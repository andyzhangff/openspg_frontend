import { memo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Zap } from 'lucide-react';

/**
 * SyncButton - 赛博朋克风格同步按钮
 * 固定在画布右下角
 */
const SyncButton = memo(({ isSyncing, onClick }) => {
  const [ripples, setRipples] = useState([]);

  const handleClick = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = { id: Date.now(), x, y };
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);

    onClick();
  }, [onClick]);

  return (
    <motion.button
      onClick={handleClick}
      disabled={isSyncing}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed z-[200] group"
      style={{
        right: 'calc(380px + 2rem)',
        bottom: '2rem',
        minWidth: '120px',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        borderRadius: '12px',
        fontFamily: 'Orbitron, sans-serif',
        fontSize: '14px',
        fontWeight: 700,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: '#0f172a',
        background: isSyncing 
          ? 'linear-gradient(135deg, rgba(0,240,255,0.6), rgba(0,200,255,0.4))'
          : 'linear-gradient(135deg, #00f0ff, #00c8ff, #00f0ff)',
        backgroundSize: '200% 200%',
        animation: isSyncing ? 'none' : 'gradient-shift 3s ease infinite',
        border: '1px solid rgba(0, 240, 255, 0.8)',
        boxShadow: `
          0 0 20px rgba(0, 240, 255, 0.6),
          0 0 40px rgba(0, 240, 255, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.5)
        `,
        cursor: isSyncing ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
      }}
    >
      {/* 冲击波动画 */}
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.span
            key={ripple.id}
            initial={{ width: 0, height: 0, opacity: 0.8 }}
            animate={{ width: 200, height: 200, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              left: ripple.x - 100,
              top: ripple.y - 100,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,240,255,0.8) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
        ))}
      </AnimatePresence>

      {/* 图标 */}
      <motion.div
        animate={isSyncing ? { rotate: 360 } : { rotate: 0 }}
        transition={isSyncing ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
      >
        {isSyncing ? (
          <RefreshCw size={18} style={{ color: '#0f172a' }} />
        ) : (
          <Zap size={18} style={{ color: '#0f172a' }} />
        )}
      </motion.div>

      {/* 文字 */}
      <span>{isSyncing ? '同步中' : '同步'}</span>

      {/* 悬停光晕 */}
      <div 
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.2), transparent)',
        }}
      />
    </motion.button>
  );
});

SyncButton.displayName = 'SyncButton';

export default SyncButton;
