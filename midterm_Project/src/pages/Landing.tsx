import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="overlay"></div>
      <div className="content fade-in">
        <h1 className="title">Mushoku Tensei RPG</h1>
        <button 
          className="btn-fantasy" 
          onClick={() => navigate('/auth')}
        >
          這一次，我一定要拿出自己的真本事
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
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

        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle, transparent 0%, rgba(0,0,0,0.7) 100%);
          z-index: 1;
        }

        .content {
          z-index: 2;
          text-align: center;
        }

        .title {
          font-size: 4rem;
          margin-bottom: 2rem;
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
