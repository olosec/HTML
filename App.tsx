import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from './components/Layout';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { useDebounce } from './hooks/useDebounce';
import { Header } from './components/Header';
import { Code, Eye, Monitor, Smartphone, FileCode, Palette } from 'lucide-react';

const DEFAULT_HTML = `<html>
<head>

</head>
<body>

</body>
</html>`;

const DEFAULT_CSS = ``;

const TAG_REFERENCES = [
  { tag: '<html></html>', desc: 'HTML 文档的根元素' },
  { tag: '<head></head>', desc: '包含文档的元数据' },
  { tag: '<title></title>', desc: '定义网页标题' },
  { tag: '<body></body>', desc: '定义文档的主体' },
  { tag: '<h1></h1>', desc: '标题标签 (h1-h6)' },
  { tag: '<p></p>', desc: '定义段落' },
  { tag: '<img />', desc: '定义图像 (单标签)' },
  { tag: '<a></a>', desc: '定义超链接' },
  { tag: '<div></div>', desc: '块级容器布局' },
  { tag: '<span></span>', desc: '行内文本容器' },
  { tag: '<button></button>', desc: '定义按钮' },
  { tag: '<ul></ul>', desc: '无序列表' },
  { tag: '<li></li>', desc: '列表项' },
];

export default function App() {
  const [html, setHtml] = useState<string>(DEFAULT_HTML);
  const [css, setCss] = useState<string>(DEFAULT_CSS);
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'preview'>('html');
  const [editorMode, setEditorMode] = useState<'html' | 'css'>('html');
  const [isMobile, setIsMobile] = useState(false);
  
  const debouncedHtml = useDebounce(html, 500);
  const debouncedCss = useDebounce(css, 500);

  const combinedCode = useMemo(() => {
    // Inject CSS into HTML
    if (debouncedHtml.includes('</head>')) {
      return debouncedHtml.replace('</head>', `<style>${debouncedCss}</style></head>`);
    }
    return `${debouncedHtml}<style>${debouncedCss}</style>`;
  }, [debouncedHtml, debouncedCss]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleReset = () => {
    if (window.confirm('确定要清空所有代码吗？')) {
      setHtml(DEFAULT_HTML);
      setCss(DEFAULT_CSS);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(combinedCode);
    alert('完整代码已复制到剪贴板！');
  };

  const handleExport = () => {
    const blob = new Blob([combinedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-100 font-sans overflow-hidden">
      <Header onReset={handleReset} onCopy={handleCopy} onExport={handleExport} />
      
      {/* Mobile Tab Navigation */}
      <div className="md:hidden flex border-b border-slate-700 bg-slate-800">
        <button
          onClick={() => setActiveTab('html')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${
            activeTab === 'html' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400'
          }`}
        >
          <FileCode size={16} /> HTML
        </button>
        <button
          onClick={() => setActiveTab('css')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${
            activeTab === 'css' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400'
          }`}
        >
          <Palette size={16} /> CSS
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${
            activeTab === 'preview' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-400'
          }`}
        >
          <Eye size={16} /> 预览
        </button>
      </div>

      <main className="flex-1 relative flex overflow-hidden">
        {/* Editor Pane (Left Side - Desktop) */}
        <div className={`
          flex-1 flex flex-col h-full bg-editor-bg
          ${isMobile ? 'hidden' : 'flex'}
          md:border-r md:border-slate-700
          md:w-1/2 md:max-w-[50%]
        `}>
          {/* Tab Buttons */}
          <div className="flex bg-slate-800 border-b border-slate-700 select-none">
            <button
              onClick={() => setEditorMode('html')}
              className={`px-6 py-3 text-sm font-medium transition-colors border-r border-slate-700 flex items-center gap-2 focus:outline-none ${
                editorMode === 'html' 
                  ? 'bg-editor-bg text-blue-400 border-t-2 border-t-blue-400' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700 border-t-2 border-t-transparent'
              }`}
            >
              <FileCode size={14} /> HTML
            </button>
            <button
              onClick={() => setEditorMode('css')}
              className={`px-6 py-3 text-sm font-medium transition-colors border-r border-slate-700 flex items-center gap-2 focus:outline-none ${
                editorMode === 'css' 
                  ? 'bg-editor-bg text-blue-400 border-t-2 border-t-blue-400' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700 border-t-2 border-t-transparent'
              }`}
            >
              <Palette size={14} /> CSS
            </button>
            <div className="flex-1 bg-slate-800"></div>
          </div>

          {/* Editor Area */}
          <div className="flex-1 relative overflow-hidden">
             {/* Using standard hidden class to preserve state in DOM if needed, 
                 but Editor is simple enough that conditional render is also fine.
                 We use hidden to ensure fast switching without scroll jump if we want. */}
            <div className={`w-full h-full ${editorMode === 'html' ? 'block' : 'hidden'}`}>
              <Editor value={html} onChange={setHtml} />
            </div>
            <div className={`w-full h-full ${editorMode === 'css' ? 'block' : 'hidden'}`}>
              <Editor value={css} onChange={setCss} />
            </div>
          </div>

          {/* Reference Section (Always visible at bottom) */}
          <div className="h-48 md:flex flex-col bg-slate-900 text-slate-300 hidden border-t border-slate-700">
            <div className="px-4 py-2 bg-slate-800 text-xs text-slate-400 font-semibold border-b border-slate-700 flex items-center gap-2">
              <Code size={14} /> 常用标签参考
            </div>
            <div className="flex-1 overflow-y-auto p-4 text-xs font-mono">
              <div className="grid grid-cols-1 gap-2">
                {TAG_REFERENCES.map((item, index) => (
                  <div key={index} className="flex gap-2 items-baseline">
                    <span className="text-blue-400 font-bold min-w-[100px]">{item.tag}</span>
                    <span className="text-slate-400">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile View Handling for Editor Pane parts when active */}
        {/* If mobile and html tab is active, show just HTML editor part */}
        <div className={`
          flex-1 flex flex-col h-full bg-editor-bg
          ${!isMobile ? 'hidden' : (activeTab === 'html' ? 'flex' : 'hidden')}
        `}>
          <div className="bg-slate-800 px-4 py-2 text-xs text-slate-400 uppercase tracking-wider font-semibold flex justify-between items-center border-b border-slate-700">
            <span className="flex items-center gap-2"><FileCode size={14}/> HTML 编辑区</span>
          </div>
          <div className="flex-1 relative overflow-hidden">
            <Editor value={html} onChange={setHtml} />
          </div>
        </div>
        
        {/* If mobile and css tab is active, show just CSS editor part */}
        <div className={`
          flex-1 flex flex-col h-full bg-editor-bg
          ${!isMobile ? 'hidden' : (activeTab === 'css' ? 'flex' : 'hidden')}
        `}>
          <div className="bg-slate-800 px-4 py-2 text-xs text-slate-400 uppercase tracking-wider font-semibold flex justify-between items-center border-b border-slate-700">
             <span className="flex items-center gap-2"><Palette size={14}/> CSS 编辑区</span>
          </div>
          <div className="flex-1 relative overflow-hidden">
            <Editor value={css} onChange={setCss} />
          </div>
           {/* Mobile Tag Reference */}
           <div className="h-32 flex flex-col bg-slate-900 text-slate-300 border-t border-slate-700">
            <div className="px-4 py-2 bg-slate-800 text-xs text-slate-400 font-semibold border-b border-slate-700 flex items-center gap-2">
              <Code size={14} /> 常用标签
            </div>
            <div className="flex-1 overflow-y-auto p-4 text-xs font-mono">
              {TAG_REFERENCES.map((item, index) => (
                <div key={index} className="flex gap-2 mb-1">
                  <span className="text-blue-400 font-bold min-w-[90px]">{item.tag}</span>
                  <span className="text-slate-400 truncate">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Pane (Right Side / Mobile Tab) */}
        <div className={`
          flex-1 flex flex-col h-full bg-white
          ${isMobile ? (activeTab === 'preview' ? 'flex' : 'hidden') : 'flex md:w-1/2'}
        `}>
          <div className="bg-slate-100 px-4 py-2 text-xs text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 flex justify-between items-center">
            <span className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${debouncedHtml === html && debouncedCss === css ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
              浏览器预览
            </span>
            <div className="flex gap-2 text-slate-400">
               {isMobile ? <Smartphone size={14} /> : <Monitor size={14} />}
            </div>
          </div>
          <div className="flex-1 relative w-full h-full bg-checkered">
             <Preview code={combinedCode} />
          </div>
        </div>
      </main>

      <footer className="h-8 bg-slate-950 border-t border-slate-800 flex items-center justify-center text-[10px] text-slate-500 shrink-0 select-none">
        Personal Project · © 2025 XinJiLeFu
      </footer>
    </div>
  );
}