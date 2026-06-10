import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const serif = { fontFamily: "'Instrument Serif', serif" };

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      className="relative bg-black pt-32 md:pt-44 pb-10 md:pb-14 px-6 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.03)_0%,_transparent_70%)]" />
      <div className="relative max-w-6xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-white/40 text-sm tracking-widest uppercase mb-6"
        >
          About Us
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight"
        >
          Pioneering{' '}
          <span className="italic text-white/60" style={serif}>
            ideas
          </span>{' '}
          for <br className="hidden md:block" />
          minds that{' '}
          <span className="italic text-white/60" style={serif}>
            create, build, and inspire.
          </span>
        </motion.h2>
      </div>
    </section>
  );
};

export default AboutSection;
