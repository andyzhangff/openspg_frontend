import { memo, useState, useEffect } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2 } from 'lucide-react';

const CustomNode = memo(({ data, id }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(data.label);
  const { setNodes } = useReactFlow();

  // 监听全局点击事件，点击菜单外部时关闭菜单
  useEffect(() => {
    if (showMenu) {
      const handleClickOutside = (e) => {
        // 如果点击的不是菜单内的元素，就关闭菜单
        if (!e.target.closest('.context-menu')) {
          setShowMenu(false);
        }
      };

      // 延迟添加监听器，避免立即触发
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 0);

      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [showMenu]);

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(true);
  };

  const handleDelete = () => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setShowMenu(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleSaveEdit = () => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, label: editLabel } } : node
      )
    );
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditLabel(data.label);
      setIsEditing(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.5,
          ease: [0.34, 1.56, 0.64, 1] // Spring effect
        }}
        className="relative group"
        onContextMenu={handleContextMenu}
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
        {isEditing ? (
          <input
            type="text"
            value={editLabel}
            onChange={(e) => setEditLabel(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSaveEdit}
            autoFocus
            className="relative z-10 font-display text-white font-bold tracking-[0.25em] uppercase text-sm
              bg-transparent border-none outline-none text-center w-full px-2
              drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]"
          />
        ) : (
          <span className="relative z-10 font-display text-white font-bold tracking-[0.25em] uppercase text-sm
            drop-shadow-[0_0_10px_rgba(0,240,255,0.8)] group-hover:drop-shadow-[0_0_15px_rgba(0,240,255,1)]
            transition-all duration-300">
            {data.label}
          </span>
        )}
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

    {/* Context Menu */}
    <AnimatePresence>
      {showMenu && (
        <>
          {/* Menu - positioned absolutely relative to the node */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: -10 }}
            transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
            className="absolute left-full top-0 ml-3 z-[99999] min-w-[120px] context-menu"
          >
            {/* Menu container */}
            <div className="relative bg-black/0 backdrop-blur-none rounded-md overflow-hidden
              shadow-[0_0_20px_rgba(255,255,255,0.1)]
              border border-white/80">

              <button
                onClick={handleEdit}
                className="relative flex items-center gap-2 px-3 py-2 w-full text-left text-white
                  bg-transparent hover:bg-white/10 transition-all duration-200 border-b border-white/30"
              >
                <Edit2 className="w-3 h-3 text-white" />
                <span className="font-display text-xs tracking-wider uppercase">
                  编辑
                </span>
              </button>

              <button
                onClick={handleDelete}
                className="relative flex items-center gap-2 px-3 py-2 w-full text-left text-white
                  bg-transparent hover:bg-white/10 transition-all duration-200"
              >
                <Trash2 className="w-3 h-3 text-white" />
                <span className="font-display text-xs tracking-wider uppercase">
                  删除
                </span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  </>
  );
});

CustomNode.displayName = 'CustomNode';

export default CustomNode;
