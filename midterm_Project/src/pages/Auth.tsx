import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') !== 'register'; // default to login unless 'register'
  const [isLogin, setIsLogin] = useState(initialMode);

  // Update mode when URL param changes
  useEffect(() => {
    setIsLogin(searchParams.get('mode') !== 'register');
  }, [searchParams]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const setAuth = useAuthStore(state => state.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setAuth(data.player, data.token);
      navigate('/'); // Go back to hub after login
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="glass auth-card fade-in">
        <button className="back-link" onClick={() => navigate('/')}>← 返回</button>
        <h2>{isLogin ? '冒險者回歸' : '新的轉生'}</h2>
        <p className="subtitle">{isLogin ? '歡迎回到魯迪烏斯的世界' : '開啟你的第二次人生'}</p>
        
        {error && <div className="error-msg">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>名稱</label>
            <input 
              type="text" 
              className="input-fantasy" 
              placeholder="輸入你的冒險者姓名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>咒語 (密碼)</label>
            <input 
              type="password" 
              className="input-fantasy" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn-fantasy w-full" disabled={loading}>
            {loading ? '加載中...' : (isLogin ? '登入' : '註冊')}
          </button>
        </form>
        
        <div className="toggle-auth">
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? '還沒有帳號？註冊一個' : '已經有帳號了？登入'}
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .auth-page {
          height: 100vh;
          width: 100vw;
          background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/vol26_bg.jpg') no-repeat center center;
          background-size: cover;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .auth-card {
          width: 100%;
          max-width: 400px;
          padding: 40px;
          text-align: center;
          border: 1px solid rgba(212, 160, 23, 0.3);
          position: relative;
        }

        .back-link {
          position: absolute;
          top: 20px;
          left: 20px;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 0.8rem;
          transition: color 0.3s;
        }

        .back-link:hover {
          color: var(--primary);
        }

        h2 {
          font-family: 'Times New Roman', serif;
          color: var(--primary);
          font-size: 2rem;
          margin-bottom: 8px;
        }

        .subtitle {
          color: var(--text-muted);
          margin-bottom: 30px;
          font-size: 0.9rem;
        }

        .form-group {
          text-align: left;
          margin-bottom: 15px;
        }

        label {
          display: block;
          margin-bottom: 8px;
          color: var(--text-main);
          font-size: 0.85rem;
          letter-spacing: 1px;
        }

        .w-full {
          width: 100%;
          margin-top: 20px;
        }

        .error-msg {
          background: rgba(139, 0, 0, 0.2);
          border: 1px solid var(--accent);
          color: #ffbaba;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 20px;
          font-size: 0.8rem;
        }

        .toggle-auth {
          margin-top: 20px;
        }

        .toggle-auth button {
          background: none;
          border: none;
          color: var(--primary);
          cursor: pointer;
          font-size: 0.85rem;
          text-decoration: underline;
        }
      `}} />
    </div>
  );
};

export default Auth;
