import { Leaf, Cpu, Activity, Zap, Droplets, Target, CloudRain, ShieldCheck, BarChart3, ChevronRight, Check, Menu, X } from 'lucide-react';
import { useState } from 'react';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-white text-dark-800 font-sans">
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
          <div className="text-white">
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
          
          <div className="relative flex justify-center lg:justify-end">
            {/* Flat Illustration matching the reference */}
            <div className="w-full max-w-[450px] h-[300px] md:h-[350px] bg-white rounded-xl shadow-2xl relative p-6 flex flex-col gap-4">
              <div className="flex gap-2 border-b border-gray-100 pb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full"></div>
                <div className="flex-1">
                  <div className="w-3/4 h-3 bg-gray-200 rounded-full mb-2"></div>
                  <div className="w-1/2 h-3 bg-gray-100 rounded-full"></div>
                </div>
              </div>
              <div className="flex-1 flex gap-4">
                <div className="flex-1 bg-gray-100 rounded-lg"></div>
                <div className="w-[200px] bg-dark-900 rounded-lg relative overflow-hidden">
                  <div className="absolute top-4 right-4 w-6 h-6 bg-success-500 rounded-sm"></div>
                </div>
              </div>
              
              {/* Overlapping circles */}
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-warning-500 rounded-full"></div>
              <div className="absolute -bottom-8 left-12 w-16 h-16 bg-success-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Stats Section */}
      <section className="bg-white py-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
          <div>
            <h3 className="text-4xl font-bold text-success-500 mb-2">+60%</h3>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Yield Increase</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-primary-500 mb-2">15%</h3>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Faster Growth</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-warning-500 mb-2">24/7</h3>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Monitoring</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-success-500 mb-2">100%</h3>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Organic Output</p>
          </div>
        </div>
      </section>

      {/* 4. Sponsors/Partners Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Our Partners</h2>
          <p className="text-gray-500 mb-10">Proudly supported by leading institutions and organizations.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {/* NIC Peshawar */}
            <div className="bg-light-50 p-8 rounded-2xl text-left border border-gray-100 flex flex-col hover:shadow-lg transition-shadow">
              <div className="h-14 mb-6 flex items-center justify-start">
                <img src="/nic-peshawar.png" alt="NIC Peshawar" className="h-full w-auto object-contain mix-blend-multiply" />
              </div>
              <h3 className="text-xl font-bold mb-3">NIC Peshawar</h3>
              <p className="text-gray-600 text-sm flex-1">
                Funded by Ignite, MOITT. Supporting our vision to revolutionize agriculture through world-class incubation and strategic mentorship.
              </p>
            </div>

            {/* British Council */}
            <div className="bg-dark-900 text-white p-8 rounded-2xl text-left relative overflow-hidden hover:shadow-lg transition-shadow">
              <div className="absolute top-6 right-6 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold">Award Winner</div>
              <div className="h-14 mb-6 flex items-center justify-start">
                <img src="/british-council.png" alt="British Council" className="h-full w-auto object-contain brightness-0 invert" />
              </div>
              <h3 className="text-xl font-bold mb-3">British Council</h3>
              <p className="text-gray-400 text-sm flex-1">
                Winner of the national call for digital innovation, providing critical funding and support for our climate tech initiatives.
              </p>
            </div>
            
            {/* Alkhidmat */}
            <div className="bg-light-50 p-8 rounded-2xl text-left border border-gray-100 flex flex-col hover:shadow-lg transition-shadow">
              <div className="h-14 mb-6 flex items-center justify-start">
                <img src="/alkhidmat.png" alt="Alkhidmat Foundation" className="h-full w-auto object-contain mix-blend-multiply" />
              </div>
              <h3 className="text-xl font-bold mb-3">Alkhidmat Foundation</h3>
              <p className="text-gray-600 text-sm flex-1">
                Actively deployed and trusted by Alkhidmat Foundation to secure food sources and promote climate-resilient farming practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Centered Text */}
      <section className="bg-light-50 py-16 lg:py-20 text-center px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Experience the future of climate-independent farming today.
          </h2>
          <p className="text-gray-500 text-lg">
            Traditional farming is failing. 56% of seeds fail to germinate and unpredictable climates destroy yields. Our AI ecosystem delivers exactly what your crops need, exactly when they need it.
          </p>
        </div>
      </section>

      {/* 6. Features Grid */}
      <section id="features" className="bg-light-50 pb-16 lg:pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-gray-500">Everything you need to automate your harvest.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-8 rounded-xl border border-blue-100">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4"><Cpu size={20} /></div>
              <h3 className="font-bold mb-2">AI Drone Monitoring</h3>
              <p className="text-sm text-gray-600">24/7 visual analysis for plant health, pest detection, and growth tracking using computer vision.</p>
            </div>
            
            <div className="bg-green-50 p-8 rounded-xl border border-green-100">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4"><Droplets size={20} /></div>
              <h3 className="font-bold mb-2">Smart IoT Irrigation</h3>
              <p className="text-sm text-gray-600">Automated, precision watering based on real-time soil moisture and environmental data.</p>
            </div>
            
            <div className="bg-yellow-50 p-8 rounded-xl border border-yellow-100">
              <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center mb-4"><BarChart3 size={20} /></div>
              <h3 className="font-bold mb-2">Carbon Tracking</h3>
              <p className="text-sm text-gray-600">Real-time Carbon Sequestration Tracking Dashboard to monitor your environmental impact.</p>
            </div>
            
            <div className="bg-purple-50 p-8 rounded-xl border border-purple-100">
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4"><CloudRain size={20} /></div>
              <h3 className="font-bold mb-2">Climate Control</h3>
              <p className="text-sm text-gray-600">Total climate independence for indoor grow rooms. Control temperature and humidity automatically.</p>
            </div>
            
            <div className="bg-red-50 p-8 rounded-xl border border-red-100">
              <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center mb-4"><ShieldCheck size={20} /></div>
              <h3 className="font-bold mb-2">Bilingual Chatbot</h3>
              <p className="text-sm text-gray-600">Built-in AI assistant offering guidance to farmers in both English and Urdu.</p>
            </div>
            
            <div className="bg-teal-50 p-8 rounded-xl border border-teal-100">
              <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center mb-4"><Zap size={20} /></div>
              <h3 className="font-bold mb-2">Yield Prediction</h3>
              <p className="text-sm text-gray-600">Predict harvest outcomes and optimize resource usage to guarantee maximum ROI margin.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Case Studies (Blog) */}
      <section className="bg-white py-16 lg:py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">Latest success stories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="group cursor-pointer">
                <div className="w-full h-48 bg-gray-200 mb-6 rounded-lg overflow-hidden">
                  <img src={`https://images.unsplash.com/photo-1530836369250-ef71a3f5e4cb?w=600&h=400&fit=crop&q=80`} alt="Farm" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="text-primary-500 text-xs font-bold uppercase tracking-wider mb-2">Case Study</div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary-500 transition-colors">Scaling urban farming by 300%</h3>
                <p className="text-sm text-gray-500 mb-4">Discover how an inner-city initiative utilized the Smart Grow Room to feed a local community independently of seasons.</p>
                <div className="text-sm font-semibold flex items-center gap-1 text-primary-500">
                  Read more <ChevronRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. How It Works */}
      <section id="about" className="bg-dark-900 text-white py-16 lg:py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">How Digitalized Plantation works</h2>
            <p className="text-gray-400">Transforming agriculture in three simple steps.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center font-bold text-xl mb-6">1</div>
              <h3 className="text-xl font-bold mb-3">Deploy Sensors</h3>
              <p className="text-gray-400 text-sm">Install our plug-and-play IoT modules across your kitchen garden or large-scale farm.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center font-bold text-xl mb-6">2</div>
              <h3 className="text-xl font-bold mb-3">AI Analysis</h3>
              <p className="text-gray-400 text-sm">Data streams to our cloud where AI predicts exactly when and how much to water.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center font-bold text-xl mb-6">3</div>
              <h3 className="text-xl font-bold mb-3">Automated Action</h3>
              <p className="text-gray-400 text-sm">Systems execute the optimal environmental controls without manual intervention.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Why Choose Us */}
      <section className="flex flex-col md:flex-row min-h-[400px]">
        <div className="w-full md:w-1/2 bg-success-500 text-white p-10 lg:p-16 flex flex-col justify-center">
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

      {/* 10. Testimonials */}
      <section className="bg-light-50 py-16 lg:py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Trusted by innovative farmers</h2>
            <p className="text-gray-500">Join thousands of tech-enabled agriculturalists across Pakistan.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-600 text-sm mb-6">
                  "The Smart Garden setup completely changed how I manage my urban crops. The AI chatbot is incredibly helpful in Urdu."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div>
                    <h4 className="font-bold text-sm">Zahra Batool</h4>
                    <p className="text-xs text-gray-500">Urban Farmer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. Pricing */}
      <section id="pricing" className="bg-light-50 py-16 lg:py-20 px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-success-500 font-semibold">Scale your farm from kitchen to commercial.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 items-center max-w-7xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100">
            {/* Tier 1 */}
            <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-gray-100">
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
            <div className="bg-primary-500 text-white p-8 md:p-12 md:scale-105 rounded-xl shadow-2xl relative z-10">
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
            <div className="p-8 md:p-10 border-t md:border-t-0 md:border-l border-gray-100">
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
      <section className="bg-white py-16 lg:py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">Frequently asked questions</h2>
          
          <div className="space-y-4">
            {['How does the AI irrigation work?', 'What is the Smart Grow Room?', 'Can I integrate with existing systems?', 'How do you handle maintenance?', 'What happens during power outages?'].map((q, i) => (
              <div key={i} className="border-b border-gray-200 pb-4 flex items-center justify-between cursor-pointer group">
                <h4 className="font-semibold text-gray-800 group-hover:text-primary-500 transition-colors">{q}</h4>
                <div className="text-gray-400 group-hover:text-primary-500 transition-colors">+</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. Bottom CTA */}
      <section className="bg-primary-500 py-8 lg:py-10 px-6 text-center">
        <div className="max-w-2xl mx-auto">
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
              <div className="w-8 h-8 rounded-full bg-white/10"></div>
              <div className="w-8 h-8 rounded-full bg-white/10"></div>
              <div className="w-8 h-8 rounded-full bg-white/10"></div>
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
