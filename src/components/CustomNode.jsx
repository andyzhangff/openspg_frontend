import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { motion } from 'framer-motion';

const CustomNode = memo(({ data }) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        duration: 0.5, 
        ease: [0.34, 1.56, 0.64, 1] // Spring effect
      }}
      className="relative group"
    >
      {/* Outer glow layers - multiple for depth */}
      <div className="absolute -inset-10 bg-cyan-500/5 blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute -inset-6 bg-cyan-400/10 blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute -inset-3 bg-cyan-400/20 blur-xl opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Animated corner glows */}
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent blur-sm opacity-80 animate-pulse" />
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent blur-sm opacity-80 animate-pulse" />
      
      {/* Side glows */}
      <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-transparent via-cyan-300 to-transparent blur-sm opacity-60" />
      <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-transparent via-cyan-300 to-transparent blur-sm opacity-60" />

      {/* Main hexagon container */}
      <div className="relative flex items-center justify-center min-w-[160px] h-[56px]">
        {/* Outer hexagon border with gradient */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-cyan-500 to-purple-500 p-[2px] 
            shadow-[0_0_30px_rgba(0,240,255,0.4),0_0_60px_rgba(0,240,255,0.2)] 
            group-hover:shadow-[0_0_40px_rgba(0,240,255,0.6),0_0_80px_rgba(0,240,255,0.3)] 
            transition-all duration-300"
          style={{
            clipPath: 'polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)'
          }}
        >
          {/* Inner fill */}
          <div 
            className="w-full h-full bg-gradient-to-b from-slate-900 via-slate-950 to-black"
            style={{
              clipPath: 'polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)'
            }}
          />
        </div>

        {/* Inner accent hexagon */}
        <div
          className="absolute inset-[4px] border border-cyan-400/40 group-hover:border-cyan-300/60 transition-colors duration-300"
          style={{
            clipPath: 'polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)'
          }}
        />

        {/* Tech lines decoration */}
        <div className="absolute left-[15%] top-1/2 -translate-y-1/2 w-4 h-[1px] bg-gradient-to-r from-cyan-400/60 to-transparent" />
        <div className="absolute right-[15%] top-1/2 -translate-y-1/2 w-4 h-[1px] bg-gradient-to-l from-cyan-400/60 to-transparent" />

        {/* Text content with Orbitron font */}
        <span className="relative z-10 font-display text-white font-bold tracking-[0.25em] uppercase text-sm 
          drop-shadow-[0_0_10px_rgba(0,240,255,0.8)] group-hover:drop-shadow-[0_0_15px_rgba(0,240,255,1)]
          transition-all duration-300">
          {data.label}
        </span>
      </div>

      {/* Connection handles with enhanced styling */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-4 !h-4 !bg-gradient-to-br !from-cyan-300 !to-cyan-500 !border-2 !border-white !rounded-none 
          !shadow-[0_0_15px_rgba(0,240,255,1)] transition-all hover:!scale-125"
        style={{ 
          top: '-8px',
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-4 !h-4 !bg-gradient-to-br !from-cyan-300 !to-cyan-500 !border-2 !border-white !rounded-none 
          !shadow-[0_0_15px_rgba(0,240,255,1)] transition-all hover:!scale-125"
        style={{ 
          bottom: '-8px',
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
        }}
      />
      
      {/* Side handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2.5 !h-2.5 !bg-cyan-500/60 !border !border-cyan-400/50 !rounded-full opacity-0 group-hover:opacity-100 transition-all hover:!scale-150"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2.5 !h-2.5 !bg-cyan-500/60 !border !border-cyan-400/50 !rounded-full opacity-0 group-hover:opacity-100 transition-all hover:!scale-150"
      />
    </motion.div>
  );
});

CustomNode.displayName = 'CustomNode';

export default CustomNode;
