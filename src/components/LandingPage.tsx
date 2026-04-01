import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Search, 
  Globe, 
  Cpu, 
  ShieldCheck, 
  ArrowRight, 
  BarChart3, 
  TrendingUp, 
  Target, 
  MousePointer2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { cn } from '../lib/utils';

interface LandingPageProps {
  onLogin: () => void;
}

export const LandingPage = ({ onLogin }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">Content<span className="text-blue-600">Optima</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Features</a>
            <a href="#growth" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Growth</a>
            <button 
              onClick={onLogin}
              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 md:pt-56 md:pb-32 px-4">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-50/50 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-50/50 rounded-full blur-3xl opacity-50" />
        </div>

        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-widest mb-8"
          >
            <Sparkles className="w-4 h-4" />
            The Future of Search is Here
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tight mb-8"
          >
            Optimize for the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Answer Engine</span> Era.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Stop guessing how AI sees your content. Audit your articles for AEO, GEO, and AI Overviews with professional-grade precision.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={onLogin}
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-500 transition-all active:scale-95 shadow-xl shadow-blue-200 flex items-center justify-center gap-2"
            >
              Start Free Audit
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all active:scale-95">
              View Sample Report
            </button>
          </motion.div>

          {/* Hero Image / Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-20 relative max-w-5xl mx-auto"
          >
            <div className="absolute inset-0 bg-blue-600/5 blur-3xl -z-10 rounded-3xl" />
            <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xl shadow-blue-900/10">
              <img 
                src="https://picsum.photos/seed/ai-seo-dashboard/1600/900" 
                alt="ContentOptima Dashboard" 
                className="rounded-2xl w-full h-auto"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">Master Every Engine.</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Our multi-framework audit ensures your content resonates with both humans and generative models.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Search,
                title: 'AEO Audit',
                desc: 'Optimize for Answer Engines like Perplexity and SearchGPT. Be the direct answer.',
                color: 'text-blue-600',
                bg: 'bg-blue-50'
              },
              {
                icon: Globe,
                title: 'GEO Strategy',
                desc: 'Generative Engine Optimization to influence how LLMs cite and summarize your work.',
                color: 'text-emerald-600',
                bg: 'bg-emerald-50'
              },
              {
                icon: Cpu,
                title: 'AI Overviews',
                desc: 'Secure your spot in Google\'s AI-generated summaries with structured optimization.',
                color: 'text-indigo-600',
                bg: 'bg-indigo-50'
              },
              {
                icon: ShieldCheck,
                title: 'Google EEAT',
                desc: 'Ensure your content meets the highest standards of Experience, Expertise, and Trust.',
                color: 'text-amber-600',
                bg: 'bg-amber-50'
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all"
              >
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", feature.bg, feature.color)}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Growth Section */}
      <section id="growth" className="py-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50" />
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative z-10"
              >
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight mb-8">
                  Data-Driven <br />
                  <span className="text-blue-600">Growth</span> for the <br />
                  AI-First Web.
                </h2>
                
                <div className="flex flex-col gap-6">
                  {[
                    { icon: TrendingUp, title: '40% Higher Visibility', desc: 'Websites optimized for AEO see a significant jump in generative citations.' },
                    { icon: Target, title: 'Precision Targeting', desc: 'Identify exactly which paragraphs AI models are likely to extract as answers.' },
                    { icon: MousePointer2, title: 'Higher CTR', desc: 'Better citations lead to more qualified traffic from AI-driven discovery.' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{item.title}</h4>
                        <p className="text-sm text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-slate-900 rounded-[40px] p-8 md:p-12 text-white relative"
            >
              <div className="absolute top-0 right-0 p-8">
                <BarChart3 className="w-12 h-12 text-blue-500 opacity-20" />
              </div>
              
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                  <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Growth Metric</span>
                  <div className="text-6xl font-black">12.4x</div>
                  <p className="text-slate-400 text-sm">Average increase in "Direct Answer" appearances for optimized content.</p>
                </div>

                <div className="h-px bg-slate-800 w-full" />

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <div className="text-2xl font-bold text-blue-400">+85%</div>
                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-bold">Trust Score</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-400">-60%</div>
                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-bold">Audit Time</p>
                  </div>
                </div>

                <button 
                  onClick={onLogin}
                  className="w-full py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                >
                  Unlock Your Growth
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-12">Trusted by Forward-Thinking Teams</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale">
            <span className="text-2xl font-black">TECHFLOW</span>
            <span className="text-2xl font-black">GROWTH.AI</span>
            <span className="text-2xl font-black">CONTENTLY</span>
            <span className="text-2xl font-black">SEARCHLAB</span>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto bg-blue-600 rounded-[48px] p-12 md:p-20 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]" />
          
          <div className="relative z-10">
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full" />
                <img 
                  src="https://picsum.photos/seed/growth-chart/400/400" 
                  alt="Growth Chart" 
                  className="w-24 h-24 rounded-2xl border-2 border-white/30 shadow-2xl relative z-10"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Ready to dominate <br /> generative search?</h2>
            <p className="text-blue-100 text-lg md:text-xl max-w-xl mx-auto mb-12">
              Join 2,000+ content creators and SEO professionals using ContentOptima to stay ahead of the AI curve.
            </p>
            <button 
              onClick={onLogin}
              className="px-10 py-5 bg-white text-blue-600 rounded-2xl font-black text-xl hover:bg-blue-50 transition-all shadow-2xl shadow-blue-900/20 active:scale-95"
            >
              Get Started for Free
            </button>
            <p className="mt-6 text-blue-200 text-sm font-medium">No credit card required. Instant access.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <Zap className="w-6 h-6 text-blue-600 fill-blue-600" />
                <span className="text-xl font-black tracking-tight text-slate-900">ContentOptima</span>
              </div>
              <p className="text-slate-500 max-w-sm leading-relaxed">
                The world's first comprehensive audit platform for the generative search era. Optimize for AEO, GEO, and beyond.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Product</h4>
              <ul className="flex flex-col gap-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-blue-600">Features</a></li>
                <li><a href="#" className="hover:text-blue-600">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-600">API</a></li>
                <li><a href="#" className="hover:text-blue-600">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Company</h4>
              <ul className="flex flex-col gap-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-blue-600">About</a></li>
                <li><a href="#" className="hover:text-blue-600">Blog</a></li>
                <li><a href="#" className="hover:text-blue-600">Privacy</a></li>
                <li><a href="#" className="hover:text-blue-600">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-400">© 2026 ContentOptima. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors">Twitter</a>
              <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors">LinkedIn</a>
              <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
