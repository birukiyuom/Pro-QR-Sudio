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

  const qrRef = useRef<HTMLDivElement>(null);
  const qrCode = useMemo(() => new QRCodeStyling({
    width: 300,
    height: 300,
    type: 'svg',
    qrOptions: { errorCorrectionLevel: 'H' },
    dotsOptions: { color: qrColor, type: qrDots },
    backgroundOptions: { color: qrBg },
    cornersSquareOptions: { type: qrEyes, color: qrColor },
    imageOptions: { crossOrigin: 'anonymous', margin: 5, imageSize: 0.4 }
  }), []);

  useEffect(() => {
    if (qrRef.current) {
      qrCode.append(qrRef.current);
    }
  }, [qrCode]);

  const updateQR = () => {
    let data = '';
    if (currentMode === 'url') {
      data = urlVal || 'https://google.com';
    } else if (currentMode === 'social') {
      const activeSocials = Object.entries(socials)
        .filter(([_, v]) => typeof v === 'string' && v.trim() !== '')
        .map(([k, v]) => `${k.toUpperCase()}:${v}`)
        .join('|');
      
      const isProduction = import.meta.env.MODE === 'production';
      // On GH Pages, pathname might be /repo-name/
      const pathname = window.location.pathname;
      const origin = window.location.origin;
      
      // Construct the base URL including the subdirectory if it exists
      const fullBaseUrl = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
      const profilePage = `${origin}${fullBaseUrl}/#/profile`;
      
      const name = clientName || 'Enterprise';
      const slogan = clientSlogan || '';
      const logo = clientLogoUrl || '';
      
      data = `${profilePage}?n=${encodeURIComponent(name)}&s=${encodeURIComponent(slogan)}&l=${encodeURIComponent(logo)}&d=${encodeURIComponent(activeSocials)}`;
    } else {
      data = textVal || ' ';
    }

    qrCode.update({
      data,
      image: clientLogoUrl || undefined,
      dotsOptions: { color: qrColor, type: qrDots },
      backgroundOptions: { color: qrBg },
      cornersSquareOptions: { type: qrEyes, color: qrColor }
    });
  };

  useEffect(() => {
    updateQR();
  }, [currentMode, urlVal, textVal, clientName, clientLogoUrl, socials, qrColor, qrBg, qrDots, qrEyes]);

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
    alert('Design Saved Successfully!');
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
    <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-[280px_1.2fr_1fr] gap-[25px] p-5 min-h-screen">
      
      {/* Sidebar */}
      <div className="glass-panel h-[90vh] flex flex-col p-5 bg-[rgba(255,255,255,0.03)] backdrop-blur-[16px] border border-[rgba(255,255,255,0.1)] rounded-[24px] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] overflow-hidden">
        <h3 className="m-0 flex items-center gap-2 text-lg font-semibold tracking-tight">
          <FolderOpen size={20} className="text-primary-400" />
          My Designs
        </h3>
        <div className="overflow-y-auto flex-grow mt-[15px] space-y-3">
          {projects.map((p) => (
            <div 
              key={p.id} 
              onClick={() => loadProject(p)}
              className="p-[15px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[14px] cursor-pointer flex justify-between items-center transition-all hover:bg-[rgba(99,102,241,0.15)] hover:border-[#6366f1]"
            >
              <div>
                <strong className="block text-sm truncate max-w-[150px]">{p.name}</strong>
                <small className="text-[10px] text-neutral-400 uppercase tracking-wider">{p.mode}</small>
              </div>
              <button 
                onClick={(e) => deleteProject(p.id, e)}
                className="text-red-500 hover:text-red-400 p-2 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {projects.length === 0 && (
            <div className="text-center py-10 text-neutral-500 italic text-sm">
              No saved designs yet
            </div>
          )}
        </div>
      </div>

      {/* Editor Main */}
      <div className="glass-panel h-[90vh] flex flex-col bg-[rgba(255,255,255,0.03)] backdrop-blur-[16px] border border-[rgba(255,255,255,0.1)] rounded-[24px] overflow-hidden">
        <div className="flex bg-[rgba(0,0,0,0.2)] p-2 gap-2">
          {[
            { id: 'url', label: 'WEBSITE', icon: <Globe size={14} /> },
            { id: 'social', label: 'SOCIAL HUB', icon: <Share2 size={14} /> },
            { id: 'text', label: 'MESSAGE', icon: <MessageSquare size={14} /> }
          ].map((tab) => (
            <div 
              key={tab.id}
              onClick={() => setCurrentMode(tab.id as any)}
              className={`flex-1 p-[14px] text-center cursor-pointer font-bold text-[10px] tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 ${
                currentMode === tab.id 
                  ? 'bg-[#6366f1] text-white shadow-[0_4px_15px_rgba(99,102,241,0.4)]' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
            </div>
          ))}
        </div>

        <div className="p-[30px] flex-grow overflow-y-auto space-y-6">
          <AnimatePresence mode="wait">
            {currentMode === 'url' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <label className="block text-[10px] font-extrabold mb-2 text-[#6366f1] uppercase tracking-[1.5px]">Destination Link</label>
                <input 
                  type="text" 
                  value={urlVal}
                  onChange={(e) => setUrlVal(e.target.value)}
                  placeholder="https://example.com" 
                  className="w-full p-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[10px] text-sm text-white focus:outline-none focus:border-[#6366f1]" 
                />
              </motion.div>
            )}

            {currentMode === 'social' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <label className="block text-[10px] font-extrabold mb-2 text-[#6366f1] uppercase tracking-[1.5px]">Landing Page Branding</label>
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Display Name" 
                    className="w-full p-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[10px] text-sm text-white focus:outline-none focus:border-[#6366f1]"
                  />
                  <input 
                    type="text" 
                    value={clientSlogan}
                    onChange={(e) => setClientSlogan(e.target.value)}
                    placeholder="Tagline/Slogan" 
                    className="w-full p-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[10px] text-sm text-white focus:outline-none focus:border-[#6366f1]"
                  />
                </div>
                <label className="block text-[10px] font-extrabold mb-2 text-[#6366f1] uppercase tracking-[1.5px]">Logo URL (Center Image)</label>
                <input 
                  type="text" 
                  value={clientLogoUrl}
                  onChange={(e) => setClientLogoUrl(e.target.value)}
                  placeholder="https://site.com/logo.png" 
                  className="w-full p-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[10px] text-sm text-white focus:outline-none focus:border-[#6366f1]"
                />

                <label className="block text-[10px] font-extrabold mb-2 text-[#6366f1] uppercase tracking-[1.5px]">Social Connections</label>
                <div className="max-h-[250px] overflow-y-auto p-4 bg-[rgba(0,0,0,0.2)] rounded-[12px] grid grid-cols-2 gap-2">
                  {Object.keys(socials).map((s) => (
                    <input 
                      key={s}
                      type="text" 
                      value={socials[s as keyof typeof socials]}
                      onChange={(e) => setSocials({ ...socials, [s]: e.target.value })}
                      placeholder={`${s.toUpperCase()} Link`} 
                      className="w-full p-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[10px] text-xs text-white focus:outline-none focus:border-[#6366f1]"
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {currentMode === 'text' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <label className="block text-[10px] font-extrabold mb-2 text-[#6366f1] uppercase tracking-[1.5px]">Text Content</label>
                <textarea 
                  value={textVal}
                  onChange={(e) => setTextVal(e.target.value)}
                  placeholder="Write something..." 
                  className="w-full p-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[10px] text-sm text-white focus:outline-none focus:border-[#6366f1] min-h-[100px] resize-none"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            <label className="block text-[10px] font-extrabold mb-2 text-[#6366f1] uppercase tracking-[1.5px]">Quick Brand Presets</label>
            <div className="grid grid-cols-2 gap-[15px]">
              <button 
                onClick={() => applyPreset('biruk')}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-[#4f46e5] text-white rounded-lg text-[10px] font-bold tracking-widest uppercase transition-transform active:scale-95 shadow-lg"
              >
                <User size={14} /> BIRUK DESIGN
              </button>
              <button 
                onClick={() => applyPreset('burka')}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-[#78350f] text-white rounded-lg text-[10px] font-bold tracking-widest uppercase transition-transform active:scale-95 shadow-lg"
              >
                <Coffee size={14} /> BURKA COFFEE
              </button>
            </div>
          </div>

          <div className="bg-[rgba(255,255,255,0.03)] p-5 rounded-[18px] border border-[rgba(255,255,255,0.05)] space-y-4">
            <label className="block text-[10px] font-extrabold mb-2 text-[#6366f1] uppercase tracking-[1.5px]">QR Customization</label>
            <div className="grid grid-cols-2 gap-[15px]">
              <div>
                <label className="text-[9px] mb-1 opacity-50 block">Color</label>
                <input type="color" value={qrColor} onChange={(e) => setQrColor(e.target.value)} className="w-full h-10 p-1 bg-transparent border-none cursor-pointer" />
              </div>
              <div>
                <label className="text-[9px] mb-1 opacity-50 block">Background</label>
                <input type="color" value={qrBg} onChange={(e) => setQrBg(e.target.value)} className="w-full h-10 p-1 bg-transparent border-none cursor-pointer" />
              </div>
              <div>
                <label className="text-[9px] mb-1 opacity-50 block">Dots</label>
                <select 
                  value={qrDots} 
                  onChange={(e) => setQrDots(e.target.value as DotType)}
                  className="w-full p-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[10px] text-xs text-white"
                >
                  <option value="square">Square</option>
                  <option value="classy">Premium</option>
                  <option value="dots">Dots</option>
                  <option value="extra-rounded">Round</option>
                </select>
              </div>
              <div>
                <label className="text-[9px] mb-1 opacity-50 block">Eyes</label>
                <select 
                  value={qrEyes} 
                  onChange={(e) => setQrEyes(e.target.value as CornerSquareType)}
                  className="w-full p-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[10px] text-xs text-white"
                >
                  <option value="extra-rounded">Rounded</option>
                  <option value="square">Square</option>
                  <option value="dot">Dot</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-extrabold mb-1 text-[#6366f1] uppercase tracking-[1.5px]">Project Name</label>
            <input 
              type="text" 
              value={projName}
              onChange={(e) => setProjName(e.target.value)}
              placeholder="E.g. Business QR" 
              className="w-full p-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[10px] text-sm text-white focus:outline-none focus:border-[#6366f1]"
            />
          </div>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="glass-panel h-[90vh] flex flex-col justify-center items-center p-10 bg-[rgba(255,255,255,0.03)] backdrop-blur-[16px] border border-[rgba(255,255,255,0.1)] rounded-[24px]">
        <label className="block text-[10px] font-extrabold mb-8 text-[#6366f1] uppercase tracking-[1.5px]">Professional Preview</label>
        
        <div className="bg-white p-5 rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.6)] mb-8 transition-transform hover:scale-[1.02]">
          <div ref={qrRef} id="canvas"></div>
        </div>

        <div className="w-full max-w-[320px] space-y-4">
          <button 
            onClick={saveProject}
            className="w-full py-4 bg-[#10b981] text-white rounded-[14px] font-bold shadow-lg shadow-emerald-900/20 hover:bg-emerald-500 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Save size={18} /> Save to Studio
          </button>
          
          <div className="grid grid-cols-2 gap-[15px]">
            <button 
              onClick={() => qrCode.download({ name: projName || 'qr_code', extension: 'png' })}
              className="py-3.5 bg-[#6366f1] text-white rounded-[12px] font-bold text-xs uppercase tracking-widest hover:bg-[#4f46e5] transition-all"
            >
              PNG
            </button>
            <button 
              onClick={() => qrCode.download({ name: projName || 'qr_code', extension: 'svg' })}
              className="py-3.5 bg-[rgba(99,102,241,0.2)] text-white border border-[#6366f1] rounded-[12px] font-bold text-xs uppercase tracking-widest hover:bg-[rgba(99,102,241,0.3)] transition-all"
            >
              SVG (Vector)
            </button>
          </div>
        </div>

        <div className="mt-12 text-center">
            <p className="text-[10px] text-neutral-500 font-mono tracking-widest uppercase">Encryption Algorithm v1.5</p>
            <div className="flex justify-center gap-1 mt-2">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse delay-75"></span>
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse delay-150"></span>
            </div>
        </div>
      </div>
    </div>
  );
}
