import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Users, Tag, Calendar, AlertCircle, CheckCircle, Clock, Zap } from 'lucide-react';
import type { Task, User, Team } from '../../types';
import { TASK_STATUSES, TEAM_COLORS } from '../../constants';

interface TaskCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  users: User[];
  workspaceId: string;
  existingTasks: Task[];
}

const STORY_POINT_OPTIONS = [1, 2, 3, 5, 8, 13, 21, 34];
const TEAMS: Team[] = ['Backend', 'Frontend', 'Mobile', 'General'];

const TaskCreationModal: React.FC<TaskCreationModalProps> = ({
  isOpen,
  onClose,
  onCreateTask,
  users,
  workspaceId,
  existingTasks
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Todo' as const,
    assigneeId: '',
    team: 'General' as Team,
    storyPoints: 3,
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    tags: [] as string[],
    dependencies: [] as string[],
    technicalComplexity: {
      apiImpact: 0,
      uiImpact: 0,
      databaseImpact: false
    },
    uncertainty: 'low' as 'low' | 'medium' | 'high'
  });

  const [newTag, setNewTag] = useState('');
  const [showSPHelper, setShowSPHelper] = useState(false);
  const [spRecommendation, setSpRecommendation] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        description: '',
        status: 'Todo',
        assigneeId: '',
        team: 'General',
        storyPoints: 3,
        priority: 'Medium',
        tags: [],
        dependencies: [],
        technicalComplexity: {
          apiImpact: 0,
          uiImpact: 0,
          databaseImpact: false
        },
        uncertainty: 'low'
      });
    }
  }, [isOpen]);

  const calculateSPRecommendation = () => {
    const { technicalComplexity, uncertainty } = formData;
    let baseSP = 3;

    // Technical complexity calculation
    const totalImpact = technicalComplexity.apiImpact + technicalComplexity.uiImpact + (technicalComplexity.databaseImpact ? 3 : 0);
    
    if (totalImpact <= 2) baseSP = 1;
    else if (totalImpact <= 4) baseSP = 2;
    else if (totalImpact <= 6) baseSP = 3;
    else if (totalImpact <= 8) baseSP = 5;
    else if (totalImpact <= 10) baseSP = 8;
    else baseSP = 13;

    // Uncertainty adjustment
    if (uncertainty === 'high') baseSP = Math.min(baseSP * 1.5, 21);
    else if (uncertainty === 'medium') baseSP = Math.min(baseSP * 1.2, 13);

    // Round to nearest Fibonacci number
    const fibonacci = [1, 2, 3, 5, 8, 13, 21, 34];
    const recommended = fibonacci.reduce((prev, curr) => 
      Math.abs(curr - baseSP) < Math.abs(prev - baseSP) ? curr : prev
    );

    setSpRecommendation(recommended);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedAssignee = users.find(u => u.id === formData.assigneeId);
    
    const newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
      title: formData.title,
      description: formData.description,
      status: formData.status,
      assignee: selectedAssignee,
      workspaceId,
      sprintId: '', // Will be assigned later
      storyPoints: formData.storyPoints,
      dependencies: formData.dependencies,
      team: formData.team,
      tags: formData.tags,
      technicalComplexity: formData.technicalComplexity,
      uncertainty: formData.uncertainty
    };

    onCreateTask(newTask);
    onClose();
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Yeni Task Oluştur
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Task Başlığı *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Task başlığını girin..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Atanan Kişi
              </label>
              <select
                value={formData.assigneeId}
                onChange={(e) => setFormData(prev => ({ ...prev, assigneeId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Atanmamış</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Açıklama
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Task açıklamasını girin..."
            />
          </div>

          {/* Team and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Takım
              </label>
              <select
                value={formData.team}
                onChange={(e) => setFormData(prev => ({ ...prev, team: e.target.value as Team }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                {TEAMS.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Öncelik
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as 'Low' | 'Medium' | 'High' }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="Low">Düşük</option>
                <option value="Medium">Orta</option>
                <option value="High">Yüksek</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Durum
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                {TASK_STATUSES.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Story Points Section */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Story Points (SP)
              </h3>
              <button
                type="button"
                onClick={() => setShowSPHelper(!showSPHelper)}
                className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium"
              >
                {showSPHelper ? 'Gizle' : 'SP Yardımcısı'}
              </button>
            </div>

            <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-4">
              {STORY_POINT_OPTIONS.map(sp => (
                <button
                  key={sp}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, storyPoints: sp }))}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.storyPoints === sp
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  {sp}
                </button>
              ))}
            </div>

            {showSPHelper && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      API Etkisi (0-10)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={formData.technicalComplexity.apiImpact}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        technicalComplexity: {
                          ...prev.technicalComplexity,
                          apiImpact: parseInt(e.target.value)
                        }
                      }))}
                      className="w-full"
                    />
                    <span className="text-sm text-gray-500">{formData.technicalComplexity.apiImpact}</span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      UI Etkisi (0-10)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={formData.technicalComplexity.uiImpact}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        technicalComplexity: {
                          ...prev.technicalComplexity,
                          uiImpact: parseInt(e.target.value)
                        }
                      }))}
                      className="w-full"
                    />
                    <span className="text-sm text-gray-500">{formData.technicalComplexity.uiImpact}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="databaseImpact"
                      checked={formData.technicalComplexity.databaseImpact}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        technicalComplexity: {
                          ...prev.technicalComplexity,
                          databaseImpact: e.target.checked
                        }
                      }))}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="databaseImpact" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Veritabanı Değişikliği
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Belirsizlik
                    </label>
                    <select
                      value={formData.uncertainty}
                      onChange={(e) => setFormData(prev => ({ ...prev, uncertainty: e.target.value as 'low' | 'medium' | 'high' }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="low">Düşük</option>
                      <option value="medium">Orta</option>
                      <option value="high">Yüksek</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={calculateSPRecommendation}
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    <Zap className="h-4 w-4" />
                    <span>SP Önerisi Hesapla</span>
                  </button>

                  {spRecommendation && (
                    <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Önerilen SP: {spRecommendation}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Etiketler
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Etiket ekleyin..."
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center space-x-1 px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded-full text-sm"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Dependencies */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bağımlılıklar
            </label>
            <select
              multiple
              value={formData.dependencies}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => option.value);
                setFormData(prev => ({ ...prev, dependencies: selected }));
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {existingTasks.map(task => (
                <option key={task.id} value={task.id}>
                  {task.title} ({task.status})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Ctrl/Cmd tuşu ile birden fazla seçim yapabilirsiniz</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Task Oluştur
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskCreationModal;
