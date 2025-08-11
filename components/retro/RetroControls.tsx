import React from 'react';
import { RetroPhase, RetroSessionSettings } from '../../src/types';
import { 
  MessageSquare, 
  ThumbsUp, 
  MessageCircle, 
  Target, 
  CheckCircle,
  ChevronRight,
  Play,
  Clock,
  Users
} from 'lucide-react';

interface RetroControlsProps {
  currentPhase: RetroPhase;
  onPhaseChange: (phase: RetroPhase) => void;
  settings: RetroSessionSettings;
}

const RetroControls: React.FC<RetroControlsProps> = ({
  currentPhase,
  onPhaseChange,
  settings
}) => {
  const phases: { id: RetroPhase; title: string; icon: React.ReactNode; description: string }[] = [
    {
      id: 'brainstorming',
      title: 'Brainstorming',
      icon: <MessageSquare className="h-5 w-5" />,
      description: 'Collect thoughts and ideas'
    },
    {
      id: 'voting',
      title: 'Voting',
      icon: <ThumbsUp className="h-5 w-5" />,
      description: 'Vote on important items'
    },
    {
      id: 'discussion',
      title: 'Discussion',
      icon: <MessageCircle className="h-5 w-5" />,
      description: 'Discuss and group items'
    },
    {
      id: 'actionPlanning',
      title: 'Action Planning',
      icon: <Target className="h-5 w-5" />,
      description: 'Create actionable next steps'
    },
    {
      id: 'completed',
      title: 'Completed',
      icon: <CheckCircle className="h-5 w-5" />,
      description: 'Session finished'
    }
  ];

  const currentPhaseIndex = phases.findIndex(p => p.id === currentPhase);
  
  const canAdvance = (phase: RetroPhase) => {
    const phaseIndex = phases.findIndex(p => p.id === phase);
    return phaseIndex <= currentPhaseIndex + 1;
  };

  const getPhaseStatus = (phase: RetroPhase) => {
    const phaseIndex = phases.findIndex(p => p.id === phase);
    if (phaseIndex < currentPhaseIndex) return 'completed';
    if (phaseIndex === currentPhaseIndex) return 'current';
    return 'upcoming';
  };

  const getPhaseStyle = (phase: RetroPhase) => {
    const status = getPhaseStatus(phase);
    
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700';
      case 'current':
        return 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 border-indigo-300 dark:border-indigo-700 ring-2 ring-indigo-300 dark:ring-indigo-600';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600';
    }
  };

  const getPhaseDuration = (phase: RetroPhase) => {
    return settings.phaseDurations[phase] || 0;
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Session Progress
          </h3>
          
          {settings.timerEnabled && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span>Timer enabled</span>
            </div>
          )}
        </div>

        {/* Phase Progress Bar */}
        <div className="relative mb-6">
          <div className="flex items-center justify-between">
            {phases.map((phase, index) => (
              <React.Fragment key={phase.id}>
                {/* Phase Step */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => canAdvance(phase.id) ? onPhaseChange(phase.id) : undefined}
                    disabled={!canAdvance(phase.id)}
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200 ${getPhaseStyle(phase.id)} ${
                      canAdvance(phase.id) 
                        ? 'hover:scale-105 cursor-pointer' 
                        : 'cursor-not-allowed opacity-60'
                    }`}
                  >
                    {getPhaseStatus(phase.id) === 'completed' ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : getPhaseStatus(phase.id) === 'current' ? (
                      <Play className="h-6 w-6" />
                    ) : (
                      phase.icon
                    )}
                  </button>
                  
                  <div className="mt-2 text-center">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {phase.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 max-w-20">
                      {phase.description}
                    </div>
                    {settings.timerEnabled && (
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {getPhaseDuration(phase.id)}min
                      </div>
                    )}
                  </div>
                </div>

                {/* Connector Line */}
                {index < phases.length - 1 && (
                  <div className="flex-1 h-0.5 mx-4 relative">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        currentPhaseIndex > index 
                          ? 'bg-green-400 dark:bg-green-500' 
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                    <ChevronRight className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Current: <span className="font-medium text-gray-900 dark:text-white">
                {phases.find(p => p.id === currentPhase)?.title}
              </span>
            </div>
            
            {settings.timerEnabled && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Duration: <span className="font-medium text-gray-900 dark:text-white">
                  {getPhaseDuration(currentPhase)} minutes
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {/* Previous Phase */}
            {currentPhaseIndex > 0 && (
              <button
                onClick={() => onPhaseChange(phases[currentPhaseIndex - 1].id)}
                className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Previous
              </button>
            )}

            {/* Next Phase */}
            {currentPhaseIndex < phases.length - 1 && (
              <button
                onClick={() => onPhaseChange(phases[currentPhaseIndex + 1].id)}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
              >
                <span>Next Phase</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            )}

            {/* Complete Session */}
            {currentPhase === 'actionPlanning' && (
              <button
                onClick={() => onPhaseChange('completed')}
                className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Complete Session</span>
              </button>
            )}
          </div>
        </div>

        {/* Phase Instructions */}
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
            {phases.find(p => p.id === currentPhase)?.title} Phase
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {getPhaseInstructions(currentPhase, settings)}
          </p>
        </div>
      </div>
    </div>
  );
};

const getPhaseInstructions = (phase: RetroPhase, settings: RetroSessionSettings): string => {
  switch (phase) {
    case 'brainstorming':
      return `Add your thoughts and ideas to each category. ${settings.allowAnonymous ? 'You can post anonymously. ' : ''}Double-click on the board to quickly add notes.`;
    case 'voting':
      return `Vote on the most important items. You have ${settings.maxVotesPerUser} votes to distribute across all categories.`;
    case 'discussion':
      return `Discuss the highest voted items. ${settings.enableGrouping ? 'You can drag and drop notes to group similar items together. ' : ''}Focus on understanding the feedback and identifying patterns.`;
    case 'actionPlanning':
      return 'Create concrete action items based on the discussion. Assign owners and due dates for each action item.';
    case 'completed':
      return 'The retrospective session has been completed. Review the action items and ensure they are properly tracked.';
    default:
      return 'Follow the facilitator\'s guidance for this phase.';
  }
};

export default RetroControls;
