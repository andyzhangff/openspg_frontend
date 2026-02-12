import { memo } from 'react';

const MiniMapPanel = memo(({ nodes }) => {
  return (
    <div className="absolute bottom-4 left-4 glass-panel rounded-xl p-4 border border-cyan-500/30
      shadow-[0_0_30px_rgba(0,0,0,0.5)]" style={{ zIndex: 100 }}>
      <div className="text-xs text-cyan-400 font-mono mb-2 tracking-wider">MINI MAP</div>
      <div className="w-32 h-24 bg-slate-900/60 rounded-lg border border-cyan-500/20 relative overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 gap-px opacity-30">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="bg-cyan-500/20" />
          ))}
        </div>
        {nodes.map((node) => (
          <div
            key={node.id}
            className="absolute w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_8px_#00f0ff] animate-pulse"
            style={{
              left: `${(node.position.x / 1000) * 100}%`,
              top: `${(node.position.y / 1000) * 100}%`,
            }}
          />
        ))}
      </div>
      <div className="mt-2 text-[10px] text-white/50 font-mono text-center">
        NODES: {nodes.length}
      </div>
    </div>
  );
});

export default MiniMapPanel;
