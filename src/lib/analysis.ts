import { Task } from '../types';

export interface TaskCharacteristics {
  domains: string[];
  technicalComplexity: {
    apiImpact: number;
    uiImpact: number;
    databaseImpact: boolean;
  };
  uncertainty: 'low' | 'medium' | 'high';
}

export interface SimilarityScore {
  task: Task;
  score: number;
  reasons: string[];
}

export interface SuggestionResult {
  suggestedSP: number;
  similarTasks: Task[];
  averageCompletionDays?: number;
  confidence: 'low' | 'medium' | 'high';
}

/**
 * Fibonacci sayılarına en yakın değeri bulur
 */
function findNearestFibonacci(value: number): number {
  const fibonacciNumbers = [1, 2, 3, 5, 8, 13, 21];
  let nearest = fibonacciNumbers[0];
  let minDifference = Math.abs(value - nearest);

  for (const fib of fibonacciNumbers) {
    const difference = Math.abs(value - fib);
    if (difference < minDifference) {
      minDifference = difference;
      nearest = fib;
    }
  }

  return nearest;
}

/**
 * İki task arasında benzerlik skoru hesaplar
 */
function calculateSimilarityScore(
  currentTask: TaskCharacteristics,
  historicalTask: Task,
  allTasks: Task[]
): SimilarityScore {
  let score = 0;
  const reasons: string[] = [];

  // Domain benzerliği (en yüksek ağırlık)
  const currentDomains = new Set(currentTask.domains);
  const historicalDomains = new Set(historicalTask.domains || []);
  
  const domainIntersection = new Set([...currentDomains].filter(x => historicalDomains.has(x)));
  const domainUnion = new Set([...currentDomains, ...historicalDomains]);
  
  if (domainUnion.size > 0) {
    const domainSimilarity = domainIntersection.size / domainUnion.size;
    score += domainSimilarity * 40; // Domain benzerliği %40 ağırlık
    
    if (domainSimilarity > 0.5) {
      reasons.push(`Benzer çalışma alanları: ${Array.from(domainIntersection).join(', ')}`);
    }
  }

  // Teknik karmaşıklık benzerliği
  if (historicalTask.technicalComplexity) {
    const apiDiff = Math.abs(currentTask.technicalComplexity.apiImpact - (historicalTask.technicalComplexity.apiImpact || 0));
    const uiDiff = Math.abs(currentTask.technicalComplexity.uiImpact - (historicalTask.technicalComplexity.uiImpact || 0));
    
    // API etkisi benzerliği
    if (apiDiff <= 2) {
      score += (1 - apiDiff / 10) * 20; // API benzerliği %20 ağırlık
      reasons.push(`Benzer API etkisi: ${historicalTask.technicalComplexity.apiImpact || 0} endpoint`);
    }
    
    // UI etkisi benzerliği
    if (uiDiff <= 2) {
      score += (1 - uiDiff / 10) * 20; // UI benzerliği %20 ağırlık
      reasons.push(`Benzer UI etkisi: ${historicalTask.technicalComplexity.uiImpact || 0} ekran/component`);
    }
    
    // Database etkisi benzerliği
    if (currentTask.technicalComplexity.databaseImpact === (historicalTask.technicalComplexity.databaseImpact || false)) {
      score += 10; // Database benzerliği %10 ağırlık
      reasons.push('Benzer database etkisi');
    }
  }

  // Belirsizlik seviyesi benzerliği
  if (historicalTask.uncertainty === currentTask.uncertainty) {
    score += 10; // Belirsizlik benzerliği %10 ağırlık
    reasons.push(`Benzer belirsizlik seviyesi: ${currentTask.uncertainty}`);
  }

  // Task boyutu benzerliği (story points)
  if (historicalTask.storyPoints) {
    const spDiff = Math.abs(currentTask.technicalComplexity.apiImpact + currentTask.technicalComplexity.uiImpact - historicalTask.storyPoints);
    if (spDiff <= 3) {
      score += 5; // Story point benzerliği bonus puan
      reasons.push(`Benzer büyüklük: ${historicalTask.storyPoints} SP`);
    }
  }

  // Takım benzerliği (bonus)
  if (historicalTask.team && historicalTask.team === 'current-team') {
    score += 5;
    reasons.push('Aynı takım');
  }

  return {
    task: historicalTask,
    score: Math.min(score, 100), // Maksimum 100 puan
    reasons
  };
}

/**
 * Geçmiş task'lardan benzer olanları bulur
 */
export function findSimilarTasks(
  currentTask: TaskCharacteristics,
  allTasks: Task[]
): Task[] {
  // Sadece tamamlanmış task'ları al
  const completedTasks = allTasks.filter(task => 
    task.status === 'completed' || task.status === 'done'
  );

  if (completedTasks.length === 0) {
    return [];
  }

  // Her task için benzerlik skoru hesapla
  const similarityScores: SimilarityScore[] = completedTasks.map(historicalTask =>
    calculateSimilarityScore(currentTask, historicalTask, allTasks)
  );

  // Skora göre sırala ve en iyi 5'i al
  const topSimilarTasks = similarityScores
    .filter(item => item.score > 30) // Minimum %30 benzerlik
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(item => item.task);

  return topSimilarTasks;
}

/**
 * Benzer task'lara dayalı story point önerisi hesaplar
 */
export function calculateSuggestion(similarTasks: Task[]): SuggestionResult {
  if (similarTasks.length === 0) {
    // Benzer task yoksa, basit bir heuristik kullan
    return {
      suggestedSP: 5, // Varsayılan orta seviye
      similarTasks: [],
      confidence: 'low'
    };
  }

  // Story point'leri topla
  const storyPoints = similarTasks
    .map(task => task.storyPoints)
    .filter(sp => sp !== undefined && sp > 0);

  if (storyPoints.length === 0) {
    return {
      suggestedSP: 5,
      similarTasks: similarTasks,
      confidence: 'low'
    };
  }

  // Ortalama hesapla
  const averageSP = storyPoints.reduce((sum, sp) => sum + sp, 0) / storyPoints.length;
  
  // En yakın Fibonacci sayısını bul
  const suggestedSP = findNearestFibonacci(averageSP);

  // Tamamlanma sürelerini hesapla (varsa)
  let averageCompletionDays: number | undefined;
  const completionTimes = similarTasks
    .map(task => {
      if (task.completedAt && task.createdAt) {
        const start = new Date(task.createdAt);
        const end = new Date(task.completedAt);
        return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      }
      return null;
    })
    .filter(time => time !== null);

  if (completionTimes.length > 0) {
    averageCompletionDays = completionTimes.reduce((sum, time) => sum + time!, 0) / completionTimes.length;
  }

  // Güven seviyesini belirle
  let confidence: 'low' | 'medium' | 'high' = 'low';
  if (similarTasks.length >= 3 && storyPoints.length >= 3) {
    confidence = 'high';
  } else if (similarTasks.length >= 2 && storyPoints.length >= 2) {
    confidence = 'medium';
  }

  return {
    suggestedSP,
    similarTasks,
    averageCompletionDays,
    confidence
  };
}

/**
 * Task karmaşıklık skorunu hesaplar (0-100)
 */
export function calculateComplexityScore(characteristics: TaskCharacteristics): number {
  let score = 0;

  // Domain ağırlıkları
  const domainWeights = {
    frontend: 15,
    backend: 20,
    database: 25,
    cicd: 10,
    design: 10,
    qa: 10
  };

  characteristics.domains.forEach(domain => {
    score += domainWeights[domain as keyof typeof domainWeights] || 0;
  });

  // Teknik karmaşıklık
  score += characteristics.technicalComplexity.apiImpact * 2; // Her API endpoint 2 puan
  score += characteristics.technicalComplexity.uiImpact * 1.5; // Her UI component 1.5 puan
  
  if (characteristics.technicalComplexity.databaseImpact) {
    score += 20; // Database değişikliği 20 puan
  }

  // Belirsizlik çarpanı
  const uncertaintyMultiplier = {
    low: 0.8,
    medium: 1.0,
    high: 1.3
  };

  score *= uncertaintyMultiplier[characteristics.uncertainty];

  return Math.min(Math.round(score), 100);
}

/**
 * Story point tahmin aralığını hesaplar
 */
export function calculateSPRange(characteristics: TaskCharacteristics): { min: number; max: number; confidence: number } {
  const complexityScore = calculateComplexityScore(characteristics);
  
  // Karmaşıklık skoruna göre SP aralığı
  let minSP = 1;
  let maxSP = 21;
  
  if (complexityScore < 20) {
    minSP = 1;
    maxSP = 3;
  } else if (complexityScore < 40) {
    minSP = 2;
    maxSP = 5;
  } else if (complexityScore < 60) {
    minSP = 3;
    maxSP = 8;
  } else if (complexityScore < 80) {
    minSP = 5;
    maxSP = 13;
  } else {
    minSP = 8;
    maxSP = 21;
  }

  // Güven seviyesi (0-1)
  const confidence = Math.min(complexityScore / 100, 1);

  return { min: minSP, max: maxSP, confidence };
}
