import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

export interface Item {
  title: string;
  description?: string;
  image?: string;
}

interface SectionCardProps {
  title: string;
  icon: ReactNode;
  description: string;
  items: Item[];
  delay?: number;
}

export default function SectionCard({ title, icon, description, items, delay = 0 }: SectionCardProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-teal-100 hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="flex items-center space-x-4 mb-6">
        <div className="p-3 bg-[#fdf8e7] rounded-xl border border-[#f5ebd4]">
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
      </div>
      
      <p className="text-slate-600 mb-6 leading-relaxed">
        {description}
      </p>
      
      <ul className="space-y-3 flex-grow">
        {items.map((item, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <motion.li 
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.4 + (index * 0.1), duration: 0.3 }}
              className="flex flex-col bg-[#f8fdfc] rounded-lg border border-teal-50 overflow-hidden"
            >
              <button
                onClick={() => toggleExpand(index)}
                className="flex items-center justify-between w-full px-4 py-3 text-left focus:outline-none hover:bg-[#fdf8e7] transition-colors"
              >
                <div className="flex items-center text-slate-700 font-medium">
                  <span className="w-2 h-2 bg-[#e8d5a5] rounded-full mr-3 flex-shrink-0 shadow-sm"></span>
                  {item.title}
                </div>
                {(item.description || item.image) && (
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4 text-teal-400" />
                  </motion.div>
                )}
              </button>
              
              <AnimatePresence>
                {isExpanded && (item.description || item.image) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-4 pb-4"
                  >
                    <div className="pt-2 border-t border-teal-100 mt-1">
                      {item.image && (
                        <div className="mb-3 rounded-md overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-32 object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                      {item.description && (
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
