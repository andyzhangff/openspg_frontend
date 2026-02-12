import { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  addEdge,
  ConnectionLineType,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';

import CustomNode from '../CustomNode';
import EnergyEdge from '../EnergyEdge';
import Toolbar from './Toolbar';

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  energy: EnergyEdge,
  cyberEdge: EnergyEdge,
};

const Canvas = ({ nodes, edges, onNodesChange, onEdgesChange, onAddNode, syncErrors }) => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  const onConnect = useCallback(
    (params) =>
      onEdgesChange((eds) =>
        addEdge(
          {
            ...params,
            type: 'energy',
            animated: true,
          },
          eds,
        ),
      ),
    [onEdgesChange],
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      const label = event.dataTransfer.getData('application/reactflow-label');
      if (typeof type === 'undefined' || !type || !reactFlowInstance) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      onAddNode({
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label: label || 'New Node' },
      });
    },
    [reactFlowInstance, onAddNode],
  );

  return (
    <div className="flex-1 relative perspective-grid z-20" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        className="bg-transparent"
        nodesDraggable={!isLocked}
        nodesConnectable={!isLocked}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          color="rgba(0, 240, 255, 0.3)"
          variant="dots"
          gap={40}
          size={2}
          style={{ opacity: 0.2 }}
        />
      </ReactFlow>

      <Toolbar
        onZoomIn={() => zoomIn({ duration: 300 })}
        onZoomOut={() => zoomOut({ duration: 300 })}
        onFitView={() => fitView({ duration: 300, padding: 0.2 })}
        isLocked={isLocked}
        onToggleLock={() => setIsLocked((prev) => !prev)}
      />

      {syncErrors.length > 0 && (
        <div className="absolute top-6 left-8 z-10">
          <div
            className="glass-panel rounded-lg px-4 py-2 border border-orange-500/50"
            style={{ boxShadow: '0 0 30px rgba(255, 100, 0, 0.3)' }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="font-display text-xs text-orange-400 tracking-wider">
                {syncErrors.length} 个验证错误
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Canvas;
