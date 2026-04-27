import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [showUI, setShowUI] = useState(true);

  return (
    <div className="landing-container">
      {/* Top Navigation */}
      {showUI && (
        <nav className="top-nav fade-in">
          <div className="nav-right">
            <button className="nav-btn" onClick={() => navigate('/auth?mode=login')}>登入</button>
            <button className="nav-btn btn-gold" onClick={() => navigate('/auth?mode=register')}>註冊</button>
          </div>
        </nav>
      )}

      <div className="overlay" style={{ opacity: showUI ? 1 : 0 }}></div>

      <div className={`content ${showUI ? 'fade-in' : 'hidden'}`}>
        <h1 className="title">Mushoku Tensei RPG</h1>
        <div className="button-stack">
          <button
            className="btn-fantasy"
            onClick={() => navigate('/auth')}
          >
            這一次，一定要拿出真本事
          </button>
          <button
            className="btn-glass-view"
            onClick={() => setShowUI(false)}
          >
            欣賞背景
          </button>
        </div>
      </div>

      {/* Restore UI Button (only visible when UI is hidden) */}
      {!showUI && (
        <button className="btn-restore fade-in" onClick={() => setShowUI(true)}>
          顯示 UI
        </button>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        .landing-container {
          height: 100vh;
          width: 100vw;
          background: url('/vol26_bg.jpg') no-repeat center center;
          background-size: cover;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .top-nav {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          padding: 20px 40px;
          display: flex;
          justify-content: flex-end;
          z-index: 10;
        }

        .nav-right {
          display: flex;
          gap: 20px;
        }

        .nav-btn {
          background: rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          padding: 8px 24px;
          border-radius: 4px;
          cursor: pointer;
          font-family: var(--font-main);
          transition: all 0.3s;
        }

        .nav-btn:hover {
          background: rgba(255,255,255,0.1);
          border-color: white;
        }

        .btn-gold {
          border-color: var(--primary);
          color: var(--primary);
        }

        .btn-gold:hover {
          background: var(--primary-glow);
          border-color: var(--primary);
        }

        .overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(circle, transparent 0%, rgba(0,0,0,0.6) 100%);
          z-index: 1;
          transition: opacity 1s;
          pointer-events: none;
        }

        .content {
          z-index: 2;
          text-align: center;
          transition: opacity 0.5s, transform 0.5s;
        }

        .content.hidden {
          opacity: 0;
          transform: translateY(20px);
          pointer-events: none;
        }

        .button-stack {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .btn-glass-view {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(5px);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255, 255, 255, 0.7);
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-glass-view:hover {
          background: rgba(255,255,255,0.15);
          color: white;
        }

        .btn-restore {
          position: absolute;
          bottom: 40px;
          right: 40px;
          z-index: 100;
          background: rgba(0,0,0,0.6);
          border: 1px solid var(--primary);
          color: var(--primary);
          padding: 10px 25px;
          border-radius: 50px;
          cursor: pointer;
          font-size: 0.9rem;
          box-shadow: 0 0 20px rgba(0,0,0,0.5);
        }

        .title {
          font-size: 4.5rem;
          margin-bottom: 2.5rem;
          color: white;
          text-shadow: 0 0 20px rgba(212, 160, 23, 0.8), 0 0 40px rgba(0,0,0,1);
          font-family: 'Times New Roman', serif;
          letter-spacing: 4px;
        }
      `}} />
    </div>
  );
};

export default Landing;
