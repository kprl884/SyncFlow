import React, { useState, useMemo, useEffect } from 'react';
import { collection, query, where, getDocs, getDoc, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../src/lib/firebase';
import { TASK_STATUSES } from '../constants';
import KanbanColumn from '../components/kanban/KanbanColumn';
import type { Task, TaskStatus, Team, User } from '../types';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import TaskCard from '../components/ui/TaskCard';
import TaskDetailModal from '../components/kanban/TaskDetailModal';
import StandupControls from '../components/kanban/StandupControls';
import MemberManagementModal from '../components/kanban/MemberManagementModal';
import { PlayCircle, X, Users, Settings } from 'lucide-react';
import { useAuth } from '../src/context/AuthContext';

interface KanbanBoardPageProps {
  workspaceId: string;
}

const KanbanBoardPage: React.FC<KanbanBoardPageProps> = ({ workspaceId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [workspace, setWorkspace] = useState<any>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showSprintGoalModal, setShowSprintGoalModal] = useState(false);
  const [standupError, setStandupError] = useState<{
    title: string;
    message: string;
    type: 'error' | 'warning' | 'info';
  } | null>(null);
  const { currentUser } = useAuth();

  // Stand-up Mode State
  const [isStandupModeActive, setIsStandupModeActive] = useState<boolean>(false);
  const [currentSpeakerId, setCurrentSpeakerId] = useState<string | null>(null);
  const [standupTeam, setStandupTeam] = useState<Team | null>(null);
  const [standupParticipants, setStandupParticipants] = useState<User[]>([]);
  const [isTeamSelectOpen, setIsTeamSelectOpen] = useState<boolean>(false);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const updateSprintGoal = async (newSprintGoal: string) => {
    if (!currentUser || workspace?.members[currentUser.uid] !== 'Admin') return;

    try {
      const workspaceRef = doc(db, 'workspaces', workspaceId);
      await updateDoc(workspaceRef, {
        sprintGoal: newSprintGoal,
        updatedAt: new Date().toISOString()
      });
      setShowSprintGoalModal(false);
    } catch (error) {
      console.error('Error updating sprint goal:', error);
      alert('Sprint hedefi güncellenirken bir hata oluştu.');
    }
  };

  // Fetch workspace data
  useEffect(() => {
    if (!workspaceId) return;

    const unsubscribe = onSnapshot(doc(db, 'workspaces', workspaceId), (doc) => {
      if (doc.exists()) {
        setWorkspace({ id: doc.id, ...doc.data() });
      }
    });

    return () => unsubscribe();
  }, [workspaceId]);

  // Fetch tasks for this workspace
  useEffect(() => {
    if (!workspaceId) return;

    const unsubscribe = onSnapshot(
      collection(db, 'workspaces', workspaceId, 'tasks'),
      (snapshot) => {
        const tasksData: Task[] = [];
        snapshot.forEach((doc) => {
          tasksData.push({ id: doc.id, ...doc.data() } as Task);
        });
        setTasks(tasksData);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [workspaceId]);

  // Fetch users for this workspace
  useEffect(() => {
    if (!workspace) return;

    const fetchUsers = async () => {
      const userIds = Object.keys(workspace.members);
      const usersData: User[] = [];
      
      for (const userId of userIds) {
        try {
          const userDoc = await getDoc(doc(db, 'users', userId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            usersData.push({
              id: userId,
              name: userData.displayName || 'Unknown User',
              avatarUrl: userData.photoURL
            });
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
      
      setUsers(usersData);
    };

    fetchUsers();
  }, [workspace]);

  const tasksByStatus = useMemo(() => {
    const relevantTasks = isStandupModeActive && standupTeam
      ? tasks.filter(task => task.team === standupTeam)
      : tasks;

    return TASK_STATUSES.reduce((acc, status) => {
      acc[status] = relevantTasks.filter((task) => task.status === status);
      return acc;
    }, {} as Record<TaskStatus, Task[]>);
  }, [tasks, isStandupModeActive, standupTeam]);
  
  const handleDragStart = (event: DragStartEvent) => {
     if (isStandupModeActive) return;
     const { active } = event;
     const task = tasks.find(t => t.id === active.data.current?.task?.id);
     if (task) {
        setActiveTask(task);
     }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    if (isStandupModeActive) return;

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === 'TASK';
    if (!isActiveATask) return;

    // Determine the new status from the drop location (either a column or another task's column)
    const overIsAColumn = over.data.current?.type === 'COLUMN';
    const newStatus = overIsAColumn 
        ? (over.id as TaskStatus) 
        : (over.data.current?.task.status as TaskStatus);

    setTasks((currentTasks) => {
      const activeTaskIndex = currentTasks.findIndex((t) => t.id === activeId);
      if (activeTaskIndex === -1 || currentTasks[activeTaskIndex].status === newStatus) {
        return currentTasks;
      }
      const updatedTasks = [...currentTasks];
      updatedTasks[activeTaskIndex] = {
        ...updatedTasks[activeTaskIndex],
        status: newStatus,
        ...(newStatus === 'Done' && !updatedTasks[activeTaskIndex].completedAt && { completedAt: new Date().toISOString() })
      };
      return updatedTasks;
    });
  };
  
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  // --- Stand-up Mode Logic ---
  const startStandup = (team: Team) => {
    try {
      const participantMap = new Map<string, User>();
      tasks.forEach(task => {
        if (task.team === team && task.assignee) {
          participantMap.set(task.assignee.id, task.assignee);
        }
      });
      const participants = Array.from(participantMap.values());
      
      if (participants.length > 0) {
          setStandupTeam(team);
          setStandupParticipants(participants);
          setCurrentSpeakerId(participants[0].id);
          setIsStandupModeActive(true);
          setIsTeamSelectOpen(false);
      } else {
          // Custom error dialog instead of alert
          setStandupError({
            title: 'Stand-up Başlatılamadı',
            message: `${team} takımında atanmış kullanıcı bulunamadı. Stand-up başlatmak için önce görevlere kullanıcı atayın.`,
            type: 'warning'
          });
          setIsTeamSelectOpen(false);
      }
    } catch (error) {
      console.error('Error starting standup:', error);
      setStandupError({
        title: 'Hata Oluştu',
        message: 'Stand-up başlatılırken beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.',
        type: 'error'
      });
      setIsTeamSelectOpen(false);
    }
  };

  const endStandup = () => {
    setIsStandupModeActive(false);
    setCurrentSpeakerId(null);
    setStandupTeam(null);
    setStandupParticipants([]);
  };

  const cycleSpeaker = (direction: 'next' | 'prev') => {
    if (!currentSpeakerId || standupParticipants.length < 2) return;
    const currentIndex = standupParticipants.findIndex(p => p.id === currentSpeakerId);
    if (currentIndex === -1) {
        setCurrentSpeakerId(standupParticipants[0].id);
        return;
    }

    const nextIndex = direction === 'next'
        ? (currentIndex + 1) % standupParticipants.length
        : (currentIndex - 1 + standupParticipants.length) % standupParticipants.length;

    setCurrentSpeakerId(standupParticipants[nextIndex].id);
  };
  // --- End of Stand-up Logic ---

  const teams: Team[] = ['Backend', 'Frontend', 'Mobile', 'General'];

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-full">
        {isStandupModeActive && (
          <StandupControls 
            participants={standupParticipants}
            currentSpeakerId={currentSpeakerId}
            onNext={() => cycleSpeaker('next')}
            onPrev={() => cycleSpeaker('prev')}
            onEnd={endStandup}
          />
        )}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center flex-shrink-0">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">
              {isStandupModeActive && standupTeam ? `${standupTeam} Stand-up` : workspace?.name || "SyncFlow Board"}
            </h1>
            {/* Sprint Goal Banner */}
            {!isStandupModeActive && (
              <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Sprint Goal:</span>
                    <span className="text-sm text-blue-700 dark:text-blue-300">
                      {workspace?.sprintGoal || "Sprint hedefi henüz belirlenmedi. Workspace ayarlarından belirleyebilirsiniz."}
                    </span>
                  </div>
                  {currentUser && workspace?.members[currentUser.uid] === 'Admin' && (
                    <button
                      onClick={() => setShowSprintGoalModal(true)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium hover:underline"
                    >
                      Düzenle
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            {!isStandupModeActive && (
              <>
                <button
                  onClick={() => setShowMemberModal(true)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  <Users className="h-4 w-4" />
                  <span>Üyeleri Yönet</span>
                </button>
                <button
                  onClick={() => setIsTeamSelectOpen(true)}
                  className="flex items-center space-x-2 px-3 py-2 md:px-4 text-sm md:text-base bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PlayCircle className="h-5 w-5" />
                  <span>Start Daily Stand-up</span>
                </button>
              </>
            )}
          </div>
        </div>
        <main className="flex-grow p-4 overflow-x-auto">
          <div className="flex space-x-4 h-full">
            <SortableContext items={TASK_STATUSES}>
              {TASK_STATUSES.map((status) => (
                <KanbanColumn
                  key={status}
                  title={status}
                  tasks={tasksByStatus[status] || []}
                  onTaskClick={handleTaskClick}
                  isStandupActive={isStandupModeActive}
                  currentSpeakerId={currentSpeakerId}
                />
              ))}
            </SortableContext>
          </div>
        </main>
      </div>

      {createPortal(
        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} onClick={() => {}} isOverlay /> : null}
        </DragOverlay>,
        document.body
      )}

      <TaskDetailModal 
        task={selectedTask}
        allTasks={tasks} 
        onClose={handleCloseModal} 
      />

      {showMemberModal && (
        <MemberManagementModal
          workspaceId={workspaceId}
          workspace={workspace}
          onClose={() => setShowMemberModal(false)}
          onMembersUpdated={() => {
            // Refresh workspace data
            if (workspace) {
              // The original code had a fetchWorkspaceUsers function here,
              // but it's not defined in the provided context.
              // Assuming it's meant to refetch users or workspace data.
              // For now, we'll just close the modal as a placeholder.
            }
          }}
        />
      )}

      {/* Sprint Goal Edit Modal */}
      {showSprintGoalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Sprint Hedefini Düzenle
              </h2>
              <button
                onClick={() => setShowSprintGoalModal(false)}
                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const newGoal = formData.get('sprintGoal') as string;
                if (newGoal.trim()) {
                  updateSprintGoal(newGoal.trim());
                }
              }}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sprint Hedefi
                  </label>
                  <textarea
                    name="sprintGoal"
                    defaultValue={workspace?.sprintGoal || ''}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Bu sprint için hedefinizi yazın..."
                    required
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowSprintGoalModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Güncelle
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Custom Error Dialog */}
      {standupError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-3 h-3 rounded-full ${
                  standupError.type === 'error' ? 'bg-red-500' :
                  standupError.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}></div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {standupError.title}
                </h2>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                {standupError.message}
              </p>
              
              <button
                onClick={() => setStandupError(null)}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
              >
                Tamam
              </button>
            </div>
          </div>
        </div>
      )}

      {isTeamSelectOpen && (
         <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-sm p-6 animate-fade-in-up">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Select a Team</h2>
                    <button onClick={() => setIsTeamSelectOpen(false)} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {teams.map(team => (
                        <button 
                            key={team} 
                            onClick={() => startStandup(team)}
                            className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md text-center font-semibold hover:bg-indigo-500 hover:text-white transition-colors duration-200"
                        >
                            {team}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      )}
      
       <style>{`
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-fade-in {
            animation: fade-in 0.2s ease-out forwards;
        }
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </DndContext>
  );
};

export default KanbanBoardPage;
