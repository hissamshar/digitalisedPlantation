import { Cpu, Zap, Droplets, CloudRain, ShieldCheck, BarChart3, ChevronRight, Check, Menu, X, Instagram, Linkedin, Facebook, Youtube } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  // Video scrub refs
  const showcaseRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Video Blob State for Vercel VOD scrubbing
  const [videoSrc, setVideoSrc] = useState<string>('');
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  // Pre-fetch video as a Blob to ensure Vercel edge caching doesn't block byte-range seek requests
  useEffect(() => {
    const videoUrl = '/Cinematic_macro_vertical_track_scrub.mp4';
    fetch(videoUrl)
      .then(res => res.blob())
      .then(blob => {
        const objectUrl = URL.createObjectURL(blob);
        setVideoSrc(objectUrl);
        setIsVideoLoading(false);
      })
      .catch(err => {
        console.warn("Blob fetch failed, falling back to direct stream:", err);
        setVideoSrc(videoUrl);
        setIsVideoLoading(false);
      });

    return () => {
      // Cleanup object URL
      if (videoSrc && videoSrc.startsWith('blob:')) {
        URL.revokeObjectURL(videoSrc);
      }
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // --- Scroll Animations organized in strict DOM order ---

      // 1. Hero
      gsap.from('.hero-content', { y: 40, opacity: 0, duration: 1, ease: 'power3.out' });
      gsap.from('.hero-card', { y: 60, opacity: 0, duration: 1, delay: 0.2, ease: 'power3.out' });

      // 2. Stats
      gsap.fromTo('.stat-item',
        { y: 30, opacity: 0 },
        { scrollTrigger: { trigger: '.stats-section', start: 'top 85%' }, y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power2.out' }
      );

      // 3. Partners (No animation per user request)

      // 4. Big Text Transition (Removed GSAP color tween in favor of CSS gradient spacer)

      // 5. Video Scrub Showcase (Pinned) - Synchronous execution
      const video = videoRef.current;
      if (video && showcaseRef.current) {
        // Ensure video is explicitly paused so scrubbing doesn't fight playback
        video.pause();
        
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: showcaseRef.current,
            start: 'top top',
            end: '+=300%', // Scroll for 3 screens
            scrub: 1.5,
            pin: true,
          }
        });

        // Scrub video smoothly using a proxy object
        const proxy = { progress: 0 };
        tl.to(proxy, {
          progress: 1,
          duration: 1, // Stretch the scrub across the entire 300% scroll distance
          ease: 'none',
          onUpdate: () => {
            if (video.duration && !isNaN(video.duration)) {
              try {
                // Request animation frame for the actual seek to prevent browser lockups
                requestAnimationFrame(() => {
                  video.currentTime = proxy.progress * video.duration;
                });
              } catch (e) {
                // Ignore seek errors
              }
            }
          }
        }, 0);

        // Animate text overlays
        tl.to('.hw-text-1', { opacity: 0, y: -50, duration: 0.15 }, 0.1);
        tl.fromTo('.hw-text-2', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.15 }, 0.2);
        tl.to('.hw-text-2', { opacity: 0, y: -50, duration: 0.15 }, 0.4);
        tl.fromTo('.hw-text-3', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.15 }, 0.5);
        tl.to('.hw-text-3', { opacity: 0, y: -50, duration: 0.15 }, 0.7);
        tl.fromTo('.hw-text-4', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.15 }, 0.8);
      }

      // 5.5 Seamless Transition OUT of Video Section (Removed GSAP color tween in favor of CSS gradient spacer)

      // 6. Features (Simplified)
      gsap.fromTo('.feature-card',
        { y: 40, opacity: 0 },
        { scrollTrigger: { trigger: '.features-section', start: 'top 85%' }, y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power2.out' }
      );

      // 7. Case Studies
      gsap.fromTo('.case-study',
        { y: 40, opacity: 0 },
        { scrollTrigger: { trigger: '.case-studies-section', start: 'top 85%' }, y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power2.out' }
      );

      // 8. How It Works
      gsap.fromTo('.step-item',
        { y: 40, opacity: 0 },
        { scrollTrigger: { trigger: '.how-it-works-section', start: 'top 85%' }, y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: 'power2.out' }
      );

      // 9. Why Choose Us
      gsap.fromTo('.why-us-content',
        { x: -50, opacity: 0 },
        { scrollTrigger: { trigger: '.why-us-section', start: 'top 85%' }, x: 0, opacity: 1, duration: 1, ease: 'power2.out' }
      );

      // 11. Pricing
      gsap.fromTo('.pricing-card',
        { y: 40, opacity: 0 },
        { scrollTrigger: { trigger: '.pricing-section', start: 'top 85%' }, y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: 'power2.out' }
      );

      // 12. FAQ
      gsap.fromTo('.faq-item',
        { y: 20, opacity: 0 },
        { scrollTrigger: { trigger: '.faq-section', start: 'top 85%' }, y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power2.out' }
      );

      // 13. CTA
      gsap.fromTo('.cta-content',
        { y: 40, opacity: 0 },
        { scrollTrigger: { trigger: '.cta-section', start: 'top 85%' }, y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
      );

      // Refresh ScrollTrigger after initializing everything
      ScrollTrigger.refresh();

    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={mainRef}
      className="min-h-screen bg-white text-dark-800 font-sans relative overflow-hidden" 
    >
      {/* 1. Navbar */}
      <nav className="w-full bg-white border-b border-gray-100 relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img src="/logo-icon.png" alt="Digitalized Plantation" className="h-8 sm:h-10 w-auto object-contain" />
            <span className="font-bold text-lg sm:text-xl tracking-tight text-primary-500">
              Digitalized Plantation
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#" className="text-dark-800 hover:text-primary-500 transition-colors">Home</a>
            <a href="#about" className="hover:text-primary-500 transition-colors">About</a>
            <a href="#features" className="hover:text-primary-500 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-primary-500 transition-colors">Pricing</a>
          </div>
          
          <div className="hidden md:flex items-center gap-4 text-sm font-medium">
            <a href="#" className="hidden md:block hover:text-primary-500">Log in</a>
            <button className="bg-primary-500 text-white px-5 py-2 rounded font-medium hover:bg-primary-600 transition-colors">
              Get started
            </button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 flex items-center justify-center p-2 -mr-2">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 p-6 flex flex-col gap-4 shadow-xl">
            <a href="#" onClick={() => setIsMenuOpen(false)} className="text-dark-800 hover:text-primary-500 font-medium">Home</a>
            <a href="#about" onClick={() => setIsMenuOpen(false)} className="hover:text-primary-500 font-medium">About</a>
            <a href="#features" onClick={() => setIsMenuOpen(false)} className="hover:text-primary-500 font-medium">Features</a>
            <a href="#pricing" onClick={() => setIsMenuOpen(false)} className="hover:text-primary-500 font-medium">Pricing</a>
            <div className="border-t border-gray-100 pt-4 mt-2 flex flex-col gap-4">
              <button className="w-full text-center py-2 font-medium">Log in</button>
              <button className="w-full bg-primary-500 text-white py-2 rounded font-medium">Get started</button>
            </div>
          </div>
        )}
      </nav>

      {/* 2. Hero Section */}
      <section className="bg-primary-500 relative overflow-hidden px-6 py-16 lg:py-20">
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-600 opacity-50 transform rotate-45 -translate-x-1/2 translate-y-1/2 rounded-3xl"></div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-white hero-content">
            <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold mb-6">
              AI FOR A GREENER PAKISTAN
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-[1.1] mb-6">
              Transform <br className="hidden md:block" />the way your <br className="hidden md:block" />plantation grows
            </h1>
            <p className="text-lg text-green-100 mb-8 max-w-lg">
              Combating climate vulnerability and food insecurity through AI-driven automation, IoT smart irrigation, and climate-independent urban farming solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-white text-primary-500 px-6 py-3 rounded font-bold hover:bg-gray-50 transition-colors text-center">
                Start for free
              </button>
              <button className="w-full sm:w-auto border border-white text-white px-6 py-3 rounded font-bold hover:bg-white/10 transition-colors text-center">
                Explore solutions
              </button>
            </div>
          </div>
          
          <div className="relative flex justify-center lg:justify-end hero-card">
            {/* Flat Illustration matching the reference */}
            <div className="w-full bg-gray-100 p-6 md:p-8 rounded-lg border-4 border-gray-900 shadow-none">
              
              {/* Dashboard Header Layout */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b-4 border-gray-900">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-100 px-2.5 py-1 rounded-md">
                    Live IoT Telemetry
                  </span>
                  <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight mt-2">
                    Smart Chamber Alpha-1
                  </h3>
                </div>
                {/* System Active Badge */}
                <div className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-md font-semibold text-sm tracking-wide uppercase">
                  <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></span>
                  AI Automation Active
                </div>
              </div>

              {/* 3-Column Real-Time Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                
                {/* Metric 1: Soil Moisture */}
                <div className="group bg-white p-6 rounded-lg transition-all duration-200 hover:scale-[1.02] shadow-none flex flex-col justify-between h-40">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-bold uppercase tracking-wider text-gray-500">Soil Moisture</span>
                    <div className="w-10 h-10 bg-blue-500 rounded-md flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z"/></svg>
                    </div>
                  </div>
                  <div>
                    <div className="text-4xl font-extrabold text-gray-900 tracking-tight">64.5%</div>
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide mt-1">● Optimal Range</p>
                  </div>
                </div>

                {/* Metric 2: Climate & Heat Control */}
                <div className="group bg-white p-6 rounded-lg transition-all duration-200 hover:scale-[1.02] shadow-none flex flex-col justify-between h-40">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-bold uppercase tracking-wider text-gray-500">Chamber Temp</span>
                    <div className="w-10 h-10 bg-amber-500 rounded-md flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></svg>
                    </div>
                  </div>
                  <div>
                    <div className="text-4xl font-extrabold text-gray-900 tracking-tight">24.2°C</div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mt-1">Humidity: 58%</p>
                  </div>
                </div>

                {/* Metric 3: AI Carbon Sequestration Counter */}
                <div className="group bg-emerald-500 p-6 rounded-lg transition-all duration-200 hover:scale-[1.02] shadow-none flex flex-col justify-between h-40">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-bold uppercase tracking-wider text-emerald-100">CO₂ Sequestered</span>
                    <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m12 8-4 4h8z"/></svg>
                    </div>
                  </div>
                  <div>
                    <div className="text-4xl font-extrabold text-white tracking-tight">142.8 kg</div>
                    <p className="text-xs font-bold text-emerald-900 uppercase tracking-wide mt-1">Net Positive Climate Impact</p>
                  </div>
                </div>

              </div>

              {/* Real-time Actuator Controls (Directly showing IoT hardware relays) */}
              <div className="bg-white p-6 rounded-lg border-2 border-gray-200 shadow-none">
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                  Active Hardware Relays
                </h4>
                <div className="flex flex-wrap gap-4">
                  
                  {/* Irrigation Pump Relay Block */}
                  <div className="flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-md border border-gray-300 flex-1 min-w-[140px]">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Water Pump</p>
                      <p className="text-sm font-extrabold text-gray-900">RUNNING (Auto)</p>
                    </div>
                  </div>

                  {/* Ventilation Fan Relay Block */}
                  <div className="flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-md border border-gray-300 flex-1 min-w-[140px]">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Exhaust Fans</p>
                      <p className="text-sm font-extrabold text-gray-900">ON (Optimizing)</p>
                    </div>
                  </div>

                  {/* Growth Light Relay Block */}
                  <div className="flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-md border border-gray-300 flex-1 min-w-[140px]">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Photosynthesis Light</p>
                      <p className="text-sm font-extrabold text-gray-900">NIGHT CYCLE</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 3. Stats Section */}
      <section className="stats-section bg-white py-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
          <div className="stat-item">
            <h3 className="text-4xl font-bold text-success-500 mb-2">+60%</h3>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Yield Increase</p>
          </div>
          <div className="stat-item">
            <h3 className="text-4xl font-bold text-primary-500 mb-2">15%</h3>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Faster Growth</p>
          </div>
          <div className="stat-item">
            <h3 className="text-4xl font-bold text-warning-500 mb-2">24/7</h3>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Monitoring</p>
          </div>
          <div className="stat-item">
            <h3 className="text-4xl font-bold text-success-500 mb-2">100%</h3>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Organic Output</p>
          </div>
        </div>
      </section>

      {/* 4. Sponsors/Partners Section */}
      <section className="partners-section bg-light-50 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-dark-900 mb-4">Our Partners</h2>
          <p className="text-gray-500 mb-10">Proudly supported by leading institutions and organizations.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* NIC Peshawar */}
            <div className="partner-card bg-white p-8 rounded-2xl text-left border border-gray-100 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="h-20 mb-6 flex items-center justify-start">
                <img src="/nic-peshawar.png" alt="NIC Peshawar" className="h-full w-auto object-contain mix-blend-multiply" />
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-3">NIC Peshawar</h3>
              <p className="text-gray-600 text-sm leading-relaxed flex-1">
                Funded by Ignite, MOITT. Supporting our vision to revolutionize agriculture through world-class incubation and strategic mentorship.
              </p>
            </div>

            {/* British Council */}
            <div className="partner-card bg-white p-8 rounded-2xl text-left border border-gray-100 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-6 right-6 px-3 py-1 bg-success-50 text-success-700 rounded-full text-xs font-semibold border border-success-100">
                Award Winner
              </div>
              <div className="h-20 mb-6 flex items-center justify-start">
                <img src="/british-council.png" alt="British Council" className="h-full w-auto object-contain mix-blend-multiply" />
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-3">British Council</h3>
              <p className="text-gray-600 text-sm leading-relaxed flex-1">
                Winner of the national call for digital innovation, providing critical funding and support for our climate tech initiatives.
              </p>
            </div>
            
            {/* Alkhidmat */}
            <div className="partner-card bg-white p-8 rounded-2xl text-left border border-gray-100 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="h-20 mb-6 flex items-center justify-start">
                <img src="/alkhidmat.png" alt="Alkhidmat Foundation" className="h-full w-auto object-contain mix-blend-multiply" />
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-3">Alkhidmat Foundation</h3>
              <p className="text-gray-600 text-sm leading-relaxed flex-1">
                Actively deployed and trusted by Alkhidmat Foundation to secure food sources and promote climate-resilient farming practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Spacer for seamless transition into dark section */}
      <div className="w-full h-32 md:h-48 bg-gradient-to-b from-light-50 to-black"></div>

      {/* 5. Centered Text */}
      <section className="big-text-section bg-black text-white py-4 lg:py-8 text-center px-6">
        <div className="max-w-3xl mx-auto big-text">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Experience the future of climate-independent farming today.
          </h2>
          <p className="text-gray-400 text-lg">
            Traditional farming is failing. 56% of seeds fail to germinate and unpredictable climates destroy yields. Our AI ecosystem delivers exactly what your crops need, exactly when they need it.
          </p>
        </div>
      </section>

      {/* 5b. Hardware Showcase - Video Scrub */}
      <section ref={showcaseRef} className="relative bg-black text-white h-[100vh] overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          {isVideoLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <video
            ref={videoRef}
            src={videoSrc || undefined}
            playsInline
            autoPlay={false}
            muted
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ pointerEvents: 'none' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none z-[5]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black pointer-events-none z-[5]"></div>
          
          {/* Hardware Text Overlays */}
          <div className="absolute inset-0 flex items-center px-8 md:px-24 pointer-events-none z-10">
            
            {/* Text 1 */}
            <div className="hw-text-1 absolute max-w-2xl">
              <div className="inline-block px-3 py-1 bg-success-500/20 text-success-400 rounded-full text-xs font-semibold mb-6 uppercase tracking-wider backdrop-blur-sm">
                Hardware Integration
              </div>
              <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-2xl">
                Engineered for <br />the Toughest Climates
              </h2>
              <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-lg drop-shadow-xl">
                Our smart IoT control hubs are built to withstand high temperatures, monsoons, and extreme weather, combining raw electronic intelligence with botanical growth.
              </p>
              <div className="mt-8 text-sm text-gray-400 flex items-center gap-2">
                <span className="inline-block animate-bounce text-white">↓</span> Scroll to explore components
              </div>
            </div>

            {/* Text 2 */}
            <div className="hw-text-2 absolute max-w-2xl opacity-0">
              <div className="w-14 h-14 bg-success-500/20 text-success-400 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm">
                <Cpu size={28} />
              </div>
              <h3 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-2xl">
                The Neural Control Hub
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed max-w-lg drop-shadow-xl">
                Equipped with custom microprocessor chips, our hubs regulate irrigation grids with surgical precision. Coiled around natural vines, they blend seamlessly into the plantation canopy.
              </p>
            </div>

            {/* Text 3 */}
            <div className="hw-text-3 absolute max-w-2xl opacity-0 right-8 md:right-24 text-right flex flex-col items-end">
              <div className="w-14 h-14 bg-warning-500/20 text-warning-400 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm">
                <Droplets size={28} />
              </div>
              <h3 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-2xl">
                Organic Smart Sensors
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed max-w-lg drop-shadow-xl">
                Moisture, temperature, and nitrogen probes are embedded along the roots. The cables are shielded with biodegradable plant-based outer skins that naturally merge with the roots.
              </p>
            </div>

            {/* Text 4 */}
            <div className="hw-text-4 absolute max-w-2xl opacity-0">
              <div className="w-14 h-14 bg-primary-500/20 text-primary-400 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm">
                <Zap size={28} />
              </div>
              <h3 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-2xl">
                Automated Solenoid Grid
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed max-w-lg drop-shadow-xl">
                Pulsed water releases are delivered on-demand. Visualized in real-time, the water flows precisely down irrigation channels only when the soil signals dehydration.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Spacer for seamless transition out of dark section */}
      <div className="w-full h-32 md:h-48 bg-gradient-to-b from-black to-light-50"></div>

      {/* 6. Features Grid */}
      <section id="features" className="features-section bg-light-50 pb-16 lg:pb-20 pt-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-gray-500">Everything you need to automate your harvest.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="feature-card bg-blue-50 p-8 rounded-xl border border-blue-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4"><Cpu size={20} /></div>
              <h3 className="font-bold mb-2">AI Drone Monitoring</h3>
              <p className="text-sm text-gray-600">24/7 visual analysis for plant health, pest detection, and growth tracking using computer vision.</p>
            </div>
            
            <div className="feature-card bg-green-50 p-8 rounded-xl border border-green-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4"><Droplets size={20} /></div>
              <h3 className="font-bold mb-2">Smart IoT Irrigation</h3>
              <p className="text-sm text-gray-600">Automated, precision watering based on real-time soil moisture and environmental data.</p>
            </div>
            
            <div className="feature-card bg-yellow-50 p-8 rounded-xl border border-yellow-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center mb-4"><BarChart3 size={20} /></div>
              <h3 className="font-bold mb-2">Carbon Tracking</h3>
              <p className="text-sm text-gray-600">Real-time Carbon Sequestration Tracking Dashboard to monitor your environmental impact.</p>
            </div>
            
            <div className="feature-card bg-purple-50 p-8 rounded-xl border border-purple-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4"><CloudRain size={20} /></div>
              <h3 className="font-bold mb-2">Climate Control</h3>
              <p className="text-sm text-gray-600">Total climate independence for indoor grow rooms. Control temperature and humidity automatically.</p>
            </div>
            
            <div className="feature-card bg-red-50 p-8 rounded-xl border border-red-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center mb-4"><ShieldCheck size={20} /></div>
              <h3 className="font-bold mb-2">Bilingual Chatbot</h3>
              <p className="text-sm text-gray-600">Built-in AI assistant offering guidance to farmers in both English and Urdu.</p>
            </div>
            
            <div className="feature-card bg-teal-50 p-8 rounded-xl border border-teal-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center mb-4"><Zap size={20} /></div>
              <h3 className="font-bold mb-2">Yield Prediction</h3>
              <p className="text-sm text-gray-600">Predict harvest outcomes and optimize resource usage to guarantee maximum ROI margin.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Case Studies (Blog) */}
      <section className="case-studies-section bg-white py-16 lg:py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">Latest success stories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Scaling Vertical Farming in Singapore",
                desc: "Discover how an urban initiative utilized our Smart Grow Rooms to feed a local community independently of land constraints.",
                tag: "Urban Agriculture",
                img: "https://images.unsplash.com/photo-1495908333425-29a1e0918c5f?w=600&h=400&fit=crop&q=80"
              },
              {
                title: "Combatting Drought in California",
                desc: "See how a commercial farm in the Central Valley used our automated solenoid grid to protect 500 acres of crops from record-breaking droughts.",
                tag: "Commercial Farm",
                img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&h=400&fit=crop&q=80"
              },
              {
                title: "Optimizing Yields in the Netherlands",
                desc: "Learn how leading European greenhouses are using our predictive AI to manage climate control and maximize organic output.",
                tag: "AI & Software",
                img: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb0?w=600&h=400&fit=crop&q=80"
              }
            ].map((story, i) => (
              <div key={i} className="case-study group cursor-pointer">
                <div className="w-full h-48 bg-gray-200 mb-6 rounded-lg overflow-hidden">
                  <img src={story.img} alt={story.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="text-primary-500 text-xs font-bold uppercase tracking-wider mb-2">{story.tag}</div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary-500 transition-colors">{story.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{story.desc}</p>
                <div className="text-sm font-semibold flex items-center gap-1 text-primary-500">
                  Read more <ChevronRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. How It Works */}
      <section id="about" className="how-it-works-section bg-dark-900 text-white py-16 lg:py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">How Digitalized Plantation works</h2>
            <p className="text-gray-400">Transforming agriculture in three simple steps.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="step-item flex flex-col items-center">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center font-bold text-xl mb-6">1</div>
              <h3 className="text-xl font-bold mb-3">Deploy Sensors</h3>
              <p className="text-gray-400 text-sm">Install our plug-and-play IoT modules across your kitchen garden or large-scale farm.</p>
            </div>
            <div className="step-item flex flex-col items-center">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center font-bold text-xl mb-6">2</div>
              <h3 className="text-xl font-bold mb-3">AI Analysis</h3>
              <p className="text-gray-400 text-sm">Data streams to our cloud where AI predicts exactly when and how much to water.</p>
            </div>
            <div className="step-item flex flex-col items-center">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center font-bold text-xl mb-6">3</div>
              <h3 className="text-xl font-bold mb-3">Automated Action</h3>
              <p className="text-gray-400 text-sm">Systems execute the optimal environmental controls without manual intervention.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Why Choose Us */}
      <section className="why-us-section flex flex-col md:flex-row min-h-[400px]">
        <div className="why-us-content w-full md:w-1/2 bg-success-500 text-white p-10 lg:p-16 flex flex-col justify-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Why farmers choose Digitalized Plantation</h2>
          <p className="text-green-100 mb-8">Empowering your yield with data-driven confidence.</p>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="mt-1 w-2 h-2 bg-white rounded-full shrink-0"></div>
              <span><strong>Zero Water Waste.</strong> Precision irrigation saves up to 50% of water.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-1 w-2 h-2 bg-white rounded-full shrink-0"></div>
              <span><strong>Highest Quality Organic.</strong> Optimal nutrients at the optimal time.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-1 w-2 h-2 bg-white rounded-full shrink-0"></div>
              <span><strong>Climate Resilience.</strong> Ignore external weather anomalies completely.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-1 w-2 h-2 bg-white rounded-full shrink-0"></div>
              <span><strong>Proven ROI.</strong> Up to 60% increase in overall harvest yields.</span>
            </li>
          </ul>
        </div>
        <div className="w-full md:w-1/2 bg-white p-10 lg:p-16 flex items-center justify-center relative overflow-hidden">
          {/* Geometric shapes matching the image */}
          <div className="relative w-64 h-64">
            <div className="absolute top-0 left-0 w-40 h-40 bg-primary-500 mix-blend-multiply opacity-90"></div>
            <div className="absolute top-12 left-12 w-32 h-32 bg-success-500 mix-blend-multiply transform rotate-45 opacity-90"></div>
            <div className="absolute bottom-4 right-4 w-40 h-40 bg-warning-500 rounded-full mix-blend-multiply opacity-90"></div>
          </div>
        </div>
      </section>

      {/* 11. Pricing */}
      <section id="pricing" className="pricing-section bg-light-50 py-16 lg:py-20 px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-success-500 font-semibold">Scale your farm from kitchen to commercial.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 items-center max-w-7xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100">
            {/* Tier 1 */}
            <div className="pricing-card p-8 md:p-10 border-b md:border-b-0 md:border-r border-gray-100">
              <h3 className="font-bold mb-2">Kitchen Garden</h3>
              <p className="text-sm text-gray-500 mb-6">Entry-level smart irrigation.</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">PKR 80K</span>
              </div>
              <ul className="space-y-4 mb-8 text-sm">
                <li className="flex items-center gap-2"><Check size={16} className="text-gray-400" /> Automated watering</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-gray-400" /> App monitoring</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-gray-400" /> Basic sensors</li>
                <li className="flex items-center gap-2 text-gray-400 line-through"><Check size={16} /> Climate control</li>
              </ul>
              <button className="w-full py-3 bg-dark-900 text-white rounded font-semibold hover:bg-black transition-colors">
                Contact Sales
              </button>
            </div>
            
            {/* Tier 2 (Highlighted) */}
            <div className="pricing-card bg-primary-500 text-white p-8 md:p-12 md:scale-105 rounded-xl shadow-2xl relative z-10">
              <div className="absolute top-0 right-0 bg-warning-500 text-dark-900 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">POPULAR</div>
              <h3 className="font-bold mb-2">Smart Garden</h3>
              <p className="text-green-200 text-sm mb-6">Advanced residential setup.</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">PKR 180K</span>
              </div>
              <ul className="space-y-4 mb-8 text-sm">
                <li className="flex items-center gap-2"><Check size={16} className="text-green-300" /> Zoned irrigation control</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-300" /> Environmental sensing</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-300" /> Weather integration</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-green-300" /> Basic AI analysis</li>
              </ul>
              <button className="w-full py-3 bg-white text-primary-500 rounded font-bold hover:bg-gray-50 transition-colors">
                Select Plan
              </button>
            </div>
            
            {/* Tier 3 */}
            <div className="pricing-card p-8 md:p-10 border-t md:border-t-0 md:border-l border-gray-100">
              <h3 className="font-bold mb-2">Smart Grow Room</h3>
              <p className="text-sm text-gray-500 mb-6">Full scale climate-independent.</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">PKR 750K</span>
              </div>
              <ul className="space-y-4 mb-8 text-sm">
                <li className="flex items-center gap-2"><Check size={16} className="text-gray-400" /> Total climate independence</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-gray-400" /> AI predictive analysis</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-gray-400" /> Full IoT automation</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-gray-400" /> Maximum ROI margin</li>
              </ul>
              <button className="w-full py-3 bg-dark-900 text-white rounded font-semibold hover:bg-black transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 12. FAQ */}
      <section className="faq-section bg-white py-16 lg:py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">Frequently asked questions</h2>
          
          <div className="space-y-4">
            {['How does the AI irrigation work?', 'What is the Smart Grow Room?', 'Can I integrate with existing systems?', 'How do you handle maintenance?', 'What happens during power outages?'].map((q, i) => (
              <div key={i} className="faq-item border-b border-gray-200 pb-4 flex items-center justify-between cursor-pointer group">
                <h4 className="font-semibold text-gray-800 group-hover:text-primary-500 transition-colors">{q}</h4>
                <div className="text-gray-400 group-hover:text-primary-500 transition-colors">+</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. Bottom CTA */}
      <section className="cta-section bg-primary-500 py-8 lg:py-10 px-6 text-center">
        <div className="max-w-2xl mx-auto cta-content">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-white">
            Ready to transform your plantation?
          </h2>
          <p className="text-primary-100 text-lg mb-8">
            Join the agricultural revolution in Pakistan. Start your journey towards climate-resilient farming today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary-600 px-8 py-3 rounded font-medium hover:bg-gray-50 transition-colors">
              Get started
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded font-medium hover:bg-white hover:text-primary-600 transition-colors">
              Contact sales
            </button>
          </div>
        </div>
      </section>

      {/* 14. Footer */}
      <footer className="bg-dark-900 text-gray-400 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 sm:gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo-icon.png" alt="Digitalized Plantation" className="h-10 w-auto object-contain brightness-0 invert" />
              <span className="font-bold text-xl tracking-tight text-white hidden sm:block">
                Digitalized Plantation
              </span>
            </div>
            <p className="text-sm mb-6">Empowering a greener Pakistan through IoT and AI.</p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/digitalized_plantation/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-primary-500 hover:text-white transition-colors flex items-center justify-center text-gray-400"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://www.linkedin.com/company/digitalized-plantation"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-primary-500 hover:text-white transition-colors flex items-center justify-center text-gray-400"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="https://www.facebook.com/groups/575293633024053/user/61575434916623/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-primary-500 hover:text-white transition-colors flex items-center justify-center text-gray-400"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a
                href="https://www.youtube.com/@DIGITALIZEDPLANTATION"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-primary-500 hover:text-white transition-colors flex items-center justify-center text-gray-400"
                aria-label="YouTube"
              >
                <Youtube size={16} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>Features</li>
              <li>Pricing</li>
              <li>Case Studies</li>
              <li>Reviews</li>
              <li>Updates</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>About</li>
              <li>Contact</li>
              <li>Careers</li>
              <li>Culture</li>
              <li>Blog</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>Help Center</li>
              <li>Documentation</li>
              <li>Community</li>
              <li>Status</li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 text-sm flex flex-col md:flex-row justify-between items-center">
          <p>© 2026 Digitalized Plantation. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span>Terms</span>
            <span>Privacy</span>
            <span>Cookies</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
