import React, { useState, useCallback, useRef } from 'react';
import { 
  RetroSession, 
  RetroNote, 
  RetroTemplate, 
  RetroCategory,
  User 
} from '../../src/types';
import RetroColumn from './RetroColumn';
import RetroPagination from './RetroPagination';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import RetroNoteCard from './RetroNoteCard';
import { Plus } from 'lucide-react';

interface RetroBoardProps {
  session: RetroSession;
  template: RetroTemplate | null;
  currentUser: User | null;
  isFacilitator: boolean;
}

const RetroBoard: React.FC<RetroBoardProps> = ({
  session,
  template,
  currentUser,
  isFacilitator
}) => {
  const [activeNote, setActiveNote] = useState<RetroNote | null>(null);
  const [showAddNote, setShowAddNote] = useState<{
    category: RetroCategory | string;
    x: number;
    y: number;
  } | null>(null);

  const boardRef = useRef<HTMLDivElement>(null);

  // Get categories from template
  const categories = template?.categories || [
    {
      id: 'whatWentWell',
      title: 'What Went Well',
      description: 'Things that worked well',
      color: 'bg-green-500',
      icon: '👍'
    },
    {
      id: 'whatCouldImprove',
      title: 'What Could Be Improved',
      description: 'Areas for improvement',
      color: 'bg-yellow-500',
      icon: '💡'
    },
    {
      id: 'actionItems',
      title: 'Action Items',
      description: 'Next steps',
      color: 'bg-blue-500',
      icon: '🎯'
    }
  ];

  // Group notes by category
  const notesByCategory = categories.reduce((acc, category) => {
    acc[category.id] = session.notes.filter(note => 
      note.category === category.id || 
      (note.category === 'custom' && note.customCategory === category.id)
    );
    return acc;
  }, {} as Record<string, RetroNote[]>);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const note = session.notes.find(n => n.id === active.id);
    setActiveNote(note || null);
  }, [session.notes]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveNote(null);

    if (!over) return;

    const activeNote = session.notes.find(n => n.id === active.id);
    if (!activeNote) return;

    // Handle dropping on different categories
    if (over.id !== activeNote.category) {
      // Update note category
      // This would trigger a service call to update the note
      console.log('Move note to different category:', over.id);
    }

    // Handle position updates for grouping
    if (over.data?.current?.type === 'note-position') {
      const { x, y } = over.data.current;
      // Update note position
      console.log('Update note position:', x, y);
    }
  }, [session.notes]);

  const handleAddNote = useCallback((category: RetroCategory | string, x?: number, y?: number) => {
    setShowAddNote({
      category,
      x: x || 0,
      y: y || 0
    });
  }, []);

  const handleAddNoteToBoard = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // Find which category this position is in
      const columnWidth = rect.width / categories.length;
      const categoryIndex = Math.floor(x / columnWidth);
      const category = categories[categoryIndex];
      
      if (category) {
        handleAddNote(category.id, x, y);
      }
    }
  }, [categories, handleAddNote]);

  // Check if user can interact based on phase and settings
  const canAddNotes = session.currentPhase === 'brainstorming' && session.status === 'active';
  const canVote = session.currentPhase === 'voting' && session.status === 'active' && session.settings.enableVoting;
  const canDiscuss = session.currentPhase === 'discussion' && session.status === 'active';

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Phase Instructions */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          {session.currentPhase === 'brainstorming' && (
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Brainstorming Phase
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Add your thoughts and ideas to each category. You can add notes anonymously if enabled.
              </p>
            </div>
          )}
          
          {session.currentPhase === 'voting' && (
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Voting Phase
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Vote on the most important items. You have {session.settings.maxVotesPerUser} votes to distribute.
              </p>
            </div>
          )}
          
          {session.currentPhase === 'discussion' && (
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Discussion Phase
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Discuss the highest voted items and group related notes together.
              </p>
            </div>
          )}
          
          {session.currentPhase === 'actionPlanning' && (
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Action Planning Phase
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Create concrete action items based on the discussion. Assign owners and due dates.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Board */}
      <div className="flex-1 overflow-hidden">
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div 
            ref={boardRef}
            className="h-full p-6"
            onDoubleClick={canAddNotes ? handleAddNoteToBoard : undefined}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full max-w-7xl mx-auto">
              {categories.map((category) => (
                <RetroColumn
                  key={category.id}
                  category={category}
                  notes={notesByCategory[category.id] || []}
                  session={session}
                  currentUser={currentUser}
                  isFacilitator={isFacilitator}
                  canAddNotes={canAddNotes}
                  canVote={canVote}
                  canDiscuss={canDiscuss}
                  onAddNote={() => handleAddNote(category.id)}
                />
              ))}
            </div>
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeNote && (
              <RetroNoteCard
                note={activeNote}
                currentUser={currentUser}
                canVote={false}
                canEdit={false}
                isDragging
              />
            )}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Quick Add Instructions */}
      {canAddNotes && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800 px-6 py-3">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
              💡 Double-click anywhere on the board to quickly add a note to that category
            </p>
          </div>
        </div>
      )}

      {/* Add Note Modal */}
      {showAddNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Add Note
              </h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                // Handle form submission
                setShowAddNote(null);
              }}>
                <textarea
                  placeholder="Enter your note..."
                  className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  autoFocus
                />
                
                {session.settings.allowAnonymous && (
                  <label className="flex items-center mt-3">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Post anonymously
                    </span>
                  </label>
                )}

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddNote(null)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Add Note
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RetroBoard;
