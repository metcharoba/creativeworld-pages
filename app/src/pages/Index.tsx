import { useEffect, useRef } from 'react';
import { Globe, Instagram, Twitter } from 'lucide-react';
import AboutSection from '../components/AboutSection';
import FeaturedVideoSection from '../components/FeaturedVideoSection';
import PhilosophySection from '../components/PhilosophySection';
import ServicesSection from '../components/ServicesSection';

const HERO_VIDEO = `${import.meta.env.BASE_URL}videos/hero_robot.mp4`;

const Index = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const animateOpacity = (from: number, to: number, duration: number) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        video.style.opacity = String(from + (to - from) * t);
        if (t < 1) rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    };

    let started = false;
    let fadingOut = false;

    const handleCanPlay = () => {
      if (started) return;
      started = true;
      void video.play().catch(() => {});
      animateOpacity(0, 1, 500);
    };

    // play once, then dim slightly toward the end and hold the last frame
    const handleTimeUpdate = () => {
      if (!video.duration || fadingOut) return;
      if (video.duration - video.currentTime <= 0.8) {
        fadingOut = true;
        animateOpacity(parseFloat(video.style.opacity || '1'), 0.6, 800);
      }
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  return (
    <div className="bg-black">
      <div className="min-h-screen overflow-hidden relative flex flex-col">
        <video
          ref={videoRef}
          src={HERO_VIDEO}
          // smaller than full-bleed: the 720p source is shown below its native
          // width (sharper), seated bottom-center, all edges melting into the
          // black background via the radial mask
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] max-w-full aspect-video object-cover"
          style={{
            opacity: 0,
            maskImage:
              'radial-gradient(110% 110% at 50% 100%, black 55%, transparent 92%)',
            WebkitMaskImage:
              'radial-gradient(110% 110% at 50% 100%, black 55%, transparent 92%)',
          }}
          muted
          autoPlay
          playsInline
          preload="auto"
        />

        <nav className="relative z-20 px-6 py-6">
          <div className="liquid-glass rounded-full max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <Globe size={24} className="text-white" />
                <span className="text-white font-semibold text-lg">CreativeWorld</span>
              </div>
              <div className="hidden md:flex items-center gap-8 ml-8">
                {[
                  ['About', '#about'],
                  ['Vision', '#vision'],
                  ['Works', '#works'],
                ].map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    className="text-white/80 hover:text-white text-sm font-medium"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://note.com/margin_trace"
                target="_blank"
                rel="noreferrer"
                className="text-white text-sm font-medium"
              >
                note
              </a>
              <a
                href="https://github.com/metcharoba"
                target="_blank"
                rel="noreferrer"
                className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium"
              >
                GitHub
              </a>
            </div>
          </div>
        </nav>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[20%]">
          <h1
            className="text-7xl md:text-8xl lg:text-9xl text-white tracking-tight whitespace-nowrap mb-8"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Know it <em className="italic">all</em>.
          </h1>

          <p className="text-white text-sm leading-relaxed px-4 mb-8 max-w-md">
            A personal field of experiments — generative scenes, quiet motion, and small
            ideas left running in the dark.
          </p>

          <a
            href="#about"
            className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors"
          >
            Enter the world
          </a>
        </div>

        <div className="relative z-10 flex justify-center gap-4 pb-12">
          {[Instagram, Twitter, Globe].map((Icon, i) => (
            <button
              key={i}
              className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all"
            >
              <Icon size={20} />
            </button>
          ))}
        </div>
      </div>

      <AboutSection />
      <FeaturedVideoSection />
      <PhilosophySection />
      <ServicesSection />
    </div>
  );
};

export default Index;
