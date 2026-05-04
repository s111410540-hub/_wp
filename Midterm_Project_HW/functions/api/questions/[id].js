export async function onRequestGet(context) {
  const { env, params } = context;
  const id = params.id;
  
  try {
    // Get question
    const question = await env.DB.prepare(
      "SELECT q.*, u.username FROM questions q JOIN users u ON q.user_id = u.id WHERE q.id = ?"
    ).bind(id).first();
    
    if (!question) {
      return new Response(JSON.stringify({ error: '找不到該問題' }), { status: 404 });
    }
    
    // Get answers
    const { results: answers } = await env.DB.prepare(
      "SELECT a.*, u.username FROM answers a JOIN users u ON a.user_id = u.id WHERE a.question_id = ? ORDER BY a.is_accepted DESC, a.vote_count DESC, a.created_at ASC"
    ).bind(id).all();
    
    return new Response(JSON.stringify({ question, answers }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: '伺服器錯誤' }), { status: 500 });
  }
}
