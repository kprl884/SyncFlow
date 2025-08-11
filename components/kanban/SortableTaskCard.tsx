import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../../types';
import TaskCard from '../ui/TaskCard';

interface SortableTaskCardProps {
  task: Task;
  onTaskClick: (task: Task) => void;
  isStandupActive?: boolean;
  currentSpeakerId?: string | null;
  selectedMemberId?: string | null;
}

const SortableTaskCard: React.FC<SortableTaskCardProps> = ({ task, onTaskClick, isStandupActive, currentSpeakerId, selectedMemberId }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: task.id,
    data: {
      type: 'TASK',
      task: task,
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
  };

  const isFaded = isStandupActive && task.assignee?.id !== currentSpeakerId;
  const isFocused = selectedMemberId && task.assignee?.id === selectedMemberId;
  const isBlurred = selectedMemberId && task.assignee?.id !== selectedMemberId;

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard
        task={task}
        onClick={() => onTaskClick(task)}
        isOverlay={isDragging}
        isFaded={isFaded}
        isFocused={isFocused}
        isBlurred={isBlurred}
      />
    </div>
  );
};

export default SortableTaskCard;
