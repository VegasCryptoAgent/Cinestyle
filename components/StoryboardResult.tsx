
import React, { useState } from 'react';
import { StoryboardScene, GroundingSource } from '../types';

interface Props {
  scenes: StoryboardScene[];
  styleAnalysis?: string;
  sources?: GroundingSource[];
  isGenerating: boolean;
}

const StoryboardResult: React.FC<Props> = ({ scenes, styleAnalysis, sources, isGenerating }) => {
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  if (scenes.length === 0 && !isGenerating) return null;

  return (
    <div className="space-y-16 animate-fade-in relative">
      {/* Lightbox Modal */}
      {selectedImageUrl && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12 animate-fade-in cursor-zoom-out"
          onClick={() => setSelectedImageUrl(null)}
        >
          <button 
            className="absolute top-8 right-8 text-white text-3xl hover:text-amber-500 transition-colors"
            onClick={() => setSelectedImageUrl(null)}
          >
            <i className="fas fa-times"></i>
          </button>
          <img 
            src={selectedImageUrl} 
            alt="Cinematic Preview" 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-scale-in"
          />
        </div>
      )}

      {/* Thumbnail Film Strip */}
      {scenes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-2">
            <i className="fas fa-film text-amber-500 text-xs"></i>
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500">Production Gallery</h3>
          </div>
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            {scenes.map((scene) => (
              <div 
                key={scene.sceneNumber}
                onClick={() => scene.imageUrl && setSelectedImageUrl(scene.imageUrl)}
                className={`flex-shrink-0 w-32 aspect-video rounded-lg overflow-hidden border border-slate-800 bg-slate-900 transition-all cursor-pointer hover:border-amber-500/50 hover:scale-105 ${!scene.imageUrl ? 'opacity-50 grayscale' : ''}`}
              >
                {scene.imageUrl ? (
                  <img src={scene.imageUrl} className="w-full h-full object-cover" alt={`Scene ${scene.sceneNumber}`} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-4 h-4 border border-slate-700 border-t-amber-500 rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {styleAnalysis && (
          <div className="glass-card rounded-2xl p-6 bg-amber-500/[0.02] border-amber-500/10 h-fit">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <i className="fas fa-wand-magic-sparkles text-amber-500 text-sm"></i>
              </div>
              <h3 className="text-xs font-bold text-amber-500 uppercase tracking-[0.3em]">Style Report</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed font-light">
              {styleAnalysis}
            </p>
          </div>
        )}

        {sources && sources.length > 0 && (
          <div className="glass-card rounded-2xl p-6 border-slate-800 h-fit">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                <i className="fas fa-search text-slate-400 text-xs"></i>
              </div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">Research Sources</h3>
            </div>
            <div className="space-y-2">
              {sources.map((source, idx) => (
                <a 
                  key={idx} 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-xs text-amber-500/70 hover:text-amber-500 truncate underline decoration-amber-500/20 underline-offset-4"
                >
                  <i className="fas fa-external-link-alt mr-2 scale-75"></i>
                  {source.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-12">
        <div className="grid grid-cols-1 gap-12">
          {scenes.map((scene) => (
            <div key={scene.sceneNumber} className="group grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7">
                <div 
                  className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl transition-transform duration-500 hover:scale-[1.01] cursor-zoom-in"
                  onClick={() => scene.imageUrl && setSelectedImageUrl(scene.imageUrl)}
                >
                  {scene.imageUrl ? (
                    <>
                      <img 
                        src={scene.imageUrl} 
                        alt={scene.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <i className="fas fa-expand text-white text-3xl"></i>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-700 bg-[radial-gradient(circle_at_center,_#0f172a_0%,_#020617_100%)]">
                      <i className="fas fa-image text-3xl mb-4 opacity-20 animate-pulse"></i>
                      <p className="text-[10px] uppercase tracking-[0.4em] font-bold">Synthesizing Frame...</p>
                    </div>
                  )}
                  <div className="absolute top-6 left-6 flex space-x-2">
                    <span className="bg-black/80 backdrop-blur-md text-amber-400 px-4 py-1.5 rounded-full text-[10px] font-bold border border-white/5 uppercase tracking-widest">
                      Scene {scene.sceneNumber}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-5 flex flex-col pt-2">
                <h4 className="text-2xl font-bold text-white font-serif mb-4 group-hover:text-amber-500 transition-colors">{scene.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 font-light">{scene.description}</p>
                
                <div className="grid grid-cols-1 gap-4 mt-auto">
                  <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/50">
                    <i className="fas fa-video text-amber-500/50 text-xs"></i>
                    <div>
                      <span className="block text-[9px] uppercase tracking-widest text-slate-500 font-bold mb-0.5">Camera Intention</span>
                      <span className="text-xs text-slate-300">{scene.cameraMovement}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/50">
                    <i className="fas fa-lightbulb text-amber-500/50 text-xs"></i>
                    <div>
                      <span className="block text-[9px] uppercase tracking-widest text-slate-500 font-bold mb-0.5">Lighting Key</span>
                      <span className="text-xs text-slate-300">{scene.lightingStyle}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isGenerating && scenes.length < 6 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
              <div className="lg:col-span-7 aspect-video bg-slate-900/50 border border-slate-800 border-dashed rounded-2xl flex items-center justify-center">
                <div className="text-slate-700 text-[10px] uppercase tracking-[0.3em] font-bold">Waiting for Director...</div>
              </div>
              <div className="lg:col-span-5 space-y-4 pt-2">
                <div className="h-8 bg-slate-900/50 rounded-lg w-3/4"></div>
                <div className="h-4 bg-slate-900/30 rounded w-full"></div>
                <div className="h-4 bg-slate-900/30 rounded w-full"></div>
                <div className="h-20 bg-slate-900/20 rounded-xl mt-6"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryboardResult;
