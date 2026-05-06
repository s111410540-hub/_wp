import { verifyJWT } from '../../utils.js';

export async function onRequestGet(context) {
  const { request, env } = context;

  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return Response.json({ count: 0 });
  }

  const token = authHeader.split(' ')[1];
  const payload = await verifyJWT(token, env.JWT_SECRET);
  if (!payload) return Response.json({ count: 0 });

  try {
    const result = await env.DB.prepare(
      'SELECT COUNT(*) as count FROM messages WHERE receiver_id = ? AND is_read = 0'
    ).bind(payload.id).first();

    return Response.json({ count: result.count });
  } catch (e) {
    return Response.json({ count: 0 });
  }
}
