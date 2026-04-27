import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { usePlayerStore } from '../store/usePlayerStore';

const Hub: React.FC = () => {
  const navigate = useNavigate();
  const { token, logout } = useAuthStore();
  const { stats, fetchStats, loading } = usePlayerStore();

  useEffect(() => {
    if (token) {
      fetchStats(token);
    }
  }, [token, fetchStats]);

  if (loading) return <div className="hub-container center">魔力共鳴中...</div>;

  return (
    <div className="hub-container">
      <nav className="glass top-nav">
        <div className="logo">Mushoku RPG</div>
        <div className="nav-links">
          <span className="active">主城</span>
          <span onClick={() => navigate('/adventure')}>冒險</span>
          <span>背包</span>
          <span>公會</span>
          <button onClick={logout} className="logout-btn">登出</button>
        </div>
      </nav>

      <main className="hub-content fade-in">
        <div className="hub-grid">
          {/* Player Banner */}
          <div className="glass player-banner">
            <div className="avatar-circle">
              {stats?.username?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="player-info">
              <h2>{stats?.username} <span className="level-tag">Lv. {stats?.level}</span></h2>
              <p className="location-tag">📍 當前位置：{stats?.location || '羅亞'}</p>
            </div>
          </div>

          {/* Stats Card */}
          <div className="glass stats-card">
            <h3>角色狀態</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-label">
                  <span>生命值 HP</span>
                  <span>{stats?.hp} / {stats?.maxHp}</span>
                </div>
                <div className="bar-container hp-bar">
                  <div className="bar-fill" style={{ width: `${(stats?.hp || 0) / (stats?.maxHp || 100) * 100}%` }}></div>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-label">
                  <span>魔力值 MP</span>
                  <span>{stats?.mp} / {stats?.maxMp}</span>
                </div>
                <div className="bar-container mp-bar">
                  <div className="bar-fill" style={{ width: `${(stats?.mp || 0) / (stats?.maxMp || 50) * 100}%` }}></div>
                </div>
              </div>

              <div className="stat-footer">
                <div className="skill-count">🪄 魔法技巧：{stats?.magicSkill}</div>
                <div className="skill-count">⚔️ 劍術技巧：{stats?.swordSkill}</div>
              </div>
              <div className="stat-footer" style={{marginTop: '5px', paddingTop: '5px', borderTop: 'none'}}>
                <div className="gold-count">💰 金幣：{stats?.gold}</div>
                <div className="exp-count">XP：{stats?.experience}</div>
              </div>
            </div>
          </div>

          {/* Action Menu */}
          <div className="glass action-card">
            <h3>接下來要做什麼？</h3>
            <div className="action-buttons">
              <button className="btn-fantasy" onClick={() => navigate('/adventure')}>前往冒險</button>
              <button className="btn-glass">公會任務</button>
              <button className="btn-glass">休息恢復 (需 10 💰)</button>
            </div>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .hub-container {
          min-height: 100vh;
          background: linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url('/vol26_bg.jpg') no-repeat center center;
          background-size: cover;
          padding: 20px;
          color: #f0e6d2;
        }

        .center { display: flex; justify-content: center; align-items: center; font-size: 1.5rem; }

        .top-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 30px;
          margin-bottom: 30px;
          border: 1px solid rgba(212, 160, 23, 0.2);
        }

        .logo {
          color: var(--primary);
          font-weight: bold;
          font-size: 1.5rem;
          letter-spacing: 2px;
          text-shadow: 0 0 10px var(--primary-glow);
        }

        .nav-links {
          display: flex;
          gap: 25px;
          align-items: center;
        }

        .nav-links span {
          cursor: pointer;
          color: var(--text-muted);
          transition: all 0.3s;
          font-size: 0.95rem;
        }

        .nav-links span:hover, .nav-links span.active {
          color: var(--primary);
          text-shadow: 0 0 8px var(--primary-glow);
        }

        .logout-btn {
          background: rgba(139, 0, 0, 0.1);
          border: 1px solid var(--accent);
          color: var(--accent);
          padding: 5px 15px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.8rem;
          transition: all 0.3s;
        }

        .logout-btn:hover {
          background: var(--accent);
          color: white;
        }

        .hub-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: auto auto;
          gap: 20px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .player-banner {
          grid-column: 1 / 3;
          display: flex;
          align-items: center;
          gap: 25px;
          padding: 30px;
        }

        .avatar-circle {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, var(--primary), #8a6d0a);
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 2.5rem;
          color: black;
          box-shadow: 0 0 20px rgba(212, 160, 23, 0.4);
        }

        .level-tag {
          font-size: 1rem;
          color: var(--primary);
          margin-left: 10px;
          background: rgba(212, 160, 23, 0.1);
          padding: 2px 8px;
          border-radius: 4px;
        }

        .location-tag {
          color: var(--text-muted);
          margin-top: 5px;
          font-size: 0.9rem;
        }

        .stats-card, .action-card {
          padding: 25px;
        }

        h3 {
          margin-bottom: 20px;
          color: var(--primary);
          border-bottom: 1px solid rgba(212, 160, 23, 0.2);
          padding-bottom: 10px;
        }

        .stat-item {
          margin-bottom: 18px;
        }

        .stat-label {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          margin-bottom: 5px;
        }

        .bar-container {
          background: rgba(255,255,255,0.05);
          height: 12px;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .hp-bar .bar-fill { 
          background: linear-gradient(90deg, #8b0000, #e74c3c); 
          box-shadow: 0 0 10px rgba(231, 76, 60, 0.4);
        }
        .mp-bar .bar-fill { 
          background: linear-gradient(90deg, #1a5276, #3498db);
          box-shadow: 0 0 10px rgba(52, 152, 219, 0.4);
        }

        .bar-fill { height: 100%; transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1); }

        .stat-footer {
          display: flex;
          justify-content: space-between;
          margin-top: 25px;
          padding-top: 15px;
          border-top: 1px dashed rgba(255,255,255,0.1);
          color: var(--primary);
          font-weight: bold;
        }

        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .btn-glass {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          padding: 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-glass:hover {
          background: rgba(255,255,255,0.1);
          border-color: var(--primary);
        }

        @media (max-width: 768px) {
          .hub-grid { grid-template-columns: 1fr; }
          .player-banner { grid-column: 1 / 2; }
        }
      `}} />
    </div>
  );
};

export default Hub;
