interface AITaskDescriptionResponse {
  userStory: string;
  acceptanceCriteria: string[];
}

interface AISubtaskChecklistResponse {
  subtasks: string[];
}

class MockAIService {
  private generateMockUserStory(title: string): string {
    const userStories = [
      `Kullanıcı olarak ${title} özelliğini kullanabilmek istiyorum ki işlerimi daha verimli bir şekilde yapabileyim.`,
      `Bir geliştirici olarak ${title} fonksiyonalitesini entegre edebilmek istiyorum ki kullanıcı deneyimini iyileştirebileyim.`,
      `Bir proje yöneticisi olarak ${title} raporlarını görüntüleyebilmek istiyorum ki proje durumunu takip edebileyim.`,
      `Bir test uzmanı olarak ${title} test senaryolarını çalıştırabilmek istiyorum ki kalite güvencesini sağlayabileyim.`,
      `Bir DevOps mühendisi olarak ${title} deployment süreçlerini otomatize edebilmek istiyorum ki sürekli entegrasyonu sağlayabileyim.`
    ];
    
    return userStories[Math.floor(Math.random() * userStories.length)];
  }

  private generateMockAcceptanceCriteria(title: string): string[] {
    const commonCriteria = [
      `${title} özelliği başarıyla çalışmalı`,
      `${title} için gerekli validasyonlar yapılmalı`,
      `${title} kullanıcı arayüzü responsive olmalı`,
      `${title} için hata yönetimi sağlanmalı`,
      `${title} performans kriterlerini karşılamalı`,
      `${title} için gerekli dokümantasyon hazırlanmalı`,
      `${title} test coverage %80'in üzerinde olmalı`
    ];
    
    // 3-5 adet rastgele kriter seç
    const shuffled = commonCriteria.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3 + Math.floor(Math.random() * 3));
  }

  private generateMockSubtasks(team: string): string[] {
    const teamSubtasks: Record<string, string[]> = {
      'Frontend': [
        'UI/UX tasarımını oluştur',
        'React component\'lerini geliştir',
        'State management yapısını kur',
        'Responsive design uygula',
        'Unit testleri yaz',
        'Accessibility standartlarını kontrol et'
      ],
      'Backend': [
        'API endpoint\'lerini tasarla',
        'Database schema\'sını oluştur',
        'Business logic\'i implement et',
        'Authentication sistemini kur',
        'API dokümantasyonunu hazırla',
        'Performance testlerini yap'
      ],
      'Mobile': [
        'Native component\'leri geliştir',
        'Platform-specific optimizasyonları yap',
        'State management yapısını kur',
        'Push notification sistemini entegre et',
        'Offline functionality ekle',
        'App store deployment hazırlığını yap'
      ],
      'General': [
        'Proje planlamasını yap',
        'Gereksinim analizini tamamla',
        'Teknik tasarımı hazırla',
        'Development sürecini başlat',
        'Testing ve QA süreçlerini yürüt',
        'Deployment ve release yap'
      ]
    };
    
    const subtasks = teamSubtasks[team] || teamSubtasks['General'];
    const shuffled = subtasks.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5 + Math.floor(Math.random() * 3));
  }

  async generateTaskDescription(title: string): Promise<AITaskDescriptionResponse> {
    console.log('🤖 Mock AI Service: Task description generating for:', title);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    return {
      userStory: this.generateMockUserStory(title),
      acceptanceCriteria: this.generateMockAcceptanceCriteria(title)
    };
  }

  async generateSubtaskChecklist(title: string, team: string): Promise<string[]> {
    console.log('🤖 Mock AI Service: Subtask checklist generating for:', title, 'Team:', team);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1500));
    
    return this.generateMockSubtasks(team);
  }
}

export const mockAIService = new MockAIService();
export type { AITaskDescriptionResponse, AISubtaskChecklistResponse };
