export async function onRequestPost(context) {
  const { env, data, params } = context;
  const user = data.user;
  const answerId = params.id;
  
  try {
    // Verify that the answer belongs to a question owned by the user
    const answer = await env.DB.prepare(
      "SELECT a.question_id, q.user_id as question_owner_id FROM answers a JOIN questions q ON a.question_id = q.id WHERE a.id = ?"
    ).bind(answerId).first();
    
    if (!answer) {
      return new Response(JSON.stringify({ error: '找不到該回答' }), { status: 404 });
    }
    
    if (answer.question_owner_id !== user.id) {
      return new Response(JSON.stringify({ error: '只有發問者可以採納回答' }), { status: 403 });
    }
    
    // Reset all accepted answers for this question
    await env.DB.prepare(
      "UPDATE answers SET is_accepted = 0 WHERE question_id = ?"
    ).bind(answer.question_id).run();
    
    // Accept this answer
    await env.DB.prepare(
      "UPDATE answers SET is_accepted = 1 WHERE id = ?"
    ).bind(answerId).run();
    
    // Mark question as solved
    await env.DB.prepare(
      "UPDATE questions SET is_solved = 1 WHERE id = ?"
    ).bind(answer.question_id).run();
    
    return new Response(JSON.stringify({ message: '回答已採納' }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: '伺服器錯誤' }), { status: 500 });
  }
}
