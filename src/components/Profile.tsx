import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, History, Bookmark, LogOut, ChevronRight, Trash2, ExternalLink, Clock, Calendar } from 'lucide-react';
import { SavedAnalysis, UserProfile } from '../types';
import { cn } from '../lib/utils';

interface ProfileProps {
  user: UserProfile;
  onSelectAnalysis: (analysis: SavedAnalysis) => void;
  onLogout: () => void;
  onBack: () => void;
}

export const Profile = ({ user, onSelectAnalysis, onLogout, onBack }: ProfileProps) => {
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'history' | 'settings'>('history');

  useEffect(() => {
    const fetchAnalyses = () => {
      setLoading(true);
      try {
        const savedAnalyses = JSON.parse(localStorage.getItem('contentoptima_history') || '[]');
        setAnalyses(savedAnalyses);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, []);

  const handleDeleteAnalysis = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      const savedAnalyses = JSON.parse(localStorage.getItem('contentoptima_history') || '[]');
      const updatedAnalyses = savedAnalyses.filter((a: SavedAnalysis) => a.id !== id);
      localStorage.setItem('contentoptima_history', JSON.stringify(updatedAnalyses));
      setAnalyses(updatedAnalyses);
    } catch (error) {
      console.error("Failed to delete analysis:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col gap-8 py-8 px-4">
      {/* Profile Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-blue-50 border-4 border-white shadow-lg overflow-hidden shrink-0">
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white text-3xl font-bold">
              {user.displayName?.[0] || user.email?.[0] || 'U'}
            </div>
          )}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold text-slate-900">{user.displayName || 'User'}</h1>
          <p className="text-slate-500">{user.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full">
              <Calendar className="w-3 h-3" />
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full">
              <History className="w-3 h-3" />
              {analyses.length} Analyses
            </div>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors font-medium text-sm"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('history')}
          className={cn(
            "px-6 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2",
            activeTab === 'history' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <History className="w-4 h-4" />
          Past Analyses
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={cn(
            "px-6 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2",
            activeTab === 'settings' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === 'history' ? (
            <motion.div 
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-4"
            >
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-10 h-10 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin" />
                  <p className="text-slate-400 text-sm">Loading your history...</p>
                </div>
              ) : analyses.length > 0 ? (
                analyses.map((analysis) => (
                  <div 
                    key={analysis.id}
                    onClick={() => onSelectAnalysis(analysis)}
                    className="group bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/5 transition-all cursor-pointer flex items-center justify-between gap-4"
                  >
                    <div className="flex flex-col gap-1 overflow-hidden">
                      <h3 className="font-semibold text-slate-900 truncate">
                        {analysis.content.split('\n')[0].slice(0, 60) || 'Untitled Analysis'}
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(analysis.createdAt).toLocaleDateString()}
                        </span>
                        {analysis.url && (
                          <span className="flex items-center gap-1 truncate max-w-[200px]">
                            <ExternalLink className="w-3 h-3" />
                            {analysis.url}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end">
                        <span className="text-xl font-black text-slate-900">{analysis.results.overallScore}</span>
                        <span className="text-[8px] font-bold uppercase tracking-widest text-blue-600">Score</span>
                      </div>
                      <button 
                        onClick={(e) => handleDeleteAnalysis(e, analysis.id)}
                        className="p-2 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-dashed border-slate-200 rounded-3xl">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-blue-50 blur-2xl rounded-full" />
                    <img 
                      src="https://picsum.photos/seed/empty-history/400/400" 
                      alt="No history" 
                      className="w-24 h-24 rounded-2xl border border-slate-100 shadow-lg relative z-10 opacity-60"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">No analyses yet</h3>
                  <p className="text-sm text-slate-500 max-w-xs mt-1">Your past content audits will appear here once you start analyzing.</p>
                  <button 
                    onClick={onBack}
                    className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Start First Audit
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col gap-8"
            >
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Preferences</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <div>
                      <p className="font-semibold text-slate-800">Email Notifications</p>
                      <p className="text-xs text-slate-500">Get notified when your analysis is ready</p>
                    </div>
                    <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl opacity-50 cursor-not-allowed">
                    <div>
                      <p className="font-semibold text-slate-800">Dark Mode</p>
                      <p className="text-xs text-slate-500">Switch to a darker interface (Coming Soon)</p>
                    </div>
                    <div className="w-12 h-6 bg-slate-300 rounded-full relative">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Danger Zone</h3>
                <div className="p-4 border border-red-100 bg-red-50/30 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-red-900">Delete Account</p>
                    <p className="text-xs text-red-600/70">Permanently delete your profile and all analyses</p>
                  </div>
                  <button className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
