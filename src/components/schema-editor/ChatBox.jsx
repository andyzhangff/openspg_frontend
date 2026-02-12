import { useState } from 'react';
import { Bot, User, ChevronLeft, ChevronRight } from 'lucide-react';

const ChatBox = ({ onSendMessage, isSyncing, isCollapsed = false, onToggleCollapse }) => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, type: 'system', text: '欢迎使用 Schema 编辑器！AI 助手已就绪。' },
  ]);

  const handleSend = () => {
    if (!inputText.trim()) {
      return;
    }
    const userMsg = { id: Date.now(), type: 'user', text: inputText };
    setMessages((prev) => [...prev, userMsg]);
    onSendMessage(inputText);
    setInputText('');
  };

  return (
    <div
      className={`glass-panel border-l border-cyan-500/30 flex flex-col relative z-20
      shadow-[-5px_0_40px_rgba(0,0,0,0.5)] transition-all duration-300 ${isCollapsed ? 'w-[56px]' : 'w-[380px]'}`}
    >
      <button
        type="button"
        onClick={onToggleCollapse}
        className="absolute -left-3 top-6 z-30 h-6 w-6 rounded-full border border-cyan-400/60 bg-slate-950 text-cyan-300 hover:text-cyan-200 hover:border-cyan-300 transition-all flex items-center justify-center"
      >
        {isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      <div className="h-16 flex items-center justify-between px-4 border-b border-cyan-500/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-l from-purple-500/10 via-cyan-500/10 to-transparent" />
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-cyan-400 shrink-0" />
          {!isCollapsed && (
            <h2 className="font-display text-lg font-bold text-white tracking-widest uppercase">
              Chat<span className="text-cyan-400">.</span>Box
            </h2>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#00f0ff]" />
          {!isCollapsed && <span className="text-[10px] text-white/50 font-mono">ONLINE</span>}
        </div>
      </div>

      {!isCollapsed && (
        <>
          <div className="flex-1 p-5 overflow-y-auto space-y-4 custom-scrollbar">
            {messages.map((msg, index) => (
              <div
                key={msg.id}
                className={`flex gap-3 animate-[float_0.5s_ease-out] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border
                  ${msg.type === 'user'
                    ? 'bg-gradient-to-br from-cyan-600/30 to-purple-600/30 border-cyan-400/50 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                    : 'glass-panel border-cyan-500/30'}`}
                >
                  {msg.type === 'user' ? (
                    <User size={16} className="text-white" />
                  ) : (
                    <Bot size={16} className="text-white" />
                  )}
                </div>

                <div
                  className={`p-4 rounded-xl max-w-[78%] text-sm leading-relaxed border font-body
                  ${msg.type === 'user'
                    ? 'bg-gradient-to-br from-cyan-900/30 to-purple-900/20 border-cyan-400/40 text-white rounded-tr-none'
                    : 'glass-panel border-cyan-500/20 text-white/95 rounded-tl-none'}`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-5 border-t border-cyan-500/20 bg-slate-950/30">
            <div className="flex gap-3 items-stretch">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                placeholder="输入 Schema 描述..."
                className="flex-1 h-24 bg-white rounded-xl p-4
                text-sm text-gray-900 placeholder-gray-400 resize-none font-body
                border border-cyan-400/40
                focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(0,240,255,0.3)]
                transition-all"
              />
              <button
                onClick={handleSend}
                className="px-8 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400
                text-white rounded-xl transition-all shadow-lg shadow-cyan-900/30
                hover:shadow-[0_0_20px_rgba(0,240,255,0.5)]"
              >
                发送
              </button>
            </div>

            <div className="flex justify-between items-center mt-4 text-[10px] text-white/30 font-mono tracking-wider">
              <span>SYS://{isSyncing ? 'SYNCING...' : 'READY'}</span>
              <span>ENCRYPTION: ENABLED</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBox;
