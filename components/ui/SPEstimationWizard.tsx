import React, { useState, useEffect } from 'react';
import { X, Calculator, History, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { Task } from '../../types';
import { findSimilarTasks, calculateSuggestion } from '../../src/lib/analysis';

interface SPEstimationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onComplete: (storyPoints: number) => void;
  allTasks: Task[];
}

interface EstimationForm {
  domains: {
    frontend: boolean;
    backend: boolean;
    database: boolean;
    cicd: boolean;
    design: boolean;
    qa: boolean;
  };
  technicalComplexity: {
    apiImpact: number;
    uiImpact: number;
    databaseImpact: boolean;
  };
  uncertainty: 'low' | 'medium' | 'high';
}

const SPEstimationWizard: React.FC<SPEstimationWizardProps> = ({
  isOpen,
  onClose,
  task,
  onComplete,
  allTasks
}) => {
  const [form, setForm] = useState<EstimationForm>({
    domains: {
      frontend: false,
      backend: false,
      database: false,
      cicd: false,
      design: false,
      qa: false
    },
    technicalComplexity: {
      apiImpact: 0,
      uiImpact: 0,
      databaseImpact: false
    },
    uncertainty: 'medium'
  });

  const [suggestion, setSuggestion] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [finalSP, setFinalSP] = useState<number | null>(null);

  const fibonacciNumbers = [1, 2, 3, 5, 8, 13, 21];

  const handleDomainChange = (domain: keyof typeof form.domains) => {
    setForm(prev => ({
      ...prev,
      domains: {
        ...prev.domains,
        [domain]: !prev.domains[domain]
      }
    }));
  };

  const handleTechnicalChange = (field: keyof typeof form.technicalComplexity, value: number | boolean) => {
    setForm(prev => ({
      ...prev,
      technicalComplexity: {
        ...prev.technicalComplexity,
        [field]: value
      }
    }));
  };

  const analyzeTask = async () => {
    setIsAnalyzing(true);
    
    try {
      // Form verilerini task characteristics'e dönüştür
      const taskCharacteristics = {
        domains: Object.keys(form.domains).filter(key => form.domains[key as keyof typeof form.domains]),
        technicalComplexity: form.technicalComplexity,
        uncertainty: form.uncertainty
      };

      // Benzer task'ları bul
      const similarTasks = findSimilarTasks(taskCharacteristics, allTasks);
      
      // Öneriyi hesapla
      const suggestionResult = calculateSuggestion(similarTasks);
      
      setSuggestion(suggestionResult);
    } catch (error) {
      console.error('Task analizi hatası:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = () => {
    if (finalSP !== null) {
      onComplete(finalSP);
      onClose();
    }
  };

  const isFormValid = () => {
    const hasDomains = Object.values(form.domains).some(Boolean);
    return hasDomains && form.uncertainty;
  };

  useEffect(() => {
    if (suggestion && !finalSP) {
      setFinalSP(suggestion.suggestedSP);
    }
  }, [suggestion]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Calculator className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Story Point Tahmin Sihirbazı
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Task Bilgisi */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Task: {task.title}</h3>
            <p className="text-sm text-blue-700">{task.description}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sol Taraf - Form */}
            <div className="space-y-6">
              {/* Domain of Work */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  Çalışma Alanları
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(form.domains).map(([key, value]) => (
                    <label key={key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() => handleDomainChange(key as keyof typeof form.domains)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 capitalize">
                        {key === 'cicd' ? 'CI/CD' : key === 'qa' ? 'QA/Testing' : key}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Technical Complexity */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                  Teknik Karmaşıklık
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Etkisi: {form.technicalComplexity.apiImpact} endpoint
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={form.technicalComplexity.apiImpact}
                      onChange={(e) => handleTechnicalChange('apiImpact', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0</span>
                      <span>5</span>
                      <span>10+</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      UI Etkisi: {form.technicalComplexity.uiImpact} ekran/component
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={form.technicalComplexity.uiImpact}
                      onChange={(e) => handleTechnicalChange('uiImpact', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0</span>
                      <span>5</span>
                      <span>10+</span>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={form.technicalComplexity.databaseImpact}
                        onChange={(e) => handleTechnicalChange('databaseImpact', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        Database şema değişikliği veya karmaşık sorgular gerekiyor
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Uncertainty & Risk */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                  Belirsizlik & Risk
                </h3>
                <div className="space-y-2">
                  {[
                    { value: 'low', label: 'Düşük: İyi tanımlanmış, geçmiş işlere benzer', color: 'text-green-600' },
                    { value: 'medium', label: 'Orta: Bazı bilinmeyenler, küçük araştırma gerekli', color: 'text-yellow-600' },
                    { value: 'high', label: 'Yüksek: Önemli araştırma, yeni teknoloji veya çok fazla dış bağımlılık', color: 'text-red-600' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="uncertainty"
                        value={option.value}
                        checked={form.uncertainty === option.value}
                        onChange={(e) => setForm(prev => ({ ...prev, uncertainty: e.target.value as 'low' | 'medium' | 'high' }))}
                        className="border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className={`text-sm ${option.color}`}>
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Analyze Button */}
              <button
                onClick={analyzeTask}
                disabled={!isFormValid() || isAnalyzing}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Analiz Ediliyor...</span>
                  </>
                ) : (
                  <>
                    <Calculator className="h-4 w-4" />
                    <span>Task'ı Analiz Et</span>
                  </>
                )}
              </button>
            </div>

            {/* Sağ Taraf - Suggestion Area */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <History className="h-5 w-5 text-purple-600 mr-2" />
                Akıllı Öneri
              </h3>

              {!suggestion ? (
                <div className="text-center py-12 text-gray-500">
                  <Calculator className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Formu doldurun ve "Task'ı Analiz Et" butonuna tıklayın</p>
                  <p className="text-sm mt-1">Sistem geçmiş verileri analiz ederek öneri sunacak</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Recommended SP */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-900 mb-2">
                        {suggestion.suggestedSP} SP
                      </div>
                      <div className="text-sm text-blue-700">
                        Önerilen Story Point
                      </div>
                    </div>
                  </div>

                  {/* Rationale */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Analiz Sonucu</h4>
                    <p className="text-sm text-gray-700">
                      {suggestion.similarTasks.length} benzer tamamlanmış task analiz edildi.
                      Ortalama tamamlanma süresi: {suggestion.averageCompletionDays?.toFixed(1) || 'N/A'} gün.
                    </p>
                  </div>

                  {/* Similar Tasks */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Benzer Task'lar</h4>
                    <div className="space-y-2">
                      {suggestion.similarTasks.map((task: Task, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                          <div className="flex-1">
                            <div className="font-medium text-sm text-gray-900">{task.title}</div>
                            <div className="text-xs text-gray-500">{task.storyPoints} SP • {task.status}</div>
                          </div>
                          <div className="text-xs text-gray-400">
                            {task.assignee?.name || 'Atanmamış'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Final SP Selection */}
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-medium text-yellow-900 mb-2">Final Story Point Seçimi</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {fibonacciNumbers.map((sp) => (
                        <button
                          key={sp}
                          onClick={() => setFinalSP(sp)}
                          className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                            finalSP === sp
                              ? 'bg-yellow-600 text-white'
                              : 'bg-white text-yellow-700 border border-yellow-300 hover:bg-yellow-100'
                          }`}
                        >
                          {sp}
                        </button>
                      ))}
                    </div>
                    <div className="mt-3 text-xs text-yellow-700">
                      Önerilen: {suggestion.suggestedSP} SP • Seçilen: {finalSP || 'Henüz seçilmedi'}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={finalSP === null}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    {finalSP ? `${finalSP} SP ile Kaydet` : 'Story Point Seçin'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SPEstimationWizard;
