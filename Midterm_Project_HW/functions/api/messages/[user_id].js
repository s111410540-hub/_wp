import { verifyJWT } from '../../utils.js';

async function getAuthUser(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  return await verifyJWT(token, env.JWT_SECRET);
}

// GET /api/messages/:user_id — 取得和某人的對話
export async function onRequestGet(context) {
  const { request, env, params } = context;
  const other_id = parseInt(params.user_id);

  const payload = await getAuthUser(request, env);
  if (!payload) {
    return Response.json({ error: '請先登入' }, { status: 401 });
  }

  try {
    const { results } = await env.DB.prepare(`
      SELECT m.*, 
        s.username as sender_name,
        r.username as receiver_name
      FROM messages m
      JOIN users s ON m.sender_id = s.id
      JOIN users r ON m.receiver_id = r.id
      WHERE (m.sender_id = ? AND m.receiver_id = ?)
         OR (m.sender_id = ? AND m.receiver_id = ?)
      ORDER BY m.created_at ASC
    `).bind(payload.id, other_id, other_id, payload.id).all();

    // 把我收到的未讀訊息標為已讀
    await env.DB.prepare(`
      UPDATE messages SET is_read = 1
      WHERE sender_id = ? AND receiver_id = ? AND is_read = 0
    `).bind(other_id, payload.id).run();

    return Response.json({ success: true, results });
  } catch (e) {
    console.error('messages/:user_id GET error:', e);
    return Response.json({ error: '伺服器錯誤' }, { status: 500 });
  }
}
