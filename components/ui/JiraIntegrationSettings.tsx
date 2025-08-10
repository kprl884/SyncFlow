import React, { useState, useEffect } from 'react';
import { JiraApiService, createJiraApiService, DEFAULT_JIRA_CONFIG } from '../../src/lib/jira-api';

interface JiraConfig {
  baseUrl: string;
  username: string;
  apiToken: string;
  projectKey: string;
}

interface JiraIntegrationSettingsProps {
  onConfigUpdate?: (config: JiraConfig) => void;
  onSync?: () => void;
}

const JiraIntegrationSettings: React.FC<JiraIntegrationSettingsProps> = ({
  onConfigUpdate,
  onSync
}) => {
  const [config, setConfig] = useState<JiraConfig>(DEFAULT_JIRA_CONFIG);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('');
  const [projectInfo, setProjectInfo] = useState<any>(null);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  // Load saved config from localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem('jiraConfig');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setConfig(parsed);
        // Test connection on load
        testConnection(parsed);
      } catch (error) {
        console.error('Failed to parse saved Jira config:', error);
      }
    }
  }, []);

  const saveConfig = (newConfig: JiraConfig) => {
    setConfig(newConfig);
    localStorage.setItem('jiraConfig', JSON.stringify(newConfig));
    onConfigUpdate?.(newConfig);
  };

  const testConnection = async (testConfig: JiraConfig = config) => {
    setIsTesting(true);
    setConnectionStatus('Testing connection...');
    
    try {
      const jiraService = createJiraApiService(testConfig);
      const connected = await jiraService.testConnection();
      
      if (connected) {
        setIsConnected(true);
        setConnectionStatus('✅ Connected successfully!');
        
        // Fetch project info
        try {
          const info = await jiraService.getProjectInfo();
          setProjectInfo(info);
        } catch (error) {
          console.error('Failed to fetch project info:', error);
        }
      } else {
        setIsConnected(false);
        setConnectionStatus('❌ Connection failed');
      }
    } catch (error) {
      setIsConnected(false);
      setConnectionStatus('❌ Connection error: ' + (error as Error).message);
    } finally {
      setIsTesting(false);
    }
  };

  const handleSync = async () => {
    if (!isConnected) {
      setConnectionStatus('❌ Please test connection first');
      return;
    }

    setIsSyncing(true);
    setConnectionStatus('Syncing with Jira...');
    
    try {
      const jiraService = createJiraApiService(config);
      await jiraService.syncWithJira('workspace-1', []); // Mock workspace and users
      
      setLastSyncTime(new Date().toLocaleString());
      setConnectionStatus('✅ Sync completed successfully!');
      onSync?.();
    } catch (error) {
      setConnectionStatus('❌ Sync failed: ' + (error as Error).message);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleInputChange = (field: keyof JiraConfig, value: string) => {
    const newConfig = { ...config, [field]: value };
    setConfig(newConfig);
  };

  const resetToDefaults = () => {
    setConfig(DEFAULT_JIRA_CONFIG);
    localStorage.removeItem('jiraConfig');
    setIsConnected(false);
    setProjectInfo(null);
    setConnectionStatus('');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🔗 Jira Entegrasyon Ayarları
        </h2>
        <p className="text-gray-600">
          Jira projenizi SyncFlow ile senkronize edin ve task'larınızı otomatik olarak güncelleyin.
        </p>
      </div>

      {/* Connection Status */}
      <div className="mb-6 p-4 rounded-lg border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Bağlantı Durumu</h3>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`text-sm font-medium ${isConnected ? 'text-green-700' : 'text-red-700'}`}>
              {isConnected ? 'Bağlı' : 'Bağlı Değil'}
            </span>
          </div>
        </div>
        
        <div className="text-sm text-gray-600 mb-3">
          {connectionStatus || 'Bağlantı test edilmedi'}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => testConnection()}
            disabled={isTesting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isTesting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Test Ediliyor...</span>
              </>
            ) : (
              <>
                <span>🔍</span>
                <span>Bağlantıyı Test Et</span>
              </>
            )}
          </button>

          {isConnected && (
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSyncing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Senkronize Ediliyor...</span>
                </>
              ) : (
                <>
                  <span>🔄</span>
                  <span>Jira ile Senkronize Et</span>
                </>
              )}
            </button>
          )}
        </div>

        {lastSyncTime && (
          <div className="mt-3 text-sm text-gray-500">
            Son senkronizasyon: {lastSyncTime}
          </div>
        )}
      </div>

      {/* Configuration Form */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Jira Konfigürasyonu</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jira Domain URL
            </label>
            <input
              type="url"
              value={config.baseUrl}
              onChange={(e) => handleInputChange('baseUrl', e.target.value)}
              placeholder="https://your-domain.atlassian.net"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Atlassian Cloud domain'iniz (örn: company.atlassian.net)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proje Anahtarı
            </label>
            <input
              type="text"
              value={config.projectKey}
              onChange={(e) => handleInputChange('projectKey', e.target.value.toUpperCase())}
              placeholder="SYNC"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Jira proje anahtarınız (örn: SYNC, DEV, PROD)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-posta Adresi
            </label>
            <input
              type="email"
              value={config.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              placeholder="your-email@company.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Atlassian hesabınızın e-posta adresi
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Token
            </label>
            <input
              type="password"
              value={config.apiToken}
              onChange={(e) => handleInputChange('apiToken', e.target.value)}
              placeholder="your-api-token"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Atlassian API token'ınız
            </p>
          </div>
        </div>

        <div className="mt-4 flex space-x-3">
          <button
            onClick={() => saveConfig(config)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            💾 Konfigürasyonu Kaydet
          </button>
          
          <button
            onClick={resetToDefaults}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            🔄 Varsayılana Sıfırla
          </button>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="mb-6">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          <span>{showAdvanced ? '▼' : '▶'}</span>
          <span>Gelişmiş Ayarlar</span>
        </button>

        {showAdvanced && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-3">Senkronizasyon Ayarları</h4>
            
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span className="text-sm text-gray-700">Otomatik senkronizasyon (her 15 dakikada bir)</span>
              </label>
              
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span className="text-sm text-gray-700">Jira'da task oluşturulduğunda otomatik ekle</span>
              </label>
              
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span className="text-sm text-gray-700">Jira'da status değiştiğinde otomatik güncelle</span>
              </label>
              
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-700">SyncFlow'ta yapılan değişiklikleri Jira'ya geri yaz</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Project Information */}
      {projectInfo && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">📋 Proje Bilgileri</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-blue-700">Proje Anahtarı:</span>
              <span className="ml-2 text-sm text-blue-600">{projectInfo.key}</span>
            </div>
            
            <div>
              <span className="text-sm font-medium text-blue-700">Proje Adı:</span>
              <span className="ml-2 text-sm text-blue-600">{projectInfo.name}</span>
            </div>
            
            <div>
              <span className="text-sm font-medium text-blue-700">Issue Tipleri:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {projectInfo.issueTypes.map((type: string) => (
                  <span key={type} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                    {type}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <span className="text-sm font-medium text-blue-700">Durumlar:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {projectInfo.statuses.map((status: string) => (
                  <span key={status} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                    {status}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">💡 Yardım</h3>
        
        <div className="text-sm text-yellow-700 space-y-2">
          <p>
            <strong>API Token Nasıl Alınır:</strong>
          </p>
          <ol className="list-decimal list-inside ml-4 space-y-1">
            <li>Atlassian hesabınıza giriş yapın</li>
            <li>Profil ayarlarına gidin</li>
            <li>"Security" sekmesine tıklayın</li>
            <li>"Create API token" butonuna tıklayın</li>
            <li>Token'ı kopyalayın ve güvenli bir yerde saklayın</li>
          </ol>
          
          <p className="mt-3">
            <strong>Not:</strong> API token'ınızı kimseyle paylaşmayın ve güvenli tutun.
          </p>
        </div>
      </div>
    </div>
  );
};

export default JiraIntegrationSettings;
