
import React from 'react';

const LOGO_URL = "https://i.postimg.cc/y3S5kp0z/Honor.jpg"; 

export const Logo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <div className={`relative flex items-center justify-center ${className} overflow-hidden rounded-full`}>
     <img 
        src={LOGO_URL} 
        alt="Honor Wallet" 
        className="w-full h-full object-cover" 
     />
  </div>
);

export const VideoLogoLarge: React.FC = () => (
  <div className="relative w-48 h-48 group">
    <div className="absolute inset-0 bg-[#D4AF37]/20 rounded-full blur-[60px] animate-pulse"></div>
    <img 
        src={LOGO_URL} 
        alt="Honor Wallet" 
        className="relative w-full h-full object-cover rounded-full drop-shadow-2xl z-10 border-4 border-[#D4AF37]/20" 
    />
  </div>
);
