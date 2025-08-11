import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginPage from './src/pages/LoginPage';
import WorkspaceSelectorPage from './src/pages/WorkspaceSelectorPage';
import KanbanBoardPage from './pages/KanbanBoardPage';
import ReportsPage from './pages/ReportsPage';
import JiraIntegrationDemoPage from './pages/JiraIntegrationDemoPage';
import RetroHistoryPage from './pages/RetroHistoryPage';
import RetroCreatePage from './pages/RetroCreatePage';
import RetroSessionPage from './pages/RetroSessionPage';
import Avatar from './components/ui/Avatar';
import AIAssistant from './components/ui/AIAssistant';
import NotesSystem from './components/ui/NotesSystem';
import { mockTasks, mockSprints } from './data/mockData';
import { AreaChart, KanbanSquare, LogOut, ArrowLeft, BookOpen, Settings, MessageSquare } from 'lucide-react';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <svg className="animate-spin h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
);

const AppContent: React.FC = () => {
  const { currentUser, loading, signOutUser } = useAuth();

  console.log('AppContent: Auth state:', { currentUser: currentUser?.uid, loading });

  if (loading) {
    console.log('AppContent: Showing loading spinner');
    return <LoadingSpinner />;
  }

  if (!currentUser) {
    console.log('AppContent: No user, showing login page');
    return <LoginPage />;
  }

  console.log('AppContent: User authenticated, showing main app');

  return (
    <div className="flex flex-col h-screen text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900">
      <Routes>
        <Route path="/" element={<Navigate to="/workspaces" replace />} />
        <Route path="/workspaces" element={<WorkspaceSelectorPage />} />
        <Route path="/workspace/:workspaceId" element={<WorkspaceLayout />} />
        <Route path="/workspace/:workspaceId/reports" element={<WorkspaceLayout />} />
        <Route path="/workspace/:workspaceId/retros" element={<WorkspaceLayout />} />
        <Route path="/workspace/:workspaceId/retros/new" element={<RetroCreatePageWrapper />} />
        <Route path="/workspace/:workspaceId/retros/:sessionId" element={<RetroSessionPageWrapper />} />
        <Route path="/jira-integration" element={<JiraIntegrationDemoPage />} />
      </Routes>
    </div>
  );
};

const RetroCreatePageWrapper: React.FC = () => {
  const { workspaceId } = useParams();
  if (!workspaceId) return <div>Invalid workspace</div>;
  return <RetroCreatePage workspaceId={workspaceId} />;
};

const RetroSessionPageWrapper: React.FC = () => {
  const { workspaceId } = useParams();
  if (!workspaceId) return <div>Invalid workspace</div>;
  return <RetroSessionPage workspaceId={workspaceId} />;
};

const WorkspaceLayout: React.FC = () => {
  const { currentUser, signOutUser } = useAuth();
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<'board' | 'reports' | 'notes' | 'retros'>('board');

  const navItemClasses = "flex items-center space-x-2 px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer";
  const activeNavItemClasses = "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-50";
  const inactiveNavItemClasses = "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400";

  return (
    <>
      <header className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm z-20">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/workspaces')}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Back to workspaces"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('board'); }}>SyncFlow</a>
          </h1>
        </div>
        <div className="flex items-center space-x-4">
            <nav className="flex items-center space-x-2">
              <div onClick={() => setCurrentPage('board')} className={`${navItemClasses} ${currentPage === 'board' ? activeNavItemClasses : inactiveNavItemClasses}`}>
                <KanbanSquare className="h-5 w-5" />
                <span>Board</span>
              </div>
              <div onClick={() => setCurrentPage('reports')} className={`${navItemClasses} ${currentPage === 'reports' ? activeNavItemClasses : inactiveNavItemClasses}`}>
                <AreaChart className="h-5 w-5" />
                <span>Reports</span>
              </div>
              <div onClick={() => setCurrentPage('notes')} className={`${navItemClasses} ${currentPage === 'notes' ? activeNavItemClasses : inactiveNavItemClasses}`}>
                <BookOpen className="h-5 w-5" />
                <span>Notlar</span>
              </div>
              <div onClick={() => setCurrentPage('retros')} className={`${navItemClasses} ${currentPage === 'retros' ? activeNavItemClasses : inactiveNavItemClasses}`}>
                <MessageSquare className="h-5 w-5" />
                <span>Retros</span>
              </div>
            </nav>
            <div className="flex items-center space-x-3">
               <Avatar user={{ id: currentUser.uid, name: currentUser.displayName || 'User', avatarUrl: currentUser.photoURL || undefined }} />
               <button 
                 onClick={signOutUser} 
                 className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium" 
                 aria-label="Sign out"
               >
                   <LogOut className="h-4 w-4" />
                   <span>Çıkış Yap</span>
               </button>
            </div>
        </div>
      </header>
      <main className="flex-grow overflow-hidden">
        {currentPage === 'board' && <KanbanBoardPage workspaceId={workspaceId} />}
        {currentPage === 'reports' && <ReportsPage workspaceId={workspaceId} />}
        {currentPage === 'notes' && <NotesSystem workspaceId={workspaceId} tasks={mockTasks} sprints={mockSprints} />}
        {currentPage === 'retros' && <RetroHistoryPage workspaceId={workspaceId} />}
      </main>
      
      {/* AI Assistant */}
      <AIAssistant workspaceId={workspaceId} />
    </>
  );
};

export default App;