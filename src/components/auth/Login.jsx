import { useState } from 'react';
import { Network, User, Lock, Zap, Shield, Cpu } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const canSubmit = account.trim() && password.trim() && !isLoading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    
    console.log('登录中...', { account, password });
    setIsLoading(true);
    
    // 模拟登录延迟
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    console.log('登录成功，跳转中...');
    onLogin();
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[var(--dark-bg)] text-white overflow-hidden relative noise-overlay vignette">
      {/* 扫描线效果 */}
      <div className="fixed inset-0 pointer-events-none z-50 scanlines" />
      
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <header className="h-20 border-b border-cyan-500/20 bg-black/20 backdrop-blur-sm relative z-10">
        <div className="max-w-[1200px] h-full mx-auto px-6 flex items-center gap-4">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg blur opacity-50" />
            <div className="relative h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.4)]">
              <Network className="w-5 h-5 text-white" />
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-2xl font-bold font-display tracking-wider text-white">
              OpenSPG<span className="text-cyan-400">.</span>
            </span>
            <span className="text-[10px] text-cyan-400/60 font-mono tracking-[0.3em] uppercase">
              Semantic Enhanced Graph
            </span>
          </div>
          
          <div className="ml-auto flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            <span className="text-xs text-white/50 font-mono">SYSTEM ONLINE</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-[1200px] mx-auto px-6 py-12 flex justify-center items-center min-h-[calc(100vh-80px)]">
        <div className="relative w-full max-w-[480px]">
          {/* 外发光 */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-50" />
          
          {/* 卡片主体 */}
          <div className="relative glass-panel rounded-2xl border border-cyan-500/30 p-10 shadow-[0_0_50px_rgba(0,240,255,0.1)]">
            
            {/* 四角装饰 */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-400/50 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-400/50 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-400/50 rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-400/50 rounded-br-2xl" />
            
            {/* 标题区域 */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 mb-4 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
                <Shield className="w-8 h-8 text-cyan-400" />
              </div>
              <h1 className="text-3xl font-bold font-display tracking-wider text-white mb-2">
                身份验证
              </h1>
              <p className="text-sm text-white/50 font-mono">
                AUTHENTICATION REQUIRED
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* 账号输入 */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-cyan-400/80 font-display tracking-wider">
                  登录名 <span className="text-white/30">/ USERNAME</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400/60" />
                  <input
                    type="text"
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    placeholder="请输入登录名"
                    className="w-full h-14 rounded-xl border border-cyan-500/30 bg-black/40 pl-12 pr-4 text-[15px] text-white placeholder-white/30 outline-none transition-all duration-300 focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(0,240,255,0.3)]"
                  />
                </div>
              </div>

              {/* 密码输入 */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-cyan-400/80 font-display tracking-wider">
                  密码 <span className="text-white/30">/ PASSWORD</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400/60" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="请输入密码"
                    className="w-full h-14 rounded-xl border border-cyan-500/30 bg-black/40 pl-12 pr-4 text-[15px] text-white placeholder-white/30 outline-none transition-all duration-300 focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(0,240,255,0.3)]"
                  />
                </div>
              </div>

              {/* 登录按钮 */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={!canSubmit}
                  onClick={() => console.log('按钮被点击', canSubmit)}
                  className={`relative w-full h-14 rounded-xl text-base font-bold font-display tracking-wider transition-all duration-300 overflow-hidden ${
                    canSubmit
                      ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white hover:from-cyan-500 hover:to-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.3)]'
                      : 'bg-white/10 text-white/30 cursor-not-allowed border border-white/10'
                  }`}
                >
                  <span className="relative flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <Zap className="w-5 h-5 animate-pulse" />
                        验证中...
                      </>
                    ) : (
                      <>
                        <Cpu className="w-5 h-5" />
                        进入系统
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>

            {/* 底部信息 */}
            <div className="mt-10 pt-6 border-t border-cyan-500/20">
              <div className="flex items-center justify-between text-[10px] text-white/30 font-mono">
                <span>SECURE CONNECTION</span>
                <span>v2.0.1</span>
              </div>
            </div>
          </div>
          
          {/* 底部装饰文字 */}
          <div className="mt-8 text-center">
            <p className="text-xs text-white/20 font-mono tracking-[0.5em] uppercase">
              OpenSPG · 语义增强可编程图谱
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
