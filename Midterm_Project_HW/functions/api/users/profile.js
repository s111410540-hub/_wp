import { getBadge } from '../utils.js';

export async function onRequestGet(context) {
  const { request, env, data } = context;
  const user = data.user;
  
  if (!user) {
    return new Response(JSON.stringify({ error: '請先登入' }), { status: 401 });
  }

  const url = new URL(request.url);
  const tab = url.searchParams.get('tab') || 'questions';

  try {
    // Basic Info
    const userInfo = await env.DB.prepare("SELECT username, created_at, reputation FROM users WHERE id = ?").bind(user.id).first();
    if (!userInfo) return new Response(JSON.stringify({ error: '找不到使用者' }), { status: 404 });

    // Stats
    const qCount = await env.DB.prepare("SELECT COUNT(*) as c FROM questions WHERE user_id = ?").bind(user.id).first();
    const aCount = await env.DB.prepare("SELECT COUNT(*) as c FROM answers WHERE user_id = ?").bind(user.id).first();
    const accCount = await env.DB.prepare("SELECT COUNT(*) as c FROM answers WHERE user_id = ? AND is_accepted = 1").bind(user.id).first();
    
    // Total Votes Received (Questions + Answers)
    const qVotes = await env.DB.prepare("SELECT SUM(vote_count) as s FROM questions WHERE user_id = ?").bind(user.id).first();
    const aVotes = await env.DB.prepare("SELECT SUM(vote_count) as s FROM answers WHERE user_id = ?").bind(user.id).first();
    const totalVotes = (qVotes?.s || 0) + (aVotes?.s || 0);

    const stats = {
      question_count: qCount.c,
      answer_count: aCount.c,
      accepted_count: accCount.c,
      total_votes: totalVotes
    };

    userInfo.badge = getBadge(totalVotes);

    // List Data based on Tab
    let listData = [];
    if (tab === 'questions') {
      const res = await env.DB.prepare("SELECT * FROM questions WHERE user_id = ? ORDER BY created_at DESC").bind(user.id).all();
      listData = res.results;
    } else if (tab === 'answers') {
      const res = await env.DB.prepare(`
        SELECT a.*, q.title as question_title 
        FROM answers a 
        JOIN questions q ON a.question_id = q.id 
        WHERE a.user_id = ? ORDER BY a.created_at DESC
      `).bind(user.id).all();
      listData = res.results;
    } else if (tab === 'votes') {
      const res = await env.DB.prepare(`
        SELECT v.*, q.title as q_title, a.content as a_content, q2.title as a_q_title, q2.id as a_q_id
        FROM votes v
        LEFT JOIN questions q ON v.target_type = 'question' AND v.target_id = q.id
        LEFT JOIN answers a ON v.target_type = 'answer' AND v.target_id = a.id
        LEFT JOIN questions q2 ON a.question_id = q2.id
        WHERE v.user_id = ? ORDER BY v.id DESC
      `).bind(user.id).all();
      listData = res.results;
    }

    return new Response(JSON.stringify({ 
      user: userInfo, 
      stats, 
      list: listData 
    }), { status: 200 });

  } catch (e) {
    return new Response(JSON.stringify({ error: '伺服器錯誤: ' + e.message }), { status: 500 });
  }
}
