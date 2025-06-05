import React from 'react';
import { motion } from 'framer-motion';
import backgroundImage from '../assets/images/me-and-beccs.jpg'; // adjust path as needed

const letterVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const splitTextWithSpaces = (text: string) => {
  return text.split(' ').map((word, wordIndex) => (
    <motion.span
      key={wordIndex}
      variants={containerVariants}
      style={{ display: 'inline-block', marginRight: '0.5em' }} // slightly tighter margin on mobile
    >
      {word.split('').map((char, i) => (
        <motion.span
          key={i}
          variants={letterVariants}
          style={{ display: 'inline-block' }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  ));
};

const Banner: React.FC<{ onLearnMoreClick?: () => void }> = ({ onLearnMoreClick }) => {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center relative px-4 sm:px-6 md:px-12 py-12 sm:py-16 md:py-24"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-pink-500 opacity-30"></div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl w-full mx-auto">
        <div className="flex flex-col gap-4 sm:gap-6 text-left">
          <motion.h1
            className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-2 sm:mb-4 font-uber-move drop-shadow-lg leading-tight"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {splitTextWithSpaces('REBECCA CUFFY-OLIVER❤️')}
          </motion.h1>

          <motion.h2
            className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-1 sm:mb-2 font-uber-move drop-shadow-lg"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1 }}
          >
            {splitTextWithSpaces("Welcome to Rebecca's Site!")}
          </motion.h2>

          <motion.p
            className="text-base sm:text-lg md:text-xl text-white mb-4 sm:mb-6 drop-shadow-lg leading-relaxed max-w-full sm:max-w-2xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 2 }}
          >
            {splitTextWithSpaces(
              'Explore our mission, discover what we do, and join us in making a difference.'
            )}
          </motion.p>

          <motion.button
            onClick={onLearnMoreClick}
            className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 sm:px-8 rounded-full shadow-lg transition duration-300 w-max max-w-full whitespace-nowrap truncate"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3 }}
          >
            Learn More
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Banner;