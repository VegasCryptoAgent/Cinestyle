
import React, { useState } from 'react';
import { VideoReference } from '../types';

interface Props {
  references: VideoReference[];
  onAdd: (ref: VideoReference) => void;
  onRemove: (id: string) => void;
}

const ReferenceManager: React.FC<Props> = ({ references, onAdd, onRemove }) => {
  const [urlInput, setUrlInput] = useState('');

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      type: 'url',
      value: urlInput
    });
    setUrlInput('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      onAdd({
        id: Math.random().toString(36).substr(2, 9),
        type: 'file',
        value: reader.result as string,
        name: file.name,
        mimeType: file.type
      });
    };
    reader.readAsDataURL(file);
    // Clear input
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-400 mb-2">Video URL / YouTube Link</label>
          <div className="flex gap-2">
            <input
              type="text"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              placeholder="https://youtube.com/watch?v=..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddUrl()}
            />
            <button
              onClick={handleAddUrl}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
            >
              Add Link
            </button>
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-400 mb-2">Upload Reference Clip (Max 10)</label>
          <div className="relative">
            <input
              type="file"
              accept="video/*"
              className="hidden"
              id="video-upload"
              onChange={handleFileUpload}
              disabled={references.length >= 10}
            />
            <label
              htmlFor="video-upload"
              className={`flex items-center justify-center w-full bg-slate-800 border-2 border-dashed border-slate-600 rounded-lg px-4 py-2 cursor-pointer transition-all hover:bg-slate-700 hover:border-amber-500/50 ${references.length >= 10 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <i className="fas fa-film mr-2 text-amber-500"></i>
              <span className="text-sm">Upload Video Clip</span>
            </label>
          </div>
        </div>
      </div>

      {references.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {references.map((ref) => (
            <div key={ref.id} className="bg-slate-800/80 border border-slate-700 rounded-lg p-3 flex items-center justify-between animate-fade-in">
              <div className="flex items-center space-x-3 overflow-hidden">
                <i className={`fas ${ref.type === 'url' ? 'fa-link' : 'fa-file-video'} text-amber-400 flex-shrink-0`}></i>
                <span className="text-xs truncate font-mono text-slate-300">
                  {ref.type === 'url' ? ref.value : (ref.name || 'Video File')}
                </span>
              </div>
              <button
                onClick={() => onRemove(ref.id)}
                className="text-slate-500 hover:text-red-400 transition-colors ml-2"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReferenceManager;
