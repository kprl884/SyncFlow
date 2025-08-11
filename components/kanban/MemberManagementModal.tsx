import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../src/lib/firebase';
import { useAuth } from '../../src/context/AuthContext';
import { User, UserRole } from '../../types';
import { X, UserPlus, Crown, User as UserIcon } from 'lucide-react';

interface MemberManagementModalProps {
  workspaceId: string;
  workspace: any;
  onClose: () => void;
  onMembersUpdated: () => void;
}

const MemberManagementModal: React.FC<MemberManagementModalProps> = ({
  workspaceId,
  workspace,
  onClose,
  onMembersUpdated
}) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [workspaceUsers, setWorkspaceUsers] = useState<User[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchWorkspaceUsers();
  }, [workspace]);

    const fetchWorkspaceUsers = async () => {
    if (!workspace) return;

    const userIds = Object.keys(workspace.members || {});
    const usersData: User[] = [];
    
    // Mock data'dan user bilgilerini al
    const mockUsers = [
      { id: 'user-1', name: 'Alex Johnson', email: 'alex@syncflow.com', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' },
      { id: 'user-2', name: 'Sarah Chen', email: 'sarah@syncflow.com', avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' },
      { id: 'user-3', name: 'Mike Rodriguez', email: 'mike@syncflow.com', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
      { id: 'user-4', name: 'Emily Davis', email: 'emily@syncflow.com', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' },
      { id: 'user-5', name: 'David Kim', email: 'david@syncflow.com', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face' },
      { id: 'user-6', name: 'Lisa Wang', email: 'lisa@syncflow.com', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face' }
    ];
    
    for (const userId of userIds) {
      const mockUser = mockUsers.find(u => u.id === userId);
      if (mockUser) {
        usersData.push(mockUser);
      } else {
        // Fallback to Firebase if mock user not found
        try {
          const userDoc = await getDoc(doc(db, 'users', userId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            usersData.push({
              id: userId,
              name: userData.displayName || 'Unknown User',
              email: userData.email || 'Email yok',
              avatarUrl: userData.photoURL
            });
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    }
    
    setWorkspaceUsers(usersData);
  };

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !currentUser) return;

    setIsInviting(true);
    setInviteError('');

    try {
      // Find user by email
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', inviteEmail.trim()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setInviteError('Bu email adresi ile kayıtlı kullanıcı bulunamadı.');
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userId = userDoc.id;

      // Check if user is already a member
      if (workspace.members[userId]) {
        setInviteError('Bu kullanıcı zaten workspace üyesi.');
        return;
      }

      // Add user to workspace
      const workspaceRef = doc(db, 'workspaces', workspaceId);
      await updateDoc(workspaceRef, {
        [`members.${userId}`]: 'Member' as UserRole,
        updatedAt: new Date().toISOString()
      });

      setInviteEmail('');
      onMembersUpdated();
    } catch (error) {
      console.error('Error inviting user:', error);
      
      let errorMessage = 'Kullanıcı davet edilirken bir hata oluştu.';
      
      // Daha spesifik hata mesajları
      if (error instanceof Error) {
        if (error.message.includes('permission') || error.message.includes('permissions')) {
          errorMessage = 'Bu işlem için yetkiniz bulunmuyor. Admin olarak giriş yapın.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'İnternet bağlantınızı kontrol edin ve tekrar deneyin.';
        } else if (error.message.includes('quota') || error.message.includes('limit')) {
          errorMessage = 'Firebase limiti aşıldı. Lütfen daha sonra tekrar deneyin.';
        } else if (error.message.includes('invalid-email')) {
          errorMessage = 'Geçersiz email formatı. Lütfen doğru email adresini girin.';
        }
      }
      
      setInviteError(errorMessage);
    } finally {
      setIsInviting(false);
    }
  };

  const removeMember = async (userId: string) => {
    if (!currentUser || workspace.members[currentUser.uid] !== 'Admin') return;
    if (userId === workspace.ownerId) return; // Can't remove owner

    try {
      const workspaceRef = doc(db, 'workspaces', workspaceId);
      const updatedMembers = { ...workspace.members };
      delete updatedMembers[userId];

      await updateDoc(workspaceRef, {
        members: updatedMembers,
        updatedAt: new Date().toISOString()
      });

      onMembersUpdated();
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  const changeRole = async (userId: string, newRole: UserRole) => {
    if (!currentUser || workspace.members[currentUser.uid] !== 'Admin') return;
    if (userId === workspace.ownerId) return; // Can't change owner role

    try {
      const workspaceRef = doc(db, 'workspaces', workspaceId);
      await updateDoc(workspaceRef, {
        [`members.${userId}`]: newRole,
        updatedAt: new Date().toISOString()
      });

      onMembersUpdated();
    } catch (error) {
      console.error('Error changing role:', error);
    }
  };

  const isAdmin = currentUser && workspace?.members[currentUser.uid] === 'Admin';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Workspace Üyeleri
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Invite Form */}
          {isAdmin && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Yeni Üye Davet Et
              </h3>
              <form onSubmit={handleInviteUser} className="space-y-3">
                <div>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="Email adresi girin"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                    required
                  />
                </div>
                {inviteError && (
                  <p className="text-red-600 dark:text-red-400 text-sm">{inviteError}</p>
                )}
                <button
                  type="submit"
                  disabled={isInviting || !inviteEmail.trim()}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>{isInviting ? 'Davet Ediliyor...' : 'Davet Et'}</span>
                </button>
              </form>
            </div>
          )}

          {/* Members List */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
              Mevcut Üyeler ({workspaceUsers.length})
            </h3>
            <div className="space-y-3">
              {workspaceUsers.map((user) => {
                const role = workspace.members[user.id];
                const isOwner = user.id === workspace.ownerId;
                const canManage = isAdmin && !isOwner;

                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={user.name}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <UserIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email || 'Email yok'}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {isOwner ? (
                            <span className="flex items-center space-x-1 text-xs text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded-full">
                              <Crown className="h-3 w-3" />
                              <span>Owner</span>
                            </span>
                          ) : (
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              role === 'Admin' 
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            }`}>
                              {role}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {canManage && (
                      <div className="flex items-center space-x-2">
                        {role !== 'Admin' && (
                          <button
                            onClick={() => changeRole(user.id, 'Admin')}
                            className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded hover:bg-purple-200 transition-colors"
                          >
                            Admin Yap
                          </button>
                        )}
                        {role === 'Admin' && (
                          <button
                            onClick={() => changeRole(user.id, 'Member')}
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                          >
                            Member Yap
                          </button>
                        )}
                        <button
                          onClick={() => removeMember(user.id)}
                          className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
                        >
                          Çıkar
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberManagementModal;
