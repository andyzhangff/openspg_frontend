import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { motion } from 'framer-motion';

const CustomNode = memo(({ data }) => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="flex items-center justify-center w-24 h-24 bg-blue-500 rounded-full border-4 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.8)] transition-shadow"
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-300 border-2 border-blue-200" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-300 border-2 border-blue-200" />
      <span className="text-white text-sm font-medium text-center px-2">{data.label}</span>
    </motion.div>
  );
});

CustomNode.displayName = 'CustomNode';

export default CustomNode;