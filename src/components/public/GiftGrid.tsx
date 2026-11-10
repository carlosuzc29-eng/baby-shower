import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift } from '../../types';
import { GiftCard } from './GiftCard';
import { DragonBall } from '../ui/DragonBall';

interface GiftGridProps {
  gifts: Gift[];
  onClaim: (gift: Gift) => void;
  isLoading: boolean;
}

export const GiftGrid: React.FC<GiftGridProps> = ({ gifts, onClaim, isLoading }) => {
  // Skeleton loader tierno mientras carga Firestore
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-[repeat(auto-fill,minmax(min(100%,230px),1fr))] gap-[18px]">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white rounded-[22px] border border-theme p-4 h-84 animate-pulse flex flex-col justify-between"
          >
            <div>
              <div className="w-full aspect-[4/3] bg-theme-secondary-light rounded-xl mb-4" />
              <div className="w-1/3 h-3 bg-theme-secondary-light rounded-md mb-2" />
              <div className="w-3/4 h-5 bg-theme-secondary-light rounded-md mb-2" />
              <div className="w-full h-3 bg-theme-secondary-light rounded-md" />
            </div>
            <div className="w-full h-11 bg-theme-secondary-light rounded-[14px]" />
          </div>
        ))}
      </div>
    );
  }

  // Estado vacío: cuando todos los regalos fueron elegidos
  if (gifts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto my-12 p-8 text-center bg-white/90 backdrop-blur-xs rounded-[22px] border border-theme shadow-xs"
      >
        <DragonBall stars={7} className="w-16 h-16 mx-auto mb-4 drop-shadow-[0_4px_12px_rgba(247,147,30,0.35)]" />
        <h3 className="text-2xl font-heading font-semibold text-theme mb-2">
          ¡La lista está completa!
        </h3>
        <p className="text-theme-muted text-sm sm:text-base leading-relaxed">
          ¡Las 7 esferas del dragón han cumplido su deseo! Todos los regalos han sido reservados por familiares y amigos. Gracias de corazón.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pb-16">
      <motion.div
        layout
        className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,230px),1fr))] gap-[18px]"
      >
        <AnimatePresence mode="popLayout">
          {gifts.map((gift, index) => (
            <motion.div
              key={gift.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                duration: 0.2,
                delay: index * 0.03,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              <GiftCard gift={gift} onClaim={onClaim} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
