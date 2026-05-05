export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const category = url.searchParams.get('category');

  try {
    let query = 'SELECT * FROM materials';
    let params = [];

    if (category && category !== '全部') {
      query += ' WHERE category = ?';
      params.push(category);
    }

    query += ' ORDER BY id ASC';

    const { results } = await env.DB.prepare(query).bind(...params).all();

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;
  
  // Auth check
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Missing or invalid token' }), { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  const { results } = await env.DB.prepare('SELECT id FROM users WHERE token = ?').bind(token).all();
  if (results.length === 0) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
  }

  try {
    const data = await request.json();
    const { name, category, description, rarity, drop_source } = data;

    if (!name || !category || !rarity) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const { success } = await env.DB.prepare(
      'INSERT INTO materials (name, category, description, rarity, drop_source) VALUES (?, ?, ?, ?, ?)'
    ).bind(name, category, description, rarity, drop_source).run();

    return new Response(JSON.stringify({ success }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
