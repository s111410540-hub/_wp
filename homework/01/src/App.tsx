import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Hero from './components/Hero';
import Details from './components/Details';

export default function App() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="min-h-screen bg-[#f2fbf9] text-slate-900 font-sans selection:bg-teal-200 selection:text-teal-900">
      <AnimatePresence mode="wait">
        {!showDetails ? (
          <motion.div key="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Hero onLearnMore={() => setShowDetails(true)} />
          </motion.div>
        ) : (
          <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Details onBack={() => setShowDetails(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
