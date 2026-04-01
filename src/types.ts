export type Framework = 'AEO' | 'GEO' | 'AIO' | 'GGL';

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  settings?: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
  createdAt: string;
}

export interface SavedAnalysis {
  id: string;
  uid?: string;
  content: string;
  url?: string;
  results: AnalysisResults;
  createdAt: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  status: '✅' | '⚠️' | '❌';
  issue: string;
  why: string;
  fix: string[];
}

export interface AuditResult {
  score: number;
  checklist: ChecklistItem[];
}

export interface AnalysisResults {
  overallScore: number;
  frameworks: Record<Framework, AuditResult>;
  suggestions: {
    aeoParagraph: string;
    h2Headings: string[];
    directAnswer: string;
    schemaMarkups: Array<{ type: string; code: string }>;
  };
  priorityActions: Array<{
    task: string;
    impact: Framework[];
    priority: number;
  }>;
}

export interface BulkAnalysisItem {
  id: string;
  url?: string;
  content: string;
  results?: AnalysisResults;
  status: 'pending' | 'analyzing' | 'completed' | 'failed';
  error?: string;
}

export interface BulkAnalysisResults {
  id: string;
  items: BulkAnalysisItem[];
  averageScore: number;
  totalItems: number;
  completedItems: number;
  createdAt: string;
}
