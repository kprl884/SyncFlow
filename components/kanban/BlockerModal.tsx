import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../src/lib/firebase';
import { useAuth } from '../../src/context/AuthContext';
import { Task, User } from '../../types';
import { X, Flag, AlertTriangle } from 'lucide-react';

interface BlockerModalProps {
  task: Task;
  workspaceId: string;
  users: User[];
  onClose: () => void;
  onBlockerUpdated: () => void;
}

const BlockerModal: React.FC<BlockerModalProps> = ({
  task,
  workspaceId,
  users,
  onClose,
  onBlockerUpdated
}) => {
  const [category, setCategory] = useState<'Technical Dependency' | 'Needs Product Clarification' | 'Missing Asset/API' | 'External Issue'>('Technical Dependency');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Pre-fill with existing blocker data
    if (task.isBlocked) {
      setCategory(task.blockerCategory || 'Technical Dependency');
      setDescription(task.blockerDescription || '');
      setAssigneeId(task.blockerAssignee || '');
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !currentUser) return;

    setIsUpdating(true);
    try {
      const taskRef = doc(db, 'workspaces', workspaceId, 'tasks', task.id);
      
      const updateData: any = {
        isBlocked: true,
        blockerCategory: category,
        blockerDescription: description.trim(),
        blockerAssignee: assigneeId || null,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(taskRef, updateData);
      onBlockerUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating blocker:', error);
      alert('Blocker güncellenirken bir hata oluştu.');
    } finally {
      setIsUpdating(false);
    }
  };

  const removeBlocker = async () => {
    if (!currentUser) return;

    setIsUpdating(true);
    try {
      const taskRef = doc(db, 'workspaces', workspaceId, 'tasks', task.id);
      
      await updateDoc(taskRef, {
        isBlocked: false,
        blockerCategory: null,
        blockerDescription: null,
        blockerAssignee: null,
        updatedAt: new Date().toISOString()
      });
      
      onBlockerUpdated();
      onClose();
    } catch (error) {
      console.error('Error removing blocker:', error);
      alert('Blocker kaldırılırken bir hata oluştu.');
    } finally {
      setIsUpdating(false);
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Technical Dependency':
        return '🔧';
      case 'Needs Product Clarification':
        return '❓';
      case 'Missing Asset/API':
        return '📦';
      case 'External Issue':
        return '🌐';
      default:
        return '🚫';
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Technical Dependency':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Needs Product Clarification':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Missing Asset/API':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'External Issue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Flag className="h-5 w-5 text-red-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {task.isBlocked ? 'Blocker Düzenle' : 'Blocker Ekle'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Task: {task.title}
            </h3>
            {task.isBlocked && (
              <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(task.blockerCategory || '')}`}>
                <span>{getCategoryIcon(task.blockerCategory || '')}</span>
                <span>{task.blockerCategory}</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Blocker Kategorisi *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="Technical Dependency">🔧 Technical Dependency</option>
                <option value="Needs Product Clarification">❓ Needs Product Clarification</option>
                <option value="Missing Asset/API">📦 Missing Asset/API</option>
                <option value="External Issue">🌐 External Issue</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Blocker Açıklaması *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Blocker'ı detaylı olarak açıklayın..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Atanacak Kişi (Opsiyonel)
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Atanmamış</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-3 pt-4">
              {task.isBlocked && (
                <button
                  type="button"
                  onClick={removeBlocker}
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50"
                >
                  Blocker'ı Kaldır
                </button>
              )}
              <button
                type="submit"
                disabled={isUpdating || !description.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isUpdating ? 'Güncelleniyor...' : (task.isBlocked ? 'Güncelle' : 'Blocker Ekle')}
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800 dark:text-yellow-200">
                <p className="font-medium">Blocker Eklendiğinde:</p>
                <ul className="mt-1 space-y-1">
                  <li>• Task kırmızı border ile işaretlenir</li>
                  <li>• Blocker kategorisi task kartında görünür</li>
                  <li>• Atanan kişi bilgilendirilir</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockerModal;
