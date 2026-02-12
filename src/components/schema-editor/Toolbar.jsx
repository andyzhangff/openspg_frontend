import { Plus, Minus, Maximize, Lock, Unlock, Eye } from 'lucide-react';

/**
 * Toolbar - 底部工具栏
 */
const Toolbar = ({
  onZoomIn,
  onZoomOut,
  onFitView,
  isLocked,
  onToggleLock,
}) => {
  return (
    <div className="absolute bottom-8 left-8 flex items-center gap-4 z-10">
      {/* Zoom Controls */}
      <div className="flex items-center glass-panel rounded-xl overflow-hidden
        shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <button 
          onClick={onZoomIn} 
          className="p-3 hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]"
        >
          <Plus className="w-5 h-5" />
        </button>
        <div className="w-px h-6 bg-cyan-500/30" />
        <button 
          onClick={onZoomOut} 
          className="p-3 hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]"
        >
          <Minus className="w-5 h-5" />
        </button>
      </div>

      {/* Fit View */}
      <button 
        onClick={onFitView}
        className="p-3 glass-panel rounded-xl hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 transition-all
          shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]"
      >
        <Maximize className="w-5 h-5" />
      </button>

      {/* Lock/Unlock */}
      <button 
        onClick={onToggleLock}
        className={`p-3 rounded-xl transition-all shadow-[0_0_30px_rgba(0,0,0,0.5)]
          ${isLocked 
            ? 'bg-cyan-500/30 border border-cyan-400/60 text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.3)]' 
            : 'glass-panel border border-cyan-500/30 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]'
          }`}
      >
        {isLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
      </button>

      {/* View toggle */}
      <button
        className="p-3 glass-panel rounded-xl hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 transition-all
          shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]"
      >
        <Eye className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Toolbar;
