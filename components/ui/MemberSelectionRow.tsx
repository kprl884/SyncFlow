import React from 'react';
import { User } from '../../types';
import { Users } from 'lucide-react';

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
  const handleUserClick = (userId: string) => {
    if (selectedUserId === userId) {
      // If clicking the same user, deselect
      onUserSelect(null);
    } else {
      // Select new user
      onUserSelect(userId);
    }
  };

  const handleAllClick = () => {
    onUserSelect(null);
  };

  return (
    <div className="py-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Üye Filtresi
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {selectedUserId ? '1 seçili' : `${users.length} üye`}
        </span>
      </div>
      
      <div className="flex items-center space-x-3">
        {/* All Members Button */}
        <button
          onClick={handleAllClick}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg border-2 transition-all duration-200 ${
            !selectedUserId
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
              : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'
          }`}
        >
          <Users className="h-4 w-4" />
          <span className="text-sm font-medium">All</span>
        </button>

        {/* User Avatars */}
        <div className="flex items-center space-x-2">
          {users.map((user) => {
            const isSelected = selectedUserId === user.id;
            const isCurrentSpeaker = isStandupMode && currentSpeakerId === user.id;
            
            return (
              <button
                key={user.id}
                onClick={() => handleUserClick(user.id)}
                className={`relative group transition-all duration-200 ${
                  isSelected 
                    ? 'scale-110' 
                    : 'hover:scale-105'
                }`}
                title={user.name}
              >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-indigo-500 ring-4 ring-indigo-200 dark:ring-indigo-800'
                    : isCurrentSpeaker
                    ? 'border-green-500 ring-2 ring-green-200 dark:ring-green-800'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}>
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full rounded-full flex items-center justify-center text-sm font-medium ${
                      isSelected
                        ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Spotlight Animation for Selected User */}
                {isSelected && (
                  <>
                    {/* Pulse Ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-indigo-400 animate-ping opacity-75"></div>
                    {/* Static Ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-indigo-500"></div>
                  </>
                )}

                {/* Current Speaker Indicator */}
                {isCurrentSpeaker && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></div>
                )}

                {/* User Name Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  {user.name}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selection Info */}
      {selectedUserId && (
        <div className="mt-3 text-sm text-indigo-600 dark:text-indigo-400">
          <span className="font-medium">
            {users.find(u => u.id === selectedUserId)?.name}
          </span>
          'in taskları gösteriliyor
        </div>
      )}
    </div>
  );
};

export default MemberSelectionRow;
