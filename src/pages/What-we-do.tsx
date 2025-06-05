import React from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const WhatWeDo: React.FC = () => {
  return (
    <div className="min-h-screen bg-pink-100 pb-12">
      {/* Cover image */}
      <motion.div
        className="w-full h-64 md:h-30 bg-pink-200 flex items-center justify-center overflow-hidden mb-8"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        <img
          src="/images/becca-cover.jpg"
          alt="Rebecca Birthday Cover"
          className="object-cover w-full h-full"
        />
      </motion.div>
      <motion.div
        className="max-w-3xl mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-5xl font-extrabold text-pink-600 mb-8 text-center drop-shadow"
          variants={itemVariants}
        >
          What We Do
        </motion.h1>
        <motion.p
          className="text-2xl text-pink-700 mb-8 text-center font-semibold"
          variants={itemVariants}
        >
          What we do is to make Becca happy and make sure that she doesn't forget that her birthday is the most special day to her.
        </motion.p>
        <motion.p
          className="text-lg text-gray-700 mb-4 text-center font-medium"
          variants={itemVariants}
        >
          Our services include:
        </motion.p>
        <motion.ul
          className="list-disc list-inside text-gray-700 space-y-2 text-lg mx-auto max-w-md text-center"
          variants={containerVariants}
        >
          {[
            'Making Rebecca happy',
            'Themed website design just for her',
            'Photographer and videography',
            "Celebrating her on her birthday",
          ].map((service, idx) => (
            <motion.li key={idx} variants={itemVariants}>
              {service}
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
    </div>
  );
};

export default WhatWeDo;