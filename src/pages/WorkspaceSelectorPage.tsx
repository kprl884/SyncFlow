import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { Workspace } from '../../types';
import { Plus, Users, Calendar, LogOut } from 'lucide-react';

interface CreateWorkspaceModalProps {
  onClose: () => void;
  onWorkspaceCreated: (workspaceId: string) => void;
}

const CreateWorkspaceModal: React.FC<CreateWorkspaceModalProps> = ({
  onClose,
  onWorkspaceCreated
}) => {
  const [workspaceName, setWorkspaceName] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { currentUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceName.trim() || !currentUser) return;

    setIsCreating(true);
    try {
      const { addDoc } = await import('firebase/firestore');
      const workspacesRef = collection(db, 'workspaces');
      
      const newWorkspace = {
        name: workspaceName.trim(),
        description: description.trim(),
        ownerId: currentUser.uid,
        members: {
          [currentUser.uid]: 'Admin' as const
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const docRef = await addDoc(workspacesRef, newWorkspace);
      onWorkspaceCreated(docRef.id);
    } catch (error) {
      console.error('Error creating workspace:', error);
      alert('Workspace oluşturulurken bir hata oluştu.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Yeni Workspace Oluştur
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Workspace Adı *
            </label>
            <input
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Proje adını girin"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Açıklama (Opsiyonel)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Workspace hakkında kısa açıklama"
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isCreating || !workspaceName.trim()}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isCreating ? 'Oluşturuluyor...' : 'Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const WorkspaceSelectorPage: React.FC = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { currentUser, signOutUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      fetchUserWorkspaces();
    }
  }, [currentUser]);

  const fetchUserWorkspaces = async () => {
    if (!currentUser) return;

    try {
      const workspacesRef = collection(db, 'workspaces');
      const q = query(workspacesRef, where(`members.${currentUser.uid}`, '!=', null));
      const querySnapshot = await getDocs(q);
      
      const workspacesData: Workspace[] = [];
      querySnapshot.forEach((doc) => {
        workspacesData.push({ id: doc.id, ...doc.data() } as Workspace);
      });
      
      setWorkspaces(workspacesData);
    } catch (error) {
      console.error('Error fetching workspaces:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkspaceClick = (workspaceId: string) => {
    navigate(`/workspace/${workspaceId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with Logout */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                SyncFlow
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Hoş geldin, {currentUser?.displayName || 'Kullanıcı'}
              </p>
            </div>
            <button 
              onClick={signOutUser} 
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium" 
              aria-label="Çıkış Yap"
            >
              <LogOut className="h-4 w-4" />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>
      </header>

      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Workspaces
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Projelerinizi yönetmek için workspace'inizi seçin veya yeni bir tane oluşturun
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Create New Workspace Card */}
            <div
              onClick={() => setShowCreateModal(true)}
              className="bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-6 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200"
            >
              <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Yeni Workspace Oluştur
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Yeni bir proje workspace'i başlat
              </p>
            </div>

            {/* Existing Workspaces */}
            {workspaces.map((workspace) => (
              <div
                key={workspace.id}
                onClick={() => handleWorkspaceClick(workspace.id)}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 cursor-pointer hover:shadow-md hover:border-indigo-300 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {workspace.name}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    workspace.members[currentUser?.uid || ''] === 'Admin' 
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {workspace.members[currentUser?.uid || ''] === 'Admin' ? 'Admin' : 'Üye'}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {workspace.description || 'Açıklama bulunmuyor'}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{Object.keys(workspace.members).length} üye</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(workspace.createdAt).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {workspaces.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <Users className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Henüz workspace yok
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                İlk workspace'inizi oluşturarak başlayın
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Workspace Modal */}
      {showCreateModal && (
        <CreateWorkspaceModal
          onClose={() => setShowCreateModal(false)}
          onWorkspaceCreated={(workspaceId) => {
            setShowCreateModal(false);
            navigate(`/workspace/${workspaceId}`);
          }}
        />
      )}
    </div>
  );
};

export default WorkspaceSelectorPage;
