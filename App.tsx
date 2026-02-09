
import React, { useState, useEffect } from 'react';
import { ProjectState, VideoReference, StoryboardScene } from './types';
import ReferenceManager from './components/ReferenceManager';
import StoryboardResult from './components/StoryboardResult';
import HeroSection from './components/ui/glassmorphism-trust-hero';
import { 
  SynthesisSlider, 
  WorkflowSection, 
  TechnicalBento, 
  ShowcaseGallery,
  ContactSection
} from './components/landing/AdditionalSections';
import { researchStyles, generateStoryboardJSON, generateSceneImage } from './services/geminiService';

const PRESET_STYLES = [
  { id: 'none', label: 'Follow References Only' },
  { id: 'neo-noir', label: 'Neo-Noir (Dark, High Contrast)' },
  { id: 'cyberpunk', label: 'Cyberpunk (Neon, Synthetic)' },
  { id: 'wes-anderson', label: 'Wes Anderson (Pastel, Symmetric)' },
  { id: 'ghibli', label: 'Studio Ghibli (Hand-painted)' },
  { id: 'kubrick', label: 'Kubrickian (Cold, One-point perspective)' },
  { id: 'custom', label: 'Custom Style Keywords...' },
];

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'studio'>('landing');
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [isCheckingKey, setIsCheckingKey] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [selectedStyleId, setSelectedStyleId] = useState('none');
  const [customStyleText, setCustomStyleText] = useState('');
  
  const [state, setState] = useState<ProjectState>({
    title: '',
    script: '',
    references: [],
    status: 'idle',
    storyboard: []
  });

  useEffect(() => {
    checkKeyStatus();
  }, []);

  const checkKeyStatus = async () => {
    if (window.aistudio) {
      const active = await window.aistudio.hasSelectedApiKey();
      setHasKey(active);
    }
    setIsCheckingKey(false);
  };

  const handleOpenKeyDialog = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasKey(true);
      setView('studio');
    }
  };

  const handleStartProduction = () => {
    if (hasKey) {
      setView('studio');
    } else {
      handleOpenKeyDialog();
    }
  };

  const handleAddReference = (ref: VideoReference) => {
    setState(prev => ({
      ...prev,
      references: [...prev.references, ref]
    }));
  };

  const handleRemoveReference = (id: string) => {
    setState(prev => ({
      ...prev,
      references: prev.references.filter(r => r.id !== id)
    }));
  };

  const getEffectiveStyle = () => {
    if (selectedStyleId === 'custom') return customStyleText;
    if (selectedStyleId === 'none') return '';
    const preset = PRESET_STYLES.find(s => s.id === selectedStyleId);
    return preset ? preset.label : '';
  };

  const generateStoryboard = async () => {
    if (!state.script.trim()) {
      alert("Please enter a script or film idea first.");
      return;
    }

    setState(prev => ({ ...prev, status: 'analyzing', error: undefined, storyboard: [], styleAnalysis: undefined, sources: [] }));
    
    try {
      setStatusMessage('Analyzing cinematography via Research tools...');
      const { text: styleProfile, sources } = await researchStyles(state.references);
      
      setStatusMessage('Directing storyboard sequence...');
      const userStyle = getEffectiveStyle();
      const { analysis, storyboard } = await generateStoryboardJSON(state.references, state.script, styleProfile, userStyle);
      
      setState(prev => ({ 
        ...prev, 
        status: 'generating_images', 
        styleAnalysis: analysis,
        sources: sources,
        storyboard: storyboard 
      }));

      const updatedStoryboard = [...storyboard];
      for (let i = 0; i < updatedStoryboard.length; i++) {
        setStatusMessage(`Synthesizing cinematic frame ${i + 1}/${updatedStoryboard.length}...`);
        try {
          const imageUrl = await generateSceneImage(updatedStoryboard[i].visualPrompt);
          updatedStoryboard[i].imageUrl = imageUrl;
          
          setState(prev => ({
            ...prev,
            storyboard: [...updatedStoryboard]
          }));
        } catch (imgError: any) {
          console.error("Frame synthesis error", i, imgError);
          if (imgError.message?.includes("Requested entity was not found")) {
            setHasKey(false);
            throw new Error("Production Session expired. Please re-select key.");
          }
        }
      }

      setState(prev => ({ ...prev, status: 'completed' }));
      setStatusMessage('');
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        setHasKey(false);
      }
      setState(prev => ({ 
        ...prev, 
        status: 'error', 
        error: err.message || "Production halted. Check your console for details." 
      }));
      setStatusMessage('');
    }
  };

  if (view === 'landing') {
    return (
      <div className="bg-zinc-950 flex flex-col relative w-full overflow-y-visible">
        <HeroSection onStart={handleStartProduction} />
        <SynthesisSlider />
        <WorkflowSection />
        <TechnicalBento />
        <ShowcaseGallery />
        <ContactSection />
        <footer className="py-20 border-t border-white/5 text-center bg-black">
          <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
             <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-6 border border-amber-500/30">
                <i className="fas fa-camera-retro text-amber-500"></i>
             </div>
             <p className="text-zinc-600 text-[10px] uppercase tracking-[0.3em] font-bold">© 2025 CineStyle AI Studio. Beyond Imagination.</p>
          </div>
        </footer>
      </div>
    );
  }

  // --- STUDIO VIEW ---
  if (isCheckingKey) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!hasKey) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-8 animate-fade-in">
          <div className="w-24 h-24 bg-amber-500/10 rounded-3xl flex items-center justify-center mx-auto border border-amber-500/20 shadow-2xl">
            <i className="fas fa-clapperboard text-amber-500 text-4xl"></i>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white font-serif tracking-tight">Studio Access</h1>
            <p className="text-slate-400 leading-relaxed text-sm">
              Connect a production key from a paid GCP project to unlock <span className="text-white">Gemini 3 Pro</span> research and synthesis.
            </p>
          </div>
          <button
            onClick={handleOpenKeyDialog}
            className="w-full btn-primary py-4 px-8 rounded-2xl font-bold text-white shadow-xl flex items-center justify-center space-x-3"
          >
            <i className="fas fa-link"></i>
            <span>Initialize Production</span>
          </button>
          <button onClick={() => setView('landing')} className="text-slate-500 hover:text-white text-xs uppercase tracking-widest font-bold">Return to Home</button>
          <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="hover:text-amber-500 transition-colors">Billing & Documentation</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-[#010409]">
      <nav className="border-b border-slate-800 bg-black/60 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setView('landing')}>
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              <i className="fas fa-camera-retro text-white text-xl"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white leading-none">CineStyle <span className="text-amber-500">AI</span></h1>
              <p className="text-[9px] uppercase tracking-[0.3em] text-amber-500/70 font-bold mt-1">Studio Mode</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center px-3 py-1 bg-green-500/5 border border-green-500/20 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse mr-2"></span>
              <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Active Studio</span>
            </div>
            <button 
              onClick={() => window.aistudio.openSelectKey()} 
              className="text-[10px] uppercase font-bold tracking-widest text-slate-500 hover:text-white transition-colors border border-slate-800 px-4 py-2 rounded-lg"
            >
              Key Mgr
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-4 space-y-8">
            <section className="glass-card rounded-2xl p-8 space-y-6 sticky top-32">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white font-serif">Project Brief</h2>
                <p className="text-xs text-slate-500">Analyze references to skin your script.</p>
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-500">Production Title</label>
                <input
                  type="text"
                  placeholder="The Silent Frame"
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all"
                  value={state.title}
                  onChange={(e) => setState(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Visual Aesthetic</h3>
                <div className="space-y-3">
                  <select 
                    value={selectedStyleId}
                    onChange={(e) => setSelectedStyleId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50 text-sm"
                  >
                    {PRESET_STYLES.map(style => (
                      <option key={style.id} value={style.id}>{style.label}</option>
                    ))}
                  </select>
                  
                  {selectedStyleId === 'custom' && (
                    <input
                      type="text"
                      placeholder="e.g. Gritty 70s grain, Technicolor, 16mm handheld..."
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50 text-sm transition-all"
                      value={customStyleText}
                      onChange={(e) => setCustomStyleText(e.target.value)}
                    />
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Cinematic References</h3>
                <ReferenceManager 
                  references={state.references} 
                  onAdd={handleAddReference} 
                  onRemove={handleRemoveReference} 
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500">The Script</label>
                <textarea
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50 h-40 resize-none font-light leading-relaxed text-sm"
                  placeholder="A lonely detective walks through a neon-lit alleyway in a rainstorm..."
                  value={state.script}
                  onChange={(e) => setState(prev => ({ ...prev, script: e.target.value }))}
                ></textarea>
              </div>

              <button
                disabled={state.status !== 'idle' && state.status !== 'completed' && state.status !== 'error'}
                onClick={generateStoryboard}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center space-x-3 shadow-xl ${
                  state.status === 'idle' || state.status === 'completed' || state.status === 'error'
                    ? 'btn-primary active:scale-[0.98]'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                }`}
              >
                {state.status === 'idle' || state.status === 'completed' || state.status === 'error' ? (
                  <>
                    <i className="fas fa-wand-sparkles"></i>
                    <span className="uppercase tracking-[0.1em] text-sm">Analyze & Synthesize</span>
                  </>
                ) : (
                  <>
                    <div className="w-5 h-5 border-2 border-slate-600 border-t-amber-500 rounded-full animate-spin"></div>
                    <span className="uppercase tracking-[0.1em] text-sm">Processing...</span>
                  </>
                )}
              </button>

              {state.error && (
                <div className="bg-red-500/5 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs flex items-start space-x-3">
                  <i className="fas fa-circle-exclamation mt-0.5"></i>
                  <span>{state.error}</span>
                </div>
              )}
            </section>
          </div>

          <div className="lg:col-span-8">
            {state.status === 'idle' ? (
              <div className="h-[700px] flex flex-col items-center justify-center space-y-8 text-center glass-card rounded-3xl border-dashed border-slate-800">
                <div className="relative">
                  <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800 shadow-inner">
                    <i className="fas fa-layer-group text-2xl text-slate-700"></i>
                  </div>
                  <div className="absolute -inset-4 bg-amber-500/5 blur-3xl rounded-full -z-10"></div>
                </div>
                <div className="max-w-xs space-y-3">
                  <h2 className="text-xl font-bold text-white font-serif">Visual Workspace</h2>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Enter production details to begin. Your high-fidelity storyboard will be synthesized here scene-by-scene.
                  </p>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
                  <div className="space-y-1">
                    <h2 className="text-3xl font-bold text-white font-serif">{state.title || 'Untitled Sequence'}</h2>
                    <p className="text-xs text-slate-500 flex items-center uppercase tracking-widest font-bold">
                      <span className="text-amber-500 mr-2">●</span>
                      Production In Progress
                    </p>
                  </div>
                </div>

                <StoryboardResult 
                  scenes={state.storyboard} 
                  styleAnalysis={state.styleAnalysis} 
                  sources={state.sources}
                  isGenerating={state.status !== 'completed' && state.status !== 'error'}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {statusMessage && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 glass-card rounded-full px-8 py-3 border-amber-500/30 shadow-2xl animate-pulse flex items-center space-x-4">
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping"></div>
          <span className="text-xs font-bold text-white uppercase tracking-[0.2em]">{statusMessage}</span>
        </div>
      )}
    </div>
  );
};

export default App;
