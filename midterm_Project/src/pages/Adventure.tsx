import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../store/usePlayerStore';

// 定義篇章與對應的地區
const STORY_ARCS = [
  {
    id: 'arc1',
    name: '菲托亞領篇',
    locations: ['菲托亞領-布耶納村', '菲托亞領-羅亞']
  },
  {
    id: 'tp1',
    name: '轉折點一',
    locations: ['大流魔力轉移 (劇情事件)']
  },
  {
    id: 'arc2',
    name: '魔大陸篇',
    locations: ['魔大陸-利卡里斯城', '魔大陸-克拉斯瑪城']
  },
  {
    id: 'arc3',
    name: '米里斯大陸篇',
    locations: ['米里斯大陸-贊特港', '米里斯大陸-米里斯神聖國']
  },
  {
    id: 'tp2',
    name: '轉折點二',
    locations: ['赤龍下顎(轉折點二)']
  },
  {
    id: 'arc4',
    name: '魔法三大國篇',
    locations: ['魔法三大國-羅森堡', '魔法三大國-魔法大學']
  },
  {
    id: 'tp3',
    name: '轉折點三',
    locations: ['保羅的信 (劇情事件)']
  },
  {
    id: 'arc5',
    name: '貝卡利特大陸篇',
    locations: ['貝卡利特大陸-拉龐(轉折點三)']
  },
  {
    id: 'arc6',
    name: '日常篇',
    locations: ['魔法三大國-夏利亞']
  },
  {
    id: 'tp4',
    name: '轉折點四',
    locations: ['老魯迪的警告 (劇情事件)']
  }
];

const Adventure: React.FC = () => {
  const navigate = useNavigate();
  const { stats } = usePlayerStore();
  const [selectedArc, setSelectedArc] = useState(STORY_ARCS[0]);

  const handleLocationSelect = (locationName: string) => {
    // 導向劇情頁面 (將地點名稱轉為 URL 安全字串)
    navigate(`/story/${encodeURIComponent(locationName)}`);
  };

  return (
    <div className="adventure-container">
      <nav className="glass top-nav">
        <div className="logo" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>Mushoku RPG</div>
        <div className="nav-links">
          <span onClick={() => navigate('/')}>主城</span>
          <span className="active">冒險</span>
          <span>背包</span>
          <span>公會</span>
          <div className="player-brief">
            HP: {stats?.hp}/{stats?.maxHp} | MP: {stats?.mp}/{stats?.maxMp}
          </div>
        </div>
      </nav>

      <div className="adventure-layout">
        <aside className="glass arcs-sidebar fade-in">
          <h2>世界卷軸</h2>
          <div className="arcs-list">
            {STORY_ARCS.map((arc, index) => (
              <button 
                key={arc.id}
                className={`arc-btn ${selectedArc.id === arc.id ? 'selected' : ''}`}
                onClick={() => setSelectedArc(arc)}
              >
                <div className="arc-index">Chapter {index + 1}</div>
                <div className="arc-name">{arc.name}</div>
              </button>
            ))}
          </div>
        </aside>

        <main className="glass locations-main fade-in">
          <div className="arc-header">
            <h2>{selectedArc.name}</h2>
            <p className="arc-desc">選擇你要前往探索的地點或事件。</p>
          </div>
          
          <div className="locations-grid">
            {selectedArc.locations.map((loc, idx) => {
              const isEvent = loc.includes('劇情');
              return (
                <div key={idx} className={`location-card ${isEvent ? 'event-card' : ''}`}>
                  <div className="loc-icon">{isEvent ? '📜' : '⚔️'}</div>
                  <div className="loc-info">
                    <h3>{loc}</h3>
                    <p>{isEvent ? '觀看劇情記憶' : '包含隨機遇敵、素材採集'}</p>
                  </div>
                  <button 
                    className={isEvent ? 'btn-glass' : 'btn-fantasy'}
                    onClick={() => handleLocationSelect(loc)}
                  >
                    {isEvent ? '回顧事件' : '出發前往'}
                  </button>
                </div>
              )
            })}
          </div>
        </main>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .adventure-container {
          min-height: 100vh;
          background: linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.9)), url('/vol26_bg.jpg') no-repeat center center;
          background-size: cover;
          padding: 20px;
          color: #f0e6d2;
          display: flex;
          flex-direction: column;
        }

        .top-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 30px;
          margin-bottom: 20px;
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

        .player-brief {
          background: rgba(0,0,0,0.5);
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 0.85rem;
          border: 1px solid var(--text-muted);
          color: var(--primary);
        }

        .adventure-layout {
          display: flex;
          gap: 20px;
          flex: 1;
          max-width: 1200px;
          margin: 20px auto;
          width: 100%;
          height: 70vh; /* 固定高度為視窗的 70%，確保觸發捲動 */
          min-height: 400px;
          overflow: hidden;
        }

        .arcs-sidebar {
          width: 300px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          height: 100%;
          background: rgba(0,0,0,0.2);
        }

        .arcs-sidebar h2 {
          color: var(--primary);
          border-bottom: 1px solid rgba(212, 160, 23, 0.3);
          padding-bottom: 15px;
          margin-bottom: 20px;
          text-align: center;
          font-family: 'Times New Roman', serif;
          flex-shrink: 0;
        }

        .arcs-list {
          display: flex;
          flex-direction: column;
          gap: 15px; /* 增加間距 */
          overflow-y: scroll; /* 改為 scroll 強制顯示軌道 */
          padding-right: 10px;
          flex: 1;
          max-height: 400px; /* 關鍵：強制限制高度為 400px，確保 100% 縮放時也會觸發捲動 */
        }

        /* Custom Scrollbar */
        .arcs-list::-webkit-scrollbar { width: 6px; }
        .arcs-list::-webkit-scrollbar-track { background: rgba(212, 160, 23, 0.05); border-radius: 4px; }
        .arcs-list::-webkit-scrollbar-thumb { 
          background: linear-gradient(to bottom, var(--primary), #8a6d0a); 
          border-radius: 4px; 
          border: 1px solid rgba(0,0,0,0.3);
        }

        .arc-btn {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid transparent;
          padding: 12px 15px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          color: var(--text-muted);
          text-align: left;
        }

        .arc-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(212, 160, 23, 0.3);
        }

        .arc-btn.selected {
          background: linear-gradient(90deg, rgba(212, 160, 23, 0.2), transparent);
          border-left: 4px solid var(--primary);
          color: var(--primary);
        }

        .arc-index {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          opacity: 0.7;
          margin-bottom: 4px;
        }

        .arc-name {
          font-size: 1.1rem;
          font-weight: bold;
        }

        .locations-main {
          flex: 1;
          padding: 30px;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        /* Scrollbar for locations too */
        .locations-main::-webkit-scrollbar { width: 4px; }
        .locations-main::-webkit-scrollbar-track { background: transparent; }
        .locations-main::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

        .arc-header {
          margin-bottom: 30px;
        }

        .arc-header h2 {
          font-size: 2.2rem;
          color: var(--text-main);
          margin-bottom: 10px;
        }

        .arc-desc {
          color: var(--text-muted);
        }

        .locations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        .location-card {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 15px;
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .location-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.5);
          border-color: rgba(212, 160, 23, 0.5);
        }

        .event-card {
          border-style: dashed;
          border-color: var(--text-muted);
        }

        .loc-icon {
          font-size: 2.5rem;
          margin-bottom: 5px;
        }
        
        .loc-info h3 {
          font-size: 1.3rem;
          margin-bottom: 8px;
          color: white;
        }

        .loc-info p {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.4;
          margin-bottom: 15px;
        }

        .btn-glass {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          padding: 10px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s;
          margin-top: auto;
        }

        .btn-glass:hover {
          background: rgba(255,255,255,0.1);
        }

        @media (max-width: 900px) {
          .adventure-layout { 
            flex-direction: column; 
            height: auto; 
            overflow: visible;
          }
          .arcs-sidebar { 
            width: 100%; 
            height: 350px; /* 在手機版給定固定高度來觸發捲動 */
            margin-bottom: 20px;
          }
          .arcs-list { 
            flex-direction: column; /* 保持垂直 */
            flex-wrap: nowrap; 
            overflow-y: scroll;
          }
          .arc-btn { width: 100%; }
        }
      `}} />
    </div>
  );
};

export default Adventure;
