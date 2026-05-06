import { verifyJWT, getBadge } from '../../utils.js';

export async function onRequestGet(context) {
  const { request, env, params } = context;
  const id = params.id;

  try {
    // 取得用戶基本資料
    const user = await env.DB.prepare(
      'SELECT id, username, created_at FROM users WHERE id = ?'
    ).bind(id).first();

    if (!user) {
      return Response.json({ error: '用戶不存在' }, { status: 404 });
    }

    // 取得他發的問題
    const { results: questions } = await env.DB.prepare(
      `SELECT id, title, created_at FROM questions 
       WHERE user_id = ? ORDER BY created_at DESC LIMIT 10`
    ).bind(id).all();

    // 取得他的回答數量
    const answerCount = await env.DB.prepare(
      'SELECT COUNT(*) as count FROM answers WHERE user_id = ?'
    ).bind(id).first();

    // 取得他的總讚數
    const qVotes = await env.DB.prepare("SELECT SUM(vote_count) as s FROM questions WHERE user_id = ?").bind(id).first();
    const aVotes = await env.DB.prepare("SELECT SUM(vote_count) as s FROM answers WHERE user_id = ?").bind(id).first();
    const totalVotes = (qVotes?.s || 0) + (aVotes?.s || 0);

    const badge = getBadge(totalVotes);

    return Response.json({
      success: true,
      user: {
        ...user,
        badge
      },
      questions,
      answer_count: answerCount.count,
      total_votes: totalVotes
    });

  } catch (e) {
    console.error('users/:id GET error:', e);
    return Response.json({ error: '伺服器錯誤' }, { status: 500 });
  }
}
