import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import MusicPlayer from '../components/MusicPlayer'; // Adjust the path as needed

const links = [
  { name: 'Home', path: '/' },
  { name: 'Videos', path: '/videos' },
];

const Navbar: React.FC = () => {
  const location = useLocation();

  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const containerRef = useRef<HTMLUListElement | null>(null);

  const setLinkRef = useCallback(
    (el: HTMLAnchorElement | null, index: number) => {
      linkRefs.current[index] = el;
    },
    []
  );

  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const activeIndex = links.findIndex(link => link.path === location.pathname);

    if (activeIndex === -1) {
      setUnderlineStyle({ left: 0, width: 0 });
      return;
    }

    const currentLink = linkRefs.current[activeIndex];
    const container = containerRef.current;

    if (currentLink && container) {
      const containerRect = container.getBoundingClientRect();
      const linkRect = currentLink.getBoundingClientRect();
      setUnderlineStyle({
        left: linkRect.left - containerRect.left,
        width: linkRect.width,
      });
    }
  }, [location.pathname]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className="bg-pink-600 text-white p-4 relative">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="text-xl font-bold tracking-wide cursor-pointer z-20">
          <Link to="/">Rebecca</Link>
        </div>

        {/* Centered Links */}
        <div className="hidden md:flex relative flex-1 justify-center">
          <ul
            ref={containerRef}
            className="flex space-x-10 relative pb-2"
          >
            {links.map(({ name, path }, i) => (
              <li key={path} className="relative">
                <Link
                  to={path}
                  ref={el => setLinkRef(el, i)}
                  className="hover:text-yellow-300 transition-colors duration-200 relative z-10"
                >
                  {name}
                </Link>
              </li>
            ))}

            {/* Animated underline */}
            <motion.div
              key={location.pathname}
              className="absolute bottom-0 h-1 bg-yellow-300 rounded pointer-events-none"
              initial={{ width: 0, left: underlineStyle.left }}
              animate={{ width: underlineStyle.width, left: underlineStyle.left }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </ul>
        </div>

        {/* Music Player on Desktop */}
        <div className="hidden md:block ml-4">
          <MusicPlayer />
        </div>

        {/* Hamburger Button */}
        <button
          className="md:hidden z-20 focus:outline-none"
          onClick={() => setMobileMenuOpen(prev => !prev)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-7 h-7 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={mobileMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="overflow-hidden md:hidden bg-pink-700 mt-2 rounded"
      >
        <ul className="flex flex-col items-center space-y-3 p-4">
          {links.map(({ name, path }) => (
            <li key={path}>
              <Link
                to={path}
                className={`block hover:text-yellow-300 transition-colors duration-200 ${
                  location.pathname === path ? 'font-bold text-yellow-300' : ''
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>
        {/* Music Player in Mobile Menu */}
        <div className="mt-4 px-4">
          <MusicPlayer />
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;