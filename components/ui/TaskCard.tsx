import React from 'react';
import type { Task } from '../../types';
import { TEAM_COLORS, PRIORITY_COLORS } from '../../constants';
import Avatar from './Avatar';
import { Link } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  isOverlay?: boolean;
  isFaded?: boolean;
  isFocused?: boolean;
  isBlurred?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, isOverlay = false, isFaded = false, isFocused = false, isBlurred = false }) => {
  const teamColor = TEAM_COLORS[task.team] || 'bg-gray-200 text-gray-800';

  let cardStyles = 'bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700 cursor-pointer transition-all duration-300';

  if (isOverlay) {
    cardStyles += ' shadow-2xl scale-105 rotate-3';
  } else if (isFocused) {
    cardStyles += ' shadow-2xl border-indigo-500 dark:border-indigo-400 ring-4 ring-indigo-200 dark:ring-indigo-800 scale-105 hover:scale-105 animate-pulse';
  } else if (isBlurred) {
    cardStyles += ' opacity-30 hover:opacity-50';
  } else if (isFaded) {
    cardStyles += ' opacity-30';
  } else {
    cardStyles += ' hover:shadow-lg hover:-translate-y-1 opacity-100';
  }

  return (
    <div className={cardStyles} onClick={onClick} style={isFocused ? { background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05))' } : {}}>
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 pr-2">{task.title}</h3>
        {task.dependencies.length > 0 && (
          <div title={`${task.dependencies.length} dependencies`}>
            <Link className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
        )}
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
           <span className={`px-2 py-1 text-xs font-semibold rounded-full ${teamColor}`}>
            {task.team}
           </span>
            {task.priority && (
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${PRIORITY_COLORS[task.priority]}`}>
                {task.priority}
              </span>
            )}
            {task.tags?.map(tag => (
                <span key={tag} className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-600 rounded-full">{tag}</span>
            ))}
        </div>
        <div className="flex items-center space-x-2">
          {task.storyPoints && (
            <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 rounded-full">
              {task.storyPoints} SP
            </span>
          )}
          {task.assignee && <Avatar user={task.assignee} />}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
