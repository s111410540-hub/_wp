import { motion } from 'motion/react';
import { ArrowDown, Code2 } from 'lucide-react';

interface HeroProps {
  onLearnMore: () => void;
}

export default function Hero({ onLearnMore }: HeroProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#e0f5f1] via-[#f2fbf9] to-[#fdf8e7]"
    >
      <div className="max-w-3xl w-full text-center space-y-8">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center justify-center p-4 bg-[#fdf8e7] rounded-full mb-4 border border-[#f5ebd4] shadow-sm"
        >
          <Code2 className="w-12 h-12 text-teal-600" />
        </motion.div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900">
          你好，我是 <span className="text-teal-600">金門大學資工系</span> 的大一生
        </h1>
        
        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          歡迎來到我的個人網站！我是一位喜歡邊聽音樂邊做事的大學生，並期望在未來成為一名優秀的軟體工程師。
          這裡記錄了我的興趣、生活與學習點滴。
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="pt-8"
        >
          <button
            onClick={onLearnMore}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-teal-600 rounded-full overflow-hidden transition-all hover:bg-teal-700 hover:shadow-lg hover:shadow-teal-500/30 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            <span className="mr-2">開始了解</span>
            <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
