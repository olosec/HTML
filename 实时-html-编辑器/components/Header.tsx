import React, { useState } from 'react';
import { Terminal, RotateCcw, Copy, Download, Info, X } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  onCopy: () => void;
  onExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset, onCopy, onExport }) => {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <>
      <header className="h-14 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-4 shrink-0 relative z-20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Terminal size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight text-white leading-tight">代码编辑器</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">HTML/CSS 实时预览</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={onReset}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
            title="重置代码"
          >
            <RotateCcw size={18} />
          </button>
          <button 
            onClick={onCopy}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
            title="复制代码"
          >
            <Copy size={18} />
          </button>
          <button 
            onClick={onExport}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
            title="导出 HTML 文件"
          >
            <Download size={18} />
          </button>
          <div className="w-px h-5 bg-slate-700 mx-1"></div>
          <button 
            onClick={() => setShowAbout(true)}
            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-slate-800 rounded-md transition-colors"
            title="关于"
          >
            <Info size={18} />
          </button>
        </div>
      </header>

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-900/50">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Info size={18} className="text-blue-400" />
                关于本项目
              </h3>
              <button 
                onClick={() => setShowAbout(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4 text-slate-300 text-sm leading-relaxed">
              <p className="font-medium text-slate-200 text-base">本工具为个人学习与教学项目</p>
              <div className="space-y-3 pt-2">
                <div className="flex gap-3">
                  <span className="text-slate-500 font-medium min-w-[60px]">作者</span>
                  <span className="text-white">新吉乐夫</span>
                </div>
                <div className="flex gap-3 items-center">
                  <span className="text-slate-500 font-medium min-w-[60px]">技术栈</span>
                  <div className="flex gap-1.5">
                    <span className="font-mono text-[10px] bg-orange-900/50 text-orange-200 border border-orange-800 px-1.5 py-0.5 rounded">HTML</span>
                    <span className="font-mono text-[10px] bg-blue-900/50 text-blue-200 border border-blue-800 px-1.5 py-0.5 rounded">CSS</span>
                    <span className="font-mono text-[10px] bg-yellow-900/50 text-yellow-200 border border-yellow-800 px-1.5 py-0.5 rounded">JS</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-slate-500 font-medium min-w-[60px]">用途</span>
                  <span>教学演示 / 前端练习</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-900/50 border-t border-slate-700 text-center">
              <button 
                onClick={() => setShowAbout(false)}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};