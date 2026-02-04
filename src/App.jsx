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
  const [messages, setMessages] = useState([
    { id: 1, type: 'system', text: '欢迎使用 Schema 编辑器！' }
  ]);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [editingNodeEdit, setEditingNode] = useState(null);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const handleDragStart = (e, nodeType, label) => {
    e.dataTransfer.setData('application/reactflow', nodeType);
    e.dataTransfer.setData('application/reactflow-label', label);
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
      const label = event.dataTransfer.getData('application/reactflow-label');

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
        data: { label: label || 'New Node' },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes],
  );

  const onNodeContextMenu = useCallback(
    (event, node) => {
      event.preventDefault();
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        node,
      });
    },
    [],
  );

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handleDeleteNode = useCallback(() => {
    if (contextMenu) {
      setNodes((nds) => nds.filter((n) => n.id !== contextMenu.node.id));
      setEdges((eds) => eds.filter((e) => e.source !== contextMenu.node.id && e.target !== contextMenu.node.id));
      setContextMenu(null);
    }
  }, [contextMenu, setNodes, setEdges]);

  const handleEditNode = useCallback(() => {
    if (contextMenu) {
      setEditingNode(contextMenu.node);
      setContextMenu(null);
    }
  }, [contextMenu]);

  const handleSaveNode = useCallback(() => {
    if (editingNodeEdit) {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === editingNodeEdit.id
            ? { ...n, data: { ...n.data, label: editingNodeEdit.data.label } }
            : n
        )
      );
      setEditingNode(null);
    }
  }, [editingNodeEdit, setNodes]);

  const handleGenerateSchema = () => {
    const trimmedText = inputText.trim();
    if (trimmedText) {
      const newMessage = {
        id: Date.now(),
        type: 'user',
        text: trimmedText
      };
      setMessages((msgs) => [...msgs, newMessage]);
      setInputText('');
    }
  };

  return (
    <div className="flex h-screen bg-white" onClick={closeContextMenu}>
      <div className="w-[260px] bg-white border-r border-gray-300 flex flex-col">
        <div className="p-4 border-b border-gray-300">
          <h2 className="text-lg font-bold text-gray-800">Schema组件</h2>
        </div>
        <div className="flex-1 p-4 space-y-3">
          <div
            draggable="true"
            onDragStart={(e) => handleDragStart(e, 'custom', 'Concept')}
            className="w-full h-16 bg-black hover:bg-gray-800 rounded-lg flex items-center justify-center cursor-move transition-colors shadow-md"
          >
            <span className="text-white font-medium">Concept</span>
          </div>
          <div
            draggable="true"
            onDragStart={(e) => handleDragStart(e, 'custom', 'Entity')}
            className="w-full h-16 bg-black hover:bg-gray-800 rounded-lg flex items-center justify-center cursor-move transition-colors shadow-md"
          >
            <span className="text-white font-medium">Entity</span>
          </div>
          <div
            draggable="true"
            onDragStart={(e) => handleDragStart(e, 'custom', 'Relation')}
            className="w-full h-16 bg-black hover:bg-gray-800 rounded-lg flex items-center justify-center cursor-move transition-colors shadow-md"
          >
            <span className="text-white font-medium">Relation</span>
          </div>
          <div
            draggable="true"
            onDragStart={(e) => handleDragStart(e, 'custom', 'Event')}
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
          onNodeContextMenu={onNodeContextMenu}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background color="#e5e7eb" gap={16} />
          <Controls />
          <MiniMap />
        </ReactFlow>

        {contextMenu && (
          <div
            className="absolute bg-white border border-gray-300 rounded-lg shadow-lg py-2 min-w-[120px] z-50"
            style={{ left: contextMenu.x, top: contextMenu.y }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleEditNode}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors"
            >
              编辑
            </button>
            <button
              onClick={handleDeleteNode}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors text-red-600"
            >
              删除
            </button>
          </div>
        )}

        {editingNodeEdit && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
              className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-4">编辑节点</h3>
              <input
                type="text"
                value={editingNodeEdit.data.label}
                onChange={(e) => {
                  setEditingNode({ ...editingNodeEdit, data: { ...editingNodeEdit.data, label: e.target.value } });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black mb-4"
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setEditingNode(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveNode}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="w-[320px] bg-white border-l border-gray-300 flex flex-col">
        <div className="p-4 border-b border-gray-300">
          <h2 className="text-lg font-bold text-gray-800">聊天框</h2>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {msg.type === 'user' && (
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">我</span>
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.type === 'user'
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <p className="text-sm break-words">{msg.text}</p>
                </div>
                {msg.type === 'system' && (
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">AI</span>
                  </div>
                )}
              </div>
            ))}
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
            发送
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;