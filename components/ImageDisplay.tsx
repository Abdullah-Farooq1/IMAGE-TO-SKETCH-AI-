import React from 'react';

interface ImageDisplayProps {
  originalImage: string | null;
  sketchedImage: string | null;
}

const ImageCard: React.FC<{ title: string; imageUrl: string | null; children?: React.ReactNode }> = ({ title, imageUrl, children }) => {
    return (
        <div className="flex-1 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg flex flex-col min-w-0">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4 truncate">{title}</h3>
            <div className="aspect-square bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center flex-grow">
                {imageUrl ? (
                    <img src={imageUrl} alt={title} className="max-w-full max-h-full object-contain rounded-md" />
                ) : (
                    <div className="text-slate-400 dark:text-slate-500 text-center p-4">
                        {children || "No image"}
                    </div>
                )}
            </div>
        </div>
    );
};

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ originalImage, sketchedImage }) => {
    
  const handleDownload = () => {
    if (sketchedImage) {
      const link = document.createElement('a');
      link.href = sketchedImage;
      link.download = 'sketch-ai-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-8">
        {/* FIX: Pass imageUrl prop to ImageCard and placeholder text as children to fix missing prop error. */}
        <ImageCard title="Original Image" imageUrl={originalImage}>
           <p>Upload an image to see it here.</p>
        </ImageCard>

        <div className="flex-1 flex flex-col min-w-0">
            {/* FIX: Pass imageUrl prop to ImageCard and placeholder text as children to fix missing prop error. */}
            <ImageCard title="AI Generated Sketch" imageUrl={sketchedImage}>
                <p>Your generated sketch will appear here.</p>
            </ImageCard>
             {sketchedImage && (
                <button 
                    onClick={handleDownload}
                    className="mt-4 w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                    Download Sketch
                </button>
            )}
        </div>
      </div>
    </div>
  );
};
