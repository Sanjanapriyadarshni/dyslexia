import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { soundEngine } from '../../hooks/useSound';

interface AudioSpeakerProps {
  onPlay: () => void;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export const AudioSpeaker: React.FC<AudioSpeakerProps> = ({
  onPlay,
  size = 'md',
  label = 'Listen',
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-sm',
    lg: 'p-3 text-base',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(true);
    soundEngine.playPop();
    onPlay();
    setTimeout(() => {
      setIsPlaying(false);
    }, 1400);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={label}
      aria-label={label}
      className={`inline-flex items-center justify-center rounded-full bg-amber-100 hover:bg-amber-200 active:bg-amber-300 text-amber-800 border-2 border-amber-300 transition-all duration-150 transform hover:scale-105 active:scale-95 shadow-sm ${sizeClasses[size]} ${
        isPlaying ? 'ring-4 ring-amber-300/60 scale-105' : ''
      } ${className}`}
    >
      {isPlaying ? (
        <Volume2 className={`${iconSizes[size]} animate-pulse text-teal-700`} />
      ) : (
        <Volume2 className={iconSizes[size]} />
      )}
    </button>
  );
};
