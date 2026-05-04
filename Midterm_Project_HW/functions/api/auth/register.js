import { hashPassword } from '../../utils.js';

export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    const { username, email, password } = await request.json();
    
    if (!username || !email || !password) {
      return new Response(JSON.stringify({ error: '請提供完整的註冊資訊' }), { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    // Insert user into DB
    try {
      await env.DB.prepare(
        "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)"
      ).bind(username, email, hashedPassword).run();
      
      return new Response(JSON.stringify({ message: '註冊成功' }), { status: 201 });
    } catch (e) {
      if (e.message.includes('UNIQUE constraint failed')) {
        return new Response(JSON.stringify({ error: '使用者名稱或信箱已被使用' }), { status: 409 });
      }
      throw e;
    }
  } catch (e) {
    return new Response(JSON.stringify({ error: '伺服器錯誤' }), { status: 500 });
  }
}
