/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Instagram, 
  Facebook, 
  Send as Telegram, // Lucide uses Send for telegram-like icons often, or we can use dedicated ones
  MessageCircle, // For WhatsApp
  Youtube,
  Music, // For TikTok
  Link as LinkIcon,
  Utensils
} from 'lucide-react';

export default function Profile() {
  const [searchParams] = useSearchParams();
  const name = searchParams.get('n') || "Business Identity";
  const slogan = searchParams.get('s') || searchParams.get('slogan') || "Digital Solutions";
  const logo = searchParams.get('l') || searchParams.get('logo');
  const rawData = searchParams.get('d') || "";

  const links = React.useMemo(() => {
    if (!rawData) return [];
    // The previous implementation used different delimiters sometimes.
    // Based on the user's provided HTML script: rawData.split(' | ')
    // But based on my previous App.tsx update: .join('|')
    // I will support both just in case, but primary is '|'
    const items = rawData.includes(' | ') ? rawData.split(' | ') : rawData.split('|');
    
    return items.map(item => {
      // Logic from user HTML: item.split(': ') or item.split(':')
      const parts = item.includes(': ') ? item.split(': ') : item.split(':');
      if (parts.length < 2) return null;
      
      const label = parts[0];
      const url = parts.slice(1).join(':');
      
      return { 
        label, 
        url: url.startsWith('http') ? url : 'https://' + url 
      };
    }).filter(Boolean);
  }, [rawData]);

  const getIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('instagram')) return <Instagram size={20} />;
    if (n.includes('facebook')) return <Facebook size={20} />;
    if (n.includes('telegram')) return <Telegram size={20} />;
    if (n.includes('whatsapp')) return <MessageCircle size={20} />;
    if (n.includes('youtube')) return <Youtube size={20} />;
    if (n.includes('tiktok')) return <Music size={20} />;
    if (n.includes('menu')) return <Utensils size={20} />;
    return <LinkIcon size={20} />;
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex justify-center items-center p-5 selection:bg-indigo-500/30">
      <div 
        className="w-full max-w-[420px] bg-white/5 backdrop-blur-[25px] border border-white/10 rounded-[35px] px-6 py-12 text-center shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
      >
        <div className="w-[120px] h-[120px] mx-auto mb-6 rounded-[30px] border-3 border-indigo-500 overflow-hidden bg-white/5 shadow-[0_10px_25px_rgba(99,102,241,0.3)]">
          <img 
            src={logo || `https://via.placeholder.com/150?text=${encodeURIComponent(name.charAt(0))}`} 
            alt="Logo" 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=No+Logo';
            }}
          />
        </div>

        <h1 className="text-3xl font-extrabold text-white mb-1.5">{name}</h1>
        <p className="text-slate-400 text-sm font-medium mb-10">{slogan}</p>

        <div className="flex flex-col gap-4">
          {links.map((link, i) => (
            <a
              key={i}
              href={link!.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/5 border border-white/10 text-white p-4.5 rounded-[20px] font-bold flex items-center justify-center gap-4 transition-all hover:bg-indigo-500 hover:scale-[1.05] hover:shadow-[0_15px_30px_rgba(99,102,241,0.4)] active:scale-95"
            >
              {getIcon(link!.label)}
              {link!.label}
            </a>
          ))}
          {links.length === 0 && (
             <div className="text-slate-500 text-xs italic py-4">No public links provided</div>
          )}
        </div>

        <div className="mt-12 text-[10px] font-black tracking-[3px] text-slate-600 uppercase">
          POWERED BY BIRUK DESIGN
        </div>
      </div>
    </div>
  );
}
