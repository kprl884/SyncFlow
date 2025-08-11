import React from 'react';
import type { Task, TaskStatus } from '../../types';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableTaskCard from './SortableTaskCard';

interface KanbanColumnProps {
  columnId: string;
  title: TaskStatus;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  isStandupActive?: boolean;
  currentSpeakerId?: string | null;
  selectedMemberId?: string | null;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ columnId, title, tasks, onTaskClick, isStandupActive, currentSpeakerId, selectedMemberId }) => {
  const { setNodeRef } = useSortable({
    id: columnId,
    data: {
      type: 'COLUMN',
    }
  });

  const taskIds = tasks.map(task => task.id);

  return (
    <div className="w-80 md:w-96 flex-shrink-0">
      <div ref={setNodeRef} className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg text-gray-700 dark:text-gray-200">{title}</h2>
          <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold text-sm rounded-full px-3 py-1">
            {tasks.length}
          </span>
        </div>
        <div className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-4">
           <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
              {tasks.map((task) => (
                <SortableTaskCard 
                  key={task.id} 
                  task={task} 
                  onTaskClick={onTaskClick}
                  isStandupActive={isStandupActive}
                  currentSpeakerId={currentSpeakerId}
                  selectedMemberId={selectedMemberId}
                />
              ))}
           </SortableContext>
        </div>
      </div>
    </div>
  );
};

export default KanbanColumn;
