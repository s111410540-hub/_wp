export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const tag = url.searchParams.get('tag');
  const search = url.searchParams.get('search');
  
  let query = "SELECT q.*, u.username FROM questions q JOIN users u ON q.user_id = u.id";
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
  
  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }
  
  query += " ORDER BY q.created_at DESC";
  
  try {
    let stmt = env.DB.prepare(query);
    for (let i = 0; i < params.length; i++) {
      stmt = stmt.bind(params[i]);
    }
    // D1 API currently only accepts multiple bindings in a single bind call if spread
    if (params.length > 0) {
      stmt = env.DB.prepare(query).bind(...params);
    }
    
    const { results } = await stmt.all();
    return new Response(JSON.stringify({ results }), { status: 200 });
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
