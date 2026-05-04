export async function onRequestPost(context) {
  const { request, env, data } = context;
  const user = data.user;
  
  try {
    const { question_id, content } = await request.json();
    
    if (!question_id || !content) {
      return new Response(JSON.stringify({ error: '請提供問題ID與回答內容' }), { status: 400 });
    }
    
    // Insert answer
    await env.DB.prepare(
      "INSERT INTO answers (content, question_id, user_id) VALUES (?, ?, ?)"
    ).bind(content, question_id, user.id).run();
    
    // Update answer count on question
    await env.DB.prepare(
      "UPDATE questions SET answer_count = answer_count + 1 WHERE id = ?"
    ).bind(question_id).run();
    
    return new Response(JSON.stringify({ message: '回答發布成功' }), { status: 201 });
  } catch (e) {
    return new Response(JSON.stringify({ error: '伺服器錯誤' }), { status: 500 });
  }
}
