import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
        <motion.div
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            backgroundColor: '#10B981', // Emerald green
          }}
          animate={{
            scale: [1, 1.2, 1, 1.2, 1],
            opacity: [1, 0.7, 1, 0.7, 1],
          }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
        <p className="text-slate-400">Finding the most scenic route...</p>
    </div>
  );
};

export default LoadingSpinner;