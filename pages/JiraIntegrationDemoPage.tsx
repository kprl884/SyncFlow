import React from 'react';
import JiraIntegrationSettings from '../components/ui/JiraIntegrationSettings';

const JiraIntegrationDemoPage: React.FC = () => {
  const handleConfigUpdate = (config: any) => {
    console.log('Jira config updated:', config);
  };

  const handleSync = () => {
    console.log('Jira sync triggered');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔗 Jira Entegrasyon Demo
          </h1>
          <p className="text-gray-600">
            Bu sayfa Jira entegrasyon ayarlarını test etmenizi sağlar. 
            Gerçek Jira projenizle bağlantı kurun ve task'larınızı senkronize edin.
          </p>
        </div>

        <JiraIntegrationSettings
          onConfigUpdate={handleConfigUpdate}
          onSync={handleSync}
        />

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📚 Entegrasyon Özellikleri
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-2">🔄</div>
              <h3 className="font-medium text-gray-900 mb-2">Otomatik Senkronizasyon</h3>
              <p className="text-sm text-gray-600">
                Jira'daki değişiklikler otomatik olarak SyncFlow'a yansır
              </p>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-2">📋</div>
              <h3 className="font-medium text-gray-900 mb-2">Task Mapping</h3>
              <p className="text-sm text-gray-600">
                Jira issue'ları SyncFlow task'larına otomatik dönüştürülür
              </p>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-2">👥</div>
              <h3 className="font-medium text-gray-900 mb-2">Takım Senkronizasyonu</h3>
              <p className="text-sm text-gray-600">
                Jira assignee'ları SyncFlow kullanıcılarıyla eşleştirilir
              </p>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-2">🏷️</div>
              <h3 className="font-medium text-gray-900 mb-2">Akıllı Etiketleme</h3>
              <p className="text-sm text-gray-600">
                Issue açıklamalarından otomatik etiketler çıkarılır
              </p>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-2">🔗</div>
              <h3 className="font-medium text-gray-900 mb-2">Bağımlılık Yönetimi</h3>
              <p className="text-sm text-gray-600">
                Jira issue linkleri SyncFlow bağımlılıklarına dönüştürülür
              </p>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-medium text-gray-900 mb-2">Story Point Senkronizasyonu</h3>
              <p className="text-sm text-gray-600">
                Jira story point'leri SyncFlow'a aktarılır
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">
            🚀 Başlangıç Rehberi
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-medium text-blue-900">Jira Hesabınızı Hazırlayın</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Atlassian hesabınızdan API token oluşturun ve proje anahtarınızı not edin.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-medium text-blue-900">Bağlantıyı Test Edin</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Yukarıdaki formu doldurun ve "Bağlantıyı Test Et" butonuna tıklayın.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-medium text-blue-900">Senkronizasyonu Başlatın</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Bağlantı başarılı olduktan sonra "Jira ile Senkronize Et" butonuna tıklayın.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="font-medium text-blue-900">Kanban Board'da Görüntüleyin</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Senkronize edilen task'ları Kanban board'da görüntüleyin ve yönetin.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-yellow-900 mb-4">
            ⚠️ Önemli Notlar
          </h2>
          
          <ul className="space-y-2 text-sm text-yellow-800">
            <li>• API token'ınızı güvenli tutun ve kimseyle paylaşmayın</li>
            <li>• Jira proje anahtarınızı doğru girdiğinizden emin olun</li>
            <li>• İlk senkronizasyon tüm issue'ları getirecektir, bu biraz zaman alabilir</li>
            <li>• Senkronizasyon sırasında internet bağlantınızın stabil olduğundan emin olun</li>
            <li>• Büyük projeler için sayfalama ve filtreleme özelliklerini kullanın</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default JiraIntegrationDemoPage;
