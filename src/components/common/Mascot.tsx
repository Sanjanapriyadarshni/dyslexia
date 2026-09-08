import React from 'react';
import { Volume2 } from 'lucide-react';
import { speakText } from '../../hooks/useSound';
import { useLanguage } from '../../context/LanguageContext';

interface MascotProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  expression?: 'happy' | 'waving' | 'reading' | 'celebrating';
  speechText?: string;
  className?: string;
}

export const Mascot: React.FC<MascotProps> = ({
  size = 'md',
  expression = 'happy',
  speechText,
  className = '',
}) => {
  const { currentLanguage } = useLanguage();

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24 md:w-28 md:h-28',
    lg: 'w-36 h-36 md:w-44 md:h-44',
    xl: 'w-48 h-48 md:w-56 md:h-56',
  };

  const handleSpeak = () => {
    if (speechText) {
      speakText(speechText, currentLanguage);
    }
  };

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {/* Optional Speech Bubble */}
      {speechText && (
        <div
          onClick={handleSpeak}
          role="button"
          tabIndex={0}
          title="Click to hear Akshu speak!"
          className="mb-3 max-w-xs md:max-w-md bg-white border-2 border-amber-300 rounded-3xl px-4 py-2.5 shadow-md shadow-amber-200/50 text-slate-800 text-sm md:text-base font-semibold cursor-pointer hover:bg-amber-50/80 transition-all transform hover:scale-[1.02] flex items-center gap-2 relative group"
        >
          <span>{speechText}</span>
          <span className="shrink-0 p-1 rounded-full bg-amber-100 group-hover:bg-amber-200 text-amber-800 transition-colors">
            <Volume2 className="w-4 h-4" />
          </span>
          {/* Bubble tail */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-amber-300 transform rotate-45" />
        </div>
      )}

      {/* Akshu the Owl SVG Vector Illustration */}
      <div className={`relative ${sizeClasses[size]} animate-float`}>
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-lg"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Soft Glow Behind */}
          <circle cx="100" cy="100" r="90" fill="#0D9488" fillOpacity="0.08" />

          {/* Owl Body */}
          <ellipse cx="100" cy="115" rx="68" ry="62" fill="#0D9488" />
          <ellipse cx="100" cy="120" rx="52" ry="46" fill="#F8FAFC" />

          {/* Feather Pattern on Belly */}
          <path
            d="M85 110 Q100 120 115 110 M82 125 Q100 135 118 125 M88 140 Q100 150 112 140"
            stroke="#14B8A6"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Ear Tufts */}
          <polygon points="50,60 70,30 85,65" fill="#0F766E" />
          <polygon points="150,60 130,30 115,65" fill="#0F766E" />
          <polygon points="58,58 72,40 80,62" fill="#F59E0B" />
          <polygon points="142,58 128,40 120,62" fill="#F59E0B" />

          {/* Owl Head Shape */}
          <ellipse cx="100" cy="80" rx="62" ry="48" fill="#14B8A6" />

          {/* Big Friendly Eyes Outer (White) */}
          <circle cx="75" cy="80" r="24" fill="#FFFFFF" stroke="#0F766E" strokeWidth="2.5" />
          <circle cx="125" cy="80" r="24" fill="#FFFFFF" stroke="#0F766E" strokeWidth="2.5" />

          {/* Eye Iris (Deep Amber) */}
          <circle cx="77" cy="80" r="14" fill="#F59E0B" />
          <circle cx="123" cy="80" r="14" fill="#F59E0B" />

          {/* Eye Pupils (Deep Indigo) */}
          <circle cx="77" cy="80" r="8" fill="#1E1B4B" />
          <circle cx="123" cy="80" r="8" fill="#1E1B4B" />

          {/* Eye Sparkles */}
          <circle cx="74" cy="76" r="3.5" fill="#FFFFFF" />
          <circle cx="120" cy="76" r="3.5" fill="#FFFFFF" />
          <circle cx="79" cy="83" r="1.5" fill="#FFFFFF" />
          <circle cx="125" cy="83" r="1.5" fill="#FFFFFF" />

          {/* Beak */}
          <polygon points="94,92 106,92 100,108" fill="#F97316" stroke="#C2410C" strokeWidth="1.5" />

          {/* Cute Rosy Cheeks */}
          <circle cx="56" cy="94" r="8" fill="#F43F5E" fillOpacity="0.45" />
          <circle cx="144" cy="94" r="8" fill="#F43F5E" fillOpacity="0.45" />

          {/* Scholar Cap / Plume */}
          <polygon points="100,20 135,32 100,44 65,32" fill="#4F46E5" />
          <polygon points="80,37 80,48 120,48 120,37" fill="#3730A3" />
          <circle cx="100" cy="32" r="3" fill="#FCD34D" />
          {/* Tassel */}
          <path d="M100 32 Q125 35 130 52" stroke="#FCD34D" strokeWidth="2.5" fill="none" />
          <circle cx="130" cy="52" r="3" fill="#F59E0B" />

          {/* Left Wing (Waving if expression is waving/happy) */}
          {expression === 'waving' || expression === 'celebrating' ? (
            <path
              d="M40 100 Q15 70 30 55 Q45 70 42 110 Z"
              fill="#0F766E"
              className="origin-bottom-right animate-wiggle-hover"
            />
          ) : (
            <ellipse cx="40" cy="115" rx="14" ry="30" fill="#0F766E" transform="rotate(-15 40 115)" />
          )}

          {/* Right Wing */}
          <ellipse cx="160" cy="115" rx="14" ry="30" fill="#0F766E" transform="rotate(15 160 115)" />

          {/* Cute Feet / Claws */}
          <ellipse cx="85" cy="175" rx="10" ry="6" fill="#F97316" />
          <ellipse cx="115" cy="175" rx="10" ry="6" fill="#F97316" />
        </svg>

        {/* Small floating sparkles */}
        <div className="absolute -top-1 -right-1 text-amber-400 text-lg animate-bounce">✨</div>
      </div>
    </div>
  );
};
