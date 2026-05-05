export async function onRequestPut(context) {
  const { request, env, data, params } = context;
  const user = data.user;
  const id = params.id;
  
  try {
    const { content } = await request.json();
    if (!content) return new Response(JSON.stringify({ error: '內容不可為空' }), { status: 400 });
    
    const answer = await env.DB.prepare("SELECT user_id FROM answers WHERE id = ?").bind(id).first();
    if (!answer) return new Response(JSON.stringify({ error: '找不到該回答' }), { status: 404 });
    if (answer.user_id !== user.id) return new Response(JSON.stringify({ error: '權限不足' }), { status: 403 });
    
    await env.DB.prepare("UPDATE answers SET content = ? WHERE id = ?").bind(content, id).run();
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
    const answer = await env.DB.prepare("SELECT user_id, question_id, is_accepted FROM answers WHERE id = ?").bind(id).first();
    if (!answer) return new Response(JSON.stringify({ error: '找不到該回答' }), { status: 404 });
    if (answer.user_id !== user.id) return new Response(JSON.stringify({ error: '權限不足' }), { status: 403 });
    
    // If accepted, mark question as unsolved
    if (answer.is_accepted === 1) {
      await env.DB.prepare("UPDATE questions SET is_solved = 0 WHERE id = ?").bind(answer.question_id).run();
    }
    
    // Decrement answer count
    await env.DB.prepare("UPDATE questions SET answer_count = answer_count - 1 WHERE id = ?").bind(answer.question_id).run();
    
    // Delete votes
    await env.DB.prepare("DELETE FROM votes WHERE target_type = 'answer' AND target_id = ?").bind(id).run();
    
    // Delete answer
    await env.DB.prepare("DELETE FROM answers WHERE id = ?").bind(id).run();
    
    return new Response(JSON.stringify({ message: '刪除成功' }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: '伺服器錯誤' }), { status: 500 });
  }
}
