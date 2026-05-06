import { getBadge } from '../utils.js';

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const tag = url.searchParams.get('tag');
  const search = url.searchParams.get('search');
  const sort = url.searchParams.get('sort') || 'newest';
  const page = parseInt(url.searchParams.get('page')) || 1;
  const limit = parseInt(url.searchParams.get('limit')) || 9;
  
  let baseQuery = "FROM questions q JOIN users u ON q.user_id = u.id";
  let params = [];
  let conditions = [];
  
  if (tag) {
    conditions.push("q.game_tag = ?");
    params.push(tag);
  }
  if (search) {
    conditions.push("(q.title LIKE ? OR q.content LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }
  if (sort === 'unsolved') {
    conditions.push("q.is_solved = 0");
  }
  
  if (conditions.length > 0) {
    baseQuery += " WHERE " + conditions.join(" AND ");
  }
  
  // Get total count for pagination
  let countQuery = "SELECT COUNT(*) as total " + baseQuery;
  
  let orderClause = " ORDER BY q.created_at DESC";
  if (sort === 'votes') {
    orderClause = " ORDER BY q.vote_count DESC, q.created_at DESC";
  }
  
  const offset = (page - 1) * limit;
  let dataQuery = "SELECT q.*, u.username " + baseQuery + orderClause + " LIMIT ? OFFSET ?";
  let dataParams = [...params, limit, offset];
  
  try {
    let countStmt = env.DB.prepare(countQuery);
    if (params.length > 0) countStmt = countStmt.bind(...params);
    const countResult = await countStmt.first();
    const total = countResult ? countResult.total : 0;
    
    let dataStmt = env.DB.prepare(dataQuery);
    if (dataParams.length > 0) dataStmt = dataStmt.bind(...dataParams);
    
    const { results } = await dataStmt.all();

    if (results.length > 0) {
      const userIds = [...new Set(results.map(q => q.user_id))];
      const placeholders = userIds.map(() => '?').join(',');
      
      const userVotes = await env.DB.prepare(`
        SELECT u.id as user_id, 
          COALESCE((SELECT SUM(vote_count) FROM questions WHERE user_id = u.id), 0) + 
          COALESCE((SELECT SUM(vote_count) FROM answers WHERE user_id = u.id), 0) as total_votes
        FROM users u WHERE id IN (${placeholders})
      `).bind(...userIds).all();
      
      const badgeMap = {};
      for (const row of userVotes.results) {
        badgeMap[row.user_id] = getBadge(row.total_votes);
      }
      
      for (const q of results) {
        q.user_badge = badgeMap[q.user_id];
      }
    }
    
    return new Response(JSON.stringify({ 
      results,
      pagination: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit)
      }
    }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: '伺服器錯誤' }), { status: 500 });
  }
}

export async function onRequestPost(context) {
  const { request, env, data } = context;
  const user = data.user; // Set by middleware
  
  try {
    const { title, content, game_tag } = await request.json();
    
    if (!title || !content) {
      return new Response(JSON.stringify({ error: '標題與內容不可為空' }), { status: 400 });
    }
    
    const result = await env.DB.prepare(
      "INSERT INTO questions (title, content, user_id, game_tag) VALUES (?, ?, ?, ?) RETURNING id"
    ).bind(title, content, user.id, game_tag || null).first();
    
    return new Response(JSON.stringify({ message: '問題發布成功', id: result.id }), { status: 201 });
  } catch (e) {
    return new Response(JSON.stringify({ error: '伺服器錯誤' }), { status: 500 });
  }
}
