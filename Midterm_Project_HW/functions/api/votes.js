export async function onRequestPost(context) {
  const { request, env, data } = context;
  const user = data.user;
  
  try {
    const { target_type, target_id, value } = await request.json();
    
    if (!target_type || !target_id || (value !== 1 && value !== -1)) {
      return new Response(JSON.stringify({ error: '無效的投票請求' }), { status: 400 });
    }
    
    // Check if user already voted
    const existingVote = await env.DB.prepare(
      "SELECT value FROM votes WHERE user_id = ? AND target_type = ? AND target_id = ?"
    ).bind(user.id, target_type, target_id).first();
    
    let voteDiff = 0;
    
    if (existingVote) {
      if (existingVote.value === value) {
        return new Response(JSON.stringify({ error: '已投過相同的票' }), { status: 400 });
      }
      // Change vote (e.g. 1 to -1 means diff is -2)
      voteDiff = value - existingVote.value;
      await env.DB.prepare(
        "UPDATE votes SET value = ? WHERE user_id = ? AND target_type = ? AND target_id = ?"
      ).bind(value, user.id, target_type, target_id).run();
    } else {
      voteDiff = value;
      await env.DB.prepare(
        "INSERT INTO votes (user_id, target_type, target_id, value) VALUES (?, ?, ?, ?)"
      ).bind(user.id, target_type, target_id, value).run();
    }
    
    // Update target vote count
    const tableName = target_type === 'question' ? 'questions' : 'answers';
    await env.DB.prepare(
      `UPDATE ${tableName} SET vote_count = vote_count + ? WHERE id = ?`
    ).bind(voteDiff, target_id).run();
    
    return new Response(JSON.stringify({ message: '投票成功', new_value: value }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: '伺服器錯誤' }), { status: 500 });
  }
}
