import { getBadge } from '../../utils.js';

export async function onRequestGet(context) {
  const { env, params } = context;
  const id = params.id;
  
  try {
    // Get question
    const question = await env.DB.prepare(
      "SELECT q.*, u.username FROM questions q JOIN users u ON q.user_id = u.id WHERE q.id = ?"
    ).bind(id).first();
    
    if (!question) {
      return new Response(JSON.stringify({ error: '找不到該問題' }), { status: 404 });
    }
    
    // Get answers
    const { results: answers } = await env.DB.prepare(
      "SELECT a.*, u.username FROM answers a JOIN users u ON a.user_id = u.id WHERE a.question_id = ? ORDER BY a.is_accepted DESC, a.vote_count DESC, a.created_at ASC"
    ).bind(id).all();

    // Calculate badges
    const userIds = [...new Set([question.user_id, ...answers.map(a => a.user_id)])];
    if (userIds.length > 0) {
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
      
      question.user_badge = badgeMap[question.user_id];
      for (const a of answers) {
        a.user_badge = badgeMap[a.user_id];
      }
    }
    
    return new Response(JSON.stringify({ question, answers }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: '伺服器錯誤' }), { status: 500 });
  }
}

export async function onRequestPut(context) {
  const { request, env, data, params } = context;
  const user = data.user;
  const id = params.id;
  
  try {
    const { title, content } = await request.json();
    
    if (!title || !content) {
      return new Response(JSON.stringify({ error: '標題與內容不可為空' }), { status: 400 });
    }
    
    // Check ownership
    const question = await env.DB.prepare("SELECT user_id FROM questions WHERE id = ?").bind(id).first();
    if (!question) return new Response(JSON.stringify({ error: '找不到該問題' }), { status: 404 });
    if (question.user_id !== user.id) return new Response(JSON.stringify({ error: '權限不足' }), { status: 403 });
    
    await env.DB.prepare(
      "UPDATE questions SET title = ?, content = ? WHERE id = ?"
    ).bind(title, content, id).run();
    
    return new Response(JSON.stringify({ message: '更新成功' }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: '伺服器錯誤' }), { status: 500 });
  }
}

export async function onRequestDelete(context) {
  const { env, data, params } = context;
  const user = data.user;
  const id = params.id;
  
  try {
    // Check ownership
    const question = await env.DB.prepare("SELECT user_id FROM questions WHERE id = ?").bind(id).first();
    if (!question) return new Response(JSON.stringify({ error: '找不到該問題' }), { status: 404 });
    if (question.user_id !== user.id) return new Response(JSON.stringify({ error: '權限不足' }), { status: 403 });
    
    // Delete votes for this question
    await env.DB.prepare("DELETE FROM votes WHERE target_type = 'question' AND target_id = ?").bind(id).run();
    
    // Get answers to delete their votes
    const { results: answers } = await env.DB.prepare("SELECT id FROM answers WHERE question_id = ?").bind(id).all();
    for (const ans of answers) {
      await env.DB.prepare("DELETE FROM votes WHERE target_type = 'answer' AND target_id = ?").bind(ans.id).run();
    }
    
    // Delete answers
    await env.DB.prepare("DELETE FROM answers WHERE question_id = ?").bind(id).run();
    
    // Delete question
    await env.DB.prepare("DELETE FROM questions WHERE id = ?").bind(id).run();
    
    return new Response(JSON.stringify({ message: '刪除成功' }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: '伺服器錯誤' }), { status: 500 });
  }
}
