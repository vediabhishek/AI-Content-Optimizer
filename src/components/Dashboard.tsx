import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Globe, 
  Cpu, 
  ShieldCheck, 
  AlertCircle, 
  ChevronDown, 
  Copy, 
  RefreshCcw, 
  BarChart3,
  Sparkles,
  User as UserIcon,
  Layers,
  Zap,
  Check,
  ArrowRight,
  FileDown,
  FileText,
  LogOut,
  Plus,
  Trash2,
  List,
  FileStack,
  Loader2,
  CheckCircle2,
  History,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import html2pdf from 'html2pdf.js';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { collection, addDoc, getDocs, query, orderBy, where, deleteDoc, doc, serverTimestamp, getDocFromServer } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Framework, ChecklistItem, AnalysisResults, SavedAnalysis, BulkAnalysisResults, BulkAnalysisItem } from '../types';
import { analyzeContentWithGemini } from '../services/geminiService';

// --- Constants ---
const FRAMEWORK_CONFIG: Record<Framework, { name: string; color: string; icon: any }> = {
  AEO: { name: 'Answer Engine', color: '#185FA5', icon: Search },
  GEO: { name: 'Generative Engine', color: '#1D9E75', icon: Globe },
  AIO: { name: 'AI Overview', color: '#534AB7', icon: Cpu },
  GGL: { name: 'Google Guidelines', color: '#BA7517', icon: ShieldCheck },
};

// --- Sub-components ---

const ScoreGauge = ({ score, color, label }: { score: number; color: string; label: string }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getStatusColor = (s: number) => {
    if (s <= 40) return '#ef4444'; // red
    if (s <= 70) return '#f59e0b'; // amber
    return '#22c55e'; // green
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90">
          <circle cx="48" cy="48" r={radius} fill="transparent" stroke="#f1f5f9" strokeWidth="8" />
          <motion.circle
            cx="48" cy="48" r={radius} fill="transparent" stroke={getStatusColor(score)} strokeWidth="8"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-slate-900">{score}</span>
        </div>
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500" style={{ color: score > 0 ? color : undefined }}>
        {label}
      </span>
    </div>
  );
};

const ChecklistItemComp = ({ item }: { item: ChecklistItem }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all hover:border-slate-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between gap-4 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{item.status}</span>
          <span className="text-sm font-semibold text-slate-800">{item.label}</span>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", isOpen && "rotate-180")} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 flex flex-col gap-4 border-t border-slate-100 bg-slate-50/50">
              <div className="flex flex-col gap-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Issue Detected</p>
                <p className="text-xs text-slate-600 leading-relaxed">{item.issue}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Why it matters</p>
                <p className="text-xs text-slate-600 leading-relaxed italic">{item.why}</p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">How to fix</p>
                <div className="flex flex-col gap-1.5">
                  {item.fix.map((f, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <div className="w-1 h-1 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                      <p className="text-xs text-slate-700 font-medium">{f}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className="absolute top-2 right-2 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-all border border-slate-200"
    >
      {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
    </button>
  );
};

const renderResults = (results: AnalysisResults, activeTab: Framework, setActiveTab: (f: Framework) => void) => (
  <>
    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-blue-900/5">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Optimization Dashboard</h2>
          <p className="text-sm text-slate-500">Overall Score</p>
        </div>
        <div className="text-5xl font-black text-slate-900">{results.overallScore}<span className="text-xl text-slate-400">/100</span></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 pt-10 border-t border-slate-100">
        {(Object.keys(results.frameworks) as Framework[]).map(f => (
          <ScoreGauge key={f} score={results.frameworks[f].score} color={FRAMEWORK_CONFIG[f].color} label={f} />
        ))}
      </div>
    </div>

    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl shadow-blue-900/5">
      <div className="flex border-b border-slate-100">
        {(Object.keys(results.frameworks) as Framework[]).map(f => (
          <button
            key={f} onClick={() => setActiveTab(f)}
            className={cn("flex-1 py-4 flex flex-col items-center gap-1.5 transition-all relative", activeTab === f ? "bg-blue-50/50" : "hover:bg-slate-50")}
          >
            <span className={cn("text-[10px] font-bold uppercase tracking-wider", activeTab === f ? "text-slate-900" : "text-slate-400")}>{f}</span>
            {activeTab === f && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: FRAMEWORK_CONFIG[f].color }} />}
          </button>
        ))}
      </div>
      <div className="p-6">
        <div className="flex flex-col gap-3">
          {results.frameworks[activeTab].checklist.map(item => <ChecklistItemComp key={item.id} item={item} />)}
        </div>
      </div>
    </div>

    {/* Suggestions */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl shadow-blue-900/5 flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-slate-900">Rewrite Suggestions</h2>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="relative">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Optimized Intro (AEO)</p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 leading-relaxed pr-12">
              {results.suggestions.aeoParagraph}
              <CopyButton text={results.suggestions.aeoParagraph} />
            </div>
          </div>

          <div className="relative">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Suggested H2 Questions</p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 flex flex-col gap-2 pr-12">
              {results.suggestions.h2Headings.map((h, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <ArrowRight className="w-3 h-3 text-blue-600 mt-1 shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
              <CopyButton text={results.suggestions.h2Headings.join('\n')} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl shadow-blue-900/5 flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-slate-900">Schema & Snippets</h2>
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Direct Answer Block (50 words)</p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 leading-relaxed pr-12">
              {results.suggestions.directAnswer}
              <CopyButton text={results.suggestions.directAnswer} />
            </div>
          </div>

          {results.suggestions.schemaMarkups.map((schema, idx) => (
            <div key={idx} className="relative">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{schema.type} JSON-LD</p>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-[10px] text-blue-600 overflow-x-auto whitespace-pre pr-12">
                {schema.code}
                <CopyButton text={schema.code} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
);

// --- Main Dashboard ---

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const Dashboard = () => {
  const reportRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const user = auth.currentUser;
  
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [activeTab, setActiveTab] = useState<Framework>('AEO');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Bulk Analysis State
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [bulkInputs, setBulkInputs] = useState<string>('');
  const [bulkResults, setBulkResults] = useState<BulkAnalysisResults | null>(null);
  const [selectedBulkItem, setSelectedBulkItem] = useState<string | null>(null);

  // History State
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>([]);
  const [savedBulkAnalyses, setSavedBulkAnalyses] = useState<BulkAnalysisResults[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    if (user) {
      fetchHistory();
      testConnection();
    }
  }, [user]);

  const testConnection = async () => {
    try {
      await getDocFromServer(doc(db, 'test', 'connection'));
    } catch (error) {
      if(error instanceof Error && error.message.includes('the client is offline')) {
        console.error("Please check your Firebase configuration. ");
      }
    }
  }

  const fetchHistory = async () => {
    if (!user) return;
    setIsLoadingHistory(true);
    try {
      const analysesRef = collection(db, 'users', user.uid, 'analyses');
      const q = query(analysesRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const analyses: SavedAnalysis[] = [];
      querySnapshot.forEach((doc) => {
        analyses.push({ id: doc.id, ...doc.data() } as SavedAnalysis);
      });
      setSavedAnalyses(analyses);

      const bulkRef = collection(db, 'users', user.uid, 'bulk_analyses');
      const qBulk = query(bulkRef, orderBy('createdAt', 'desc'));
      const querySnapshotBulk = await getDocs(qBulk);
      const bulkAnalyses: BulkAnalysisResults[] = [];
      querySnapshotBulk.forEach((doc) => {
        bulkAnalyses.push({ id: doc.id, ...doc.data() } as BulkAnalysisResults);
      });
      setSavedBulkAnalyses(bulkAnalyses);
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `users/${user.uid}/analyses`);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const saveAnalysis = async (result: AnalysisResults, content: string, url?: string) => {
    if (!user) return;
    try {
      const analysesRef = collection(db, 'users', user.uid, 'analyses');
      await addDoc(analysesRef, {
        content,
        url: url || '',
        results: result,
        createdAt: serverTimestamp()
      });
      fetchHistory();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}/analyses`);
    }
  };

  const saveBulkAnalysis = async (bulkResult: BulkAnalysisResults) => {
    if (!user) return;
    try {
      const bulkRef = collection(db, 'users', user.uid, 'bulk_analyses');
      await addDoc(bulkRef, {
        ...bulkResult,
        createdAt: serverTimestamp()
      });
      fetchHistory();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}/bulk_analyses`);
    }
  };

  const deleteAnalysis = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'analyses', id));
      fetchHistory();
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `users/${user.uid}/analyses/${id}`);
    }
  };

  const deleteBulkAnalysis = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'bulk_analyses', id));
      fetchHistory();
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `users/${user.uid}/bulk_analyses/${id}`);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const handleAnalyze = async () => {
    if (mode === 'single') {
      if (!content.trim() && !url.trim()) return;
      setIsAnalyzing(true);
      setError(null);
      try {
        const result = await analyzeContentWithGemini(content, url);
        setResults(result);
        saveAnalysis(result, content, url);
      } catch (err: any) {
        console.error("Analysis failed:", err);
        setError(err.message || 'Analysis failed. Please try again.');
      } finally {
        setIsAnalyzing(false);
      }
    } else {
      const inputs = bulkInputs.split('\n').map(i => i.trim()).filter(Boolean);
      if (inputs.length === 0) return;

      setIsAnalyzing(true);
      setError(null);

      const initialBulkResults: BulkAnalysisResults = {
        id: Date.now().toString(),
        items: inputs.map((input, idx) => ({
          id: idx.toString(),
          url: input.startsWith('http') ? input : undefined,
          content: input.startsWith('http') ? '' : input,
          status: 'pending'
        })),
        averageScore: 0,
        totalItems: inputs.length,
        completedItems: 0,
        createdAt: new Date().toISOString()
      };

      setBulkResults(initialBulkResults);

      let completed = 0;
      let totalScore = 0;

      const updatedItems = [...initialBulkResults.items];

      for (let i = 0; i < updatedItems.length; i++) {
        updatedItems[i].status = 'analyzing';
        setBulkResults(prev => prev ? { ...prev, items: [...updatedItems] } : null);

        try {
          const result = await analyzeContentWithGemini(updatedItems[i].content, updatedItems[i].url);
          updatedItems[i].results = result;
          updatedItems[i].status = 'completed';
          totalScore += result.overallScore;
        } catch (err: any) {
          updatedItems[i].status = 'failed';
          updatedItems[i].error = err.message || 'Failed';
        }

        completed++;
        setBulkResults(prev => prev ? { 
          ...prev, 
          items: [...updatedItems],
          completedItems: completed,
          averageScore: Math.round(totalScore / completed)
        } : null);
      }

      const finalBulkResults = { 
        ...initialBulkResults, 
        items: [...updatedItems],
        completedItems: completed,
        averageScore: Math.round(totalScore / completed)
      };
      saveBulkAnalysis(finalBulkResults);

      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setContent('');
    setUrl('');
    setResults(null);
    setError(null);
    setBulkInputs('');
    setBulkResults(null);
    setSelectedBulkItem(null);
  };

  const handleExportPDF = () => {
    if (!reportRef.current || !results) return;
    const element = reportRef.current;
    const opt = {
      margin: 10,
      filename: `content_optimization_report_${new Date().getTime()}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] as any }
    };
    element.classList.add('pdf-export');
    html2pdf().set(opt).from(element).save().then(() => {
      element.classList.remove('pdf-export');
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-500/30">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Content<span className="text-blue-600">Optima</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowHistory(!showHistory)} 
              className={cn(
                "text-sm font-medium flex items-center gap-1.5 transition-colors",
                showHistory ? "text-blue-600" : "text-slate-500 hover:text-slate-900"
              )}
            >
              <History className="w-4 h-4" />
              History
            </button>
            {results && (
              <button onClick={handleExportPDF} className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors">
                <FileText className="w-4 h-4" />
                Export PDF
              </button>
            )}
            <button onClick={handleReset} className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors">
              <RefreshCcw className="w-4 h-4" />
              Reset
            </button>
            <div className="w-px h-4 bg-slate-200 mx-2" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold overflow-hidden">
                {user?.photoURL ? <img src={user.photoURL} alt="User" referrerPolicy="no-referrer" /> : (user?.displayName?.[0] || user?.email?.[0] || 'U')}
              </div>
              <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 flex flex-col gap-6">
            {showHistory ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl shadow-blue-900/5 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-slate-900">Analysis History</h2>
                  </div>
                  <button onClick={() => setShowHistory(false)} className="text-xs font-bold text-blue-600 hover:underline">Back to Input</button>
                </div>

                <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {isLoadingHistory ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                      <p className="text-sm text-slate-500">Loading history...</p>
                    </div>
                  ) : savedAnalyses.length === 0 && savedBulkAnalyses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Clock className="w-10 h-10 text-slate-200 mb-3" />
                      <p className="text-sm text-slate-500">No history yet. Start analyzing to see your past reports here.</p>
                    </div>
                  ) : (
                    <>
                      {savedAnalyses.length > 0 && (
                        <div className="flex flex-col gap-3">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Single Audits</p>
                          {savedAnalyses.map((item) => (
                            <div key={item.id} className="group relative">
                              <button 
                                onClick={() => {
                                  setResults(item.results);
                                  setMode('single');
                                  setShowHistory(false);
                                  setBulkResults(null);
                                }}
                                className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-blue-200 hover:bg-blue-50/30 transition-all text-left"
                              >
                                <div className="flex flex-col gap-1 overflow-hidden">
                                  <p className="text-sm font-bold text-slate-900 truncate">{item.url || item.content.slice(0, 50)}</p>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                                    <span className="text-[10px] font-bold text-blue-600">{item.results.overallScore}/100</span>
                                  </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteAnalysis(item.id);
                                }}
                                className="absolute -right-2 -top-2 p-1.5 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {savedBulkAnalyses.length > 0 && (
                        <div className="flex flex-col gap-3 mt-4">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Bulk Audits</p>
                          {savedBulkAnalyses.map((item) => (
                            <div key={item.id} className="group relative">
                              <button 
                                onClick={() => {
                                  setBulkResults(item);
                                  setMode('bulk');
                                  setShowHistory(false);
                                  setResults(null);
                                }}
                                className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-blue-200 hover:bg-blue-50/30 transition-all text-left"
                              >
                                <div className="flex flex-col gap-1 overflow-hidden">
                                  <div className="flex items-center gap-2">
                                    <FileStack className="w-3 h-3 text-blue-600" />
                                    <p className="text-sm font-bold text-slate-900">{item.totalItems} Items Audit</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                                    <span className="text-[10px] font-bold text-blue-600">Avg: {item.averageScore}/100</span>
                                  </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteBulkAnalysis(item.id);
                                }}
                                className="absolute -right-2 -top-2 p-1.5 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl shadow-blue-900/5">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-slate-900">Analysis Input</h2>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button 
                    onClick={() => setMode('single')}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                      mode === 'single' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    Single
                  </button>
                  <button 
                    onClick={() => setMode('bulk')}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                      mode === 'bulk' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    Bulk
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                {mode === 'single' ? (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Content URL</label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="text" placeholder="https://example.com/blog-post" value={url} onChange={(e) => setUrl(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Paste Content</label>
                      <textarea 
                        placeholder="Paste your article content here..." value={content} onChange={(e) => setContent(e.target.value)}
                        className="w-full h-[400px] bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none leading-relaxed"
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Bulk URLs or Content (One per line)</label>
                    <textarea 
                      placeholder="Enter multiple URLs or paste multiple content pieces separated by new lines..." 
                      value={bulkInputs} onChange={(e) => setBulkInputs(e.target.value)}
                      className="w-full h-[480px] bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none leading-relaxed"
                    />
                    <p className="text-[10px] text-slate-400 px-1 mt-1">Tip: Paste a list of URLs to analyze multiple pages at once.</p>
                  </div>
                )}
                
                {error && <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-start gap-2 text-red-600 text-xs"><AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /><p>{error}</p></div>}
                <button 
                  onClick={handleAnalyze} disabled={isAnalyzing || (mode === 'single' ? (!content.trim() && !url.trim()) : !bulkInputs.trim())}
                  className={cn("w-full py-4 rounded-2xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/10", isAnalyzing || (mode === 'single' ? (!content.trim() && !url.trim()) : !bulkInputs.trim()) ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500 text-white active:scale-[0.98]")}
                >
                  {isAnalyzing ? <><RefreshCcw className="w-5 h-5 animate-spin" />{mode === 'single' ? 'Analyzing...' : 'Bulk Analyzing...'}</> : <><Zap className="w-5 h-5 fill-current" />{mode === 'single' ? 'Analyze Content' : 'Start Bulk Audit'}</>}
                </button>
              </div>
            </div>
            )}

            {/* Priority Action Plan (Visible after analysis) */}
            <AnimatePresence>
              {(results || (bulkResults && selectedBulkItem && bulkResults.items.find(i => i.id === selectedBulkItem)?.results)) && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl shadow-blue-900/5"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    <h2 className="text-lg font-semibold text-slate-900">Priority Action Plan</h2>
                  </div>
                  <div className="flex flex-col gap-3">
                    {(results || bulkResults?.items.find(i => i.id === selectedBulkItem)?.results)?.priorityActions.map((action, i) => (
                      <div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex gap-4 items-start">
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5",
                          action.priority === 1 ? "bg-red-500/10 text-red-600" : "bg-amber-500/10 text-amber-600"
                        )}>
                          {i + 1}
                        </div>
                        <div className="flex flex-col gap-2">
                          <p className="text-sm font-medium text-slate-800">{action.task}</p>
                          <div className="flex gap-2">
                            {action.impact.map(f => {
                              const config = FRAMEWORK_CONFIG[f as Framework];
                              if (!config) return null;
                              return (
                                <span 
                                  key={f} 
                                  className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter"
                                  style={{ backgroundColor: `${config.color}15`, color: config.color }}
                                >
                                  {f}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-8" ref={reportRef}>
            {!results && !bulkResults && !isAnalyzing && (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white border border-dashed border-slate-200 rounded-3xl">
                <Search className="w-12 h-12 text-slate-300 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Ready for Analysis</h3>
                <p className="text-sm text-slate-500 max-w-xs">Paste your content or URLs and click "Analyze" to see your optimization scores.</p>
              </div>
            )}

            {isAnalyzing && mode === 'single' && (
              <div className="h-full flex flex-col items-center justify-center gap-8 p-12">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="w-24 h-24 rounded-full border-4 border-slate-100 border-t-blue-600" />
                <h3 className="text-xl font-bold text-slate-900">Running Audit...</h3>
              </div>
            )}

            {/* Bulk Progress View */}
            {bulkResults && (
              <div className="flex flex-col gap-6">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl shadow-blue-900/5">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Bulk Analysis Progress</h2>
                      <p className="text-sm text-slate-500">{bulkResults.completedItems} of {bulkResults.totalItems} completed</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Average Score</p>
                      <p className="text-3xl font-black text-blue-600">{bulkResults.averageScore}<span className="text-sm text-slate-400">/100</span></p>
                    </div>
                  </div>
                  
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-8">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(bulkResults.completedItems / bulkResults.totalItems) * 100}%` }}
                      className="h-full bg-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {bulkResults.items.map((item) => (
                      <button 
                        key={item.id}
                        onClick={() => (item.status === 'completed' || item.status === 'failed') && setSelectedBulkItem(item.id)}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-2xl border transition-all text-left",
                          selectedBulkItem === item.id ? "border-blue-600 bg-blue-50/30" : "border-slate-100 bg-slate-50/50 hover:border-slate-200",
                          (item.status === 'completed' || item.status === 'failed') ? "cursor-pointer" : "cursor-default"
                        )}
                      >
                        <div className="flex items-center gap-4 overflow-hidden">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                            item.status === 'completed' ? "bg-green-100 text-green-600" : 
                            item.status === 'analyzing' ? "bg-blue-100 text-blue-600" : 
                            item.status === 'failed' ? "bg-red-100 text-red-600" : "bg-slate-200 text-slate-400"
                          )}>
                            {item.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : 
                             item.status === 'analyzing' ? <Loader2 className="w-5 h-5 animate-spin" /> : 
                             item.status === 'failed' ? <AlertCircle className="w-5 h-5" /> : <List className="w-5 h-5" />}
                          </div>
                          <div className="overflow-hidden flex-1">
                            <p className="text-sm font-bold text-slate-900 truncate">{item.url || 'Text Content'}</p>
                            <div className="flex flex-col gap-1 mt-1">
                              <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-none">{item.status}</p>
                              <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                                {item.status === 'analyzing' ? (
                                  <motion.div 
                                    initial={{ x: '-100%' }}
                                    animate={{ x: '100%' }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                    className="h-full w-1/2 bg-blue-600 rounded-full"
                                  />
                                ) : (
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: item.status === 'completed' || item.status === 'failed' ? '100%' : '0%' }}
                                    className={cn(
                                      "h-full transition-all",
                                      item.status === 'completed' ? "bg-green-500" : "bg-red-500"
                                    )}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        {item.results && (
                          <div className="text-right">
                            <p className="text-lg font-black text-slate-900">{item.results.overallScore}</p>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Item Detail */}
                <AnimatePresence>
                  {selectedBulkItem && bulkResults.items.find(i => i.id === selectedBulkItem) && (
                    <motion.div 
                      key={selectedBulkItem}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col gap-8"
                    >
                      {(() => {
                        const item = bulkResults.items.find(i => i.id === selectedBulkItem)!;
                        return (
                          <>
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col gap-1">
                                <h3 className="text-lg font-bold text-slate-900">
                                  {item.status === 'failed' ? 'Analysis Failed' : 'Detailed Report'}: {item.url || 'Text Content'}
                                </h3>
                                {item.status === 'failed' && (
                                  <div className="flex items-center gap-2 text-red-600 text-xs font-medium">
                                    <AlertCircle className="w-3 h-3" />
                                    <span>{item.error || 'Unknown error occurred during analysis.'}</span>
                                  </div>
                                )}
                              </div>
                              <button 
                                onClick={() => setSelectedBulkItem(null)}
                                className="text-xs font-bold text-blue-600 hover:underline"
                              >
                                Close Detail
                              </button>
                            </div>
                            {item.results ? (
                              renderResults(item.results, activeTab, setActiveTab)
                            ) : (
                              <div className="bg-red-50 border border-red-100 rounded-3xl p-12 text-center flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                  <AlertCircle className="w-8 h-8" />
                                </div>
                                <div className="max-w-md">
                                  <h4 className="text-lg font-bold text-red-900 mb-2">Analysis Error</h4>
                                  <p className="text-sm text-red-700 leading-relaxed">
                                    We encountered an error while analyzing this content. This could be due to a network issue, 
                                    an invalid URL, or a temporary problem with the AI engine.
                                  </p>
                                  <div className="mt-6 p-4 bg-white/50 rounded-xl border border-red-200 text-left">
                                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">Error Message</p>
                                    <p className="text-xs font-mono text-red-800 break-words">{item.error || 'No detailed error message available.'}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <AnimatePresence>
              {results && mode === 'single' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
                  {renderResults(results, activeTab, setActiveTab)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};
