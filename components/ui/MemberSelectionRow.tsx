import React from 'react';
import { User } from '../../types';
import { UserIcon } from 'lucide-react';

interface MemberSelectionRowProps {
  users: User[];
  selectedUserId: string | null;
  onUserSelect: (userId: string | null) => void;
  isStandupMode?: boolean;
  currentSpeakerId?: string | null;
}

const MemberSelectionRow: React.FC<MemberSelectionRowProps> = ({
  users,
  selectedUserId,
  onUserSelect,
  isStandupMode = false,
  currentSpeakerId = null
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {isStandupMode ? 'Stand-up Participants' : 'Team Members'}
        </h3>
        {!isStandupMode && selectedUserId && (
          <button
            onClick={() => onUserSelect(null)}
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:underline transition-colors"
          >
            Clear Selection
          </button>
        )}
      </div>
      
      <div className="flex items-center space-x-3 overflow-x-auto pb-2">
        {/* All Members Option */}
        {!isStandupMode && (
          <button
            onClick={() => onUserSelect(null)}
            className={`flex-shrink-0 group relative transition-all duration-300 ${
              selectedUserId === null
                ? 'transform scale-110'
                : 'hover:scale-105'
            }`}
          >
            <div className={`w-12 h-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
              selectedUserId === null
                ? 'border-indigo-500 bg-indigo-100 dark:bg-indigo-900 shadow-lg ring-4 ring-indigo-200 dark:ring-indigo-800'
                : 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900'
            }`}>
              <UserIcon className={`h-5 w-5 ${
                selectedUserId === null
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`} />
            </div>
            
            {/* Spotlight effect for selected */}
            {selectedUserId === null && (
              <div className="absolute inset-0 rounded-full bg-indigo-400 dark:bg-indigo-500 opacity-20 animate-pulse"></div>
            )}
            
            {/* Label */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
                All
              </span>
            </div>
          </button>
        )}

        {/* User Avatars */}
        {users.map((user) => {
          const isSelected = selectedUserId === user.id;
          const isCurrentSpeaker = isStandupMode && currentSpeakerId === user.id;
          const isActive = isSelected || isCurrentSpeaker;
          
          return (
            <button
              key={user.id}
              onClick={() => onUserSelect(user.id)}
              className={`flex-shrink-0 group relative transition-all duration-300 ${
                isActive
                  ? 'transform scale-110'
                  : 'hover:scale-105'
              }`}
              disabled={isStandupMode}
            >
              <div className={`w-12 h-12 rounded-full border-2 transition-all duration-300 overflow-hidden ${
                isActive
                  ? 'border-indigo-500 shadow-lg ring-4 ring-indigo-200 dark:ring-indigo-800'
                  : 'border-gray-300 dark:border-gray-600 hover:border-indigo-300'
              }`}>
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${
                    isActive
                      ? 'bg-indigo-100 dark:bg-indigo-900'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    <UserIcon className={`h-5 w-5 ${
                      isActive
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`} />
                  </div>
                )}
              </div>
              
              {/* Spotlight effect for current speaker */}
              {isCurrentSpeaker && (
                <div className="absolute inset-0 rounded-full bg-yellow-400 dark:bg-yellow-500 opacity-30 animate-pulse"></div>
              )}
              
              {/* Spotlight effect for selected */}
              {isSelected && !isCurrentSpeaker && (
                <div className="absolute inset-0 rounded-full bg-indigo-400 dark:bg-indigo-500 opacity-20 animate-pulse"></div>
              )}
              
              {/* Breathing effect for current speaker */}
              {isCurrentSpeaker && (
                <div className="absolute inset-0 rounded-full border-2 border-yellow-400 dark:border-yellow-500 animate-ping"></div>
              )}
              
              {/* Label */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                <span className={`text-xs font-medium whitespace-nowrap ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {user.name.split(' ')[0]}
                </span>
              </div>
              
              {/* Speaking indicator */}
              {isCurrentSpeaker && (
                <div className="absolute -top-1 -right-1">
                  <div className="w-4 h-4 bg-yellow-400 dark:bg-yellow-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Keyboard shortcuts hint for standup mode */}
      {isStandupMode && (
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
          Use ← → arrow keys to navigate between speakers
        </div>
      )}
    </div>
  );
};

export default MemberSelectionRow;
