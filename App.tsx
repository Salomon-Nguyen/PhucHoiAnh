
import React, { useState, useCallback, useRef } from 'react';
import { PhotoType, OutputMode, RestorationConfig } from './types';
import ComparisonSlider from './components/ComparisonSlider';
import { restoreImage } from './services/geminiService';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [restoredImage, setRestoredImage] = useState<string | null>(null);
  const [config, setConfig] = useState<RestorationConfig>({
    type: PhotoType.PORTRAIT,
    mode: OutputMode.STUDIO,
    description: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setOriginalImage(event.target?.result as string);
        setRestoredImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startRestoration = async () => {
    if (!originalImage) return;
    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      const result = await restoreImage(originalImage, config, (p, s) => {
        setProgress(p);
        setStatusMessage(s);
      });
      setRestoredImage(result);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra trong quá trình xử lý.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!restoredImage) return;
    const link = document.createElement('a');
    link.href = restoredImage;
    link.download = 'di-san-hoi-sinh-result.png';
    link.click();
  };

  const resetAll = () => {
    setOriginalImage(null);
    setRestoredImage(null);
    setConfig({
      type: PhotoType.PORTRAIT,
      mode: OutputMode.STUDIO,
      description: ''
    });
    setProgress(0);
    setStatusMessage('');
    setError(null);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-slate-900 text-slate-100 overflow-hidden text-sm">
      {/* Header */}
      <header className="p-2 border-b border-slate-800 flex justify-between items-center bg-slate-900/80 backdrop-blur-sm z-50">
        <h1 className="text-xl font-black tracking-tighter uppercase italic text-blue-400">
          DI SẢN HỒI SINH
        </h1>
        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
          AI Professional Restoration
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden p-3 gap-4">
        
        {/* Left Column: Visuals */}
        <div className="flex-[3] flex flex-col gap-3 h-full overflow-hidden">
          <div className="flex-1 relative bg-black rounded shadow-2xl border border-slate-800">
            <ComparisonSlider original={originalImage} restored={restoredImage} />
          </div>

          <div className="flex flex-col gap-2 bg-slate-800/50 p-3 rounded border border-slate-700">
            <label className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
              Mô tả chi tiết (màu sắc, bối cảnh, nhân vật...)
            </label>
            <textarea
              value={config.description}
              onChange={(e) => setConfig({ ...config, description: e.target.value })}
              className="w-full h-16 bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
              placeholder="Nhập thông tin để AI xử lý chính xác hơn..."
            />
            
            <div className="flex gap-2">
              <button 
                onClick={downloadResult}
                disabled={!restoredImage}
                className={`flex-1 py-2 rounded text-[12px] font-bold uppercase tracking-widest transition-all ${
                  restoredImage 
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                }`}
              >
                Tải ảnh kết quả
              </button>
              <button 
                onClick={resetAll}
                className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-[12px] font-bold uppercase tracking-widest transition-all"
              >
                Làm ảnh mới
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Controls */}
        <div className="flex-[1.2] flex flex-col gap-4 bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-xl min-w-[320px] h-fit self-start">
          
          {/* Upload Button */}
          <section>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileUpload}
              accept="image/*"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-4 border-2 border-dashed border-slate-600 hover:border-blue-500 hover:bg-blue-500/10 rounded transition-all text-sm font-bold uppercase text-slate-300"
            >
              {originalImage ? 'Đã tải ảnh lên' : 'Tải ảnh từ máy'}
            </button>
          </section>

          {/* Type Selection */}
          <section className="space-y-2">
            <span className="text-[11px] uppercase font-bold text-slate-400">Kiểu ảnh</span>
            <div className="grid grid-cols-2 gap-1">
              {Object.values(PhotoType).map((type) => (
                <button
                  key={type}
                  onClick={() => setConfig({ ...config, type })}
                  className={`py-2 text-[11px] border rounded transition-all font-medium ${
                    config.type === type 
                      ? 'bg-blue-600 border-blue-400 text-white' 
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </section>

          {/* Output Mode */}
          <section className="space-y-2">
            <span className="text-[11px] uppercase font-bold text-slate-400">Chế độ đầu ra</span>
            <div className="flex flex-col gap-1">
              {Object.values(OutputMode).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setConfig({ ...config, mode })}
                  className={`py-2 px-3 text-left text-[11px] border rounded transition-all font-medium ${
                    config.mode === mode 
                      ? 'bg-blue-600/20 border-blue-500 text-blue-400' 
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </section>

          {/* Progress Section */}
          {(isProcessing || progress > 0) && (
            <section className="space-y-1">
              <div className="flex justify-between text-[10px] uppercase font-bold">
                <span className="text-blue-400">{statusMessage}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </section>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-2 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-[11px] font-medium italic">
              {error}
            </div>
          )}

          {/* Primary Action */}
          <button 
            onClick={startRestoration}
            disabled={!originalImage || isProcessing}
            className={`w-full py-4 rounded font-black text-sm uppercase tracking-widest shadow-lg transition-all transform active:scale-95 ${
              originalImage && !isProcessing
                ? 'bg-blue-600 hover:bg-blue-500 text-white ring-2 ring-blue-400/50'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed opacity-50'
            }`}
          >
            {isProcessing ? 'Đang xử lý...' : 'BẮT ĐẦU PHỤC HỒI'}
          </button>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="px-4 py-1 text-[9px] text-slate-600 flex justify-between uppercase font-medium">
        <span>Tiling Process Active</span>
        <span>Super-Resolution (4K-8K) Ready</span>
        <span>Face ID Locked - Vietnamese Heritage</span>
      </footer>
    </div>
  );
};

export default App;
