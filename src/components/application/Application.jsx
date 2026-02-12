import { useState } from 'react';
import { Search, Plus, LayoutGrid, MoreHorizontal, Database } from 'lucide-react';

/**
 * ApplicationCard - 应用卡片组件
 */
const ApplicationCard = ({ icon, title, description, isCreateNew, onCreate, onClick }) => {
  if (isCreateNew) {
    return (
      <div
        onClick={onCreate}
        className="group relative h-[150px] rounded-lg min-w-[300px] w-[300px] border border-dashed border-cyan-500/40
          bg-slate-800/50 backdrop-blur-xl
          flex flex-col items-center justify-center gap-3
          cursor-pointer transition-all duration-300
          hover:border-cyan-400/70 hover:bg-slate-800/70
          shadow-[0_0_20px_rgba(0,240,255,0.15)] hover:shadow-[0_0_35px_rgba(0,240,255,0.3)]"
      >
        <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center
          group-hover:bg-cyan-500/30 group-hover:scale-110 transition-all duration-300
          shadow-[0_0_15px_rgba(0,240,255,0.2)]">
          <Plus className="w-6 h-6 text-cyan-400" />
        </div>
        <span className="text-cyan-400/90 text-sm font-medium tracking-wide">创建应用</span>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="group relative h-[150px] rounded-lg min-w-[350px] w-[350px]
        bg-slate-800/60 backdrop-blur-xl border border-cyan-500/30
        flex items-center justify-between p-5 cursor-pointer
        transition-all duration-300
        hover:border-cyan-400/60 hover:bg-slate-800/80
        shadow-[0_0_20px_rgba(0,240,255,0.15)] hover:shadow-[0_0_35px_rgba(0,240,255,0.3)]"
    >
      {/* 四角装饰 */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400/70 rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400/70 rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400/70 rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400/70 rounded-br-lg" />

      {/* 顶部图标和更多按钮 */}
      <div className="flex flex-row items-center gap-4 min-w-0 w-full">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600
          shrink-0 flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.4)]
          group-hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] transition-all duration-300">
          <LayoutGrid className="w-6 h-6 text-white" />
        </div>

        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-white mb-1 truncate">{title}</h3>
          <p className="text-sm text-cyan-400/70 truncate">{description}</p>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          console.log('更多操作');
        }}
        className="p-2 rounded-lg hover:bg-cyan-500/20 text-cyan-400/60 hover:text-cyan-400 transition-colors shrink-0"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>

      {/* 底部发光效果 */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent
        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

/**
 * Navbar - 顶部导航栏
 */
const Navbar = ({ userName, onLogout, onNavigateToKnowledgeBase, currentPage }) => {
  return (
    <nav className="h-16 border-b border-cyan-500/20 bg-slate-950/50 backdrop-blur-xl
      flex items-center justify-between px-8">
      {/* Logo */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 
            flex items-center justify-center">
            <Database className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">OpenSPG</span>
        </div>
        
        {/* 导航标签 */}
        <div className="flex items-center gap-6">
          <button 
            onClick={onNavigateToKnowledgeBase}
            className={`pb-5 pt-5 transition-colors ${
              currentPage === 'knowledge-base' 
                ? 'text-cyan-400 border-b-2 border-cyan-400' 
                : 'text-cyan-400/60 hover:text-cyan-400'
            }`}
          >
            知识库
          </button>
          <button 
            className={`pb-5 pt-5 transition-colors ${
              currentPage === 'application' 
                ? 'text-cyan-400 border-b-2 border-cyan-400' 
                : 'text-cyan-400/60 hover:text-cyan-400'
            }`}
          >
            应用
          </button>
        </div>
      </div>

      {/* 右侧菜单 */}
      <div className="flex items-center gap-6">
        <button className="text-cyan-400/70 hover:text-cyan-400 text-sm transition-colors">
          教程
        </button>
        <button className="text-cyan-400/70 hover:text-cyan-400 text-sm transition-colors">
          官网
        </button>
        <button className="text-cyan-400/70 hover:text-cyan-400 text-sm transition-colors">
          English
        </button>
        
        {/* 用户头像 */}
        <div className="flex items-center gap-3 pl-6 border-l border-cyan-500/20">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/30 to-purple-500/30 
            border border-cyan-500/30 flex items-center justify-center">
            <span className="text-cyan-400 text-sm font-medium">
              {userName?.slice(0, 2)?.toUpperCase() || 'OS'}
            </span>
          </div>
          <span className="text-cyan-400/80 text-sm">{userName || 'openspg'}</span>
          <button 
            onClick={onLogout}
            className="text-cyan-400/50 hover:text-cyan-400 text-sm ml-2 transition-colors"
          >
            退出
          </button>
        </div>
      </div>
    </nav>
  );
};

/**
 * Application - 应用页面
 */
const Application = ({ userName, onLogout, onNavigateToKnowledgeBase, onCreateApp, onEnterApp }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // 模拟应用数据
  const applications = [
    {
      id: 1,
      title: '年报分析问答',
      description: '基于年报数据的智能问答系统'
    },
    {
      id: 2,
      title: '东富龙财务问答',
      description: '针对东富龙财务报表的深度解析'
    },
  ];

  const handleCreateApp = () => {
    onCreateApp();
  };

  const handleEnterApp = (id) => {
    onEnterApp(id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden selection:bg-cyan-500/30 noise-overlay vignette">
      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 scanlines" />

      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* 导航栏 */}
      <Navbar 
        userName={userName} 
        onLogout={onLogout} 
        onNavigateToKnowledgeBase={onNavigateToKnowledgeBase}
        currentPage="application"
      />

      {/* 主内容区 */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 py-8">
        {/* 标题和搜索区 */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">应用列表</h1>
          
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400/50" />
            <input
              type="text"
              placeholder="输入应用名称"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 rounded-lg 
                bg-slate-900/50 border border-cyan-500/20
                text-cyan-100 placeholder-cyan-400/40
                focus:outline-none focus:border-cyan-400/50 focus:shadow-[0_0_15px_rgba(0,240,255,0.1)]
                transition-all duration-200"
            />
          </div>
        </div>

        {/* 应用卡片网格 */}
        <div className="flex gap-6 overflow-x-auto pb-4 justify-center">
          {/* 创建新应用卡片 */}
          <ApplicationCard 
            isCreateNew={true} 
            onCreate={handleCreateApp}
          />
          
          {/* 应用卡片列表 */}
          {applications.map((app) => (
            <ApplicationCard
              key={app.id}
              title={app.title}
              description={app.description}
              onClick={() => handleEnterApp(app.id)}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Application;


