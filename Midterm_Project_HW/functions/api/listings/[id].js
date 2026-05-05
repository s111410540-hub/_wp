import { verifyJWT } from '../../utils.js';

async function getAuthUser(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  return await verifyJWT(token, env.JWT_SECRET);
}

export async function onRequestPut(context) {
  const { request, env, params } = context;
  const id = params.id;

  const payload = await getAuthUser(request, env);
  if (!payload) {
    return Response.json({ error: '請先登入' }, { status: 401 });
  }

  try {
    const listing = await env.DB.prepare('SELECT seller_id FROM listings WHERE id = ?').bind(id).first();
    if (!listing) {
      return Response.json({ error: '找不到此交易' }, { status: 404 });
    }
    if (listing.seller_id !== payload.id) {
      return Response.json({ error: '無權限修改此交易' }, { status: 403 });
    }

    const { price, quantity, status, description } = await request.json();

    const updates = [];
    const bindParams = [];

    if (price !== undefined) {
      if (price <= 0) return Response.json({ error: '價格必須大於 0' }, { status: 400 });
      updates.push('price = ?');
      bindParams.push(price);
    }
    if (quantity !== undefined) {
      if (quantity <= 0) return Response.json({ error: '數量必須大於 0' }, { status: 400 });
      updates.push('quantity = ?');
      bindParams.push(quantity);
    }
    if (status !== undefined) {
      if (!['active', 'sold', 'cancelled'].includes(status)) {
        return Response.json({ error: '無效的狀態' }, { status: 400 });
      }
      updates.push('status = ?');
      bindParams.push(status);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      bindParams.push(description);
    }

    if (updates.length === 0) {
      return Response.json({ error: '沒有提供任何要更新的欄位' }, { status: 400 });
    }

    bindParams.push(id);
    await env.DB.prepare(`UPDATE listings SET ${updates.join(', ')} WHERE id = ?`).bind(...bindParams).run();

    return Response.json({ success: true, message: '交易更新成功' });
  } catch (e) {
    console.error('listings PUT error:', e);
    return Response.json({ error: '伺服器錯誤' }, { status: 500 });
  }
}

export async function onRequestDelete(context) {
  const { request, env, params } = context;
  const id = params.id;

  const payload = await getAuthUser(request, env);
  if (!payload) {
    return Response.json({ error: '請先登入' }, { status: 401 });
  }

  try {
    const listing = await env.DB.prepare('SELECT seller_id FROM listings WHERE id = ?').bind(id).first();
    if (!listing) {
      return Response.json({ error: '找不到此交易' }, { status: 404 });
    }
    if (listing.seller_id !== payload.id) {
      return Response.json({ error: '無權限刪除此交易' }, { status: 403 });
    }

    await env.DB.prepare('DELETE FROM listings WHERE id = ?').bind(id).run();

    return Response.json({ success: true, message: '交易已下架' });
  } catch (e) {
    console.error('listings DELETE error:', e);
    return Response.json({ error: '伺服器錯誤' }, { status: 500 });
  }
}