
import React, { useState, useEffect } from 'react';
import type { Task } from '../../types';
import Modal from '../ui/Modal';
import Avatar from '../ui/Avatar';
import { TEAM_COLORS } from '../../constants';
import { Link, GitCommitHorizontal, CheckCircle2, Calculator, Sparkles, Wand2 } from 'lucide-react';
import SPEstimationWizard from '../ui/SPEstimationWizard';
import { aiService } from '../../src/lib/ai-service';

interface TaskDetailModalProps {
  task: Task | null;
  allTasks: Task[];
  onClose: () => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, allTasks, onClose }) => {
  const [isSPWizardOpen, setIsSPWizardOpen] = useState(false);
  const [coPilotChecklist, setCoPilotChecklist] = useState<string[]>([]);
  const [isGeneratingChecklist, setIsGeneratingChecklist] = useState(false);
  const [showCoPilotChecklist, setShowCoPilotChecklist] = useState(false);
  
  if (!task) return null;

  const dependencies = task.dependencies.map(depId => 
    allTasks.find(t => t.id === depId)
  ).filter((t): t is Task => t !== undefined);

  const generateCoPilotChecklist = async () => {
    setIsGeneratingChecklist(true);
    try {
      const subtasks = await aiService.generateSubtaskChecklist(task.title, task.team);
      setCoPilotChecklist(subtasks);
      setShowCoPilotChecklist(true);
    } catch (error) {
      console.error('Co-pilot checklist generation hatası:', error);
      alert('Co-pilot şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setIsGeneratingChecklist(false);
    }
  };

  const teamColor = TEAM_COLORS[task.team] || 'bg-gray-200 text-gray-800';

  return (
    <Modal isOpen={!!task} onClose={onClose} title={task.title}>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${teamColor}`}>{task.team}</span>
          <span className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-700 rounded-full">{task.status}</span>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Description</h3>
            <button
              onClick={generateCoPilotChecklist}
              disabled={isGeneratingChecklist}
              className="flex items-center space-x-2 px-2 py-1 text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md hover:from-purple-600 hover:to-pink-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refine with Co-pilot"
            >
              <Wand2 className="h-3 w-3" />
              <span>{isGeneratingChecklist ? 'Oluşturuluyor...' : 'Refine with Co-pilot'}</span>
            </button>
          </div>
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
              <button
                onClick={() => setIsSPWizardOpen(true)}
                className="ml-2 p-1 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors duration-200"
                title="Story Point Tahmin Sihirbazını Aç"
              >
                <Calculator className="h-4 w-4" />
              </button>
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

        {/* Co-pilot Checklist */}
        {showCoPilotChecklist && coPilotChecklist.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
              Co-pilot Checklist
            </h3>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg">
              <ul className="space-y-2">
                {coPilotChecklist.map((subtask, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id={`subtask-${index}`}
                      className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`subtask-${index}`} className="text-sm text-gray-700 dark:text-gray-300">
                      {subtask}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* SP Estimation Wizard */}
        <SPEstimationWizard
          isOpen={isSPWizardOpen}
          onClose={() => setIsSPWizardOpen(false)}
          task={task}
          onComplete={(storyPoints: number) => {
            // Task'ı güncelle (gerçek uygulamada bu state management ile yapılır)
            console.log(`Task ${task.id} için ${storyPoints} SP atandı`);
            setIsSPWizardOpen(false);
          }}
          allTasks={allTasks}
        />
      </div>
    </Modal>
  );
};

export default TaskDetailModal;
