import { useCallback, useState } from 'react';
import { useSchemaStore } from '../../hooks/useSchemaStore';
import Sidebar from './Sidebar';
import Canvas from './Canvas';
import ChatBox from './ChatBox';
import SyncButton from '../SyncButton';

/**
 * SchemaEditor - Schema 编辑器主组件
 * 整合 Sidebar、Canvas、ChatBox 三个子组件
 */
const SchemaEditor = () => {
  const {
    nodes,
    edges,
    isSyncing,
    syncErrors,
    onNodesChange,
    onEdgesChange,
    addNode,
    updateSchema,
    syncToBackend,
  } = useSchemaStore();

  const [messages, setMessages] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);

  // 处理拖拽开始
  const handleDragStart = (e, nodeType, label) => {
    e.dataTransfer.setData('application/reactflow', nodeType);
    e.dataTransfer.setData('application/reactflow-label', label);
    e.dataTransfer.effectAllowed = 'move';
  };

  // 处理发送消息
  const handleSendMessage = async (text) => {
    setMessages(prev => [...prev, {
      id: Date.now() + 1,
      type: 'system',
      text: '收到指令，正在解析 Schema...'
    }]);

    try {
      const response = await fetch('http://localhost:8000/api/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      console.log('收到后端数据:', data);

      // 使用 Hook 提供的方法更新 Schema
      const { nodeCount, edgeCount } = updateSchema(data.data);

      setMessages(prev => [...prev, {
        id: Date.now() + 2,
        type: 'system',
        text: `解析完成！提取了 ${nodeCount} 个节点，${edgeCount} 条边。`
      }]);
    } catch (error) {
      console.error('Error extracting schema:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 2,
        type: 'system',
        text: `解析失败：${error.message}`
      }]);
    }
  };

  // 处理同步
  const handleSync = async () => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'system',
      text: '正在同步到后端服务器...'
    }]);

    await syncToBackend();

    if (syncErrors.length === 0) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'system',
        text: '同步成功！Schema 已保存。'
      }]);
    } else {
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'system',
        text: `同步失败：发现 ${syncErrors.length} 个验证错误，请检查标红节点。`
      }]);
    }
  };

  return (
    <div className="flex h-screen text-white overflow-hidden selection:bg-cyan-500/30 noise-overlay vignette">
      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 scanlines" />
      
      {/* Left Sidebar - 组件面板 */}
      <Sidebar
        onDragStart={handleDragStart}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      {/* Main Canvas Area - 画布区域 */}
      <Canvas
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onAddNode={addNode}
        syncErrors={syncErrors}
      />

      {/* Right Sidebar - Chat Box */}
      <ChatBox 
        onSendMessage={handleSendMessage}
        isSyncing={isSyncing}
        isCollapsed={isChatCollapsed}
        onToggleCollapse={() => setIsChatCollapsed((prev) => !prev)}
      />

      <SyncButton
        isSyncing={isSyncing}
        onClick={handleSync}
        rightOffset={isChatCollapsed ? 'calc(56px + 2rem)' : 'calc(380px + 2rem)'}
      />
    </div>
  );
};

export default SchemaEditor;
