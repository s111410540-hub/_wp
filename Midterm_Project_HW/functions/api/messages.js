import { verifyJWT } from '../utils.js';

async function getAuthUser(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  return await verifyJWT(token, env.JWT_SECRET);
}

// GET /api/messages — 查我的所有對話列表
export async function onRequestGet(context) {
  const { request, env } = context;

  const payload = await getAuthUser(request, env);
  if (!payload) {
    return Response.json({ error: '請先登入' }, { status: 401 });
  }

  try {
    // 找出所有和我有對話的用戶，以及最新一則訊息
    const { results } = await env.DB.prepare(`
      SELECT 
        u.id as user_id,
        u.username,
        m.content as last_message,
        m.created_at as last_time,
        SUM(CASE WHEN m.is_read = 0 AND m.receiver_id = ? THEN 1 ELSE 0 END) as unread_count
      FROM messages m
      JOIN users u ON (
        CASE WHEN m.sender_id = ? THEN m.receiver_id ELSE m.sender_id END = u.id
      )
      WHERE m.sender_id = ? OR m.receiver_id = ?
      GROUP BY u.id
      ORDER BY m.created_at DESC
    `).bind(payload.id, payload.id, payload.id, payload.id).all();

    return Response.json({ success: true, results });
  } catch (e) {
    console.error('messages GET error:', e);
    return Response.json({ error: '伺服器錯誤' }, { status: 500 });
  }
}

// POST /api/messages — 寄訊息
export async function onRequestPost(context) {
  const { request, env } = context;

  const payload = await getAuthUser(request, env);
  if (!payload) {
    return Response.json({ error: '請先登入' }, { status: 401 });
  }

  try {
    const { receiver_id, content } = await request.json();

    if (!receiver_id || !content?.trim()) {
      return Response.json({ error: '請填寫收件人與內容' }, { status: 400 });
    }

    if (receiver_id === payload.id) {
      return Response.json({ error: '不能傳訊息給自己' }, { status: 400 });
    }

    // 確認收件人存在
    const receiver = await env.DB.prepare(
      'SELECT id FROM users WHERE id = ?'
    ).bind(receiver_id).first();

    if (!receiver) {
      return Response.json({ error: '用戶不存在' }, { status: 404 });
    }

    await env.DB.prepare(
      'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)'
    ).bind(payload.id, receiver_id, content.trim()).run();

    return Response.json({ success: true, message: '訊息已送出' }, { status: 201 });
  } catch (e) {
    console.error('messages POST error:', e);
    return Response.json({ error: '伺服器錯誤' }, { status: 500 });
  }
}
