
import React from 'react';
import type { Task } from '../../types';
import Modal from '../ui/Modal';
import Avatar from '../ui/Avatar';
import { TEAM_COLORS } from '../../constants';
import { Link, GitCommitHorizontal, CheckCircle2 } from 'lucide-react';

interface TaskDetailModalProps {
  task: Task | null;
  allTasks: Task[];
  onClose: () => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, allTasks, onClose }) => {
  if (!task) return null;

  const dependencies = task.dependencies.map(depId => 
    allTasks.find(t => t.id === depId)
  ).filter((t): t is Task => t !== undefined);

  const teamColor = TEAM_COLORS[task.team] || 'bg-gray-200 text-gray-800';

  return (
    <Modal isOpen={!!task} onClose={onClose} title={task.title}>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${teamColor}`}>{task.team}</span>
          <span className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-700 rounded-full">{task.status}</span>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</h3>
          <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{task.description || 'No description provided.'}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Assignee</h3>
            {task.assignee ? (
              <div className="flex items-center space-x-3">
                <Avatar user={task.assignee} />
                <span className="text-gray-800 dark:text-gray-200">{task.assignee.name}</span>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Unassigned</p>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Story Points</h3>
            <div className="flex items-center space-x-2">
              <GitCommitHorizontal className="h-5 w-5 text-indigo-500" />
              <span className="text-lg font-bold text-gray-800 dark:text-gray-100">{task.storyPoints || 'N/A'}</span>
            </div>
          </div>
        </div>

        {dependencies.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              <Link className="h-5 w-5 mr-2" />
              Dependencies
            </h3>
            <ul className="space-y-2">
              {dependencies.map(dep => (
                <li key={dep.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md flex items-center justify-between">
                  <span className="text-gray-800 dark:text-gray-200">{dep.title}</span>
                  <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    {dep.status === 'Done' ? <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" /> : null}
                    {dep.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </Modal>
  );
};

export default TaskDetailModal;
