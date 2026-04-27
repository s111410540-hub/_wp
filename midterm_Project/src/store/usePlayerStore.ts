import { create } from 'zustand';

interface PlayerStats {
  id: number;
  username: string;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  magicSkill: number;
  swordSkill: number;
  location: string;
  gold: number;
  level: number;
  experience: number;
}

interface PlayerState {
  stats: PlayerStats | null;
  loading: boolean;
  error: string | null;
  fetchStats: (token: string) => Promise<void>;
  updateStats: (newStats: Partial<PlayerStats>) => void;
  applyChoice: (token: string, diffs: {hpDiff?: number, mpDiff?: number, magicDiff?: number, swordDiff?: number}) => Promise<{died: boolean}>;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  stats: null,
  loading: false,
  error: null,
  
  fetchStats: async (token: string) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/game/player', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) throw new Error('無法獲取玩家資料');
      
      const data = await res.json();
      set({ stats: data.player, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  
  updateStats: (newStats) => set((state) => ({
    stats: state.stats ? { ...state.stats, ...newStats } : null
  })),

  applyChoice: async (token: string, diffs) => {
    try {
      const res = await fetch('/api/game/apply-choice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(diffs)
      });
      if (!res.ok) throw new Error('無法套用選擇結果');
      
      const data = await res.json();
      set({ stats: data.player });
      return { died: data.event === 'died' };
    } catch(err) {
      console.error(err);
      return { died: false };
    }
  }
}));
