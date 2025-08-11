import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { RetroNote, User } from '../../src/types';
import { 
  ThumbsUp, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff,
  MessageCircle,
  MoreVertical
} from 'lucide-react';

interface RetroNoteCardProps {
  note: RetroNote;
  currentUser: User | null;
  canVote: boolean;
  canEdit: boolean;
  showVoteCount?: boolean;
  maxVotes?: number;
  userVotes?: number;
  isDragging?: boolean;
}

const RetroNoteCard: React.FC<RetroNoteCardProps> = ({
  note,
  currentUser,
  canVote,
  canEdit,
  showVoteCount = true,
  maxVotes = 5,
  userVotes = 0,
  isDragging = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(note.content);
  const [showMenu, setShowMenu] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ 
    id: note.id,
    data: {
      type: 'note',
      note: note,
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isSortableDragging ? 10 : 'auto',
  };

  const hasVoted = currentUser ? note.votedBy.includes(currentUser.uid) : false;
  const canVoteForThis = canVote && currentUser && (!hasVoted || userVotes < maxVotes);
  const isOwner = currentUser && note.authorId === currentUser.uid;
  const isPrivate = note.isPrivate;

  const handleVote = async () => {
    if (!canVoteForThis || !currentUser) return;

    try {
      // Toggle vote
      const newVotedBy = hasVoted 
        ? note.votedBy.filter(id => id !== currentUser.uid)
        : [...note.votedBy, currentUser.uid];
      
      // Here you would call the service to update the vote
      console.log('Voting for note:', note.id, 'New voted by:', newVotedBy);
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleEdit = async () => {
    if (!editContent.trim()) return;

    try {
      // Here you would call the service to update the note
      console.log('Updating note:', note.id, 'New content:', editContent);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      // Here you would call the service to delete the note
      console.log('Deleting note:', note.id);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const getCardStyle = () => {
    let baseStyle = 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-sm transition-all duration-200 cursor-pointer';
    
    if (isDragging || isSortableDragging) {
      baseStyle += ' shadow-xl rotate-3 scale-105';
    } else {
      baseStyle += ' hover:shadow-md hover:-translate-y-0.5';
    }

    if (hasVoted) {
      baseStyle += ' ring-2 ring-indigo-200 dark:ring-indigo-800 border-indigo-300 dark:border-indigo-600';
    }

    if (isPrivate) {
      baseStyle += ' bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
    }

    return baseStyle;
  };

  const formatTimeAgo = (dateString: string) => {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={getCardStyle()}
      onClick={(e) => {
        if (isEditing) e.stopPropagation();
      }}
    >
      {/* Note Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2 flex-1">
          {/* Author */}
          <div className="flex items-center space-x-1">
            {note.isAnonymous ? (
              <>
                <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-xs">?</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Anonymous</span>
              </>
            ) : (
              <>
                <div className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                    {note.authorName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">{note.authorName}</span>
              </>
            )}
          </div>

          {/* Private indicator */}
          {isPrivate && (
            <div className="flex items-center space-x-1 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-full">
              <EyeOff className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
              <span className="text-xs text-yellow-700 dark:text-yellow-300">Private</span>
            </div>
          )}
        </div>

        {/* Actions Menu */}
        {(canEdit || isOwner) && (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <MoreVertical className="h-4 w-4 text-gray-400" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 py-1 min-w-24">
                {canEdit && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                  >
                    <Edit2 className="h-3 w-3" />
                    <span>Edit</span>
                  </button>
                )}
                
                {isOwner && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete();
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Note Content */}
      <div className="mb-3">
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              rows={3}
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(note.content);
                }}
                className="px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                disabled={!editContent.trim()}
                className="px-2 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
            {note.content}
          </p>
        )}
      </div>

      {/* Note Footer */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {formatTimeAgo(note.createdAt)}
        </span>

        {/* Vote Button */}
        {showVoteCount && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleVote();
            }}
            disabled={!canVoteForThis}
            className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs transition-all duration-200 ${
              hasVoted
                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                : canVoteForThis
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }`}
          >
            <ThumbsUp className={`h-3 w-3 ${hasVoted ? 'fill-current' : ''}`} />
            <span>{note.votes}</span>
          </button>
        )}
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default RetroNoteCard;
