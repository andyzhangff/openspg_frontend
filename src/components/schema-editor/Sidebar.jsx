import { Box, Cpu, Share2, CalendarDays, Zap, ChevronLeft, ChevronRight } from 'lucide-react';

const SidebarButton = ({ label, icon: Icon, onDragStart, type }) => (
  <div
    draggable
    onDragStart={(e) => onDragStart(e, type, label)}
    className="group relative w-full min-h-[112px] cursor-pointer"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
    <div
      className="relative glass-panel rounded-lg group-hover:border-cyan-400/60 transition-all duration-300
      shadow-[0_0_15px_rgba(0,240,255,0.1)] group-hover:shadow-[0_0_25px_rgba(0,240,255,0.3)] overflow-hidden
      min-h-[112px]"
    >
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400/70 rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400/70 rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400/70 rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400/70 rounded-br-lg" />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent h-full w-full animate-[shine_2s_ease-in-out_infinite]" />
      </div>
      <div className="relative flex flex-col items-center justify-center gap-2 py-6">
        <div
          className="relative p-3 rounded-xl bg-slate-900/60 border border-cyan-500/30
          group-hover:border-cyan-400/60 group-hover:bg-cyan-950/40
          group-hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all duration-300
          group-hover:scale-110"
        >
          <Icon className="w-7 h-7 text-cyan-300 group-hover:text-cyan-200 transition-colors" />
        </div>
        <span className="font-display text-white/90 text-sm tracking-[0.2em] uppercase group-hover:text-white transition-colors font-semibold">
          {label}
        </span>
      </div>
    </div>
  </div>
);

const Sidebar = ({ onDragStart, isCollapsed = false, onToggleCollapse }) => {
  const components = [
    { label: 'Concept', icon: Box, type: 'custom' },
    { label: 'Entity', icon: Cpu, type: 'custom' },
    { label: 'Relation', icon: Share2, type: 'custom' },
    { label: 'Event', icon: CalendarDays, type: 'custom' },
  ];

  return (
    <div
      className={`glass-panel border-r border-cyan-500/30 flex flex-col relative z-20
      shadow-[5px_0_40px_rgba(0,0,0,0.5)] transition-all duration-300 ${isCollapsed ? 'w-[56px]' : 'w-[260px]'}`}
    >
      <button
        type="button"
        onClick={onToggleCollapse}
        className="absolute -right-3 top-6 z-30 h-6 w-6 rounded-full border border-cyan-400/60 bg-slate-950 text-cyan-300 hover:text-cyan-200 hover:border-cyan-300 transition-all flex items-center justify-center"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      <div className="h-16 flex items-center px-4 border-b border-cyan-500/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-transparent" />
        <Zap className="w-5 h-5 text-cyan-400 mr-2 shrink-0" />
        {!isCollapsed && (
          <h2 className="font-display text-lg font-bold text-white tracking-widest uppercase">
            Schema<span className="text-cyan-400">.</span>组件
          </h2>
        )}
      </div>

      {!isCollapsed && (
        <>
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
            <div className="text-xs text-white/40 font-display tracking-widest uppercase mb-4 ml-1">拖拽添加</div>
            <div className="flex flex-col gap-8">
              {components.map((comp) => (
                <SidebarButton
                  key={comp.label}
                  label={comp.label}
                  icon={comp.icon}
                  type={comp.type}
                  onDragStart={onDragStart}
                />
              ))}
            </div>
          </div>
          <div className="absolute left-0 bottom-32 w-1 h-48 bg-gradient-to-b from-cyan-500/0 via-cyan-500/60 to-cyan-500/0" />
          <div className="absolute right-0 top-32 w-1 h-48 bg-gradient-to-t from-purple-500/0 via-purple-500/60 to-purple-500/0" />
          <div className="p-4 border-t border-cyan-500/20">
            <div className="text-[10px] text-white/30 font-mono text-center tracking-widest">V 2.0.1 // SYSTEM READY</div>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
