import { memo } from 'react';
import { Handle, Position } from 'reactflow';

const CustomNode = memo(({ data }) => {
  return (
    <div className="flex items-center justify-center w-20 h-20 bg-black rounded-full border-4 border-gray-800 shadow-lg hover:shadow-xl transition-shadow">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-gray-400 border-2 border-gray-600" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-gray-400 border-2 border-gray-600" />
      <span className="text-white text-sm font-medium text-center px-2">{data.label}</span>
    </div>
  );
});

CustomNode.displayName = 'CustomNode';

export default CustomNode;