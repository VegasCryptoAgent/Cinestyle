
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  BrainCircuit, 
  Zap, 
  Aperture, 
  Palette, 
  Layers, 
  Clapperboard,
  MousePointer2,
  ExternalLink,
  Mail,
  MapPin,
  Instagram,
  Twitter,
  Linkedin,
  Send
} from 'lucide-react';

/** 1. Synthesis Slider Section **/
export const SynthesisSlider = () => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const relativeX = Math.max(0, Math.min(x - rect.left, rect.width));
    setSliderPos((relativeX / rect.width) * 100);
  };

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold font-serif text-white">The Synthesis Engine</h2>
        <p className="text-zinc-500 max-w-2xl mx-auto">See how CineStyle transforms low-resolution reference frames into production-ready cinematic storyboards.</p>
      </div>

      <div 
        ref={containerRef}
        onMouseMove={handleMove}
        onTouchMove={handleMove}
        className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl cursor-ew-resize group"
      >
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=100&w=2000" 
            className="w-full h-full object-cover"
            alt="After Synthesis"
          />
        </div>
        <div 
          className="absolute inset-0 border-r-2 border-amber-500 z-10 overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <img 
            src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=10&w=2000&blur=10" 
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-60 scale-105"
            style={{ width: `${10000 / sliderPos}%`, maxWidth: 'none' }}
            alt="Before Synthesis"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white/20 text-9xl font-bold font-serif select-none uppercase tracking-widest">Raw</span>
          </div>
        </div>
        <div className="absolute bottom-8 left-8 z-20 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-[10px] uppercase tracking-widest font-bold text-white">
          Reference Frame
        </div>
        <div className="absolute bottom-8 right-8 z-20 bg-amber-500 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold text-black shadow-lg">
          Synthesized Concept
        </div>
        <div 
          className="absolute top-0 bottom-0 z-30 flex items-center justify-center"
          style={{ left: `calc(${sliderPos}% - 1px)` }}
        >
          <div className="w-10 h-10 rounded-full bg-white text-zinc-950 flex items-center justify-center shadow-2xl -translate-x-1/2 group-hover:scale-110 transition-transform">
            <MousePointer2 className="w-4 h-4" />
          </div>
        </div>
      </div>
    </section>
  );
};

/** 2. The Director's Brain Section **/
export const WorkflowSection = () => {
  const steps = [
    {
      title: "Deep Grounding",
      desc: "Gemini 3 Pro researches your reference links, extracting lens specs, lighting Kelvin, and LUT profiles from global film databases.",
      icon: Search,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/20"
    },
    {
      title: "Narrative Analysis",
      desc: "Our model parses your script, identifying key narrative beats, emotional shifts, and character positioning.",
      icon: BrainCircuit,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      border: "border-purple-400/20"
    },
    {
      title: "Directorial Logic",
      desc: "The AI 'thinks' through camera placement, deciding on shot sizes (CU, MCU, WS) and movement based on cinematic tradition.",
      icon: Zap,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20"
    },
    {
      title: "1K Synthesis",
      desc: "Frames are rendered at high resolution with perfect aspect ratios, ready for your production pitch.",
      icon: Clapperboard,
      color: "text-green-400",
      bg: "bg-green-400/10",
      border: "border-green-400/20"
    }
  ];

  return (
    <section className="py-32 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-20 gap-8">
          <div className="max-w-xl space-y-4">
            <h2 className="text-5xl font-bold font-serif text-white tracking-tight">The Director's Brain</h2>
            <p className="text-zinc-500 text-lg leading-relaxed font-light">How our architecture bridges the gap between raw input and cinematic excellence.</p>
          </div>
          <div className="flex items-center space-x-2 text-zinc-600 text-[10px] uppercase tracking-widest font-bold">
            <span>Powered by</span>
            <span className="text-zinc-300">Thinking Config</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="relative p-10 rounded-[2rem] border border-white/[0.03] bg-zinc-900/40 hover:bg-zinc-900/60 transition-all duration-500 group"
            >
              <div className="flex justify-between items-start mb-10">
                <div className={`w-14 h-14 rounded-2xl ${step.bg} border ${step.border} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                  <step.icon className={`w-6 h-6 ${step.color}`} />
                </div>
                <div className="text-5xl font-serif text-white/[0.06] font-bold italic select-none group-hover:text-white/[0.1] transition-colors">
                  0{idx + 1}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-amber-500 transition-colors">{step.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed font-light">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/** 3. Cinematic DNA Section **/
export const TechnicalBento = () => {
  return (
    <section className="py-32 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 glass-card p-12 rounded-[2.5rem] border-amber-500/10 flex flex-col justify-between group overflow-hidden relative">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-amber-500/20 transition-colors"></div>
          <div className="relative z-10">
            <Aperture className="w-12 h-12 text-amber-500 mb-8" />
            <h3 className="text-4xl font-bold text-white font-serif mb-6 leading-tight">Optical Fidelity <br /><span className="text-zinc-500 font-light">Lens Emulation</span></h3>
            <p className="text-zinc-400 max-w-md text-lg font-light leading-relaxed">
              Our synthesis engine doesn't just draw images—it emulates real glass. Specify 35mm anamorphics, vintage primes, or high-definition telephoto lenses.
            </p>
          </div>
          <div className="mt-12 flex space-x-4">
             {["Anamorphic", "Super 35", "T-Stop Control"].map(tag => (
               <span key={tag} className="px-4 py-2 rounded-full border border-white/10 text-[10px] uppercase font-bold tracking-widest text-zinc-500">
                 {tag}
               </span>
             ))}
          </div>
        </div>

        <div className="lg:col-span-4 grid grid-rows-2 gap-6">
          <div className="glass-card p-8 rounded-[2rem] border-white/5 flex flex-col justify-between hover:border-white/10 transition-colors">
            <Palette className="w-8 h-8 text-purple-400" />
            <div>
              <h4 className="text-xl font-bold text-white mb-2">Color Science</h4>
              <p className="text-sm text-zinc-500 font-light leading-relaxed">Match reference LUTs and color grading profiles with pixel-perfect accuracy.</p>
            </div>
          </div>
          <div className="glass-card p-8 rounded-[2rem] border-white/5 flex flex-col justify-between hover:border-white/10 transition-colors">
            <Layers className="w-8 h-8 text-blue-400" />
            <div>
              <h4 className="text-xl font-bold text-white mb-2">Multi-Pass Synthesis</h4>
              <p className="text-sm text-zinc-500 font-light leading-relaxed">Iterative frame refinement ensures every scene remains stylistically consistent.</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-12 glass-card p-12 rounded-[2.5rem] flex flex-col lg:flex-row items-center justify-between border-white/5 group hover:border-amber-500/20 transition-all duration-700">
          <div className="max-w-xl text-center lg:text-left mb-8 lg:mb-0">
            <h3 className="text-3xl font-bold text-white font-serif mb-4">The Cinematic Database</h3>
            <p className="text-zinc-500 font-light">Linked directly to production metadata archives, we ensure your storyboards aren't just pretty—they're technically sound for the DP.</p>
          </div>
          <div className="flex -space-x-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="w-16 h-16 rounded-full border-4 border-zinc-950 bg-zinc-800 overflow-hidden shadow-2xl transition-transform hover:-translate-y-2">
                <img src={`https://images.unsplash.com/photo-${1500000000000 + i * 1000}?auto=format&fit=crop&q=80&w=200`} className="w-full h-full object-cover" alt="Cinema Pro" />
              </div>
            ))}
            <div className="w-16 h-16 rounded-full border-4 border-zinc-950 bg-amber-500 flex items-center justify-center text-black font-bold text-xs shadow-2xl">
              10k+
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/** 4. Showcase Gallery Section **/
export const ShowcaseGallery = () => {
  const samples = [
    { url: "https://images.unsplash.com/photo-1478720568477-152d9b164e26", title: "Neo-Noir Night", style: "Kubrickian" },
    { url: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4", title: "Desert Chase", style: "Anamorphic" },
    { url: "https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c", title: "Neon Alleyway", style: "Cyberpunk" },
    { url: "https://images.unsplash.com/photo-1542204172-3769dfca0a6b", title: "Gothic Interior", style: "Chiaroscuro" },
    { url: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1", title: "Cyber-Organic Hub", style: "Technicolor" },
    { url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23", title: "Deep Forest Ritual", style: "Hand-painted" },
  ];

  return (
    <section className="py-32 overflow-hidden bg-[#010409]">
      <div className="max-w-7xl mx-auto px-6 mb-16 flex items-end justify-between">
        <div className="space-y-4">
          <h2 className="text-4xl font-bold font-serif text-white">The Cutting Room</h2>
          <p className="text-zinc-500">Recent productions synthesized by the CineStyle community.</p>
        </div>
        <button className="flex items-center space-x-2 text-amber-500 font-bold uppercase tracking-widest text-[10px] hover:text-amber-400 transition-colors">
          <span>Explore All</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      <div className="relative">
        <div className="flex animate-marquee hover:pause whitespace-nowrap gap-6 py-4 px-6">
          {[...samples, ...samples].map((sample, i) => (
            <div 
              key={i} 
              className="relative w-[450px] aspect-video flex-shrink-0 rounded-[2rem] overflow-hidden border border-white/5 bg-zinc-900 shadow-2xl group"
            >
              <img src={sample.url + "?auto=format&fit=crop&q=80&w=600"} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" alt={sample.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-8 flex flex-col justify-end">
                <span className="text-amber-500 text-[10px] uppercase tracking-widest font-bold mb-2">{sample.style}</span>
                <h4 className="text-2xl font-bold text-white font-serif">{sample.title}</h4>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#010409] to-transparent z-10"></div>
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#010409] to-transparent z-10"></div>
      </div>
    </section>
  );
};

/** 5. Contact Section **/
export const ContactSection = () => {
  return (
    <section id="contact" className="py-32 bg-zinc-950 relative overflow-hidden border-t border-white/5">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none opacity-40"></div>
      <div className="absolute bottom-0 right-1/4 translate-y-1/2 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none opacity-30"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <div className="space-y-6">
              <h2 className="text-5xl md:text-6xl font-bold font-serif text-white tracking-tight leading-tight">
                Direct Your <br />
                <span className="text-amber-500 italic">Vision.</span>
              </h2>
              <p className="text-zinc-500 text-lg font-light leading-relaxed max-w-md">
                Ready to turn your script into a cinematic masterpiece? Our cinematography experts are standing by to help you visualize your next production.
              </p>
            </div>

            <div className="space-y-8 pt-4">
              <div className="flex items-center space-x-5 group cursor-pointer">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center border border-white/5 group-hover:border-amber-500/30 transition-all duration-500 group-hover:scale-110">
                  <Mail className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold mb-1">Email our studio</p>
                  <p className="text-white text-lg font-medium group-hover:text-amber-400 transition-colors">production@cinestyle.ai</p>
                </div>
              </div>

              <div className="flex items-center space-x-5 group cursor-pointer">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center border border-white/5 group-hover:border-amber-500/30 transition-all duration-500 group-hover:scale-110">
                  <MapPin className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold mb-1">Visit us</p>
                  <p className="text-white text-lg font-medium group-hover:text-amber-400 transition-colors">Santa Monica, California</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-8 pt-10">
              {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="text-zinc-500 hover:text-amber-500 transition-all duration-300 hover:scale-125">
                  <Icon className="w-7 h-7" />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-card p-10 md:p-14 rounded-[3rem] border-white/5 shadow-2xl relative group overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[60px] -mr-16 -mt-16 group-hover:bg-amber-500/20 transition-colors duration-700"></div>
            
             <form className="space-y-8 relative z-10" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Name</label>
                    <input 
                      type="text" 
                      placeholder="Christopher Nolan" 
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all font-light"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Email</label>
                    <input 
                      type="email" 
                      placeholder="director@studio.com" 
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all font-light"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Production Brief</label>
                  <textarea 
                    rows={4}
                    placeholder="Describe your next cinematic project..." 
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all resize-none font-light leading-relaxed"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="w-full btn-primary py-5 rounded-2xl font-bold text-black uppercase tracking-widest text-xs flex items-center justify-center space-x-4 group shadow-2xl"
                >
                  <span>Inquire Production</span>
                  <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
             </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
