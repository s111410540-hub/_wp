import { hashPassword, createJWT } from '../../utils.js';

export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return new Response(JSON.stringify({ error: '請提供信箱與密碼' }), { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    const user = await env.DB.prepare(
      "SELECT id, username FROM users WHERE email = ? AND password_hash = ?"
    ).bind(email, hashedPassword).first();

    if (!user) {
      return new Response(JSON.stringify({ error: '信箱或密碼錯誤' }), { status: 401 });
    }

    const token = await createJWT({ id: user.id, username: user.username }, env.JWT_SECRET);
    
    return new Response(JSON.stringify({ token, username: user.username, id: user.id }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: '伺服器錯誤' }), { status: 500 });
  }
}
