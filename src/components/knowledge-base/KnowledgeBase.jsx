import { useMemo, useState } from 'react';
import { Search, Plus, Database, BarChart3, Package, Cog, UserCircle2 } from 'lucide-react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const UiButton = ({ children, className, variant = 'default', ...props }) => {
  const variants = {
    default:
      'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white border border-cyan-400/60 hover:from-cyan-500 hover:to-cyan-400 hover:shadow-[0_0_20px_rgba(0,240,255,0.35)]',
    ghost:
      'bg-slate-900/70 text-cyan-100 border border-cyan-500/45 hover:bg-cyan-950/40 hover:text-cyan-50 hover:border-cyan-300/70 hover:shadow-[0_0_16px_rgba(0,240,255,0.2)]',
  };

  return (
    <button
      className={cn(
        'h-10 px-4 rounded-xl text-sm font-medium transition-all duration-200 font-display tracking-wider',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

const UiCard = ({ children, className, ...props }) => (
  <div
    className={cn(
      'glass-panel rounded-2xl border border-cyan-500/30 shadow-[0_0_24px_rgba(0,0,0,0.35)]',
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

const UiInput = ({ className, ...props }) => (
  <input
    className={cn(
      'h-10 w-full rounded-xl border border-cyan-500/30 bg-slate-950/60 pl-10 pr-3 text-sm text-cyan-100 placeholder-cyan-300/40 font-body',
      'focus:outline-none focus:border-cyan-400/60 focus:shadow-[0_0_16px_rgba(0,240,255,0.2)] transition-all',
      className,
    )}
    {...props}
  />
);

const UiBadge = ({ children }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs border border-cyan-400/40 bg-cyan-500/15 text-cyan-200 font-display tracking-wider">
    {children}
  </span>
);

const UiCheckbox = ({ checked, onChange, label }) => (
  <label className="inline-flex items-center gap-2 cursor-pointer select-none">
    <button
      type="button"
      aria-pressed={checked}
      onClick={onChange}
      className={cn(
        'h-4 w-4 rounded border transition-all flex items-center justify-center',
        checked ? 'bg-cyan-500 border-cyan-400' : 'bg-transparent border-cyan-500/40',
      )}
    >
      {checked && <span className="h-2 w-2 rounded-[2px] bg-white" />}
    </button>
    <span className="text-sm text-cyan-200/80 font-display tracking-wider">{label}</span>
  </label>
);

const iconMap = {
  chart: BarChart3,
  package: Package,
  cog: Cog,
};

const KNOWLEDGE_BASES = [
  { id: 1, icon: 'chart', title: '年报分析', updateTime: '2024-05-20', isPrivate: true, createdByMe: true },
  { id: 2, icon: 'package', title: '产品中心', updateTime: '2024-05-20', isPrivate: true, createdByMe: false },
  { id: 3, icon: 'cog', title: 'ERP审批', updateTime: '2024-05-20', isPrivate: true, createdByMe: true },
];

const KnowledgeBaseCard = ({ icon, title, updateTime, isPrivate, onBuild, onConfig, isCreateNew, onCreate }) => {
  if (isCreateNew) {
    return (
      <UiCard
        onClick={onCreate}
        className="group h-[280px] border-dashed border-cyan-500/40 bg-slate-900/35 cursor-pointer flex flex-col items-center justify-center gap-4 hover:border-cyan-300/70 hover:shadow-[0_0_30px_rgba(0,240,255,0.25)]"
      >
        <div className="h-16 w-16 rounded-full border border-cyan-400/50 bg-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Plus className="w-8 h-8 text-cyan-300" />
        </div>
        <span className="font-display text-sm tracking-widest text-cyan-200 uppercase">创建知识库</span>
      </UiCard>
    );
  }

  const IconComponent = iconMap[icon] || Cog;

  return (
    <UiCard className="h-[280px] p-6 flex flex-col hover:border-cyan-400/55 hover:shadow-[0_0_28px_rgba(0,240,255,0.22)] transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="h-12 w-12 rounded-xl border border-cyan-400/35 bg-gradient-to-br from-cyan-500/25 to-purple-500/20 flex items-center justify-center">
          <IconComponent className="w-6 h-6 text-cyan-300" />
        </div>
        {isPrivate && <UiBadge>私有</UiBadge>}
      </div>

      <h3 className="text-lg font-display text-white tracking-widest">{title}</h3>
      <p className="text-sm text-cyan-200/65 mt-2 font-body">最后更新: {updateTime}</p>

      <div className="mt-auto flex gap-3">
        <UiButton className="flex-1" onClick={onBuild}>
          知识库构建
        </UiButton>
        <UiButton className="flex-1" variant="ghost" onClick={onConfig}>
          知识库配置
        </UiButton>
      </div>
    </UiCard>
  );
};

const Navbar = ({ userName, onLogout, onNavigateToApplication, currentPage }) => {
  return (
    <header className="h-16 px-6 border-b border-cyan-500/30 glass-panel flex items-center justify-between shrink-0">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Database className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-white tracking-wider">OpenSPG</span>
        </div>
        <nav className="flex items-center gap-6 text-sm font-display tracking-wider">
          <span className={`h-16 flex items-center border-b-2 transition-colors cursor-pointer ${
            currentPage === 'knowledge-base' 
              ? 'text-cyan-300 border-cyan-400' 
              : 'text-cyan-300/60 border-transparent hover:text-cyan-300'
          }`}>
            知识库
          </span>
          <span 
            onClick={onNavigateToApplication}
            className={`h-16 flex items-center border-b-2 transition-colors cursor-pointer ${
              currentPage === 'application' 
                ? 'text-cyan-300 border-cyan-400' 
                : 'text-cyan-300/60 border-transparent hover:text-cyan-300'
            }`}
          >
            应用
          </span>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-cyan-300/70 hover:text-cyan-200 text-sm font-display tracking-wider">教程</button>
        <button className="text-cyan-300/70 hover:text-cyan-200 text-sm font-display tracking-wider">官网</button>
        <button className="text-cyan-300/70 hover:text-cyan-200 text-sm font-display tracking-wider">English</button>
        <div className="h-8 w-px bg-cyan-500/30 mx-1" />
        <div className="flex items-center gap-2">
          <UserCircle2 className="w-5 h-5 text-cyan-300" />
          <span className="text-cyan-100 text-sm font-display tracking-wider">{userName || 'openspg'}</span>
        </div>
        <UiButton variant="ghost" className="h-8 px-3" onClick={onLogout}>
          退出
        </UiButton>
      </div>
    </header>
  );
};

const KnowledgeBase = ({ onEnterSchema, onLogout, userName, onNavigateToApplication }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMyCreated, setShowMyCreated] = useState(false);

  const filteredKnowledgeBases = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();
    return KNOWLEDGE_BASES.filter((kb) => {
      if (showMyCreated && !kb.createdByMe) {
        return false;
      }
      if (!keyword) {
        return true;
      }
      return kb.title.toLowerCase().includes(keyword);
    });
  }, [searchQuery, showMyCreated]);

  const handleCreateKnowledgeBase = () => {
    onEnterSchema();
  };

  const handleBuildKnowledgeBase = () => {
    onEnterSchema();
  };

  const handleConfigKnowledgeBase = (id) => {
    console.log('配置知识库:', id);
  };

  return (
    <div className="h-screen text-white overflow-hidden selection:bg-cyan-500/30 noise-overlay vignette perspective-grid">
      <div className="fixed inset-0 pointer-events-none z-50 scanlines" />

      <div className="relative z-10 h-full flex flex-col">
        <Navbar 
          userName={userName} 
          onLogout={onLogout} 
          onNavigateToApplication={onNavigateToApplication}
          currentPage="knowledge-base"
        />

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-[1280px] mx-auto px-8 py-8">
            <section className="glass-panel rounded-2xl border border-cyan-500/30 p-6 mb-6">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="font-display text-2xl text-white tracking-[0.2em] uppercase">知识库列表</h1>
                  <p className="text-cyan-200/65 mt-2 text-sm font-body">使用 Schema Editor 风格统一管理知识库</p>
                </div>
                <div className="flex items-center gap-4">
                  <UiCheckbox
                    checked={showMyCreated}
                    onChange={() => setShowMyCreated((prev) => !prev)}
                    label="我创建的"
                  />
                  <div className="relative w-72">
                    <Search className="w-4 h-4 text-cyan-300/60 absolute left-3 top-1/2 -translate-y-1/2" />
                    <UiInput
                      placeholder="输入项目名称"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="relative">
              <div className="pointer-events-none absolute left-0 top-0 bottom-3 z-10 w-10 bg-gradient-to-r from-[#0a0a0f] to-transparent" />
              <div className="pointer-events-none absolute right-0 top-0 bottom-3 z-10 w-10 bg-gradient-to-l from-[#0a0a0f] to-transparent" />
              <div
                className="overflow-x-auto overflow-y-hidden custom-scrollbar pb-3"
                style={{ scrollbarGutter: 'stable both-edges' }}
              >
                <div className="flex gap-6 min-w-max">
                  <div className="w-[290px] shrink-0">
                    <KnowledgeBaseCard isCreateNew onCreate={handleCreateKnowledgeBase} />
                  </div>
                  {filteredKnowledgeBases.map((kb) => (
                    <div key={kb.id} className="w-[290px] shrink-0">
                      <KnowledgeBaseCard
                        icon={kb.icon}
                        title={kb.title}
                        updateTime={kb.updateTime}
                        isPrivate={kb.isPrivate}
                        onBuild={handleBuildKnowledgeBase}
                        onConfig={() => handleConfigKnowledgeBase(kb.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default KnowledgeBase;
