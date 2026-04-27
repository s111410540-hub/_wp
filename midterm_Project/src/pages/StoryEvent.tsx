import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { usePlayerStore } from '../store/usePlayerStore';

// 示範的劇情腳本格式 (菲托亞領-布耶納村)
const STROIES: Record<string, any[]> = {
  '菲托亞領-布耶納村': [
    { speaker: '旁白', text: '你在布耶納村的平靜生活開始了，這裡的微風總是帶著麥田的香氣。' },
    { speaker: '旁白', text: '今天天氣很好，洛琪希老師在庭院裡等你。' },
    {
      speaker: '洛琪希', text: '魯迪烏斯，今天我們要進行特訓。你準備好練習水王級魔術了嗎？還是你想專心精進劍術？',
      options: [
        { text: '專心練習水魔術！ (消耗 20 魔力，提升 5 魔法技巧)', magicDiff: 5, mpDiff: -20 },
        { text: '和保羅練習劍術 (消耗 20 生命值，提升 5 劍術技巧)', swordDiff: 5, hpDiff: -20 }
      ]
    },
    { speaker: '旁白', text: '特訓結束後，你感覺自己變強了。' },
    {
      speaker: '保羅', text: '嘿，臭小鬼！你的腳步還太浮誇了，想要被我扁一頓嗎？',
      options: [
        { text: '挑釁老爸 (遭痛扁，損失 30 HP，提升 10 劍術技巧)', swordDiff: 10, hpDiff: -30 },
        { text: '乖乖聽話 (安全下莊)', hpDiff: 0 }
      ]
    },
    { speaker: '旁白', text: '美好的日子還在繼續...' },
    { speaker: '希露菲', text: '魯迪...明天見。' },
  ]
};

// 這是當找不到特定地點腳本時的備用劇本
const FALLBACK_SCRIPT = [
  { speaker: '系統', text: '此地點的劇情尚在建置中，你探索了四周一無所獲。' },
];

const StoryEvent: React.FC = () => {
  const { locationId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const { stats, applyChoice, fetchStats } = usePlayerStore();

  const [script, setScript] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [floatingLogs, setFloatingLogs] = useState<{ id: number, text: string }[]>([]);

  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // 根據 URL 載入對應的腳本
    const decodedLocation = decodeURIComponent(locationId || '');
    setScript(STROIES[decodedLocation] || FALLBACK_SCRIPT);
  }, [locationId]);

  const currentLine = script[currentIdx];
  const hasOptions = currentLine && currentLine.options && currentLine.options.length > 0;

  const handleNextLine = () => {
    if (isProcessing || isFinished) return;
    if (hasOptions) return; // 有選項時不能點擊背景跳過

    if (currentIdx < script.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // 結束劇情，顯示結算畫面
      finishStoryArc();
    }
  };

  const showLog = (text: string) => {
    const id = Date.now();
    setFloatingLogs(prev => [...prev, { id, text }]);
    setTimeout(() => {
      setFloatingLogs(prev => prev.filter(log => log.id !== id));
    }, 2500); // 2.5秒後消失
  };

  const handleChoice = async (option: any) => {
    if (!token) return;
    setIsProcessing(true);

    const { died } = await applyChoice(token, {
      hpDiff: option.hpDiff,
      mpDiff: option.mpDiff,
      magicDiff: option.magicDiff,
      swordDiff: option.swordDiff
    });

    // 建立提示文字
    let logMsg = [];
    if (option.hpDiff) logMsg.push(`${option.hpDiff > 0 ? '+' : ''}${option.hpDiff} HP`);
    if (option.mpDiff) logMsg.push(`${option.mpDiff > 0 ? '+' : ''}${option.mpDiff} MP`);
    if (option.magicDiff) logMsg.push(`+${option.magicDiff} 魔法技巧`);
    if (option.swordDiff) logMsg.push(`+${option.swordDiff} 劍術技巧`);
    if (logMsg.length > 0) showLog(logMsg.join(', '));

    if (died) {
      alert("【你已經死亡】\n隨著意識遠去，命運的齒輪將你帶回了上一個轉折點...");
      // 若死亡則跳回冒險地圖（可以配合轉折點邏輯，目前先回主城或地圖）
      navigate('/adventure');
    } else {
      setIsProcessing(false);

      // 檢查選項之後是否直接結束
      if (currentIdx >= script.length - 1) {
        finishStoryArc();
      } else {
        setCurrentIdx(currentIdx + 1);
      }
    }
  };

  const finishStoryArc = async () => {
    if (!token || !stats) return;
    setIsProcessing(true);
    // 篇章結束，回滿狀態
    await applyChoice(token, {
      hpDiff: stats.maxHp, // 送極大值讓後端限制在 maxHp
      mpDiff: stats.maxMp
    });
    showLog("+ 完全恢復 HP/MP");
    setIsFinished(true);
  };

  if (!currentLine) return null;

  return (
    <div className="story-container" onClick={handleNextLine}>
      {/* 浮動提示文字 */}
      <div className="floating-logs">
        {floatingLogs.map(log => (
          <div key={log.id} className="log-msg float-up">{log.text}</div>
        ))}
      </div>

      {/* HUD: 顯示目前狀態 */}
      <div className="story-hud fade-in">
        <div className="hud-stats">
          <span className="stat-hp">HP {stats?.hp}/{stats?.maxHp}</span>
          <span className="stat-mp">MP {stats?.mp}/{stats?.maxMp}</span>
          <span className="stat-magic">🪄 Magic: {stats?.magicSkill}</span>
          <span className="stat-sword">⚔️ Sword: {stats?.swordSkill}</span>
        </div>
        <button onClick={() => navigate('/adventure')} className="btn-quit">逃跑</button>
      </div>

      {/* 底部對話框 */}
      {!isFinished ? (
        <div className="dialog-box fade-in" onClick={(e) => e.stopPropagation()}>
          <div className="dialog-speaker">{currentLine.speaker}</div>
          <div className="dialog-text">{currentLine.text}</div>

          {hasOptions && (
            <div className="dialog-options">
              {currentLine.options.map((opt: any, idx: number) => (
                <button
                  key={idx}
                  className="option-btn"
                  onClick={() => handleChoice(opt)}
                  disabled={isProcessing}
                >
                  {opt.text}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="end-screen fade-in" onClick={(e) => e.stopPropagation()}>
          <h2>📜 篇章結束</h2>
          <p>你的傷勢和魔力已經完全恢復了！</p>
          <div className="end-buttons">
            <button className="btn-fantasy" onClick={() => navigate('/')}>回主城</button>
            <button className="btn-fantasy" onClick={() => navigate('/adventure')}>返回世界卷軸</button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        .story-container {
          position: relative;
          height: 100vh;
          width: 100vw;
          background: linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.6)), url('/vol26_bg.jpg') no-repeat center center;
          background-size: cover;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          cursor: pointer;
        }

        .story-hud {
          position: absolute;
          top: 20px;
          left: 20px;
          right: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .hud-stats {
          background: rgba(0, 0, 0, 0.6);
          padding: 8px 15px;
          border-radius: 8px;
          border: 1px solid rgba(212, 160, 23, 0.4);
          display: flex;
          gap: 15px;
          font-family: monospace;
          font-size: 1.1rem;
          color: white;
        }

        .stat-hp { color: #ff6b6b; }
        .stat-mp { color: #4dabf7; }
        .stat-magic { color: #b197fc; }
        .stat-sword { color: #fcc419; }

        .btn-quit {
          background: rgba(0,0,0,0.5);
          border: 1px solid white;
          color: white;
          padding: 5px 15px;
          border-radius: 4px;
          cursor: pointer;
        }

        .dialog-box {
          background: rgba(10, 10, 15, 0.85);
          border-top: 2px solid var(--primary);
          padding: 20px 40px;
          height: 20vh; /* 縮小至全圖的約 1/5 */
          min-height: 150px;
          display: flex;
          flex-direction: column;
          position: relative;
          cursor: default;
        }

        .dialog-speaker {
          color: var(--primary);
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 10px;
          text-shadow: 0 0 5px var(--primary-glow);
        }

        .dialog-text {
          color: #f0e6d2;
          font-size: 1.2rem;
          line-height: 1.5;
          flex: 1;
        }

        .floating-logs {
          position: absolute;
          top: 30%;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          pointer-events: none;
        }

        .log-msg {
          background: rgba(0, 0, 0, 0.7);
          color: #fcc419;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 1.2rem;
          border: 1px solid var(--primary);
          box-shadow: 0 0 10px rgba(212, 160, 23, 0.5);
          animation: floatUpAndFade 2.5s forwards ease-out;
        }

        @keyframes floatUpAndFade {
          0% { opacity: 0; transform: translateY(20px); }
          10% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; transform: translateY(-30px); }
          100% { opacity: 0; transform: translateY(-50px); }
        }

        .dialog-options {
          display: flex;
          flex-direction: column;
          gap: 10px;
          position: absolute;
          top: -150px;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          max-width: 600px;
        }

        .option-btn {
          background: rgba(0, 0, 0, 0.8);
          border: 1px solid var(--primary);
          color: white;
          padding: 15px;
          font-size: 1.1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .option-btn:hover {
          background: rgba(212, 160, 23, 0.3);
          transform: scale(1.02);
        }

        .option-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .end-screen {
          background: rgba(10, 10, 15, 0.95);
          border-top: 2px solid var(--primary);
          padding: 40px;
          height: 30vh;
          min-height: 200px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        
        .end-screen h2 {
          color: var(--primary);
          font-size: 2rem;
          margin-bottom: 10px;
          text-shadow: 0 0 10px var(--primary-glow);
        }

        .end-screen p {
          color: #f0e6d2;
          font-size: 1.2rem;
          margin-bottom: 30px;
        }

        .end-buttons {
          display: flex;
          gap: 20px;
        }
      `}} />
    </div>
  );
};

export default StoryEvent;
