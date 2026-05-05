import { verifyJWT } from '../utils.js';

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const material_id = url.searchParams.get('material_id');
  const type = url.searchParams.get('type');

  try {
    let query = `
      SELECT l.*, u.username as seller_name, m.name as material_name, m.category, m.rarity
      FROM listings l
      JOIN users u ON l.seller_id = u.id
      JOIN materials m ON l.material_id = m.id
      WHERE l.status = 'active'
    `;
    const params = [];

    if (material_id) {
      query += ' AND l.material_id = ?';
      params.push(material_id);
    }

    if (type) {
      query += ' AND l.type = ?';
      params.push(type);
    }

    query += ' ORDER BY l.created_at DESC';

    const { results } = params.length > 0
      ? await env.DB.prepare(query).bind(...params).all()
      : await env.DB.prepare(query).all();

    return Response.json({ success: true, results });
  } catch (e) {
    console.error('listings GET error:', e);
    return Response.json({ error: '伺服器錯誤' }, { status: 500 });
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;

  // JWT 驗證
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return Response.json({ error: '請先登入' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  const payload = await verifyJWT(token, env.JWT_SECRET);
  if (!payload) {
    return Response.json({ error: '無效的 Token' }, { status: 401 });
  }
  const seller_id = payload.id;

  try {
    const { material_id, price, quantity, type, description } = await request.json();

    if (!material_id || !price || !quantity || !type) {
      return Response.json({ error: '請填寫完整的交易資訊' }, { status: 400 });
    }

    if (!['出售', '收購'].includes(type)) {
      return Response.json({ error: '交易類型必須是出售或收購' }, { status: 400 });
    }

    if (price <= 0 || quantity <= 0) {
      return Response.json({ error: '價格與數量必須大於 0' }, { status: 400 });
    }

    // 確認素材存在
    const material = await env.DB.prepare('SELECT id FROM materials WHERE id = ?').bind(material_id).first();
    if (!material) {
      return Response.json({ error: '素材不存在' }, { status: 404 });
    }

    await env.DB.prepare(
      'INSERT INTO listings (material_id, seller_id, price, quantity, type, description) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(material_id, seller_id, price, quantity, type, description ?? null).run();

    return Response.json({ success: true, message: '交易發布成功' }, { status: 201 });
  } catch (e) {
    console.error('listings POST error:', e);
    return Response.json({ error: '伺服器錯誤' }, { status: 500 });
  }
}