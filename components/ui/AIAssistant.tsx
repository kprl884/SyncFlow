import React, { useState } from 'react';
import { Bot, Send, Loader2, X } from 'lucide-react';
import { aiService } from '../../src/lib/ai-service';

interface AIAssistantProps {
  workspaceId?: string;
  onTaskSuggestion?: (suggestion: string) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ workspaceId, onTaskSuggestion }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message to conversation
    const newConversation = [...conversation, { role: 'user', content: userMessage }];
    setConversation(newConversation);

    try {
      let aiResponse: string;
      
                          // Handle different types of requests
                    if (userMessage.toLowerCase().includes('task suggestion') || userMessage.toLowerCase().includes('suggest')) {
                      const result = await aiService.generateTaskDescription(userMessage);
                      aiResponse = `Görev Önerisi:\n\n${result.userStory}\n\nKabul Kriterleri:\n${result.acceptanceCriteria.map(criteria => `• ${criteria}`).join('\n')}`;
                    } else if (userMessage.toLowerCase().includes('description') || userMessage.toLowerCase().includes('describe')) {
                      const result = await aiService.generateTaskDescription(userMessage);
                      aiResponse = `Görev Açıklaması:\n\n${result.userStory}\n\nKabul Kriterleri:\n${result.acceptanceCriteria.map(criteria => `• ${criteria}`).join('\n')}`;
                    } else {
                      // General conversation - check if it's a task creation or general question
                      const isTaskCreation = userMessage.toLowerCase().includes('oluştur') || 
                                           userMessage.toLowerCase().includes('yap') || 
                                           userMessage.toLowerCase().includes('ekle') ||
                                           userMessage.toLowerCase().includes('task') ||
                                           userMessage.toLowerCase().includes('görev');
                      
                      if (isTaskCreation) {
                        const result = await aiService.generateTaskDescription(userMessage);
                        aiResponse = `Görev Açıklaması:\n\n${result.userStory}\n\nKabul Kriterleri:\n${result.acceptanceCriteria.map(criteria => `• ${criteria}`).join('\n')}`;
                      } else {
                        // General question - get direct answer
                        const result = await aiService.generateTaskDescription(userMessage);
                        aiResponse = `Yanıt:\n\n${result.userStory}`;
                      }
                    }

      // Add AI response to conversation
      setConversation([...newConversation, { role: 'assistant', content: aiResponse }]);
      setResponse(aiResponse);

      // If it's a task suggestion, notify parent component
      if (onTaskSuggestion && (userMessage.toLowerCase().includes('task suggestion') || userMessage.toLowerCase().includes('suggest'))) {
        onTaskSuggestion(aiResponse);
      }
    } catch (error) {
      console.error('❌ AI Assistant Error:', error);
      
      let errorMessage = 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.';
      
      // Daha spesifik hata mesajları
      if (error instanceof Error) {
        console.log('🔍 Error message:', error.message);
        if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'İnternet bağlantınızı kontrol edin ve tekrar deneyin.';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'İstek zaman aşımına uğradı. Lütfen tekrar deneyin.';
        } else if (error.message.includes('quota') || error.message.includes('limit')) {
          errorMessage = 'API limiti aşıldı. Lütfen daha sonra tekrar deneyin.';
        } else if (error.message.includes('İnternet bağlantınızı kontrol edin')) {
          errorMessage = '🌐 İnternet bağlantınızı kontrol edin ve tekrar deneyin.';
        } else if (error.message.includes('AI servisi hatası')) {
          errorMessage = `AI Servis Hatası: ${error.message}`;
        }
      }
      
      console.log('📝 Error message to user:', errorMessage);
      setConversation([...newConversation, { role: 'assistant', content: errorMessage }]);
      setResponse(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { label: 'Görev önerisi al', action: 'Bu workspace için 3-5 görev önerisi verebilir misin?' },
    { label: 'Görev açıklaması oluştur', action: 'Görev açıklaması oluşturmak için yardım eder misin?' },
    { label: 'Verimlilik ipuçları', action: 'Bu workspace için verimlilik ipuçları verebilir misin?' }
  ];

  const handleQuickAction = (action: string) => {
    setInput(action);
  };

  return (
    <>
      {/* Floating AI Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-50"
        aria-label="AI Asistan'ı aç"
      >
        <Bot className="h-6 w-6" />
      </button>

      {/* AI Assistant Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl h-[600px] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <Bot className="h-6 w-6 text-indigo-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  AI Asistan
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Hızlı Eylemler:
              </h3>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.action)}
                    className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                          {conversation.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <Bot className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Merhaba! Size nasıl yardımcı olabilirim?</p>
              </div>
            )}
              
              {conversation.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Mesajınızı yazın..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-md transition-colors disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
