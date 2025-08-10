import React, { useState, useEffect } from 'react';
import type { User } from '../../types';
import Avatar from '../ui/Avatar';
import { SkipBack, SkipForward, Timer, XCircle } from 'lucide-react';

interface StandupControlsProps {
  participants: User[];
  currentSpeakerId: string | null;
  onNext: () => void;
  onPrev: () => void;
  onEnd: () => void;
}

const StandupControls: React.FC<StandupControlsProps> = ({ participants, currentSpeakerId, onNext, onPrev, onEnd }) => {
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds

  useEffect(() => {
    if (timeLeft <= 0) return;
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 shadow-lg p-3 flex items-center justify-between z-30 border-b-2 border-indigo-500 animate-slide-down">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-red-500 font-bold">
            <Timer className="h-6 w-6"/>
            <span className="text-xl tabular-nums">{formatTime(timeLeft)}</span>
        </div>
      </div>
      <div className="flex items-center justify-center space-x-2 flex-grow px-4">
          <button onClick={onPrev} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Previous Speaker">
              <SkipBack className="h-6 w-6"/>
          </button>
        {participants.map(user => (
          <div key={user.id} className={`transition-all duration-300 ease-in-out ${user.id === currentSpeakerId ? 'scale-110' : ''}`}>
            <div className={`p-0.5 rounded-full ${user.id === currentSpeakerId ? 'bg-indigo-500' : 'bg-transparent'}`}>
                <Avatar user={user} />
            </div>
          </div>
        ))}
        <button onClick={onNext} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Next Speaker">
            <SkipForward className="h-6 w-6"/>
        </button>
      </div>
      <button onClick={onEnd} className="flex items-center space-x-2 px-3 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
          <XCircle className="h-5 w-5"/>
          <span>End</span>
      </button>
      <style>{`
        @keyframes slide-down {
            from { transform: translateY(-100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-down {
            animation: slide-down 0.3s ease-out forwards;
        }
    `}</style>
    </div>
  );
};

export default StandupControls;
