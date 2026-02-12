import { useState } from 'react';
import Login from './components/auth/Login';
import KnowledgeBase from './components/knowledge-base/KnowledgeBase';
import Application from './components/application/Application';
import SchemaEditor from './components/schema-editor/SchemaEditor';

/**
 * App - 应用入口组件
 * 管理登录状态和页面路由
 * 流程: 登录页 -> 知识库首页/应用页 -> Schema编辑器
 */
function App() {
  // 登录状态
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // 当前页面状态: 'knowledge-base' | 'application' | 'schema-editor'
  const [currentPage, setCurrentPage] = useState('knowledge-base');
  // 用户信息
  const [userName, setUserName] = useState('openspg');

  // 处理登录成功
  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('knowledge-base');
  };

  // 处理退出登录
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('knowledge-base');
  };

  // 导航到知识库
  const handleNavigateToKnowledgeBase = () => {
    setCurrentPage('knowledge-base');
  };

  // 导航到应用页
  const handleNavigateToApplication = () => {
    setCurrentPage('application');
  };

  // 进入 Schema 编辑器
  const handleEnterSchema = () => {
    setCurrentPage('schema-editor');
  };

  // 创建新应用
  const handleCreateApp = () => {
    // 创建应用后进入 Schema 编辑器
    setCurrentPage('schema-editor');
  };

  // 进入已有应用
  const handleEnterApp = (appId) => {
    console.log('进入应用:', appId);
    setCurrentPage('schema-editor');
  };

  // 如果未登录，显示登录页面
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // 根据当前页面状态渲染对应组件
  switch (currentPage) {
    case 'knowledge-base':
      return (
        <KnowledgeBase
          userName={userName}
          onLogout={handleLogout}
          onEnterSchema={handleEnterSchema}
          onNavigateToApplication={handleNavigateToApplication}
        />
      );

    case 'application':
      return (
        <Application
          userName={userName}
          onLogout={handleLogout}
          onNavigateToKnowledgeBase={handleNavigateToKnowledgeBase}
          onCreateApp={handleCreateApp}
          onEnterApp={handleEnterApp}
        />
      );

    case 'schema-editor':
      return (
        <div className="relative">
          {/* 返回按钮 */}
          <button
            onClick={handleNavigateToKnowledgeBase}
            className="fixed top-4 left-4 z-[60] px-4 py-2 rounded-lg
              bg-slate-900/80 backdrop-blur-xl border border-cyan-500/30
              text-cyan-400 text-sm font-medium
              hover:bg-cyan-950/50 hover:border-cyan-400/50
              transition-all duration-200 shadow-[0_0_20px_rgba(0,240,255,0.1)]"
          >
            ← 返回知识库
          </button>
          <SchemaEditor />
        </div>
      );

    default:
      return (
        <KnowledgeBase
          userName={userName}
          onLogout={handleLogout}
          onEnterSchema={handleEnterSchema}
          onNavigateToApplication={handleNavigateToApplication}
        />
      );
  }
}

export default App;
