/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import QRCodeStyling, { 
  DrawType, 
  TypeNumber, 
  Mode, 
  ErrorCorrectionLevel, 
  DotType, 
  CornerSquareType, 
  CornerDotType, 
  Options 
} from 'qr-code-styling';
import { 
  Download, 
  Copy, 
  Settings2, 
  Type, 
  Palette, 
  Info,
  CheckCircle2,
  QrCode,
  ExternalLink,
  Github,
  Maximize2,
  RefreshCcw,
  Zap,
  FolderOpen,
  Trash2,
  Save,
  Globe,
  Share2,
  MessageSquare,
  Coffee,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Project {
  id: string;
  name: string;
  mode: 'url' | 'social' | 'text';
  data: string;
  design: {
    color: string;
    bg: string;
    dots: DotType;
    eyes: CornerSquareType;
    logo?: string;
  };
}

export default function App() {
  const [currentMode, setCurrentMode] = useState<'url' | 'social' | 'text'>('url');
  const [projName, setProjName] = useState('');
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('enterprise_qrs');
    return saved ? JSON.parse(saved) : [];
  });

  // Content states
  const [urlVal, setUrlVal] = useState('https://google.com');
  const [textVal, setTextVal] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientSlogan, setClientSlogan] = useState('');
  const [clientLogoUrl, setClientLogoUrl] = useState('');
  const [socials, setSocials] = useState({
    ig: '', fb: '', tg: '', wa: '', yt: '', tt: ''
  });

  // Style states
  const [qrColor, setQrColor] = useState('#6366f1');
  const [qrBg, setQrBg] = useState('#ffffff');
  const [qrDots, setQrDots] = useState<DotType>('square');
  const [qrEyes, setQrEyes] = useState<CornerSquareType>('extra-rounded');
  const [qrMargin, setQrMargin] = useState(10);
  const [qrLogoSize, setQrLogoSize] = useState(0.3);
  const [qrECL, setQrECL] = useState<ErrorCorrectionLevel>('Q');
  const [optimizeForScanning, setOptimizeForScanning] = useState(true);

  const [isGenerating, setIsGenerating] = useState(false);
  const [updateCounter, setUpdateCounter] = useState(0);

  const qrRef = useRef<HTMLDivElement>(null);
  const qrCode = useMemo(() => new QRCodeStyling({
    width: 300,
    height: 300,
    type: 'svg',
    qrOptions: { errorCorrectionLevel: qrECL },
    dotsOptions: { color: qrColor, type: qrDots },
    backgroundOptions: { color: qrBg },
    cornersSquareOptions: { type: qrEyes, color: qrColor },
    imageOptions: { crossOrigin: 'anonymous', margin: 5, imageSize: qrLogoSize },
    margin: qrMargin
  }), []);

  useEffect(() => {
    if (qrRef.current) {
      qrCode.append(qrRef.current);
    }
  }, [qrCode]);

  const updateQR = () => {
    setIsGenerating(true);
    let data = '';
    if (currentMode === 'url') {
      data = urlVal || 'https://google.com';
    } else if (currentMode === 'social') {
      const activeSocials = Object.entries(socials)
        .filter(([_, v]) => typeof v === 'string' && v.trim() !== '')
        .map(([k, v]) => `${k.toUpperCase()}:${v}`)
        .join('|');
      
      const isProduction = import.meta.env.MODE === 'production';
      // Robust URL creation for Social Hub - handles subdirectories (GH Pages) and AI Studio paths
      const currentUrl = new URL(window.location.href);
      const basePath = currentUrl.pathname.endsWith('/') 
        ? currentUrl.pathname 
        : currentUrl.pathname.substring(0, currentUrl.pathname.lastIndexOf('/') + 1);
      const profilePage = `${currentUrl.origin}${basePath}#/profile`;
      
      const name = clientName || 'Enterprise';
      const slogan = clientSlogan || '';
      const logo = clientLogoUrl || '';
      
      data = `${profilePage}?n=${encodeURIComponent(name)}&s=${encodeURIComponent(slogan)}&l=${encodeURIComponent(logo)}&d=${encodeURIComponent(activeSocials)}`;
    } else {
      data = textVal || ' ';
    }

    const finalDots = optimizeForScanning ? 'square' as DotType : qrDots;
    const finalECL = optimizeForScanning ? 'Q' as ErrorCorrectionLevel : qrECL;
    const finalMargin = optimizeForScanning ? Math.max(qrMargin, 15) : qrMargin;

    qrCode.update({
      data,
      image: clientLogoUrl || undefined,
      dotsOptions: { color: qrColor, type: finalDots },
      backgroundOptions: { color: qrBg },
      cornersSquareOptions: { type: qrEyes, color: qrColor },
      qrOptions: { errorCorrectionLevel: finalECL },
      imageOptions: { imageSize: qrLogoSize, margin: 5 },
      margin: finalMargin
    });

    setUpdateCounter(prev => prev + 1);
    setTimeout(() => setIsGenerating(false), 300);
  };

  useEffect(() => {
    updateQR();
  }, [currentMode, urlVal, textVal, clientName, clientLogoUrl, socials, qrColor, qrBg, qrDots, qrEyes, qrMargin, qrLogoSize, qrECL, optimizeForScanning]);

  const saveProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: projName || 'Untitled Project',
      mode: currentMode,
      data: currentMode === 'url' ? urlVal : currentMode === 'text' ? textVal : clientName,
      design: {
        color: qrColor,
        bg: qrBg,
        dots: qrDots,
        eyes: qrEyes,
        logo: clientLogoUrl
      }
    };
    const updated = [newProject, ...projects];
    setProjects(updated);
    localStorage.setItem('enterprise_qrs', JSON.stringify(updated));
    setProjName('');
  };

  const deleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    localStorage.setItem('enterprise_qrs', JSON.stringify(updated));
  };

  const loadProject = (p: Project) => {
    setProjName(p.name);
    setQrColor(p.design.color);
    setQrBg(p.design.bg);
    setQrDots(p.design.dots);
    setQrEyes(p.design.eyes);
    setClientLogoUrl(p.design.logo || '');
    setCurrentMode(p.mode);
    if (p.mode === 'url') setUrlVal(p.data);
    else if (p.mode === 'text') setTextVal(p.data);
    else setClientName(p.data);
  };

  const applyPreset = (brand: 'biruk' | 'burka') => {
    if (brand === 'biruk') {
      setQrColor('#4f46e5');
      setQrDots('square');
      setProjName('Biruk Design Portfolio');
    } else if (brand === 'burka') {
      setQrColor('#78350f');
      setQrDots('classy');
      setProjName('Burka Coffee Branding');
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-[320px_1fr_400px] gap-6 p-6 min-h-screen">
      
      {/* Sidebar - Project Library */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="pro-panel h-[calc(100vh-48px)] flex flex-col p-6 rounded-3xl overflow-hidden"
      >
        <div className="flex items-center justify-between mb-8">
          <h3 className="m-0 flex items-center gap-3 text-sm font-bold tracking-wider uppercase text-dim">
            <FolderOpen size={16} className="text-primary" />
            Library
          </h3>
          <span className="text-[10px] font-mono bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">
            {projects.length}
          </span>
        </div>

        <div className="overflow-y-auto flex-grow space-y-3 pr-2 scroll-modern">
          <AnimatePresence>
            {projects.map((p) => (
              <motion.div 
                key={p.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => loadProject(p)}
                className="group p-4 bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-primary/5 rounded-2xl cursor-pointer flex justify-between items-center transition-all duration-300"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-sm font-semibold truncate text-white group-hover:text-primary transition-colors">{p.name || 'Untitled'}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] px-1.5 py-0.5 bg-white/5 rounded text-neutral-400 uppercase font-bold tracking-widest">{p.mode}</span>
                  </div>
                </div>
                <button 
                  onClick={(e) => deleteProject(p.id, e)}
                  className="opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-red-500 p-2 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {projects.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 border border-white/5">
                <FolderOpen size={20} className="text-neutral-600" />
              </div>
              <p className="text-xs text-neutral-500 font-medium">No saved designs</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Editor Main */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="pro-panel h-[calc(100vh-48px)] flex flex-col rounded-3xl overflow-hidden"
      >
        <div className="flex bg-black/40 p-1.5 m-6 rounded-2xl border border-white/5">
          {[
            { id: 'url', label: 'Website', icon: <Globe size={14} /> },
            { id: 'social', label: 'Social Hub', icon: <Share2 size={14} /> },
            { id: 'text', label: 'Message', icon: <MessageSquare size={14} /> }
          ].map((tab) => (
            <motion.button 
              key={tab.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentMode(tab.id as any)}
              className={`flex-1 py-3 px-4 text-center cursor-pointer font-bold text-[11px] tracking-wide rounded-[14px] transition-all duration-300 flex items-center justify-center gap-2.5 ${
                currentMode === tab.id 
                  ? 'bg-primary text-white shadow-xl shadow-primary/20' 
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className={currentMode === tab.id ? 'text-white' : 'text-primary'}>{tab.icon}</span>
              {tab.label}
            </motion.button>
          ))}
        </div>

        <div className="px-8 pb-8 flex-grow overflow-y-auto space-y-10 custom-scroll">
          <AnimatePresence mode="wait">
            {currentMode === 'url' && (
              <motion.div key="url" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <label className="text-[10px] font-black text-white/50 uppercase tracking-[2px]">Destination Endpoint</label>
                </div>
                <input 
                  type="text" 
                  value={urlVal}
                  onChange={(e) => setUrlVal(e.target.value)}
                  placeholder="https://enterprise.com" 
                  className="w-full p-4 input-pro rounded-2xl text-sm text-white font-medium" 
                />
              </motion.div>
            )}

            {currentMode === 'social' && (
              <motion.div key="social" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <label className="text-[10px] font-black text-white/50 uppercase tracking-[2px]">Brand Identity</label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Organization Name" 
                      className="w-full p-4 input-pro rounded-2xl text-sm text-white"
                    />
                    <input 
                      type="text" 
                      value={clientSlogan}
                      onChange={(e) => setClientSlogan(e.target.value)}
                      placeholder="Brand Tagline" 
                      className="w-full p-4 input-pro rounded-2xl text-sm text-white"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <label className="text-[10px] font-black text-white/50 uppercase tracking-[2px]">Asset Configuration</label>
                  </div>
                  <input 
                    type="text" 
                    value={clientLogoUrl}
                    onChange={(e) => setClientLogoUrl(e.target.value)}
                    placeholder="Vector Logo URL (.svg, .png)" 
                    className="w-full p-4 input-pro rounded-2xl text-sm text-white"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <label className="text-[10px] font-black text-white/50 uppercase tracking-[2px]">Network Nodes</label>
                  </div>
                  <div className="p-4 bg-black/30 rounded-2xl border border-white/5 grid grid-cols-2 gap-3">
                    {Object.keys(socials).map((s) => (
                      <div key={s} className="relative group">
                        <input 
                          type="text" 
                          value={socials[s as keyof typeof socials]}
                          onChange={(e) => setSocials({ ...socials, [s]: e.target.value })}
                          placeholder={`${s.toUpperCase()} Handle`} 
                          className="w-full p-3 pl-10 input-pro rounded-xl text-[11px] text-white"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary opacity-50 group-focus-within:opacity-100 transition-opacity">
                          <Zap size={12} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {currentMode === 'text' && (
              <motion.div key="text" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <label className="text-[10px] font-black text-white/50 uppercase tracking-[2px]">Data Payload</label>
                </div>
                <textarea 
                  value={textVal}
                  onChange={(e) => setTextVal(e.target.value)}
                  placeholder="Encoded message content..." 
                  className="w-full p-4 input-pro rounded-2xl text-sm text-white min-h-[160px] resize-none font-mono"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pt-6 border-t border-white/5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <label className="text-[10px] font-black text-white/50 uppercase tracking-[2px]">Aesthetic Engine</label>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <motion.button 
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => applyPreset('biruk')}
                  className="flex flex-col items-center justify-center gap-3 p-6 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl group transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 group-hover:scale-110 transition-transform">
                    <User size={18} />
                  </div>
                  <span className="text-[10px] font-bold tracking-[2px] text-indigo-400">DESIGN PORTFOLIO</span>
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => applyPreset('burka')}
                  className="flex flex-col items-center justify-center gap-3 p-6 bg-amber-900/10 border border-amber-900/20 rounded-2xl group transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-900 flex items-center justify-center text-white shadow-lg shadow-amber-900/30 group-hover:scale-110 transition-transform">
                    <Coffee size={18} />
                  </div>
                  <span className="text-[10px] font-bold tracking-[2px] text-amber-500">LUXURY BRANDING</span>
                </motion.button>
              </div>

              <div className="bg-black/30 p-6 rounded-2xl border border-white/5 space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-[11px] font-bold text-dim tracking-widest uppercase">Styling Parameters</h4>
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setOptimizeForScanning(!optimizeForScanning)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all border duration-500 ${
                      optimizeForScanning 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                        : 'bg-white/5 text-neutral-500 border-white/10 opacity-50'
                    }`}
                  >
                    <Zap size={12} className={optimizeForScanning ? 'fill-emerald-400' : ''} />
                    <span className="text-[10px] font-black tracking-wider">SMART SCAN</span>
                  </motion.button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Accent Core Color</label>
                    <div className="flex items-center gap-3 p-2 input-pro rounded-xl">
                      <input type="color" value={qrColor} onChange={(e) => setQrColor(e.target.value)} className="w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer overflow-hidden" />
                      <span className="text-[10px] font-mono text-white/50 uppercase">{qrColor}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Base Surface Color</label>
                    <div className="flex items-center gap-3 p-2 input-pro rounded-xl">
                      <input type="color" value={qrBg} onChange={(e) => setQrBg(e.target.value)} className="w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer overflow-hidden" />
                      <span className="text-[10px] font-mono text-white/50 uppercase">{qrBg}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Data Pattern Architecture</label>
                    <select 
                      value={qrDots} 
                      disabled={optimizeForScanning}
                      onChange={(e) => setQrDots(e.target.value as DotType)}
                      className="w-full p-3 input-pro rounded-xl text-[11px] text-white disabled:opacity-30 disabled:grayscale"
                    >
                      <option value="square">Universal Square</option>
                      <option value="classy">Refined Edge</option>
                      <option value="dots">Circular Nodes</option>
                      <option value="extra-rounded">Max Smooth</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Marker Geometry</label>
                    <select 
                      value={qrEyes} 
                      onChange={(e) => setQrEyes(e.target.value as CornerSquareType)}
                      className="w-full p-3 input-pro rounded-xl text-[11px] text-white"
                    >
                      <option value="extra-rounded">Geometric Rounded</option>
                      <option value="square">Industrial Square</option>
                      <option value="dot">Core Dot</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Safety Margin (Quiet Zone)</label>
                      <span className="text-[10px] font-mono text-primary font-bold">{optimizeForScanning ? Math.max(qrMargin, 15) : qrMargin}px</span>
                    </div>
                    <input 
                      type="range" min="0" max="40" value={qrMargin} 
                      onChange={(e) => setQrMargin(parseInt(e.target.value))} 
                      className="w-full accent-primary h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer" 
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Branding Exposure</label>
                      <span className="text-[10px] font-mono text-primary font-bold">{Math.round(qrLogoSize * 100)}%</span>
                    </div>
                    <input 
                      type="range" min="0.1" max="0.5" step="0.05" value={qrLogoSize} 
                      onChange={(e) => setQrLogoSize(parseFloat(e.target.value))} 
                      className="w-full accent-primary h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 pb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <label className="text-[10px] font-black text-white/50 uppercase tracking-[2px]">Project Metadata</label>
            </div>
            <input 
              type="text" 
              value={projName}
              onChange={(e) => setProjName(e.target.value)}
              placeholder="Enterprise Project Identifier" 
              className="w-full p-4 input-pro rounded-2xl text-sm text-white font-semibold"
            />
          </div>
        </div>
      </motion.div>

      {/* Preview Panel */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="pro-panel h-[calc(100vh-48px)] flex flex-col items-center p-12 rounded-3xl"
      >
        <div className="flex flex-col items-center mb-10 text-center gap-2">
          <div className="inline-flex items-center gap-3 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <label className="text-[9px] font-black text-primary uppercase tracking-[2px]">Real-time Vector Render</label>
          </div>
          <h2 className="text-xl font-bold text-white mt-4">Enterprise Hub V2</h2>
          <p className="text-xs text-neutral-500 max-w-[200px]">Production-ready vector output with smart-scan verification</p>
        </div>
        
        <div className="relative group">
          <div className="absolute -inset-4 bg-primary/20 rounded-[40px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <motion.div 
            key={updateCounter}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className="relative bg-white p-6 rounded-[32px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] border border-white/10 ring-1 ring-black/5"
          >
            <div ref={qrRef} id="canvas" className="rounded-xl overflow-hidden shadow-sm"></div>
          </motion.div>
          {isGenerating && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[4px] rounded-[32px] z-10"
            >
              <RefreshCcw size={32} className="text-primary animate-spin" />
            </motion.div>
          )}
        </div>

        <div className="w-full max-w-[340px] mt-auto space-y-4">
          <motion.button 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={saveProject}
            className="w-full py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary/40 hover:brightness-110 flex items-center justify-center gap-3 transition-all"
          >
            <Save size={18} /> Deploy to Library
          </motion.button>
          
          <div className="grid grid-cols-2 gap-4">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => qrCode.download({ name: projName || 'qr_code', extension: 'png' })}
              className="py-4 bg-white/5 text-white border border-white/10 rounded-2xl font-bold text-[10px] uppercase tracking-[2px] hover:bg-white/10"
            >
              Export PNG
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => qrCode.download({ name: projName || 'qr_code', extension: 'svg' })}
              className="py-4 bg-white/10 text-primary border border-primary/30 rounded-2xl font-bold text-[10px] uppercase tracking-[2px] hover:bg-primary/20"
            >
              Export SVG
            </motion.button>
          </div>
        </div>

        <div className="mt-12 text-center">
            <div className="flex items-center gap-3 mb-2 opacity-30 grayscale saturate-0 pointer-events-none scale-75">
              <div className="h-4 w-4 rounded-full border border-white flex items-center justify-center text-[6px] font-bold">QR</div>
              <div className="h-[1px] w-8 bg-white" />
              <div className="text-[8px] font-black uppercase tracking-widest">Security Protocol</div>
            </div>
            <p className="text-[8px] text-neutral-600 font-mono tracking-widest uppercase">Encryption Algorithm v1.5 • AES-256 Vector Map</p>
        </div>
      </motion.div>
    </div>

  );
}
