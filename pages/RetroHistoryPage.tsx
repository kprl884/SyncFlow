import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RetroSession } from '../src/types';
import { retroService } from '../src/lib/retro-service';
import { useAuth } from '../src/context/AuthContext';
import {
  Plus,
  Clock,
  Users,
  Calendar,
  Play,
  CheckCircle,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  Filter,
  Search,
  MessageSquare
} from 'lucide-react';
import toast from 'react-hot-toast';

interface RetroHistoryPageProps {
  workspaceId: string;
}

const RetroHistoryPage: React.FC<RetroHistoryPageProps> = ({ workspaceId }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [sessions, setSessions] = useState<RetroSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'active' | 'completed'>('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
  }, [workspaceId]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const workspaceSessions = await retroService.getWorkspaceSessions(workspaceId);
      setSessions(workspaceSessions);
    } catch (error) {
      console.error('Error loading sessions:', error);
      toast.error('Failed to load retrospective sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      // Here you would call the service to delete the session
      console.log('Deleting session:', sessionId);
      toast.success('Session deleted successfully');
      setShowDeleteConfirm(null);
      loadSessions(); // Reload the list
    } catch (error) {
      console.error('Error deleting session:', error);
      toast.error('Failed to delete session');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200', icon: Clock },
      active: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: Play },
      completed: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: CheckCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        <Icon className="h-3 w-3" />
        <span className="capitalize">{status}</span>
      </span>
    );
  };

  const getPhaseBadge = (phase: string) => {
    const phaseConfig = {
      brainstorming: { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', label: 'Brainstorming' },
      voting: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', label: 'Voting' },
      discussion: { color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200', label: 'Discussion' },
      actionPlanning: { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200', label: 'Action Planning' },
      completed: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', label: 'Completed' }
    };

    const config = phaseConfig[phase as keyof typeof phaseConfig] || phaseConfig.brainstorming;

    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const canManageSession = (session: RetroSession) => {
    return currentUser && (
      session.facilitatorId === currentUser.uid ||
      session.participants.some(p => p.userId === currentUser.uid && p.permissions.canManageSession)
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Retrospectives
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Review and manage your team's retrospective sessions
              </p>
            </div>
            
            <button
              onClick={() => navigate(`/workspace/${workspaceId}/retros/new`)}
              className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              <Plus className="h-5 w-5" />
              <span>New Retrospective</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search retrospectives..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {filteredSessions.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No retrospectives yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Get started by creating your first retrospective session
            </p>
            <button
              onClick={() => navigate(`/workspace/${workspaceId}/retros/new`)}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              <Plus className="h-5 w-5" />
              <span>Create First Retrospective</span>
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
                        {session.title}
                      </h3>
                      {getStatusBadge(session.status)}
                      {session.status === 'active' && getPhaseBadge(session.currentPhase)}
                    </div>
                    
                    {session.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {session.description}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{session.participants.length} participants</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(session.createdAt)}</span>
                      </div>
                      
                      {session.duration > 0 && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{session.duration} min</span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-1">
                        <BarChart3 className="h-4 w-4" />
                        <span>{session.notes.length} notes</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {/* View/Join Button */}
                    <button
                      onClick={() => navigate(`/workspace/${workspaceId}/retros/${session.id}`)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        session.status === 'active'
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {session.status === 'active' ? 'Join Session' : 'View Details'}
                    </button>
                    
                    {/* Manage Actions */}
                    {canManageSession(session) && (
                      <>
                        <button
                          onClick={() => navigate(`/workspace/${workspaceId}/retros/${session.id}`)}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Edit session"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => setShowDeleteConfirm(session.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete session"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Delete Retrospective
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete this retrospective session? This action cannot be undone.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteSession(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RetroHistoryPage;
