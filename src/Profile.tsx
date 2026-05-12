/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Instagram, 
  Facebook, 
  Send as Telegram,
  MessageCircle, 
  Youtube,
  Music, 
  Link as LinkIcon,
  Utensils,
  Globe,
  Mail,
  Phone,
  Linkedin,
  Github,
  Twitter,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function Profile() {
  const [searchParams] = useSearchParams();
  const name = searchParams.get('n') || "Digital Identity";
  const slogan = searchParams.get('s') || searchParams.get('slogan') || "Professional Network Node";
  const logo = searchParams.get('l') || searchParams.get('logo');
  const rawData = searchParams.get('d') || "";

  const links = React.useMemo(() => {
    if (!rawData) return [];
    const items = rawData.includes(' | ') ? rawData.split(' | ') : rawData.split('|');
    
    return items.map(item => {
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

  const getIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes('instagram')) return <Instagram className="text-[#E4405F]" />;
    if (l.includes('facebook')) return <Facebook className="text-[#1877F2]" />;
    if (l.includes('telegram')) return <Telegram className="text-[#24A1DE]" />;
    if (l.includes('whatsapp')) return <MessageCircle className="text-[#25D366]" />;
    if (l.includes('youtube')) return <Youtube className="text-[#FF0000]" />;
    if (l.includes('tiktok')) return <Music className="text-white" />;
    if (l.includes('twitter') || l.includes(' x ')) return <Twitter className="text-[#1DA1F2]" />;
    if (l.includes('linkedin')) return <Linkedin className="text-[#0A66C2]" />;
    if (l.includes('github')) return <Github className="text-white" />;
    if (l.includes('web') || l.includes('site')) return <Globe className="text-indigo-400" />;
    if (l.includes('mail') || l.includes('email')) return <Mail className="text-amber-400" />;
    if (l.includes('phone') || l.includes('call')) return <Phone className="text-emerald-400" />;
    if (l.includes('menu') || l.includes('food')) return <Utensils className="text-orange-400" />;
    return <LinkIcon className="text-neutral-400" />;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 overflow-x-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/20 blur-[150px] rounded-full" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-900/10 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-[480px] mx-auto min-h-screen flex flex-col items-center px-6 py-16">
        
        {/* Profile Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className="relative mb-8"
        >
          <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-indigo-500 rounded-[42px] blur opacity-40 animate-pulse" />
          <div className="relative w-32 h-32 rounded-[40px] bg-black border border-white/10 overflow-hidden shadow-2xl">
            <img 
              src={logo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=4f46e5`} 
              alt="Brand Identity" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-2xl border-4 border-black flex items-center justify-center shadow-lg"
          >
            <Globe size={16} className="text-white" />
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-black tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            {name}
          </h1>
          <p className="text-neutral-500 font-medium text-sm px-4 leading-relaxed tracking-wide uppercase italic opacity-80 decoration-primary decoration-2 h-auto flex items-center justify-center gap-2">
            <span className="w-8 h-[1px] bg-primary/30" />
            {slogan}
            <span className="w-8 h-[1px] bg-primary/30" />
          </p>
        </motion.div>

        {/* Links Grid */}
        <div className="w-full space-y-4">
          <AnimatePresence>
            {links.map((link, i) => (
              <motion.a
                key={i}
                href={link!.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i + 0.4 }}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className="group relative flex items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-[28px] overflow-hidden transition-all hover:bg-white/10 hover:border-white/20 active:bg-white/15"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-black/40 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                  {getIcon(link!.label)}
                </div>
                
                <div className="flex-grow min-w-0">
                  <h3 className="text-base font-bold text-white/90 truncate group-hover:text-white transition-colors">
                    {link!.label}
                  </h3>
                  <p className="text-[10px] text-neutral-500 font-mono truncate opacity-60 group-hover:opacity-100 transition-opacity">
                    {link!.url.replace('https://', '').replace('http://', '').split('/')[0]}
                  </p>
                </div>

                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all text-primary">
                  <ExternalLink size={18} />
                </div>
                
                {/* Background reveal effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </motion.a>
            ))}
          </AnimatePresence>

          {links.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center"
            >
              <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/5 mx-auto mb-4 flex items-center justify-center opacity-20">
                <LinkIcon size={32} />
              </div>
              <p className="text-neutral-600 font-medium text-sm italic">No data nodes published</p>
            </motion.div>
          )}
        </div>

        {/* Verification Status */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-auto pt-16 pb-8 flex flex-col items-center gap-6"
        >
          <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
            <span className="text-[10px] font-black tracking-widest text-emerald-500 uppercase">Authenticated Identity</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="text-[9px] font-black tracking-[4px] text-neutral-600 uppercase">Powered by</span>
            <div className="flex items-center gap-2 text-primary">
              <span className="font-bold text-sm tracking-tighter">Enterprise</span>
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="font-bold text-sm tracking-tighter">Studio</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

