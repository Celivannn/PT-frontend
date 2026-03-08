import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-hide splash screen after 2.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onFinish, 500); // Wait for exit animation
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-red-600"
        >
          {/* Logo Container */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              delay: 0.2,
              duration: 0.8,
              type: "spring",
              stiffness: 200,
              damping: 20
            }}
            className="relative"
          >
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-white shadow-2xl flex items-center justify-center overflow-hidden">
              <img 
                src="/logo.png" 
                alt="Minute Burger Logo" 
                className="w-40 h-40 md:w-52 md:h-52 object-contain"
              />
            </div>
            
            {/* Rotating ring animation */}
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -inset-2 rounded-full border-4 border-white border-t-transparent"
              style={{ borderTopColor: 'transparent' }}
            />
          </motion.div>

          {/* App Name with animation */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 text-3xl md:text-4xl font-heading font-bold text-white"
          >
            Minute Burger
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-2 text-white/80 text-sm md:text-base"
          >
            Fresh burgers in a minute!
          </motion.p>

          {/* Loading dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute bottom-12 flex space-x-2"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  y: [0, -10, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
                className="w-3 h-3 bg-white rounded-full"
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;