import { motion } from 'motion/react';
import { Music, Gamepad2, Laptop, ArrowLeft } from 'lucide-react';
import SectionCard from './SectionCard';

interface DetailsProps {
  onBack: () => void;
}

export default function Details({ onBack }: DetailsProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-[#f2fbf9] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="mb-12 inline-flex items-center text-teal-600 hover:text-teal-800 transition-colors font-medium text-lg"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          返回首頁
        </motion.button>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <motion.div variants={itemVariants} className="h-full">
            <SectionCard
              title="我喜歡的歌單"
              icon={<Music className="w-6 h-6 text-teal-500" />}
              description="寫程式時的最佳伴侶。我喜歡聽各種風格的音樂來保持專注與靈感。"
              items={[
                {
                  title: "ハレハレヤ 歌ってみた ver.Sou",
                  description: "輕快又帶點憂傷的旋律，Sou 的翻唱版本特別有味道，很適合在寫程式時當作背景音樂。",
                  image: "https://picsum.photos/seed/harehareya/400/300"
                },
                {
                  title: "魔女之旅-文學 ( リテラチュア)",
                  description: "這首歌的旋律非常優美，讓人彷彿置身於奇幻的世界中，能有效放鬆心情。",
                  image: "https://picsum.photos/seed/majo/400/300"
                },
                {
                  title: "水平線 - back number",
                  description: "溫暖的嗓音與感人的歌詞，在遇到挫折或是需要平靜時，這首歌總能給我力量。",
                  image: "https://picsum.photos/seed/horizon/400/300"
                },
                {
                  title: "Lofi Hip Hop Radio",
                  description: "無人聲的純音樂，節奏穩定，是需要高度專注力時的最佳選擇。",
                  image: "https://picsum.photos/seed/lofi/400/300"
                }
              ]}
              delay={0.1}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="h-full">
            <SectionCard
              title="我喜愛的遊戲"
              icon={<Gamepad2 className="w-6 h-6 text-teal-500" />}
              description="在課業之餘，我喜歡透過遊戲來放鬆心情，同時也能從中學習遊戲設計的邏輯。"
              items={[
                {
                  title: "Anno 1800",
                  description: "一款迷人的城市建造與經濟模擬遊戲，規劃生產線與貿易路線非常考驗邏輯思考。",
                  image: "https://picsum.photos/seed/anno1800/400/300"
                },
                {
                  title: "Minecraft",
                  description: "無限的創造空間，不僅能蓋建築，還能透過紅石電路學習基礎的邏輯閘概念。",
                  image: "https://picsum.photos/seed/minecraft/400/300"
                },
                {
                  title: "OverWatch",
                  description: "講求團隊合作與角色技能搭配的射擊遊戲，和朋友一起玩總是充滿歡樂。",
                  image: "https://picsum.photos/seed/overwatch/400/300"
                },
                {
                  title: "APEX",
                  description: "快節奏的大逃殺遊戲，需要快速的反應與精準的判斷力，非常刺激。",
                  image: "https://picsum.photos/seed/apex/400/300"
                }
              ]}
              delay={0.2}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="h-full">
            <SectionCard
              title="我正在做的事"
              icon={<Laptop className="w-6 h-6 text-teal-500" />}
              description="目前專注於提升自己的程式能力，並參與一些有趣的專案開發。"
              items={[
                {
                  title: "努力變健康",
                  description: "開始培養運動習慣，注意飲食均衡，畢竟有好的身體才能寫出好的程式碼。",
                  image: "https://picsum.photos/seed/health/400/300"
                },
                {
                  title: "完成網頁設計的作業",
                  description: "正在學習 React 與 Tailwind CSS，努力將自己的個人網站打造得更完美。",
                  image: "https://picsum.photos/seed/coding/400/300"
                },
                {
                  title: "準備期中考",
                  description: "複習各科目的重點，整理筆記，希望能考取好成績。",
                  image: "https://picsum.photos/seed/study/400/300"
                },
                {
                  title: "學習線性代數",
                  description: "這是一門對資工系非常重要的基礎課程，特別是在未來的圖學與機器學習領域。",
                  image: "https://picsum.photos/seed/math/400/300"
                }
              ]}
              delay={0.3}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
