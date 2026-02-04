import { useCallback, useState, useRef } from 'react';
import ReactFlow, { Background, Controls, MiniMap, useNodesState, useEdgesState, addEdge } from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './components/CustomNode';

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes = [
  { id: '1', type: 'custom', position: { x: 250, y: 100 }, data: { label: 'Concept' } },
  { id: '2', type: 'custom', position: { x: 500, y: 200 }, data: { label: 'Entity' } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
];

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [inputText, setInputText] = useState('');
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const handleDragStart = (e, nodeType) => {
    e.dataTransfer.setData('application/reactflow', nodeType);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label: type === 'custom' ? 'New Node' : type },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes],
  );

  const handleGenerateSchema = () => {
    console.log('生成 Schema:', inputText);
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="w-[260px] bg-white border-r border-gray-300 flex flex-col">
        <div className="p-4 border-b border-gray-300">
          <h2 className="text-lg font-bold text-gray-800">Schema组件</h2>
        </div>
        <div className="flex-1 p-4 space-y-3">
          <div
            draggable="true"
            onDragStart={(e) => handleDragStart(e, 'custom')}
            className="w-full h-16 bg-black hover:bg-gray-800 rounded-lg flex items-center justify-center cursor-move transition-colors shadow-md"
          >
            <span className="text-white font-medium">Concept</span>
          </div>
          <div
            draggable="true"
            onDragStart={(e) => handleDragStart(e, 'custom')}
            className="w-full h-16 bg-black hover:bg-gray-800 rounded-lg flex items-center justify-center cursor-move transition-colors shadow-md"
          >
            <span className="text-white font-medium">Entity</span>
          </div>
          <div
            draggable="true"
            onDragStart={(e) => handleDragStart(e, 'custom')}
            className="w-full h-16 bg-black hover:bg-gray-800 rounded-lg flex items-center justify-center cursor-move transition-colors shadow-md"
          >
            <span className="text-white font-medium">Relation</span>
          </div>
          <div
            draggable="true"
            onDragStart={(e) => handleDragStart(e, 'custom')}
            className="w-full h-16 bg-black hover:bg-gray-800 rounded-lg flex items-center justify-center cursor-move transition-colors shadow-md"
          >
            <span className="text-white font-medium">Event</span>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white relative" ref={reactFlowWrapper}>
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
          fitView
        >
          <Background color="#e5e7eb" gap={16} />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>

      <div className="w-[320px] bg-white border-l border-gray-300 flex flex-col">
        <div className="p-4 border-b border-gray-300">
          <h2 className="text-lg font-bold text-gray-800">聊天框</h2>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            <div className="bg-gray-100 rounded-lg p-3">
              <p className="text-sm text-gray-700">欢迎使用 Schema 编辑器！</p>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-gray-300">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="请输入 Schema 描述..."
            className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            onClick={handleGenerateSchema}
            className="w-full mt-3 h-10 bg-black hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
          >
            生成 Schema
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;