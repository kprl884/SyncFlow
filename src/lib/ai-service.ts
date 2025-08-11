interface AITaskDescriptionResponse {
  userStory: string;
  acceptanceCriteria: string[];
}

interface AISubtaskChecklistResponse {
  subtasks: string[];
}

class AIService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_AI_API_KEY;
    this.baseUrl = 'https://api.openai.com/v1/chat/completions'; // OpenAI API kullanıyoruz
  }

  private async makeAIRequest(prompt: string): Promise<string> {
    console.log('🔍 AI Request başlatılıyor...');
    console.log('🔑 API Key var mı:', !!this.apiKey);
    console.log('🔑 API Key uzunluğu:', this.apiKey ? this.apiKey.length : 0);
    console.log('🌐 Base URL:', this.baseUrl);
    
    if (!this.apiKey) {
      throw new Error('AI API key bulunamadı. Lütfen VITE_AI_API_KEY environment variable\'ını ayarlayın.');
    }

    try {
      console.log('📡 API çağrısı yapılıyor...');
      const requestBody = {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Sen deneyimli bir Scrum Master ve yazılım geliştiricisisin. Türkçe yanıt ver.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      };
      
      console.log('📤 Request body:', requestBody);
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response error:', errorText);
        throw new Error(`AI API hatası: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Response data:', data);
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('❌ AI API çağrısı hatası:', error);
      
      // İnternet bağlantısı kontrolü
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('İnternet bağlantınızı kontrol edin ve tekrar deneyin.');
      }
      
      throw new Error(`AI servisi hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    }
  }

                async generateTaskDescription(title: string): Promise<AITaskDescriptionResponse> {
                const prompt = `Sen deneyimli bir Scrum Master ve yazılım geliştiricisisin. 

            Eğer kullanıcı bir görev oluşturmak istiyorsa:
            1. User Story (Kullanıcı Hikayesi): "As a..., I want to..., so that..." formatında
            2. Acceptance Criteria (Kabul Kriterleri): 3-5 adet madde halinde

            Eğer kullanıcı genel bir soru soruyorsa (süre, öneri, ipucu):
            Direkt ve pratik cevap ver, User Story formatına çevirme.

            Sadece gerekli bilgileri ver, ekstra açıklama ekleme.`;

    try {
      const response = await this.makeAIRequest(prompt);
      
      // Response'u parse et
      const lines = response.split('\n').filter(line => line.trim());
      const userStory = lines.find(line => line.includes('As a') || line.includes('Kullanıcı olarak')) || '';
      
      const acceptanceCriteria = lines
        .filter(line => line.includes('-') || line.includes('•') || line.includes('*') || /^\d+\./.test(line))
        .map(line => line.replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, '').trim())
        .filter(line => line.length > 0);

      return {
        userStory: userStory || 'User story oluşturulamadı.',
        acceptanceCriteria: acceptanceCriteria.length > 0 ? acceptanceCriteria : ['Kabul kriterleri oluşturulamadı.']
      };
    } catch (error) {
      console.error('Task description generation hatası:', error);
      return {
        userStory: 'AI servisi kullanılamıyor. Lütfen manuel olarak doldurun.',
        acceptanceCriteria: ['AI servisi kullanılamıyor.']
      };
    }
  }

  async generateSubtaskChecklist(title: string, team: string): Promise<string[]> {
    const teamContext = this.getTeamContext(team);
    
    const prompt = `Sen kıdemli bir yazılım geliştiricisisin. '${team}' takımı için '${title}' başlıklı görev için 5-7 adet yaygın alt görev veya geliştirme adımını liste halinde ver.

${teamContext}

Sadece madde listesi ver, ekstra açıklama ekleme. Her madde "- " ile başlasın.`;

    try {
      const response = await this.makeAIRequest(prompt);
      
      const subtasks = response
        .split('\n')
        .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•') || line.trim().startsWith('*'))
        .map(line => line.replace(/^[-•*]\s*/, '').trim())
        .filter(line => line.length > 0);

      return subtasks.length > 0 ? subtasks : ['Alt görevler oluşturulamadı.'];
    } catch (error) {
      console.error('Subtask checklist generation hatası:', error);
      return ['AI servisi kullanılamıyor.'];
    }
  }

  private getTeamContext(team: string): string {
    const contexts: Record<string, string> = {
      'Frontend': 'Frontend geliştirme için tipik adımları düşün: UI/UX tasarım, component geliştirme, state management, testing, responsive design.',
      'Backend': 'Backend geliştirme için tipik adımları düşün: API tasarımı, database schema, business logic, authentication, testing, documentation.',
      'Mobile': 'Mobile geliştirme için tipik adımları düşün: UI/UX tasarım, native component geliştirme, state management, testing, platform-specific optimizations.',
      'General': 'Genel yazılım geliştirme için tipik adımları düşün: planning, development, testing, documentation, review, deployment.'
    };

    return contexts[team] || contexts['General'];
  }
}

export const aiService = new AIService();
export type { AITaskDescriptionResponse, AISubtaskChecklistResponse };
