import { verifyJWT } from '../utils.js';

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);
  
  // Public routes that don't need auth
  const publicPaths = [
    '/api/auth/register',
    '/api/auth/login'
  ];
  
  if (publicPaths.includes(url.pathname)) {
    return next();
  }
  
  // GET requests to questions don't need auth
  if (request.method === 'GET' && url.pathname.startsWith('/api/questions')) {
    return next();
  }

  // All other /api/* routes require auth
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: '未授權的存取' }), { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  const payload = await verifyJWT(token, env.JWT_SECRET);
  
  if (!payload) {
    return new Response(JSON.stringify({ error: '無效的 Token' }), { status: 401 });
  }

  // Attach user to context data so downstream handlers can use it
  context.data = { user: payload };
  
  return next();
}
