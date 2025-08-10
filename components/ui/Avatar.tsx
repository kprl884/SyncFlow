
import React from 'react';
import type { User } from '../../types';

interface AvatarProps {
  user: User;
}

const Avatar: React.FC<AvatarProps> = ({ user }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('');
  };

  return (
    <div className="h-8 w-8 rounded-full flex items-center justify-center bg-gray-300 text-gray-600 font-bold text-xs overflow-hidden" title={user.name}>
      {user.avatarUrl ? (
        <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
      ) : (
        <span>{getInitials(user.name)}</span>
      )}
    </div>
  );
};

export default Avatar;
