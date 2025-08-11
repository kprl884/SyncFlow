import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { 
  RetroNote, 
  RetroSession, 
  User,
  RetroCategory 
} from '../../src/types';
import RetroNoteCard from './RetroNoteCard';
import { Plus, MessageSquare, ThumbsUp } from 'lucide-react';

interface CategoryConfig {
  id: RetroCategory | string;
  title: string;
  description: string;
  color: string;
  icon: string;
}

interface RetroColumnProps {
  category: CategoryConfig;
  notes: RetroNote[];
  session: RetroSession;
  currentUser: User | null;
  isFacilitator: boolean;
  canAddNotes: boolean;
  canVote: boolean;
  canDiscuss: boolean;
  onAddNote: () => void;
}

const RetroColumn: React.FC<RetroColumnProps> = ({
  category,
  notes,
  session,
  currentUser,
  isFacilitator,
  canAddNotes,
  canVote,
  canDiscuss,
  onAddNote
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: category.id,
    data: {
      type: 'category',
      category: category.id
    }
  });

  // Sort notes by vote count during voting phase, by creation time otherwise
  const sortedNotes = [...notes].sort((a, b) => {
    if (session.currentPhase === 'voting' || session.currentPhase === 'discussion') {
      return b.votes - a.votes;
    }
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  const totalVotes = notes.reduce((sum, note) => sum + note.votes, 0);
  const noteIds = sortedNotes.map(note => note.id);

  const handleSubmitNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim() || !currentUser) return;

    try {
      // Create new note object
      const newNote: Omit<RetroNote, 'id'> = {
        sessionId: session.id,
        content: newNoteContent.trim(),
        category: category.id as RetroCategory,
        customCategory: category.id.startsWith('custom') ? category.title : undefined,
        authorId: isAnonymous ? 'anonymous' : currentUser.uid,
        authorName: isAnonymous ? 'Anonymous' : (currentUser.displayName || 'User'),
        isAnonymous,
        isPrivate,
        votes: 0,
        votedBy: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Here you would call the service to add the note
      console.log('Adding note:', newNote);
      
      // Reset form
      setNewNoteContent('');
      setIsAnonymous(false);
      setIsPrivate(false);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const getCategoryColor = (opacity = 100) => {
    const colorMap: Record<string, string> = {
      'bg-green-500': `rgba(34, 197, 94, ${opacity / 100})`,
      'bg-yellow-500': `rgba(234, 179, 8, ${opacity / 100})`,
      'bg-blue-500': `rgba(59, 130, 246, ${opacity / 100})`,
      'bg-red-500': `rgba(239, 68, 68, ${opacity / 100})`,
      'bg-purple-500': `rgba(168, 85, 247, ${opacity / 100})`,
      'bg-indigo-500': `rgba(99, 102, 241, ${opacity / 100})`,
      'bg-pink-500': `rgba(236, 72, 153, ${opacity / 100})`,
      'bg-orange-500': `rgba(249, 115, 22, ${opacity / 100})`
    };
    return colorMap[category.color] || 'rgba(107, 114, 128, 0.1)';
  };

  return (
    <div 
      ref={setNodeRef}
      className={`flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 transition-all duration-200 ${
        isOver 
          ? 'border-indigo-500 shadow-lg' 
          : 'border-gray-200 dark:border-gray-700'
      }`}
      style={{
        background: isOver 
          ? `linear-gradient(135deg, ${getCategoryColor(5)}, ${getCategoryColor(10)})`
          : undefined
      }}
    >
      {/* Column Header */}
      <div 
        className="p-4 border-b border-gray-200 dark:border-gray-700"
        style={{
          background: `linear-gradient(135deg, ${getCategoryColor(10)}, ${getCategoryColor(5)})`
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{category.icon}</span>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">
              {category.title}
            </h3>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <MessageSquare className="h-4 w-4" />
              <span>{notes.length}</span>
            </div>
            {session.settings.enableVoting && (
              <div className="flex items-center space-x-1">
                <ThumbsUp className="h-4 w-4" />
                <span>{totalVotes}</span>
              </div>
            )}
          </div>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {category.description}
        </p>

        {/* Add Note Button */}
        {canAddNotes && (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full flex items-center justify-center space-x-2 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200 group"
          >
            <Plus className="h-4 w-4 text-gray-400 group-hover:text-indigo-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
              Add Note
            </span>
          </button>
        )}
      </div>

      {/* Add Note Form */}
      {showAddForm && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <form onSubmit={handleSubmitNote} className="space-y-3">
            <textarea
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder={`Add your ${category.title.toLowerCase()}...`}
              className="w-full h-20 p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
              autoFocus
            />
            
            <div className="space-y-2">
              {session.settings.allowAnonymous && (
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-2"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Anonymous</span>
                </label>
              )}
              
              {session.settings.allowPrivateNotes && isFacilitator && (
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-2"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Private (facilitator only)</span>
                </label>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewNoteContent('');
                  setIsAnonymous(false);
                  setIsPrivate(false);
                }}
                className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newNoteContent.trim()}
                className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <SortableContext items={noteIds} strategy={verticalListSortingStrategy}>
          {sortedNotes.map((note) => (
            <RetroNoteCard
              key={note.id}
              note={note}
              currentUser={currentUser}
              canVote={canVote}
              canEdit={canDiscuss && (note.authorId === currentUser?.uid || isFacilitator)}
              showVoteCount={session.settings.enableVoting}
              maxVotes={session.settings.maxVotesPerUser}
              userVotes={currentUser ? 
                session.notes
                  .filter(n => n.votedBy.includes(currentUser.uid))
                  .length 
                : 0
              }
            />
          ))}
        </SortableContext>

        {/* Empty State */}
        {notes.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">{category.icon}</div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No notes yet
            </p>
            {canAddNotes && (
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                Click "Add Note" to get started
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RetroColumn;
