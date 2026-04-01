import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Search, Globe, Cpu, ShieldCheck, ArrowRight, Sparkles, BarChart3, Layers, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const Home = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">Content<span className="text-blue-600">Optima</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Features</a>
          <a href="#frameworks" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Frameworks</a>
          <Link to="/login" className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors">Log in</Link>
          <Link to="/signup" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg shadow-blue-500/10 active:scale-[0.98]">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 pt-20 pb-32 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-8"
        >
          <Sparkles className="w-3 h-3" />
          AI-Powered Content Optimization
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 max-w-4xl leading-[1.1] mb-8"
        >
          Optimize for the <span className="text-blue-600">AI-First</span> Search Era
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-slate-500 max-w-2xl leading-relaxed mb-12"
        >
          Scan and optimize your blog content for AEO, GEO, and AIO with real-time AI-powered recommendations. Don't just rank—dominate AI overviews.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg tracking-wide transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98] flex items-center justify-center gap-2">
            Start Free Analysis
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a href="#features" className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl font-bold text-lg tracking-wide transition-all active:scale-[0.98]">
            Learn More
          </a>
        </motion.div>

        {/* Hero Image / Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-24 relative w-full max-w-5xl"
        >
          <div className="absolute inset-0 bg-blue-600/10 blur-[120px] -z-10 rounded-full" />
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden">
            <div className="h-12 bg-slate-50 border-b border-slate-200 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <img 
              src="https://picsum.photos/seed/dashboard/1200/800" 
              alt="Dashboard Preview" 
              className="w-full h-auto opacity-90"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>
      </section>

      {/* Frameworks Section */}
      <section id="frameworks" className="bg-slate-50 py-32 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Modern Optimization Frameworks</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">We analyze your content across the four pillars of modern AI-driven search.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Search, title: 'AEO', desc: 'Answer Engine Optimization for voice and direct queries.', color: 'text-blue-600', bg: 'bg-blue-50' },
              { icon: Globe, title: 'GEO', desc: 'Generative Engine Optimization for LLM-based search.', color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { icon: Cpu, title: 'AIO', desc: 'AI Overview optimization for Google Search Generative Experience.', color: 'text-purple-600', bg: 'bg-purple-50' },
              { icon: ShieldCheck, title: 'Guidelines', desc: 'Strict adherence to Google Search Quality Rater guidelines.', color: 'text-amber-600', bg: 'bg-amber-50' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">Actionable Insights, Not Just Scores</h2>
              <div className="flex flex-col gap-8">
                {[
                  { icon: BarChart3, title: 'Priority Action Plan', desc: 'Get a step-by-step guide on what to fix first for maximum impact.' },
                  { icon: Layers, title: 'Schema Generation', desc: 'Automatically generate JSON-LD schema markups tailored to your content.' },
                  { icon: CheckCircle2, title: 'Real-time Audit', desc: 'Instant feedback on your content quality, structure, and AI-readiness.' },
                ].map((feature, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="w-12 h-12 shrink-0 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600/5 blur-[100px] -z-10 rounded-full" />
              <img 
                src="https://picsum.photos/seed/features/800/800" 
                alt="Features Illustration" 
                className="rounded-3xl shadow-2xl border border-slate-100"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">Ready to Optimize Your Content?</h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-12 text-lg">Join thousands of content creators who are already winning in the AI search era.</p>
          <Link to="/signup" className="inline-flex items-center gap-2 px-10 py-5 bg-white text-blue-600 rounded-2xl font-bold text-xl tracking-wide transition-all shadow-2xl shadow-black/10 active:scale-[0.98]">
            Get Started for Free
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-2 items-center md:items-start">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600 fill-blue-600" />
              <span className="text-sm font-bold text-slate-900">ContentOptima</span>
            </div>
            <p className="text-xs text-slate-500">© 2026 ContentOptima. All rights reserved.</p>
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-xs font-bold text-slate-500 hover:text-blue-600 uppercase tracking-widest transition-colors">Twitter</a>
            <a href="#" className="text-xs font-bold text-slate-500 hover:text-blue-600 uppercase tracking-widest transition-colors">LinkedIn</a>
            <a href="#" className="text-xs font-bold text-slate-500 hover:text-blue-600 uppercase tracking-widest transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
