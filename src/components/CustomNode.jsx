import { memo, useState, useEffect, useMemo } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { useSchemaStore } from '../hooks/useSchemaStore';

/**
 * CustomNode - 六边形赛博朋克风格节点
 * 
 * Props:
 * - data: 节点数据 { label, category }
 * - id: 节点ID
 * 
 * 通过 useSchemaStore 获取 syncErrors，如果当前节点 ID 命中错误列表，激活警告模式
 */
const CustomNode = memo(({ data, id }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(data.label);
  const [showErrorTooltip, setShowErrorTooltip] = useState(false);
  const { setNodes } = useReactFlow();

  // 从全局状态获取同步错误
  const { syncErrors } = useSchemaStore();

  // 计算当前节点的错误列表
  const nodeErrors = useMemo(() => {
    if (!syncErrors || syncErrors.length === 0) return [];
    return syncErrors.filter(error => error.nodeId === id);
  }, [syncErrors, id]);

  // 是否有错误
  const hasErrors = nodeErrors.length > 0;

  // 监听全局点击事件，点击菜单外部时关闭菜单
  useEffect(() => {
    if (showMenu) {
      const handleClickOutside = (e) => {
        if (!e.target.closest('.context-menu')) {
          setShowMenu(false);
        }
      };
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
      {/* 错误提示气泡 */}
      <AnimatePresence>
        {hasErrors && showErrorTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
            className="absolute -top-4 left-1/2 -translate-x-1/2 -translate-y-full z-[9999] min-w-[280px] max-w-[350px]"
          >
            {/* 气泡主体 - 玻璃拟态 */}
            <div className="relative bg-black/90 backdrop-blur-xl rounded-lg border border-orange-500/50 overflow-hidden"
              style={{
                boxShadow: '0 0 40px rgba(255, 100, 0, 0.4), inset 0 0 30px rgba(255, 100, 0, 0.08)',
              }}
            >
              {/* 顶部装饰条 */}
              <div className="h-1 bg-gradient-to-r from-orange-600/0 via-orange-500 to-orange-600/0" />
              
              {/* 扫描线效果 */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                  animate={{ y: ['0%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="h-1 bg-gradient-to-b from-transparent via-orange-400/30 to-transparent"
                />
              </div>

              {/* 内容区域 */}
              <div className="p-4">
                {/* 标题 */}
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <span className="font-display text-xs text-orange-400 tracking-widest uppercase">
                    Validation Error
                  </span>
                </div>

                {/* 错误列表 */}
                <div className="space-y-2">
                  {nodeErrors.map((error, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-2 text-sm"
                    >
                      <span className="text-orange-500/60 font-mono text-xs mt-0.5">
                        [{String(index + 1).padStart(2, '0')}]
                      </span>
                      <span className="text-white/90 font-body leading-relaxed text-xs">
                        {error.message || 'Unknown error'}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* 底部装饰 */}
                <div className="mt-3 pt-2 border-t border-orange-500/20 flex justify-between items-center">
                  <span className="text-[10px] text-orange-400/50 font-mono">
                    NODE_ID: {id}
                  </span>
                  <span className="text-[10px] text-orange-400/50 font-mono animate-pulse">
                    ⚠ CRITICAL
                  </span>
                </div>
              </div>

              {/* 角标装饰 */}
              <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-orange-500/60" />
              <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-orange-500/60" />
              <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-orange-500/60" />
              <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-orange-500/60" />
            </div>

            {/* 底部箭头 */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-black/90 border-r border-b border-orange-500/50 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.5,
          ease: [0.34, 1.56, 0.64, 1]
        }}
        className="relative group"
        onContextMenu={handleContextMenu}
        onMouseEnter={() => hasErrors && setShowErrorTooltip(true)}
        onMouseLeave={() => setShowErrorTooltip(false)}
      >
        {/* 警告状态下的外层脉冲发光 - warning-shadow-pulse */}
        {hasErrors && (
          <>
            <div className="absolute -inset-10 bg-orange-500/10 blur-3xl animate-pulse-warning" />
            <div className="absolute -inset-6 bg-orange-500/20 blur-2xl animate-pulse-warning" style={{ animationDelay: '0.2s' }} />
            <div className="absolute -inset-3 bg-orange-500/30 blur-xl animate-pulse-warning" style={{ animationDelay: '0.4s' }} />
          </>
        )}

        {/* 普通状态下的外层发光 */}
        {!hasErrors && (
          <>
            <div className="absolute -inset-10 bg-cyan-500/5 blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute -inset-6 bg-cyan-400/10 blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -inset-3 bg-cyan-400/20 blur-xl opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        )}
      
        {/* 角落发光 - 普通状态 */}
        {!hasErrors && (
          <>
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent blur-sm opacity-80 animate-pulse" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent blur-sm opacity-80 animate-pulse" />
            <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-transparent via-cyan-300 to-transparent blur-sm opacity-60" />
            <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-transparent via-cyan-300 to-transparent blur-sm opacity-60" />
          </>
        )}

        {/* 警告状态下的闪烁边角 - border-flicker */}
        {hasErrors && (
          <>
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent blur-sm animate-flicker-warning" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent blur-sm animate-flicker-warning" />
            <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-1 h-10 bg-gradient-to-b from-transparent via-orange-400 to-transparent blur-sm animate-flicker-warning" />
            <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-1 h-10 bg-gradient-to-b from-transparent via-orange-400 to-transparent blur-sm animate-flicker-warning" />
          </>
        )}

        {/* 主六边形容器 */}
        <div className="relative flex items-center justify-center min-w-[160px] h-[56px]">
          {/* 外六边形边框 - 警告模式下橙红色闪烁 */}
          <div
            className={`absolute inset-0 p-[2px] transition-all duration-300
              ${hasErrors 
                ? 'bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 animate-border-flicker warning-shadow' 
                : 'bg-gradient-to-br from-cyan-400 via-cyan-500 to-purple-500 shadow-[0_0_30px_rgba(0,240,255,0.4),0_0_60px_rgba(0,240,255,0.2)] group-hover:shadow-[0_0_40px_rgba(0,240,255,0.6),0_0_80px_rgba(0,240,255,0.3)]'
              }`}
            style={{
              clipPath: 'polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)'
            }}
          >
            {/* 内填充 */}
            <div 
              className={`w-full h-full ${hasErrors ? 'bg-gradient-to-b from-orange-950/80 via-slate-950 to-black' : 'bg-gradient-to-b from-slate-900 via-slate-950 to-black'}`}
              style={{
                clipPath: 'polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)'
              }}
            />
          </div>

          {/* 内装饰六边形 */}
          <div
            className={`absolute inset-[4px] transition-colors duration-300 ${
              hasErrors 
                ? 'border border-orange-400/60 animate-border-flicker' 
                : 'border border-cyan-400/40 group-hover:border-cyan-300/60'
            }`}
            style={{
              clipPath: 'polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)'
            }}
          />

          {/* 科技线条装饰 */}
          <div className={`absolute left-[15%] top-1/2 -translate-y-1/2 w-4 h-[1px] ${hasErrors ? 'bg-gradient-to-r from-orange-400/60 to-transparent' : 'bg-gradient-to-r from-cyan-400/60 to-transparent'}`} />
          <div className={`absolute right-[15%] top-1/2 -translate-y-1/2 w-4 h-[1px] ${hasErrors ? 'bg-gradient-to-l from-orange-400/60 to-transparent' : 'bg-gradient-to-l from-cyan-400/60 to-transparent'}`} />

          {/* AlertTriangle 警告图标 */}
          {hasErrors && (
            <div className="absolute -top-3 -right-3 z-20">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-500/30 border border-orange-500/60 animate-pulse"
              >
                <AlertTriangle className="w-4 h-4 text-orange-400" />
              </motion.div>
            </div>
          )}

          {/* 文本内容 */}
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
            <span className={`relative z-10 font-display font-bold tracking-[0.25em] uppercase text-sm transition-all duration-300 ${
              hasErrors 
                ? 'text-orange-100 drop-shadow-[0_0_10px_rgba(255,150,0,0.8)]' 
                : 'text-white drop-shadow-[0_0_10px_rgba(0,240,255,0.8)] group-hover:drop-shadow-[0_0_15px_rgba(0,240,255,1)]'
            }`}>
              {data.label}
            </span>
          )}
        </div>

        {/* 连接手柄 */}
        <Handle
          type="target"
          position={Position.Top}
          className={`!w-4 !h-4 !border-2 !border-white !rounded-none transition-all hover:!scale-125 ${
            hasErrors 
              ? '!bg-gradient-to-br !from-orange-300 !to-orange-500 !shadow-[0_0_15px_rgba(255,150,0,1)]' 
              : '!bg-gradient-to-br !from-cyan-300 !to-cyan-500 !shadow-[0_0_15px_rgba(0,240,255,1)]'
          }`}
          style={{ 
            top: '-8px',
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
          }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className={`!w-4 !h-4 !border-2 !border-white !rounded-none transition-all hover:!scale-125 ${
            hasErrors 
              ? '!bg-gradient-to-br !from-orange-300 !to-orange-500 !shadow-[0_0_15px_rgba(255,150,0,1)]' 
              : '!bg-gradient-to-br !from-cyan-300 !to-cyan-500 !shadow-[0_0_15px_rgba(0,240,255,1)]'
          }`}
          style={{ 
            bottom: '-8px',
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
          }}
        />
      
        {/* 侧边手柄 */}
        <Handle
          type="target"
          position={Position.Left}
          className={`!w-2.5 !h-2.5 !rounded-full opacity-0 group-hover:opacity-100 transition-all hover:!scale-150 ${
            hasErrors 
              ? '!bg-orange-500/60 !border !border-orange-400/50' 
              : '!bg-cyan-500/60 !border !border-cyan-400/50'
          }`}
        />
        <Handle
          type="source"
          position={Position.Right}
          className={`!w-2.5 !h-2.5 !rounded-full opacity-0 group-hover:opacity-100 transition-all hover:!scale-150 ${
            hasErrors 
              ? '!bg-orange-500/60 !border !border-orange-400/50' 
              : '!bg-cyan-500/60 !border !border-cyan-400/50'
          }`}
        />
    </motion.div>

    {/* 右键菜单 */}
    <AnimatePresence>
      {showMenu && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: -0 }}
            transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
            className="absolute left-full top-0 ml-3 z-[99999] min-w-[120px] context-menu"
          >
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
