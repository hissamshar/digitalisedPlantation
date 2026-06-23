import { Cpu, Zap, Droplets, CloudRain, ShieldCheck, BarChart3, Check, Menu, X, Instagram, Linkedin, Facebook, Youtube, Sprout, Mail, Activity } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Shared contact destination used by sales / contact CTAs across the site.
const WHATSAPP_URL = 'https://wa.me/923192291320';
const openWhatsApp = () => window.open(WHATSAPP_URL, '_blank', 'noopener,noreferrer');

// Clickable footer entry — keeps every footer item a real, navigable action.
const FooterLink = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <li>
    <button onClick={onClick} className="text-left hover:text-white transition-colors">
      {label}
    </button>
  </li>
);

const LiveDashboard = ({ deviceId = 'Alpha-1' }: { deviceId?: string }) => {
  const [soilMoisture, setSoilMoisture] = useState(64.5);
  const [chamberTemp, setChamberTemp] = useState(24.2);
  const [humidity, setHumidity] = useState(58.0);
  const [co2Sequestered, setCo2Sequestered] = useState(142.8);
  const [relays, setRelays] = useState({ pump: true, fans: true, light: false });

  // AWS API Gateway URL
  const API_URL = 'https://5bl52j7egj.execute-api.us-east-1.amazonaws.com/default/GetEsp32Data'; 

  useEffect(() => {
    // --- REAL DATA FETCHING (AWS) ---
    const fetchRealData = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        
        // Ensure data is valid before updating state
        if (!data || data.error) return;

        setSoilMoisture(data.soil);
        setChamberTemp(data.temp);
        setHumidity(data.hum);
        setRelays({ pump: data.pump, fans: data.fans, light: data.light });
        
        // Co2 goes up slowly over time (stub)
        setCo2Sequestered(prev => Number((prev + Math.random() * 0.2).toFixed(1)));
      } catch (err) {
        console.error('Failed to fetch AWS telemetry', err);
      }
    };

    fetchRealData(); // Fetch instantly on load
    const interval = setInterval(fetchRealData, 5000); // Then poll every 5s

    return () => clearInterval(interval);
  }, [deviceId]);

  return (
    <div className="w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-white/20 bg-gray-50 transform hover:-translate-y-2 transition-transform duration-500 perspective-1000 group">
      
      {/* Browser Window Header */}
      <div className="flex items-center px-4 py-3 bg-gray-100 border-b border-gray-200/80 backdrop-blur-md">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-400 shadow-inner"></div>
          <div className="w-3 h-3 rounded-full bg-amber-400 shadow-inner"></div>
          <div className="w-3 h-3 rounded-full bg-green-400 shadow-inner"></div>
        </div>
        <div className="mx-auto flex-1 max-w-[200px] sm:max-w-xs flex justify-center ml-4 sm:ml-auto">
          <div className="bg-white text-gray-400 text-[10px] font-medium px-3 py-1 rounded-md border border-gray-200/80 shadow-sm w-full text-center truncate flex items-center justify-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            digitalizedplantation.garden
          </div>
        </div>
      </div>

      {/* The Dashboard Content (Inside the "Screen") */}
      <div className="w-full bg-white/90 p-5 md:p-7 relative overflow-hidden">
        {/* Subtle 3D Shine */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-20"></div>
        
        {/* Dashboard Header Layout */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-5 border-b border-gray-200/60 relative z-10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full shadow-sm border border-primary-100/50">
              Live IoT Telemetry
            </span>
            <h3 className="text-xl font-extrabold text-gray-900 tracking-tight mt-2 drop-shadow-sm uppercase">
              Smart Chamber {deviceId}
            </h3>
          </div>
          {/* System Active Badge */}
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white px-3 py-1.5 rounded-full font-semibold text-xs tracking-wide shadow-md shadow-emerald-500/20 border border-emerald-400/50">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
            <span className="relative z-10">AI Automation</span>
          </div>
        </div>

        {/* 3-Column Real-Time Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 relative z-10">
          
          {/* Metric 1: Soil Moisture */}
          <div className="bg-white p-4 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg shadow-sm border border-gray-100 flex flex-col justify-between h-32 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Soil Moisture</span>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z"/></svg>
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-gray-900 tracking-tight transition-all duration-300">{soilMoisture}%</div>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide mt-1 flex items-center gap-1">
                <span className="w-1 h-1 bg-emerald-500 rounded-full inline-block"></span> Optimal
              </p>
            </div>
          </div>

          {/* Metric 2: Climate & Heat Control */}
          <div className="bg-white p-4 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg shadow-sm border border-gray-100 flex flex-col justify-between h-32 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Chamber Temp</span>
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center shadow-md shadow-amber-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></svg>
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-gray-900 tracking-tight transition-all duration-300">{chamberTemp}°C</div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mt-1">Humidity: {humidity}%</p>
            </div>
          </div>

          {/* Metric 3: AI Carbon Sequestration Counter */}
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-4 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg shadow-sm border border-emerald-400 flex flex-col justify-between h-32 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            <div className="flex justify-between items-start relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-100 drop-shadow-sm">CO₂ Captured</span>
              <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/30 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white drop-shadow-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m12 8-4 4h8z"/></svg>
              </div>
            </div>
            <div className="relative z-10">
              <div className="text-3xl font-extrabold text-white tracking-tight drop-shadow-sm transition-all duration-300">{co2Sequestered} kg</div>
              <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-wide mt-1 drop-shadow-sm">Net Positive</p>
            </div>
          </div>

        </div>

        {/* Real-time Actuator Controls */}
        <div className="bg-gradient-to-b from-gray-50 to-gray-100/50 p-4 rounded-xl border border-gray-200/80 shadow-inner relative z-10">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full shadow-sm"></span>
            Active Hardware Relays
          </h4>
          <div className="flex flex-wrap gap-2.5">
            
            {/* Irrigation Pump Relay Block */}
            <div className={`flex items-center gap-2.5 bg-white px-3 py-2.5 rounded-lg border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex-1 min-w-[120px] transition-shadow ${!relays.pump && 'opacity-75'}`}>
              <div className={`w-2 h-2 rounded-full ${relays.pump ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse' : 'bg-gray-300'}`}></div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Water Pump</p>
                <p className="text-xs font-extrabold text-gray-800">{relays.pump ? 'RUNNING' : 'IDLE'}</p>
              </div>
            </div>

            {/* Ventilation Fan Relay Block */}
            <div className={`flex items-center gap-2.5 bg-white px-3 py-2.5 rounded-lg border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex-1 min-w-[120px] transition-shadow ${!relays.fans && 'opacity-75'}`}>
              <div className={`w-2 h-2 rounded-full ${relays.fans ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse' : 'bg-gray-300'}`}></div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Exhaust Fans</p>
                <p className="text-xs font-extrabold text-gray-800">{relays.fans ? 'ON (Auto)' : 'OFF'}</p>
              </div>
            </div>

            {/* Growth Light Relay Block */}
            <div className={`flex items-center gap-2.5 bg-white px-3 py-2.5 rounded-lg border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex-1 min-w-[120px] transition-shadow ${!relays.light && 'opacity-75'}`}>
              <div className={`w-2 h-2 rounded-full ${relays.light ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'bg-amber-500/40'}`}></div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Growth Light</p>
                <p className="text-xs font-extrabold text-gray-500">{relays.light ? 'DAY' : 'NIGHT'}</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

const LiveAnalyticsCard = () => {
  const [barHeights, setBarHeights] = useState([35, 55, 75, 100]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBarHeights(prev => [
        Math.max(30, Math.min(45, prev[0] + (Math.random() - 0.5) * 5)),
        Math.max(50, Math.min(65, prev[1] + (Math.random() - 0.5) * 5)),
        Math.max(70, Math.min(85, prev[2] + (Math.random() - 0.5) * 5)),
        Math.max(95, Math.min(100, prev[3] + (Math.random() - 0.5) * 2)),
      ]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-xl lg:max-w-2xl bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-gray-100 p-8 transform hover:-translate-y-2 transition-all duration-500 group relative z-10">
      {/* Decorative background glow */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-success-100 to-primary-100 opacity-0 group-hover:opacity-60 blur-xl transition-opacity duration-500 -z-10 rounded-3xl"></div>
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h4 className="text-gray-900 font-bold tracking-tight text-lg">Yield Projection</h4>
          <p className="text-sm text-gray-500 font-medium">Alpha-1 vs Traditional</p>
        </div>
        <div className="bg-success-50 text-success-600 px-3 py-1.5 rounded-md text-sm font-extrabold border border-success-200 shadow-sm flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
          +60%
        </div>
      </div>
      
      {/* Mock Chart Area */}
      <div className="relative h-56 w-full flex items-end justify-between gap-6 border-b-2 border-gray-100 pb-2 mb-8 px-2">
        {/* Grid lines */}
        <div className="absolute top-0 left-0 w-full border-t border-dashed border-gray-200"></div>
        <div className="absolute top-1/3 left-0 w-full border-t border-dashed border-gray-200"></div>
        <div className="absolute top-2/3 left-0 w-full border-t border-dashed border-gray-200"></div>
        
        {/* Bars */}
        <div className="flex-1 bg-gray-300 rounded-t-md transition-all duration-700 ease-in-out relative z-10" style={{ height: `${barHeights[0]}%` }}>
          <span className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-400">Q1</span>
        </div>
        <div className="flex-1 bg-success-300 rounded-t-md transition-all duration-700 ease-in-out relative z-10" style={{ height: `${barHeights[1]}%` }}>
          <span className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-400">Q2</span>
        </div>
        <div className="flex-1 bg-success-400 rounded-t-md transition-all duration-700 ease-in-out relative z-10" style={{ height: `${barHeights[2]}%` }}>
          <span className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-400">Q3</span>
        </div>
        <div className="flex-1 bg-primary-500 rounded-t-md shadow-[0_0_15px_rgba(34,197,94,0.4)] transition-all duration-700 ease-in-out relative z-10" style={{ height: `${barHeights[3]}%` }}>
          <span className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-900">Q4</span>
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 -translate-y-full bg-gray-900 text-white text-[10px] font-bold py-1.5 px-2.5 rounded-lg whitespace-nowrap shadow-lg">
            Peak Yield
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>
      
      {/* Legend / Metrics */}
      <div className="grid grid-cols-2 gap-6 pt-2">
        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z"/></svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Water Saved</p>
            <p className="text-xl font-extrabold text-gray-900">50%</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-warning-100 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-warning-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Growth Rate</p>
            <p className="text-xl font-extrabold text-gray-900">1.5x Faster</p>
          </div>
        </div>
      </div>
    </div>
  );
};
const GlobalNav = ({ currentPage, onNavigate }: { currentPage: string, onNavigate: (page: string) => void }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNav = (page: string) => {
    setIsMenuOpen(false);
    onNavigate(page);
  };

  return (
    <nav className="w-full bg-white border-b border-gray-100 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNav('home')}>
          <img src="/logo-icon.png" alt="Digitalized Plantation" className="h-8 sm:h-10 w-auto object-contain" />
          <span className="font-bold text-lg sm:text-xl tracking-tight text-primary-500">
            Digitalized Plantation
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <button onClick={() => handleNav('home')} className={`${currentPage === 'home' ? 'text-dark-800 font-bold' : 'hover:text-primary-500'} transition-colors`}>Home</button>
          <button onClick={() => handleNav('products')} className={`${currentPage === 'products' ? 'text-dark-800 font-bold' : 'hover:text-primary-500'} transition-colors`}>Products</button>
          <button onClick={() => handleNav('company')} className={`${currentPage === 'company' ? 'text-dark-800 font-bold' : 'hover:text-primary-500'} transition-colors`}>Company</button>
          <button onClick={() => handleNav('invest')} className={`${currentPage === 'invest' ? 'text-dark-800 font-bold' : 'hover:text-primary-500'} transition-colors`}>Invest</button>
        </div>
        
        <div className="hidden md:flex items-center gap-4 text-sm font-medium">
          <button onClick={() => handleNav('login')} className="hidden md:block hover:text-primary-500">Request Access</button>
          <button onClick={() => handleNav('invest')} className="bg-primary-500 text-white px-5 py-2 rounded font-medium hover:bg-primary-600 transition-colors">
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
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 p-6 flex flex-col gap-4 shadow-xl z-50">
          <button onClick={() => handleNav('home')} className={`text-left font-medium ${currentPage === 'home' ? 'text-primary-500' : 'text-dark-800 hover:text-primary-500'}`}>Home</button>
          <button onClick={() => handleNav('products')} className={`text-left font-medium ${currentPage === 'products' ? 'text-primary-500' : 'hover:text-primary-500'}`}>Products</button>
          <button onClick={() => handleNav('company')} className={`text-left font-medium ${currentPage === 'company' ? 'text-primary-500' : 'hover:text-primary-500'}`}>Company</button>
          <button onClick={() => handleNav('invest')} className={`text-left font-medium ${currentPage === 'invest' ? 'text-primary-500' : 'hover:text-primary-500'}`}>Invest</button>
          <hr className="border-gray-100 my-2" />
          <button onClick={() => handleNav('login')} className="text-left font-medium hover:text-primary-500">Request Access</button>
          <button onClick={() => handleNav('invest')} className="bg-primary-500 text-white px-5 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors w-full mt-2">
            Get started
          </button>
        </div>
      )}
    </nav>
  );
};

const InvestPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen bg-white text-dark-800 font-sans relative overflow-hidden flex flex-col">
      <GlobalNav currentPage="invest" onNavigate={onNavigate} />

      {/* Hero Section */}
      <section className="bg-primary-500 text-white py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-400 rounded-full blur-[120px] opacity-20 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Partner <span className="text-success-500">With Us</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-50 font-medium leading-relaxed max-w-2xl mx-auto">
            Invest in the future of AgriTech or digitalize your own garden with our custom hardware.
          </p>
        </div>
      </section>

      <section className="pricing-section bg-light-50 py-20 px-6 relative overflow-hidden flex-1 flex items-center">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100 rounded-full blur-[100px] opacity-50 translate-x-1/3 -translate-y-1/2 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            <div className="pricing-card bg-white p-10 md:p-12 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-100 transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mb-8 border border-primary-100">
                <BarChart3 size={32} />
              </div>
              <h3 className="text-3xl font-bold mb-4 text-gray-900">Open to Investment</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">We are actively seeking investors and incubation partners who believe in the future of smart agriculture. Our prototype is live, results are proven, and our roadmap is clear.</p>
              <ul className="space-y-4 mb-10 text-sm font-medium">
                <li className="flex items-start gap-4 text-gray-700"><Check size={20} className="text-success-500 shrink-0 mt-0.5" /> Proven 90% germination success</li>
                <li className="flex items-start gap-4 text-gray-700"><Check size={20} className="text-success-500 shrink-0 mt-0.5" /> Incubated at NIC, credible & structured</li>
                <li className="flex items-start gap-4 text-gray-700"><Check size={20} className="text-success-500 shrink-0 mt-0.5" /> Scalable IoT system ready for commercialization</li>
                <li className="flex items-start gap-4 text-gray-700"><Check size={20} className="text-success-500 shrink-0 mt-0.5" /> Clear roadmap to indoor farm & SaaS</li>
              </ul>
              <button onClick={openWhatsApp} className="w-full py-4 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20 text-lg">
                Discuss Investment
              </button>
            </div>
            
            <div className="pricing-card bg-primary-500 text-white p-10 md:p-12 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] transform hover:-translate-y-2 transition-all duration-300 relative overflow-hidden border border-primary-400">
              <div className="absolute top-0 right-0 w-64 h-64 bg-success-500/20 blur-[60px] rounded-full pointer-events-none"></div>
              <div className="w-16 h-16 bg-white/10 text-success-400 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md border border-white/10">
                <Sprout size={32} />
              </div>
              <h3 className="text-3xl font-bold mb-4">Digitalize Your Garden</h3>
              <p className="text-primary-100 mb-8 leading-relaxed">Want smart automation for your home garden, rooftop farm, or indoor space? We design and build custom IoT-powered growth chambers tailored to your needs.</p>
              <ul className="space-y-4 mb-10 text-sm font-medium">
                <li className="flex items-start gap-4 text-white"><Check size={20} className="text-success-400 shrink-0 mt-0.5" /> Custom indoor growth chambers built for you</li>
                <li className="flex items-start gap-4 text-white"><Check size={20} className="text-success-400 shrink-0 mt-0.5" /> Full sensor integration (temp, humidity, soil)</li>
                <li className="flex items-start gap-4 text-white"><Check size={20} className="text-success-400 shrink-0 mt-0.5" /> Automated irrigation and UV lighting</li>
                <li className="flex items-start gap-4 text-white"><Check size={20} className="text-success-400 shrink-0 mt-0.5" /> Remote monitoring from your phone</li>
              </ul>
              <button onClick={openWhatsApp} className="w-full py-4 bg-white text-primary-600 rounded-xl font-bold hover:bg-gray-100 transition-colors text-lg shadow-lg">
                Get Your Chamber
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer Contact */}
      <section className="cta-section bg-primary-500 py-12 px-6 text-center relative overflow-hidden border-t border-primary-600">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white opacity-5 blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white opacity-5 blur-[60px] rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto cta-content relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold mb-2 text-white">
              Get In Touch
            </h2>
            <p className="text-gray-300 font-medium">
              Start your journey towards climate-resilient farming.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <a href="mailto:safiu2543@gmail.com" className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-xl border border-white/20 backdrop-blur-md shadow-lg hover:bg-white/15 transition-colors">
              <Mail size={20} className="text-white" />
              <span className="text-white font-bold tracking-wide">Email Us</span>
            </a>
            
            <a href="https://wa.me/923192291320" target="_blank" rel="noopener noreferrer" className="bg-primary-500 text-white px-8 py-3 rounded-xl font-extrabold hover:bg-primary-600 transition-all hover:scale-105 shadow-xl">
              Chat with us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

const ProductsPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen bg-white text-dark-800 font-sans relative overflow-hidden flex flex-col">
      <GlobalNav currentPage="products" onNavigate={onNavigate} />

      {/* Hero Section */}
      <section className="bg-primary-500 text-white py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-400 rounded-full blur-[120px] opacity-20 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Powerful <span className="text-success-500">AgriTech Solutions</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-50 font-medium leading-relaxed max-w-2xl mx-auto">
            Everything you need to automate your harvest, from AI drone monitoring to complete climate-independent indoor growth systems.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="features-section bg-white pb-16 lg:pb-20 pt-16 px-6">
        <div className="max-w-7xl mx-auto">
          
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

      {/* Pricing */}
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
                <li className="flex items-center gap-2"><Check size={16} className="text-primary-400" /> Automated watering</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-primary-400" /> App monitoring</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-primary-400" /> Basic sensors</li>
                <li className="flex items-center gap-2 text-gray-400 line-through"><Check size={16} /> Climate control</li>
              </ul>
              <button onClick={openWhatsApp} className="w-full py-3 bg-primary-50 text-primary-600 rounded font-bold hover:bg-primary-100 transition-colors">
                Contact Sales
              </button>
            </div>
            
            {/* Tier 2 (Highlighted) */}
            <div className="pricing-card bg-primary-500 text-white p-8 md:p-12 md:scale-105 rounded-xl shadow-2xl relative z-10 border border-primary-400">
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
              <button onClick={openWhatsApp} className="w-full py-3 bg-white text-primary-500 rounded font-bold hover:bg-gray-50 transition-colors">
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
                <li className="flex items-center gap-2"><Check size={16} className="text-primary-400" /> Total climate independence</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-primary-400" /> AI predictive analysis</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-primary-400" /> Full IoT automation</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-primary-400" /> Maximum ROI margin</li>
              </ul>
              <button onClick={openWhatsApp} className="w-full py-3 bg-primary-50 text-primary-600 rounded font-bold hover:bg-primary-100 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Contact */}
      <section className="cta-section bg-primary-500 py-12 px-6 text-center relative overflow-hidden border-t border-primary-600">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white opacity-5 blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white opacity-5 blur-[60px] rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto cta-content relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold mb-2 text-white">
              Get In Touch
            </h2>
            <p className="text-primary-100 font-medium">
              Start your journey towards climate-resilient farming.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <a href="mailto:safiu2543@gmail.com" className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-xl border border-white/20 backdrop-blur-md shadow-lg hover:bg-white/15 transition-colors">
              <Mail size={20} className="text-white" />
              <span className="text-white font-bold tracking-wide">Email Us</span>
            </a>
            
            <a href="https://wa.me/923192291320" target="_blank" rel="noopener noreferrer" className="bg-white text-primary-600 px-8 py-3 rounded-xl font-extrabold hover:bg-gray-50 transition-all hover:scale-105 shadow-xl">
              Chat with us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

const CompanyPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen bg-white text-dark-800 font-sans relative overflow-hidden">
      <GlobalNav currentPage="company" onNavigate={onNavigate} />

      {/* Hero / Motivation */}
      <section className="bg-primary-500 text-white py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-400 rounded-full blur-[120px] opacity-20 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Cultivating the Future of <span className="text-success-500">Climate Resilience</span>
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Traditional farming is vulnerable. With 56% of seeds failing to germinate and unpredictable climates destroying yields, we realized something had to change. Our mission is to decouple agriculture from weather volatility and secure food sources through intelligent automation.
          </p>
        </div>
      </section>

      {/* Note from the Founder */}
      <section className="bg-light-50 py-20 px-6 border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-10 md:p-14 rounded-3xl shadow-xl border border-gray-100 relative">
            <div className="absolute top-0 left-10 -translate-y-1/2 text-success-500 text-8xl font-serif">"</div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 relative z-10">A Note from the Founder</h2>
            <div className="prose prose-lg text-gray-600 relative z-10">
              <p className="mb-4">
                When I started Digitalized Plantation as a Computer Science student at IMSciences, the goal was simple: solve a very real problem facing our local communities. I saw farmers struggling with unpredictable weather and staggering crop failure rates. We knew that technology could provide a buffer.
              </p>
              <p className="mb-4">
                We built our first IoT germination chamber and achieved a 90% success rate. That was the turning point. Since then, we've trained over 200 students on climate solutions and successfully incubated at the National Incubation Center (NIC) Peshawar. 
              </p>
              <p className="mb-6">
                We aren't just building software; we are building physical, tangible resilience for our food supply. Whether you're a home gardener or a commercial farmer, we invite you to join us in digitalizing the plantation.
              </p>
              <div className="flex items-center gap-4">
                <img src="/team-safi.webp" alt="Safi Ullah" className="w-12 h-12 rounded-full object-cover object-top shadow-sm border border-gray-100" />
                <div>
                  <div className="font-bold text-gray-900">Safi Ullah</div>
                  <div className="text-sm text-primary-600 font-medium">Founder & CEO</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section id="team" className="team-section bg-white py-16 lg:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">A multidisciplinary team of builders, researchers, and innovators working together to bring smart agriculture to life, incubated at NIC.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
            {/* Safi Ullah */}
            <div className="team-member case-study bg-white rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col items-center p-8">
              <div className="w-32 h-32 rounded-full overflow-hidden shrink-0 mb-6 shadow-md border-4 border-gray-50">
                <img src="/team-safi.webp" alt="Safi Ullah" className="w-full h-full object-cover object-top hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="text-primary-500 text-[10px] font-bold uppercase tracking-widest mb-3 bg-primary-50 inline-block px-3 py-1 rounded-full border border-primary-100 max-w-max">Founder & CEO</div>
              <h3 className="font-extrabold text-xl mb-3 text-gray-900">Safi Ullah</h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed flex-1">CS student at IMSciences. Designed and built the IoT germination chamber achieving 90% success. Trained 200+ students on climate solutions.</p>
              <div className="flex flex-wrap justify-center gap-2 mt-auto">
                <span className="text-[10px] font-bold bg-gray-50 px-2.5 py-1.5 rounded-lg text-gray-600 border border-gray-100">IoT Systems</span>
                <span className="text-[10px] font-bold bg-gray-50 px-2.5 py-1.5 rounded-lg text-gray-600 border border-gray-100">ESP32 & Arduino</span>
                <span className="text-[10px] font-bold bg-gray-50 px-2.5 py-1.5 rounded-lg text-gray-600 border border-gray-100">Python & Flask</span>
              </div>
            </div>

            {/* Ronit Chowhan */}
            <div className="team-member case-study bg-white rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col items-center p-8">
              <div className="w-32 h-32 rounded-full overflow-hidden shrink-0 mb-6 shadow-md border-4 border-gray-50">
                <img src="/team-ronit.webp" alt="Ronit Chowhan" className="w-full h-full object-cover object-top hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="text-success-500 text-[10px] font-bold uppercase tracking-widest mb-3 bg-success-50 inline-block px-3 py-1 rounded-full border border-success-100 max-w-max">Tech Lead</div>
              <h3 className="font-extrabold text-xl mb-3 text-gray-900">Ronit Chowhan</h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed flex-1">Leading product development and building the core IoT architecture. Responsible for turning the vision into working technology.</p>
              <div className="flex flex-wrap justify-center gap-2 mt-auto">
                <span className="text-[10px] font-bold bg-gray-50 px-2.5 py-1.5 rounded-lg text-gray-600 border border-gray-100">Hardware Dev</span>
                <span className="text-[10px] font-bold bg-gray-50 px-2.5 py-1.5 rounded-lg text-gray-600 border border-gray-100">IoT Protocols</span>
              </div>
            </div>

            {/* Ahmad Ullah */}
            <div className="team-member case-study bg-white rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col items-center p-8">
              <div className="w-32 h-32 rounded-full overflow-hidden shrink-0 mb-6 shadow-md border-4 border-gray-50">
                <img src="/team-ahmad.webp" alt="Ahmad Ullah" className="w-full h-full object-cover object-top hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="text-success-500 text-[10px] font-bold uppercase tracking-widest mb-3 bg-success-50 inline-block px-3 py-1 rounded-full border border-success-100 max-w-max">AI Engineer</div>
              <h3 className="font-extrabold text-xl mb-3 text-gray-900">Ahmad Ullah</h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed flex-1">Contributing intelligent automation and machine learning capabilities to the smart agriculture system.</p>
              <div className="flex flex-wrap justify-center gap-2 mt-auto">
                <span className="text-[10px] font-bold bg-gray-50 px-2.5 py-1.5 rounded-lg text-gray-600 border border-gray-100">Machine Learning</span>
                <span className="text-[10px] font-bold bg-gray-50 px-2.5 py-1.5 rounded-lg text-gray-600 border border-gray-100">Python Integration</span>
              </div>
            </div>

            {/* Bisma Sami */}
            <div className="team-member case-study bg-white rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col items-center p-8">
              <div className="w-32 h-32 rounded-full overflow-hidden shrink-0 mb-6 shadow-md border-4 border-gray-50">
                <img src="/team-bisma.webp" alt="Bisma Sami" className="w-full h-full object-cover object-top hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="text-primary-500 text-[10px] font-bold uppercase tracking-widest mb-3 bg-primary-50 inline-block px-3 py-1 rounded-full border border-primary-100 max-w-max">Research Lead</div>
              <h3 className="font-extrabold text-xl mb-3 text-gray-900">Bisma Sami</h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed flex-1">Leading market research and strategic planning. Future focus on software development for the platform.</p>
              <div className="flex flex-wrap justify-center gap-2 mt-auto">
                <span className="text-[10px] font-bold bg-gray-50 px-2.5 py-1.5 rounded-lg text-gray-600 border border-gray-100">Market Research</span>
                <span className="text-[10px] font-bold bg-gray-50 px-2.5 py-1.5 rounded-lg text-gray-600 border border-gray-100">Strategy</span>
              </div>
            </div>

            {/* Fahad Nasar */}
            <div className="team-member case-study bg-white rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col items-center p-8 lg:col-span-2 xl:col-span-1">
              <div className="w-32 h-32 rounded-full overflow-hidden shrink-0 mb-6 shadow-md border-4 border-gray-50">
                <img src="/team-fahad.webp" alt="Fahad Nasar" className="w-full h-full object-cover object-top hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="text-success-500 text-[10px] font-bold uppercase tracking-widest mb-3 bg-success-50 inline-block px-3 py-1 rounded-full border border-success-100 max-w-max">Marketing Lead</div>
              <h3 className="font-extrabold text-xl mb-3 text-gray-900">Fahad Nasar</h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed flex-1">Driving the marketing strategy and brand awareness. CS background brings a tech-forward approach to growth.</p>
              <div className="flex flex-wrap justify-center gap-2 mt-auto">
                <span className="text-[10px] font-bold bg-gray-50 px-2.5 py-1.5 rounded-lg text-gray-600 border border-gray-100">Digital Marketing</span>
                <span className="text-[10px] font-bold bg-gray-50 px-2.5 py-1.5 rounded-lg text-gray-600 border border-gray-100">Brand Strategy</span>
                <span className="text-[10px] font-bold bg-gray-50 px-2.5 py-1.5 rounded-lg text-gray-600 border border-gray-100">CS</span>
              </div>
            </div>
            
            {/* Join Us */}
            <div className="team-member case-study bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:shadow-xl transition-all duration-300 flex flex-col justify-center text-center">
              <div className="p-8 text-white">
                <div className="text-success-500 text-xs font-bold uppercase tracking-wider mb-3 inline-block">We Are Hiring</div>
                <h3 className="font-bold text-2xl mb-4">Join Our Team</h3>
                <p className="text-sm text-gray-400 mb-6 leading-relaxed">Looking for Arduino/ESP32 developers and Agriculture Researchers. Real hardware, real impact.</p>
                <button onClick={openWhatsApp} className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2.5 px-6 rounded-lg transition-colors w-full">
                  Apply via WhatsApp
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Footer Contact */}
      <section className="cta-section bg-primary-500 py-12 px-6 text-center relative overflow-hidden border-t border-primary-600">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white opacity-5 blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white opacity-5 blur-[60px] rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto cta-content relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold mb-2 text-white">
              Get In Touch
            </h2>
            <p className="text-gray-200 font-medium">
              Start your journey towards climate-resilient farming.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <a href="mailto:safiu2543@gmail.com" className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-xl border border-white/20 backdrop-blur-md shadow-lg hover:bg-white/15 transition-colors">
              <Mail size={20} className="text-white" />
              <span className="text-white font-bold tracking-wide">Email Us</span>
            </a>
            
            <a href="https://wa.me/923192291320" target="_blank" rel="noopener noreferrer" className="bg-white text-primary-600 px-8 py-3 rounded-xl font-extrabold hover:bg-gray-50 transition-all hover:scale-105 shadow-xl">
              Chat with us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

const LoginPage = ({ onNavigate, onLogin }: { onNavigate: (page: string) => void, onLogin: (deviceId: string) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // This simulates an API login via AWS Cognito.
    // In production, you would authenticate, get the JWT token, and extract the user's custom:deviceId.
    setTimeout(() => {
      setIsLoading(false);
      // Let's pretend the user logs in and their hardware ID is 'alpha-1'
      onLogin('alpha-1'); 
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <GlobalNav currentPage="login" onNavigate={onNavigate} />
      
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden bg-gray-50/50">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100 rounded-full blur-[100px] opacity-40 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100 relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary-100 shadow-sm">
              <Activity size={32} />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">Sign in to Dashboard</h2>
            <p className="text-sm text-gray-500 mt-2">Manage your smart plantation hardware.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none text-gray-800"
                placeholder="farmer@example.com"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none text-gray-800"
                placeholder="••••••••"
                required 
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3.5 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/30 flex justify-center items-center h-[52px]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
            Don't have hardware yet? <button onClick={() => onNavigate('invest')} className="text-primary-600 font-bold hover:underline">Get a Smart Chamber</button>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [loggedInDevice, setLoggedInDevice] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  // Hardware showcase section (scroll-revealed cards).
  const showcaseRef = useRef<HTMLDivElement>(null);

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

      // 5. Hardware Showcase — staggered reveal of the capability cards
      gsap.fromTo('.hw-card',
        { y: 50, opacity: 0 },
        { scrollTrigger: { trigger: '.hardware-section', start: 'top 80%' }, y: 0, opacity: 1, stagger: 0.12, duration: 0.8, ease: 'power3.out' }
      );
      gsap.fromTo('.hw-heading',
        { y: 30, opacity: 0 },
        { scrollTrigger: { trigger: '.hardware-section', start: 'top 85%' }, y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }
      );

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
  }, [currentPage]); // Re-run GSAP when returning to home

  if (currentPage === 'invest') {
    return <InvestPage onNavigate={setCurrentPage} />;
  }
  if (currentPage === 'products') {
    return <ProductsPage onNavigate={setCurrentPage} />;
  }
  if (currentPage === 'company') {
    return <CompanyPage onNavigate={setCurrentPage} />;
  }
  if (currentPage === 'login') {
    return <LoginPage 
      onNavigate={setCurrentPage} 
      onLogin={(device) => {
        setLoggedInDevice(device);
        setCurrentPage('dashboard');
      }} 
    />;
  }

  if (currentPage === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <GlobalNav currentPage="dashboard" onNavigate={setCurrentPage} />
        <div className="flex-1 max-w-4xl w-full mx-auto px-6 py-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Your Plantation</h1>
              <p className="text-gray-500 font-medium mt-1">Managing device: <span className="text-primary-600 font-bold uppercase">{loggedInDevice}</span></p>
            </div>
            <button 
              onClick={() => {
                setLoggedInDevice(null);
                setCurrentPage('home');
              }}
              className="text-sm font-bold bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 hover:text-red-500 transition-colors shadow-sm"
            >
              Sign Out
            </button>
          </div>
          <LiveDashboard deviceId={loggedInDevice || 'alpha-1'} />
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mainRef}
      className="min-h-screen bg-white text-dark-800 font-sans relative overflow-hidden" 
    >
      <GlobalNav currentPage={currentPage} onNavigate={setCurrentPage} />

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
              <button onClick={() => setCurrentPage('invest')} className="w-full sm:w-auto bg-white text-primary-500 px-6 py-3 rounded font-bold hover:bg-gray-50 transition-colors text-center">
                Invest With Us
              </button>
              <button onClick={() => setCurrentPage('products')} className="w-full sm:w-auto border border-white text-white px-6 py-3 rounded font-bold hover:bg-white/10 transition-colors text-center">
                Explore solutions
              </button>
            </div>
          </div>
          
          <div className="relative flex justify-center lg:justify-end hero-card">
            <LiveDashboard />
          </div>
        </div>
      </section>

      {/* 3. Stats Section */}
      <section className="stats-section bg-white py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="stat-item bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h3 className="text-5xl font-extrabold text-success-500 mb-2">90%</h3>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Germination Success</p>
          </div>
          <div className="stat-item bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h3 className="text-5xl font-extrabold text-primary-500 mb-2">200+</h3>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Students Trained</p>
          </div>
          <div className="stat-item bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h3 className="text-5xl font-extrabold text-warning-500 mb-2">NIC</h3>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Incubated Startup</p>
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
            <div className="partner-card bg-white p-8 rounded-2xl text-center border border-gray-100 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 items-center">
              <div className="h-28 mb-6 flex items-center justify-center">
                <img src="/nic-peshawar.png" alt="NIC Peshawar" className="h-full w-auto object-contain mix-blend-multiply" />
              </div>
              <p className="text-gray-600 text-sm leading-relaxed flex-1">
                Funded by Ignite, MOITT. Supporting our vision to revolutionize agriculture through world-class incubation and strategic mentorship.
              </p>
            </div>

            {/* British Council */}
            <div className="partner-card bg-white p-8 rounded-2xl text-center border border-gray-100 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden items-center">
              <div className="absolute top-6 right-6 px-3 py-1 bg-success-50 text-success-700 rounded-full text-xs font-semibold border border-success-100">
                Award Winner
              </div>
              <div className="h-28 mb-6 flex items-center justify-center">
                <img src="/british-council.png" alt="British Council" className="h-full w-auto object-contain mix-blend-multiply" />
              </div>
              <p className="text-gray-600 text-sm leading-relaxed flex-1">
                Winner of the national call for digital innovation, providing critical funding and support for our climate tech initiatives.
              </p>
            </div>
            
            {/* Alkhidmat */}
            <div className="partner-card bg-white p-8 rounded-2xl text-center border border-gray-100 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 items-center">
              <div className="h-28 mb-6 flex items-center justify-center">
                <img src="/alkhidmat.png" alt="Alkhidmat Foundation" className="h-full w-auto object-contain mix-blend-multiply" />
              </div>
              <p className="text-gray-600 text-sm leading-relaxed flex-1">
                Actively deployed and trusted by Alkhidmat Foundation to secure food sources and promote climate-resilient farming practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Spacer for seamless transition into dark section: eased 3-stop gradient
          holds light, then ramps to pure black so there's no muddy grey band */}
      <div
        className="w-full h-24 md:h-32"
        style={{ background: 'linear-gradient(to bottom, #F8FAFC 0%, #c9d2cd 38%, #2b3330 68%, #000000 100%)' }}
      ></div>

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

      {/* 5b. Hardware Showcase - Engineered components */}
      <section ref={showcaseRef} className="hardware-section relative bg-black text-white py-20 lg:py-28 px-6 overflow-hidden">
        {/* decorative ambient glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-success-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-warning-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Heading */}
          <div className="hw-heading max-w-3xl mb-14 lg:mb-20">
            <div className="inline-block px-3 py-1 bg-success-500/20 text-success-400 rounded-full text-xs font-semibold mb-6 uppercase tracking-wider backdrop-blur-sm">
              Hardware Integration
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Engineered for <span className="text-success-500">the Toughest Climates</span>
            </h2>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
              Our smart IoT hubs fuse raw electronic intelligence with botanical growth — built to withstand high temperatures, monsoons, and extreme weather.
            </p>
          </div>

          {/* Capability cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Cpu size={26} />, label: 'Compute', title: 'Neural Control Hub', desc: 'Custom microprocessor chips regulate irrigation grids with surgical precision.', accent: 'from-success-500 to-success-700', glow: 'hover:shadow-success-500/30' },
              { icon: <Droplets size={26} />, label: 'Sensing', title: 'Organic Smart Sensors', desc: 'Moisture, temperature and nitrogen probes embedded along the roots, reporting in real time.', accent: 'from-blue-500 to-blue-700', glow: 'hover:shadow-blue-500/30' },
              { icon: <Zap size={26} />, label: 'Actuation', title: 'Automated Solenoid Grid', desc: 'Pulsed water releases delivered on-demand — only when the soil signals dehydration.', accent: 'from-warning-500 to-warning-600', glow: 'hover:shadow-warning-500/30' },
              { icon: <ShieldCheck size={26} />, label: 'Durability', title: 'Climate-Hardened Build', desc: 'Weather-sealed enclosures engineered to survive monsoons and extreme heat.', accent: 'from-primary-500 to-primary-700', glow: 'hover:shadow-primary-500/30' },
            ].map((c, i) => (
              <div
                key={i}
                className={`hw-card group relative bg-white/[0.04] border border-white/10 rounded-2xl p-7 backdrop-blur-sm shadow-lg transition-all duration-300 hover:-translate-y-2 hover:bg-white/[0.07] hover:border-white/20 ${c.glow}`}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${c.accent} flex items-center justify-center text-white mb-6 shadow-lg`}>
                  {c.icon}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">{c.label}</div>
                <h3 className="text-xl font-bold mb-3">{c.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{c.desc}</p>
                <div className={`absolute bottom-0 left-7 right-7 h-px bg-gradient-to-r ${c.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spacer for seamless transition out of dark section */}
      <div className="w-full h-32 md:h-48 bg-gradient-to-b from-black to-dark-900"></div>

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
          <LiveAnalyticsCard />
        </div>
      </section>

      {/* 12. FAQ */}
      <section className="faq-section bg-white py-16 lg:py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">Frequently asked questions</h2>
          
          <div className="space-y-4">
            {[
              { q: 'How does the AI irrigation work?', a: 'Our AI analyzes soil moisture, weather forecasts, and plant types to deliver precisely the right amount of water exactly when needed, reducing water usage by up to 50%.' },
              { q: 'What is the Smart Grow Room?', a: 'The Smart Grow Room is a fully climate-controlled indoor setup that allows you to grow high-value crops year-round regardless of outside weather conditions, with automated lighting, temperature, and humidity.' },
              { q: 'Can I integrate with existing systems?', a: 'Yes! Our modular hardware is designed to retrofit onto most existing irrigation lines and greenhouse sensors, making upgrades cost-effective.' },
              { q: 'How do you handle maintenance?', a: 'We provide 24/7 remote monitoring and over-the-air updates. If hardware needs physical maintenance, our team is dispatched within 48 hours for enterprise clients.' },
              { q: 'What happens during power outages?', a: 'Our systems have built-in battery backups that keep critical sensors and the local control unit running for up to 24 hours, ensuring your farm stays protected.' }
            ].map((faq, i) => (
              <div 
                key={i} 
                className="faq-item border-b border-gray-200 pb-4 cursor-pointer group"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-800 group-hover:text-primary-500 transition-colors">{faq.q}</h4>
                  <div className={`text-xl transition-transform duration-300 ${openFaq === i ? 'text-primary-500 rotate-45' : 'text-gray-400 group-hover:text-primary-500'}`}>+</div>
                </div>
                {openFaq === i && (
                  <div className="mt-4 text-gray-600 text-sm leading-relaxed pr-8 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. Contact Us */}
      <section className="cta-section bg-primary-500 py-12 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white opacity-5 blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white opacity-5 blur-[60px] rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto cta-content relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold mb-2 text-white">
              Get In Touch
            </h2>
            <p className="text-primary-100 font-medium">
              Start your journey towards climate-resilient farming.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <a href="mailto:safiu2543@gmail.com" className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-xl border border-white/20 backdrop-blur-md shadow-lg hover:bg-white/15 transition-colors">
              <Mail size={20} className="text-white" />
              <span className="text-white font-bold tracking-wide">Email Us</span>
            </a>
            
            <a href="https://wa.me/923192291320" target="_blank" rel="noopener noreferrer" className="bg-white text-primary-600 px-8 py-3 rounded-xl font-extrabold hover:bg-gray-50 transition-all hover:scale-105 shadow-xl">
              Chat with us
            </a>
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
              <FooterLink label="Features" onClick={() => setCurrentPage('products')} />
              <FooterLink label="Pricing" onClick={() => setCurrentPage('products')} />
              <FooterLink label="Case Studies" onClick={() => setCurrentPage('products')} />
              <FooterLink label="Reviews" onClick={() => setCurrentPage('products')} />
              <FooterLink label="Updates" onClick={() => setCurrentPage('products')} />
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <FooterLink label="About" onClick={() => setCurrentPage('company')} />
              <FooterLink label="Contact" onClick={openWhatsApp} />
              <FooterLink label="Careers" onClick={() => setCurrentPage('company')} />
              <FooterLink label="Culture" onClick={() => setCurrentPage('company')} />
              <FooterLink label="Invest" onClick={() => setCurrentPage('invest')} />
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <FooterLink label="Help Center" onClick={openWhatsApp} />
              <FooterLink label="Contact Sales" onClick={openWhatsApp} />
              <FooterLink label="Community" onClick={openWhatsApp} />
              <FooterLink label="Email Us" onClick={() => window.open('mailto:safiu2543@gmail.com')} />
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 text-sm flex flex-col md:flex-row justify-between items-center">
          <p>© 2026 Digitalized Plantation. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <button onClick={() => setCurrentPage('company')} className="hover:text-white transition-colors">Terms</button>
            <button onClick={() => setCurrentPage('company')} className="hover:text-white transition-colors">Privacy</button>
            <button onClick={() => setCurrentPage('company')} className="hover:text-white transition-colors">Cookies</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
