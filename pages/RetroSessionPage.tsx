import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RetroSession, RetroTemplate } from '../src/types';
import { retroService } from '../src/lib/retro-service';
import { useAuth } from '../src/context/AuthContext';
import RetroBoard from '../components/retro/RetroBoard';
import RetroControls from '../components/retro/RetroControls';
import RetroParticipants from '../components/retro/RetroParticipants';
import {
  ArrowLeft,
  Users,
  Settings,
  Play,
  Pause,
  Square,
  Clock,
  MessageSquare,
  BarChart3,
  Download,
  Share2
} from 'lucide-react';
import toast from 'react-hot-toast';

interface RetroSessionPageProps {
  workspaceId: string;
}

const RetroSessionPage: React.FC<RetroSessionPageProps> = ({ workspaceId }) => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [session, setSession] = useState<RetroSession | null>(null);
  const [template, setTemplate] = useState<RetroTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    if (!sessionId) return;
    
    loadSession();
    const unsubscribe = retroService.onSessionUpdate(sessionId, (updatedSession) => {
      setSession(updatedSession);
      if (updatedSession.template && typeof updatedSession.template === 'string') {
        const templateData = retroService.getTemplate(updatedSession.template);
        setTemplate(templateData || null);
      }
    });

    return unsubscribe;
  }, [sessionId]);

  const loadSession = async () => {
    try {
      setLoading(true);
      const sessionData = await retroService.getSession(sessionId!);
      if (!sessionData) {
        toast.error('Retrospective session not found');
        navigate(`/workspace/${workspaceId}/retros`);
        return;
      }

      setSession(sessionData);
      
      if (typeof sessionData.template === 'string') {
        const templateData = retroService.getTemplate(sessionData.template);
        setTemplate(templateData || null);
      }
    } catch (error) {
      console.error('Error loading session:', error);
      toast.error('Failed to load retrospective session');
    } finally {
      setLoading(false);
    }
  };

  const handlePhaseChange = async (newPhase: string) => {
    if (!session || !currentUser) return;

    try {
      await retroService.changePhase(session.id, newPhase as any);
      toast.success(`Phase changed to ${newPhase}`);
    } catch (error) {
      console.error('Error changing phase:', error);
      toast.error('Failed to change phase');
    }
  };

  const handleStartSession = async () => {
    if (!session || !currentUser) return;

    try {
      await retroService.startSession(session.id);
      toast.success('Session started!');
    } catch (error) {
      console.error('Error starting session:', error);
      toast.error('Failed to start session');
    }
  };

  const handleCompleteSession = async () => {
    if (!session || !currentUser) return;

    try {
      await retroService.completeSession(session.id);
      toast.success('Session completed!');
    } catch (error) {
      console.error('Error completing session:', error);
      toast.error('Failed to complete session');
    }
  };

  const startTimer = () => {
    if (!session || !session.settings.timerEnabled) return;
    
    const phaseDuration = session.settings.phaseDurations[session.currentPhase];
    if (phaseDuration <= 0) return;

    setTimer(phaseDuration * 60); // Convert to seconds
    setTimerRunning(true);
  };

  const pauseTimer = () => {
    setTimerRunning(false);
  };

  const stopTimer = () => {
    setTimer(null);
    setTimerRunning(false);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerRunning && timer && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev && prev > 0) {
            return prev - 1;
          } else {
            setTimerRunning(false);
            return null;
          }
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timerRunning, timer]);

  const formatTimer = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const isFacilitator = currentUser && session?.facilitatorId === currentUser.uid;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Session Not Found
          </h2>
          <button
            onClick={() => navigate(`/workspace/${workspaceId}/retros`)}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Retrospectives
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/workspace/${workspaceId}/retros`)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {session.title}
                </h1>
                {session.description && (
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {session.description}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Timer */}
              {session.settings.timerEnabled && timer && (
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <span className="font-mono text-lg font-semibold text-gray-900 dark:text-white">
                    {formatTimer(timer)}
                  </span>
                  <div className="flex items-center space-x-1">
                    {!timerRunning ? (
                      <button
                        onClick={startTimer}
                        className="p-1 text-green-600 hover:text-green-700 transition-colors"
                        title="Start timer"
                      >
                        <Play className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={pauseTimer}
                        className="p-1 text-yellow-600 hover:text-yellow-700 transition-colors"
                        title="Pause timer"
                      >
                        <Pause className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={stopTimer}
                      className="p-1 text-red-600 hover:text-red-700 transition-colors"
                      title="Stop timer"
                    >
                      <Square className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Session Controls */}
              {isFacilitator && (
                <div className="flex items-center space-x-2">
                  {session.status === 'draft' && (
                    <button
                      onClick={handleStartSession}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Play className="h-4 w-4" />
                      <span>Start Session</span>
                    </button>
                  )}
                  
                  {session.status === 'active' && session.currentPhase === 'actionPlanning' && (
                    <button
                      onClick={handleCompleteSession}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Square className="h-4 w-4" />
                      <span>Complete Session</span>
                    </button>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowParticipants(true)}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Users className="h-4 w-4" />
                  <span>{session.participants.length}</span>
                </button>
                
                {isFacilitator && (
                  <button
                    onClick={() => setShowSettings(true)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Session settings"
                  >
                    <Settings className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Session Status Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  session.status === 'active' ? 'bg-green-500' : 
                  session.status === 'completed' ? 'bg-blue-500' : 'bg-gray-500'
                }`}></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {session.status}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {session.notes.length} notes
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {session.actionItems.length} action items
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Download className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Phase Controls */}
      {session.status === 'active' && (
        <RetroControls
          currentPhase={session.currentPhase}
          onPhaseChange={handlePhaseChange}
          settings={session.settings}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Retro Board */}
        <div className="flex-1">
          <RetroBoard
            session={session}
            template={template}
            currentUser={currentUser}
            isFacilitator={isFacilitator}
          />
        </div>

        {/* Participants Sidebar */}
        {showParticipants && (
          <div className="w-80 border-l border-gray-200 dark:border-gray-700">
            <RetroParticipants
              participants={session.participants}
              facilitatorId={session.facilitatorId}
              onClose={() => setShowParticipants(false)}
            />
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Session Settings
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    Current Settings
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Anonymous Notes:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">
                        {session.settings.allowAnonymous ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Voting:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">
                        {session.settings.enableVoting ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Timer:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">
                        {session.settings.timerEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Max Votes:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">
                        {session.settings.maxVotesPerUser}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    Phase Durations
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(session.settings.phaseDurations).map(([phase, duration]) => (
                      <div key={phase} className="text-center">
                        <div className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                          {phase}
                        </div>
                        <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                          {duration}m
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RetroSessionPage;
