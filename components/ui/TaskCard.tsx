import React from 'react';
import type { Task } from '../../types';
import { TEAM_COLORS } from '../../constants';
import Avatar from './Avatar';
import { Link } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  isOverlay?: boolean;
  isFaded?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, isOverlay = false, isFaded = false }) => {
  const teamColor = TEAM_COLORS[task.team] || 'bg-gray-200 text-gray-800';
  
  const cardStyles = `bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${isOverlay ? 'shadow-2xl scale-105 rotate-3' : ''} ${isFaded ? 'opacity-30' : 'opacity-100'}`;

  return (
    <div className={cardStyles} onClick={onClick}>
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
            {task.tags?.map(tag => (
                <span key={tag} className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-600 rounded-full">{tag}</span>
            ))}
        </div>
        {task.assignee && <Avatar user={task.assignee} />}
      </div>
    </div>
  );
};

export default TaskCard;