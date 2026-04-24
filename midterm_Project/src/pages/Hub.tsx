import React from 'react';
import { useAuthStore } from '../store/useAuthStore';

const Hub: React.FC = () => {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  return (
    <div className="hub-container">
      <nav className="glass top-nav">
        <div className="logo">Mushoku RPG</div>
        <div className="nav-links">
          <span>冒險</span>
          <span>背包</span>
          <span>公會</span>
          <button onClick={logout} className="logout-btn">登出</button>
        </div>
      </nav>

      <main className="hub-content">
        <div className="glass player-card fade-in">
          <h2>冒險者: {user?.username}</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <label>HP</label>
              <div className="bar-container hp-bar">
                <div className="bar-fill" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div className="stat-item">
              <label>MP</label>
              <div className="bar-container mp-bar">
                <div className="bar-fill" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .hub-container {
          min-height: 100vh;
          background: #050505;
          padding: 20px;
        }

        .top-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 30px;
          margin-bottom: 40px;
        }

        .logo {
          color: var(--primary);
          font-weight: bold;
          font-size: 1.5rem;
        }

        .nav-links {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .nav-links span {
          cursor: pointer;
          color: var(--text-muted);
          transition: color 0.3s;
        }

        .nav-links span:hover {
          color: var(--primary);
        }

        .logout-btn {
          background: none;
          border: 1px solid var(--accent);
          color: var(--accent);
          padding: 5px 12px;
          border-radius: 4px;
          cursor: pointer;
        }

        .player-card {
          max-width: 400px;
          padding: 20px;
        }

        .stats-grid {
          margin-top: 20px;
        }

        .stat-item {
          margin-bottom: 15px;
        }

        .bar-container {
          background: #222;
          height: 10px;
          border-radius: 5px;
          overflow: hidden;
          margin-top: 5px;
        }

        .hp-bar .bar-fill { background: #e74c3c; }
        .mp-bar .bar-fill { background: #3498db; }
        
        .bar-fill { height: 100%; transition: width 0.5s; }
      `}} />
    </div>
  );
};

export default Hub;
