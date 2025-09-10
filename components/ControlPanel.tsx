
import React from 'react';
import type { SketchOptions } from '../types';
import { SketchStyle, ArtistStyle, LineThickness, CanvasType, BackgroundOption } from '../types';

interface ControlPanelProps {
  options: SketchOptions;
  setOptions: React.Dispatch<React.SetStateAction<SketchOptions>>;
  onGenerate: () => void;
  isGenerating: boolean;
  isImageUploaded: boolean;
}

const ControlSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300 mb-3">{title}</h3>
    {children}
  </div>
);

const SelectInput = <T extends string,>({ label, value, onChange, options }: { label: string; value: T; onChange: (value: T) => void; options: readonly T[] }) => (
    <div className="flex flex-col">
      <label className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-400">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

export const ControlPanel: React.FC<ControlPanelProps> = ({ options, setOptions, onGenerate, isGenerating, isImageUploaded }) => {
  const handleOptionChange = <K extends keyof SketchOptions,>(key: K, value: SketchOptions[K]) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg sticky top-8">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">Customize Sketch</h2>

      <ControlSection title="Art Style">
        <SelectInput 
            label="Sketch Style" 
            value={options.sketchStyle} 
            onChange={(v) => handleOptionChange('sketchStyle', v)} 
            options={Object.values(SketchStyle)} 
        />
      </ControlSection>

       <ControlSection title="Artistic Influence">
        <SelectInput 
            label="Artist Style" 
            value={options.artistStyle} 
            onChange={(v) => handleOptionChange('artistStyle', v)} 
            options={Object.values(ArtistStyle)} 
        />
      </ControlSection>

      <ControlSection title="Details & Texture">
        <div className="space-y-4">
            <SelectInput 
                label="Line Thickness" 
                value={options.lineThickness} 
                onChange={(v) => handleOptionChange('lineThickness', v)} 
                options={Object.values(LineThickness)} 
            />
            <SelectInput 
                label="Canvas Type" 
                value={options.canvasType} 
                onChange={(v) => handleOptionChange('canvasType', v)} 
                options={Object.values(CanvasType)} 
            />
             <SelectInput 
                label="Background" 
                value={options.backgroundOption} 
                onChange={(v) => handleOptionChange('backgroundOption', v)} 
                options={Object.values(BackgroundOption)} 
            />
        </div>
      </ControlSection>

      <button
        onClick={onGenerate}
        disabled={isGenerating || !isImageUploaded}
        className="w-full bg-brand-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 ease-in-out flex items-center justify-center"
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          'Generate Sketch'
        )}
      </button>
      {!isImageUploaded && <p className="text-xs text-center mt-2 text-slate-500">Upload an image to start</p>}
    </div>
  );
};
