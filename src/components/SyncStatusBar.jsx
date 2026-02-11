import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 全局同步状态条
 * 当 isSyncing 为 true 时显示青色流光扫描效果
 */
const SyncStatusBar = memo(({ isSyncing }) => {
  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-[100] overflow-hidden">
      <AnimatePresence>
        {isSyncing && (
          <>
            {/* 背景轨道 */}
            <div className="absolute inset-0 bg-cyan-500/10" />
            
            {/* 流光扫描效果 - 主光束 */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100vw' }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute inset-0 w-[200px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
              style={{
                boxShadow: '0 0 20px rgba(0, 240, 255, 0.8), 0 0 40px rgba(0, 240, 255, 0.4)',
              }}
            />
            
            {/* 二次流光 - 跟随效果 */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100vw' }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: 'linear',
                delay: 0.1,
              }}
              className="absolute inset-0 w-[100px] bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent"
            />
            
            {/* 脉冲光点 */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100vw' }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 -ml-2"
            >
              <div className="w-full h-full rounded-full bg-cyan-400 animate-ping opacity-75" />
              <div className="absolute inset-1 rounded-full bg-white" />
            </motion.div>

            {/* 持续发光的底部边框 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-400/50 to-cyan-500/0"
              style={{
                boxShadow: '0 1px 10px rgba(0, 240, 255, 0.5)',
              }}
            />
          </>
        )}
      </AnimatePresence>
      
      {/* 静态底线 - 始终显示 */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
    </div>
  );
});

SyncStatusBar.displayName = 'SyncStatusBar';

export default SyncStatusBar;
