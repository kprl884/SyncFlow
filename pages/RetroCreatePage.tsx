import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RetroTemplate, RetroSessionSettings } from '../src/types';
import { retroService } from '../src/lib/retro-service';
import { useAuth } from '../src/context/AuthContext';
import {
  ArrowLeft,
  Clock,
  Users,
  Eye,
  MessageSquare,
  ThumbsUp,
  Target,
  CheckCircle,
  Settings,
  Play
} from 'lucide-react';
import toast from 'react-hot-toast';

interface RetroCreatePageProps {
  workspaceId: string;
}

const RetroCreatePage: React.FC<RetroCreatePageProps> = ({ workspaceId }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('standard');
  const [duration, setDuration] = useState(60);
  const [settings, setSettings] = useState<RetroSessionSettings>({
    allowAnonymous: true,
    allowPrivateNotes: false,
    enableVoting: true,
    maxVotesPerUser: 5,
    timerEnabled: true,
    phaseDurations: {
      brainstorming: 15,
      voting: 5,
      discussion: 20,
      actionPlanning: 10,
      completed: 0
    },
    enableGrouping: true,
    autoAdvancePhases: false
  });
  const [creating, setCreating] = useState(false);

  const templates = retroService.getTemplates();

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = retroService.getTemplate(templateId);
    if (template && template.defaultSettings) {
      setSettings(prev => ({
        ...prev,
        ...template.defaultSettings
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !title.trim()) return;

    setCreating(true);
    try {
      const sessionId = await retroService.createSession(
        workspaceId,
        currentUser.uid,
        currentUser.displayName || 'Anonymous',
        {
          title: title.trim(),
          description: description.trim(),
          template: selectedTemplate as any,
          duration,
          settings
        }
      );

      toast.success('Retrospective created successfully!');
      navigate(`/workspace/${workspaceId}/retros/${sessionId}`);
    } catch (error) {
      console.error('Error creating retrospective:', error);
      toast.error('Failed to create retrospective');
    } finally {
      setCreating(false);
    }
  };

  const updatePhaseDuration = (phase: keyof typeof settings.phaseDurations, minutes: number) => {
    setSettings(prev => ({
      ...prev,
      phaseDurations: {
        ...prev.phaseDurations,
        [phase]: minutes
      }
    }));
  };

  const totalPhaseDuration = Object.values(settings.phaseDurations).reduce((sum, duration) => sum + duration, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(`/workspace/${workspaceId}/retros`)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Create New Retrospective
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Set up a new retrospective session for your team
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6">
        <div className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Basic Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Session Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Sprint 23 Retrospective"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add any context or goals for this retrospective..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Estimated Duration (minutes)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  min="15"
                  max="180"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Template Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Choose Template
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                    selectedTemplate === template.id
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                  }`}
                  onClick={() => handleTemplateChange(template.id)}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`w-4 h-4 rounded-full border-2 transition-colors ${
                      selectedTemplate === template.id
                        ? 'border-indigo-500 bg-indigo-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {selectedTemplate === template.id && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {template.name}
                    </h3>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {template.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {template.categories.map((category) => (
                      <span
                        key={category.id}
                        className="inline-flex items-center space-x-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                      >
                        <span>{category.icon}</span>
                        <span>{category.title}</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Session Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Session Settings
            </h2>
            
            <div className="space-y-6">
              {/* Participation Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Participation
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.allowAnonymous}
                      onChange={(e) => setSettings(prev => ({ ...prev, allowAnonymous: e.target.checked }))}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Allow anonymous notes
                    </span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.allowPrivateNotes}
                      onChange={(e) => setSettings(prev => ({ ...prev, allowPrivateNotes: e.target.checked }))}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Allow private notes (facilitator only)
                    </span>
                  </label>
                </div>
              </div>

              {/* Voting Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Voting
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.enableVoting}
                      onChange={(e) => setSettings(prev => ({ ...prev, enableVoting: e.target.checked }))}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Enable voting on notes
                    </span>
                  </label>
                  
                  {settings.enableVoting && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Maximum votes per participant
                      </label>
                      <input
                        type="number"
                        value={settings.maxVotesPerUser}
                        onChange={(e) => setSettings(prev => ({ ...prev, maxVotesPerUser: Number(e.target.value) }))}
                        min="1"
                        max="20"
                        className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Timer Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Timer & Phases
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.timerEnabled}
                      onChange={(e) => setSettings(prev => ({ ...prev, timerEnabled: e.target.checked }))}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Enable phase timers
                    </span>
                  </label>
                  
                  {settings.timerEnabled && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Brainstorming (min)
                        </label>
                        <input
                          type="number"
                          value={settings.phaseDurations.brainstorming}
                          onChange={(e) => updatePhaseDuration('brainstorming', Number(e.target.value))}
                          min="5"
                          max="60"
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Voting (min)
                        </label>
                        <input
                          type="number"
                          value={settings.phaseDurations.voting}
                          onChange={(e) => updatePhaseDuration('voting', Number(e.target.value))}
                          min="2"
                          max="30"
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Discussion (min)
                        </label>
                        <input
                          type="number"
                          value={settings.phaseDurations.discussion}
                          onChange={(e) => updatePhaseDuration('discussion', Number(e.target.value))}
                          min="5"
                          max="60"
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Action Planning (min)
                        </label>
                        <input
                          type="number"
                          value={settings.phaseDurations.actionPlanning}
                          onChange={(e) => updatePhaseDuration('actionPlanning', Number(e.target.value))}
                          min="5"
                          max="60"
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  )}
                  
                  {settings.timerEnabled && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Total phase time: {totalPhaseDuration} minutes
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(`/workspace/${workspaceId}/retros`)}
              className="px-6 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || creating}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {creating ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <Play className="h-4 w-4" />
              )}
              <span>{creating ? 'Creating...' : 'Create Retrospective'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RetroCreatePage;
