import React, { useState } from 'react';
import { RetroParticipant } from '../../src/types';
import { 
  X, 
  Crown, 
  User, 
  Eye, 
  MessageSquare,
  Clock,
  Circle,
  UserPlus,
  Link,
  Copy
} from 'lucide-react';
import toast from 'react-hot-toast';

interface RetroParticipantsProps {
  participants: RetroParticipant[];
  facilitatorId: string;
  onClose: () => void;
}

const RetroParticipants: React.FC<RetroParticipantsProps> = ({
  participants,
  facilitatorId,
  onClose
}) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  const onlineParticipants = participants.filter(p => p.isOnline);
  const offlineParticipants = participants.filter(p => !p.isOnline);

  const formatLastActivity = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'facilitator':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'observer':
        return <Eye className="h-4 w-4 text-gray-500" />;
      default:
        return <User className="h-4 w-4 text-blue-500" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'facilitator':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'observer':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  const handleCopyInviteLink = () => {
    const inviteLink = `${window.location.origin}${window.location.pathname}`;
    navigator.clipboard.writeText(inviteLink);
    toast.success('Invite link copied to clipboard!');
  };

  const handleInviteByEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    try {
      // Here you would send an invitation email
      console.log('Sending invite to:', inviteEmail);
      toast.success('Invitation sent!');
      setInviteEmail('');
      setShowInviteModal(false);
    } catch (error) {
      console.error('Error sending invite:', error);
      toast.error('Failed to send invitation');
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Participants
          </h3>
          <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
            {participants.length}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowInviteModal(true)}
            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
            title="Invite participants"
          >
            <UserPlus className="h-5 w-5" />
          </button>
          
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Participants List */}
      <div className="flex-1 overflow-y-auto">
        {/* Online Participants */}
        {onlineParticipants.length > 0 && (
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Circle className="h-3 w-3 text-green-500 fill-current" />
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                Online ({onlineParticipants.length})
              </h4>
            </div>
            
            <div className="space-y-3">
              {onlineParticipants.map((participant) => (
                <div
                  key={participant.userId}
                  className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  {/* Avatar */}
                  <div className="relative">
                    {participant.userAvatar ? (
                      <img
                        src={participant.userAvatar}
                        alt={participant.userName}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                          {participant.userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {participant.userName}
                      </p>
                      {getRoleIcon(participant.role)}
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadge(participant.role)}`}>
                        {participant.role}
                      </span>
                      
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Active {formatLastActivity(participant.lastActivity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Offline Participants */}
        {offlineParticipants.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-3">
              <Circle className="h-3 w-3 text-gray-400" />
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                Offline ({offlineParticipants.length})
              </h4>
            </div>
            
            <div className="space-y-3">
              {offlineParticipants.map((participant) => (
                <div
                  key={participant.userId}
                  className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg opacity-60"
                >
                  {/* Avatar */}
                  <div className="relative">
                    {participant.userAvatar ? (
                      <img
                        src={participant.userAvatar}
                        alt={participant.userName}
                        className="w-10 h-10 rounded-full grayscale"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {participant.userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-400 border-2 border-white dark:border-gray-800 rounded-full"></div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                        {participant.userName}
                      </p>
                      <div className="opacity-50">
                        {getRoleIcon(participant.role)}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full opacity-50 ${getRoleBadge(participant.role)}`}>
                        {participant.role}
                      </span>
                      
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Last seen {formatLastActivity(participant.lastActivity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {participants.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64">
            <User className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-center">
              No participants yet
            </p>
            <button
              onClick={() => setShowInviteModal(true)}
              className="mt-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Invite participants
            </button>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Invite Participants
                </h3>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Share Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Share Link
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={`${window.location.origin}${window.location.pathname}`}
                      readOnly
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    />
                    <button
                      onClick={handleCopyInviteLink}
                      className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Email Invite */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Invite by Email
                  </label>
                  <form onSubmit={handleInviteByEmail} className="space-y-3">
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      type="submit"
                      disabled={!inviteEmail.trim()}
                      className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Send Invitation
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RetroParticipants;
