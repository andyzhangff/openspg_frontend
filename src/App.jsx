import { useCallback, useState, useRef } from 'react';
import ReactFlow, {
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ConnectionLineType,
  MarkerType,
  useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  Box,
  Cpu,
  Share2,
  CalendarDays,
  Send,
  Bot,
  User,
  Plus,
  Minus,
  Maximize,
  Lock,
  Unlock,
  Eye,
  Zap,
} from 'lucide-react';

import CustomNode from './components/CustomNode';
import MiniMapPanel from './components/MiniMapPanel';
import EnergyEdge from './components/EnergyEdge';

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  energy: EnergyEdge,
};

const initialNodes = [
  { id: '1', type: 'custom', position: { x: 450, y: 180 }, data: { label: 'Concept' } },
  { id: '2', type: 'custom', position: { x: 450, y: 420 }, data: { label: 'Entity' } },
];

const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'energy',
    animated: true,
  },
];

const SidebarButton = ({ label, icon: Icon, onDragStart, type }) => (
  <div
    draggable
    onDragStart={(e) => onDragStart(e, type, label)}
    className="group relative w-full h-28 mb-5 cursor-pointer"
  >
    {/* Animated border glow */}
    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
    
    {/* Main container with glass effect */}
    <div className="absolute inset-0 glass-panel rounded-lg group-hover:border-cyan-400/60 transition-all duration-300 
      shadow-[0_0_15px_rgba(0,240,255,0.1)] group-hover:shadow-[0_0_25px_rgba(0,240,255,0.3)] overflow-hidden">
      
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400/70 rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400/70 rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400/70 rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400/70 rounded-br-lg" />
      
      {/* Scanline animation */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent h-full w-full animate-[shine_2s_ease-in-out_infinite]" />
      </div>
    </div>

    {/* Content */}
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
      <div className="relative p-3 rounded-xl bg-slate-900/60 border border-cyan-500/30 
        group-hover:border-cyan-400/60 group-hover:bg-cyan-950/40
        group-hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all duration-300
        group-hover:scale-110">
        <Icon className="w-7 h-7 text-cyan-300 group-hover:text-cyan-200 transition-colors" />
      </div>
      <span className="font-display text-white/90 text-sm tracking-[0.2em] uppercase group-hover:text-white transition-colors font-semibold">
        {label}
      </span>
    </div>
  </div>
);

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, type: 'system', text: '欢迎使用 Schema 编辑器！AI 助手已就绪。' }
  ]);
  const [isLocked, setIsLocked] = useState(false);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'energy',
            animated: true,
          },
          eds
        )
      ),
    [setEdges]
  );

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
    [reactFlowInstance, setNodes]
  );

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMsg = { id: Date.now(), type: 'user', text: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'system',
        text: '收到指令，正在解析 Schema...'
      }]);
    }, 1000);
  };

  const handleZoomIn = () => zoomIn({ duration: 300 });
  const handleZoomOut = () => zoomOut({ duration: 300 });
  const handleFitView = () => fitView({ duration: 300, padding: 0.2 });

  return (
    <div className="flex h-screen text-white overflow-hidden selection:bg-cyan-500/30 noise-overlay vignette">
      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 scanlines" />
      
      {/* Left Sidebar */}
      <div className="w-[260px] glass-panel border-r border-cyan-500/30 flex flex-col relative z-20 
        shadow-[5px_0_40px_rgba(0,0,0,0.5)]">
        {/* Header with gradient */}
        <div className="h-16 flex items-center px-6 border-b border-cyan-500/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-transparent" />
          <Zap className="w-5 h-5 text-cyan-400 mr-3" />
          <h2 className="font-display text-lg font-bold text-white tracking-widest uppercase">
            Schema<span className="text-cyan-400">.</span>组件
          </h2>
        </div>

        {/* Components */}
        <div className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="text-xs text-white/40 font-display tracking-widest uppercase mb-4 ml-1">拖拽添加</div>
          <SidebarButton label="Concept" icon={Box} type="custom" onDragStart={handleDragStart} />
          <SidebarButton label="Entity" icon={Cpu} type="custom" onDragStart={handleDragStart} />
          <SidebarButton label="Relation" icon={Share2} type="custom" onDragStart={handleDragStart} />
          <SidebarButton label="Event" icon={CalendarDays} type="custom" onDragStart={handleDragStart} />
        </div>

        {/* Decorative elements */}
        <div className="absolute left-0 bottom-32 w-1 h-48 bg-gradient-to-b from-cyan-500/0 via-cyan-500/60 to-cyan-500/0" />
        <div className="absolute right-0 top-32 w-1 h-48 bg-gradient-to-t from-purple-500/0 via-purple-500/60 to-purple-500/0" />
        
        {/* Version info */}
        <div className="p-4 border-t border-cyan-500/20">
          <div className="text-[10px] text-white/30 font-mono text-center tracking-widest">
            V 2.0.1 // SYSTEM READY
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 relative perspective-grid" ref={reactFlowWrapper}>
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
        >
          <Background
            color="rgba(0, 240, 255, 0.3)"
            variant="dots"
            gap={40}
            size={2}
            style={{ 
              opacity: 0.2,
            }}
          />
        </ReactFlow>

        {/* Bottom Toolbar */}
        <div className="absolute bottom-8 left-8 flex items-center gap-4 z-10">
          {/* Zoom Controls */}
          <div className="flex items-center glass-panel rounded-xl overflow-hidden
            shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <button onClick={handleZoomIn} className="p-3 hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <Plus className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-cyan-500/30" />
            <button onClick={handleZoomOut} className="p-3 hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <Minus className="w-5 h-5" />
            </button>
          </div>

          {/* Fit View */}
          <button 
            onClick={handleFitView}
            className="p-3 glass-panel rounded-xl hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 transition-all
              shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]"
          >
            <Maximize className="w-5 h-5" />
          </button>

          {/* Lock/Unlock */}
          <button 
            onClick={() => setIsLocked(!isLocked)}
            className={`p-3 rounded-xl transition-all shadow-[0_0_30px_rgba(0,0,0,0.5)]
              ${isLocked 
                ? 'bg-cyan-500/30 border border-cyan-400/60 text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.3)]' 
                : 'glass-panel border border-cyan-500/30 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]'
              }`}
          >
            {isLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
          </button>

          {/* View toggle */}
          <button 
            className="p-3 glass-panel rounded-xl hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 transition-all
              shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>

        {/* Mini Map Panel */}
        <MiniMapPanel nodes={nodes} />
      </div>

      {/* Right Sidebar - Chat Box */}
      <div className="w-[380px] glass-panel border-l border-cyan-500/30 flex flex-col relative z-20 
        shadow-[-5px_0_40px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-cyan-500/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-l from-purple-500/10 via-cyan-500/10 to-transparent" />
          <div className="flex items-center gap-3">
            <Bot className="w-5 h-5 text-cyan-400" />
            <h2 className="font-display text-lg font-bold text-white tracking-widest uppercase">
              Chat<span className="text-cyan-400">.</span>Box
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#00f0ff]" />
            <span className="text-[10px] text-white/50 font-mono">ONLINE</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 custom-scrollbar">
          {messages.map((msg, index) => (
            <div 
              key={msg.id} 
              className={`flex gap-3 animate-[float_0.5s_ease-out] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border 
                ${msg.type === 'user' 
                  ? 'bg-gradient-to-br from-cyan-600/30 to-purple-600/30 border-cyan-400/50 shadow-[0_0_15px_rgba(0,240,255,0.2)]' 
                  : 'glass-panel border-cyan-500/30'}`}>
                {msg.type === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
              </div>

              <div className={`p-4 rounded-xl max-w-[78%] text-sm leading-relaxed border font-body
                ${msg.type === 'user'
                  ? 'bg-gradient-to-br from-cyan-900/30 to-purple-900/20 border-cyan-400/40 text-white rounded-tr-none'
                  : 'glass-panel border-cyan-500/20 text-white/95 rounded-tl-none'}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-5 border-t border-cyan-500/20 bg-slate-950/30">
          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
              placeholder="输入 Schema 描述..."
              className="w-full h-24 glass-panel rounded-xl p-4 pr-14 
                text-sm text-white placeholder-white/30 resize-none font-body
                focus:outline-none focus:border-cyan-400/60 focus:shadow-[0_0_20px_rgba(0,240,255,0.15)] 
                transition-all"
            />
            <button
              onClick={handleSendMessage}
              className="absolute bottom-3 right-3 p-2.5 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 
                text-white rounded-lg transition-all shadow-lg shadow-cyan-900/30 
                hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] group"
            >
              <Send size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Status bar */}
          <div className="flex justify-between items-center mt-4 text-[10px] text-white/30 font-mono tracking-wider">
            <span>SYS://READY</span>
            <span>ENCRYPTION: ENABLED</span>
          </div>
          
          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            className="w-full mt-4 py-3 bg-gradient-to-r from-cyan-600/20 via-cyan-500/20 to-purple-500/20 
              border border-cyan-400/40 rounded-xl text-white text-sm font-display font-semibold tracking-widest uppercase
              hover:from-cyan-600/30 hover:via-cyan-500/30 hover:to-purple-500/30 hover:border-cyan-300/60
              hover:shadow-[0_0_25px_rgba(0,240,255,0.3)] transition-all duration-300
              flex items-center justify-center gap-2 group relative overflow-hidden"
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative">发送</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
