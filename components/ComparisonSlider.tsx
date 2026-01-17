
import React, { useState, useRef, useEffect } from 'react';

interface ComparisonSliderProps {
  original: string | null;
  restored: string | null;
}

const ComparisonSlider: React.FC<ComparisonSliderProps> = ({ original, restored }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const position = ((x - rect.left) / rect.width) * 100;
    setSliderPos(Math.min(Math.max(position, 0), 100));
  };

  if (!original) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-800 border-2 border-dashed border-slate-600 rounded">
        <span className="text-slate-400 text-sm uppercase font-bold tracking-widest">Chưa có ảnh</span>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden rounded bg-black cursor-col-resize select-none"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      {/* Restored Image (Background) */}
      <img 
        src={restored || original} 
        alt="Restored" 
        className="absolute inset-0 w-full h-full object-contain"
      />
      
      {/* Original Image (Foreground with Clip) */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <img 
          src={original} 
          alt="Original" 
          className="w-full h-full object-contain"
        />
      </div>

      {/* Slider Line */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white shadow-xl z-10 slider-handle"
        style={{ left: `${sliderPos}%` }}
      />

      {/* Labels */}
      <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 text-[10px] rounded uppercase font-bold z-20">Ảnh Gốc</div>
      <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/50 text-[10px] rounded uppercase font-bold z-20">Sau Phục Hồi</div>
    </div>
  );
};

export default ComparisonSlider;
