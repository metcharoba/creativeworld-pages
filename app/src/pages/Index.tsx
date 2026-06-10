import { useEffect, useRef } from 'react';
import { ArrowRight, Globe, Instagram, Twitter } from 'lucide-react';
import AboutSection from '../components/AboutSection';
import FeaturedVideoSection from '../components/FeaturedVideoSection';
import PhilosophySection from '../components/PhilosophySection';
import ServicesSection from '../components/ServicesSection';

const HERO_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4';

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

    const handleTimeUpdate = () => {
      if (!video.duration || fadingOut) return;
      if (video.duration - video.currentTime <= 0.55) {
        fadingOut = true;
        animateOpacity(parseFloat(video.style.opacity || '1'), 0, 500);
      }
    };

    const handleEnded = () => {
      video.style.opacity = '0';
      window.setTimeout(() => {
        video.currentTime = 0;
        void video.play().catch(() => {});
        fadingOut = false;
        animateOpacity(0, 1, 500);
      }, 100);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <div className="bg-black">
      <div className="min-h-screen overflow-hidden relative flex flex-col">
        <video
          ref={videoRef}
          src={HERO_VIDEO}
          className="absolute inset-0 w-full h-full object-cover object-bottom"
          style={{ opacity: 0 }}
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
                <span className="text-white font-semibold text-lg">Asme</span>
              </div>
              <div className="hidden md:flex items-center gap-8 ml-8">
                {['Features', 'Pricing', 'About'].map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="text-white/80 hover:text-white text-sm font-medium"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-white text-sm font-medium">Sign Up</button>
              <button className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium">
                Login
              </button>
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

          <form className="max-w-xl w-full mb-6" onSubmit={(e) => e.preventDefault()}>
            <div className="liquid-glass rounded-full pl-6 pr-2 py-2 flex items-center gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 min-w-0 bg-transparent text-white placeholder:text-white/40 text-sm outline-none"
              />
              <button type="submit" className="bg-white rounded-full p-3 text-black">
                <ArrowRight size={20} />
              </button>
            </div>
          </form>

          <p className="text-white text-sm leading-relaxed px-4 mb-8 max-w-md">
            Stay updated with the latest news and insights. Subscribe to our newsletter
            today and never miss out on exciting updates.
          </p>

          <button className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors">
            Manifesto
          </button>
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
