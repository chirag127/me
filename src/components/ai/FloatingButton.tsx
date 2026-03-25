import React from 'react';
import { BotMessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FloatingButton = ({ onClick, isOpen }: { onClick: () => void, isOpen: boolean }) => {
  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          onClick={onClick}
          className="fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50 flex items-center justify-center"
          aria-label="Open AI Assistant"
        >
          <BotMessageSquare size={28} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
