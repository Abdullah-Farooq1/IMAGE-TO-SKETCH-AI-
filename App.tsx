
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ControlPanel } from './components/ControlPanel';
import { ImageDisplay } from './components/ImageDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { SketchStyle, ArtistStyle, LineThickness, CanvasType, BackgroundOption, SketchOptions } from './types';
import { generateSketch } from './services/geminiService';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [sketchedImage, setSketchedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [options, setOptions] = useState<SketchOptions>({
    sketchStyle: SketchStyle.PENCIL_BW,
    artistStyle: ArtistStyle.NONE,
    lineThickness: LineThickness.MEDIUM,
    canvasType: CanvasType.WHITE_PAPER,
    backgroundOption: BackgroundOption.KEEP,
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleImageUpload = (imageDataUrl: string) => {
    setOriginalImage(imageDataUrl);
    setSketchedImage(null); // Reset sketched image on new upload
    setError(null);
  };

  const handleGenerateSketch = useCallback(async () => {
    if (!originalImage) {
      setError("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSketchedImage(null);

    try {
      const result = await generateSketch(originalImage, options);
      if(result.imageUrl) {
        setSketchedImage(result.imageUrl);
      } else {
        setError(result.error || "Failed to generate sketch. The model might not have returned an image.");
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      console.error(e);
      setError(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, options]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 xl:col-span-3">
            <ControlPanel 
              options={options}
              setOptions={setOptions}
              onGenerate={handleGenerateSketch}
              isGenerating={isLoading}
              isImageUploaded={!!originalImage}
            />
          </div>
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-8">
            <ImageUploader onImageUpload={handleImageUpload} />
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline ml-2">{error}</span>
              </div>
            )}
            {isLoading && <LoadingSpinner />}
            <ImageDisplay 
              originalImage={originalImage}
              sketchedImage={sketchedImage}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
