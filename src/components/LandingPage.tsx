import React, { useState } from "react";
import { 
  GraduationCap, 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  Download, 
  ArrowRight, 
  CheckCircle2,
  Globe,
  Smartphone,
  Monitor,
  Users,
  Building2,
  MessageSquare
} from "lucide-react";
import { motion } from "motion/react";
import { EnrollmentForm } from "./EnrollmentForm";

interface LandingPageProps {
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-bottom border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <GraduationCap className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">Smart Education</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Features</a>
              <a href="#downloads" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Downloads</a>
              <a href="#demo" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Take a Demo</a>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={onLogin}
                className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
              >
                Sign In
              </button>
              <button 
                onClick={() => setIsEnrollModalOpen(true)}
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
              >
                Enroll Your Institution
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-indigo-600 uppercase bg-indigo-50 rounded-full">
              The Future of School Management
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]">
              Empower Your Institution with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                Intelligent Operations
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-slate-600 mb-10 leading-relaxed">
              A comprehensive ecosystem designed for modern schools. Automate attendance, 
              streamline finances, and leverage Gemini AI for predictive academic analytics.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => setIsEnrollModalOpen(true)}
                className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 group"
              >
                Enroll Your Institution
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full sm:w-auto bg-white text-slate-900 border-2 border-slate-200 px-8 py-4 rounded-full text-lg font-bold hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-center gap-2">
                Request Access
              </button>
            </div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-20 relative max-w-5xl mx-auto"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl blur opacity-20"></div>
            <div className="relative bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
              <img 
                src="https://picsum.photos/seed/dashboard/1200/800" 
                alt="Dashboard Preview" 
                className="w-full h-auto opacity-90"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything you need to lead</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Powerful tools designed to simplify complex administrative tasks and enhance learning outcomes.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Automated Onboarding",
                desc: "Create school profiles instantly with pre-configured schemas for students, teachers, and classes."
              },
              {
                icon: ShieldCheck,
                title: "Secure Role-Based Access",
                desc: "Granular permissions for Admins, Teachers, Students, and Guardians ensuring data integrity."
              },
              {
                icon: BarChart3,
                title: "AI Predictive Analytics",
                desc: "Leverage Gemini AI to identify performance trends and provide actionable insights for educators."
              },
              {
                icon: Globe,
                title: "Multi-Channel Alerts",
                desc: "Automatic notifications via WhatsApp, SMS, and App Push for attendance and achievements."
              },
              {
                icon: Users,
                title: "Community Engagement",
                desc: "Automated social media posts highlighting school achievements and student success stories."
              },
              {
                icon: MessageSquare,
                title: "Real-time Sync",
                desc: "Instant data synchronization across web, desktop, and mobile platforms."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="text-indigo-600 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download Hub */}
      <section id="downloads" className="py-24 bg-indigo-600 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">Operational Efficiency <br /> on Every Device</h2>
              <p className="text-indigo-100 text-lg mb-10 leading-relaxed">
                Download our native applications for the best experience. Optimized for daily operations like attendance tracking, fee collection, and result management.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:bg-indigo-50 transition-all shadow-lg active:scale-95">
                  <Monitor className="w-6 h-6" />
                  <div className="text-left">
                    <div className="text-[10px] uppercase tracking-wider opacity-70">Download for</div>
                    <div className="text-base">Windows (.exe)</div>
                  </div>
                </button>
                <button className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                  <Smartphone className="w-6 h-6" />
                  <div className="text-left">
                    <div className="text-[10px] uppercase tracking-wider opacity-70">Download for</div>
                    <div className="text-base">Android (.apk)</div>
                  </div>
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-white/20 rounded-full w-3/4"></div>
                  <div className="h-4 bg-white/20 rounded-full w-1/2"></div>
                  <div className="h-32 bg-white/10 rounded-2xl w-full"></div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-20 bg-white/10 rounded-xl"></div>
                    <div className="h-20 bg-white/10 rounded-xl"></div>
                    <div className="h-20 bg-white/10 rounded-xl"></div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white text-indigo-600 p-6 rounded-2xl shadow-xl border border-indigo-100">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-bold">System Ready</span>
                </div>
                <div className="text-xs text-slate-500">v2.4.0 Stable Build</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="text-white w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">Smart Education</span>
          </div>
          <div className="flex gap-8 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Contact Support</a>
          </div>
          <p className="text-sm text-slate-400">© 2026 Smart Education. All rights reserved.</p>
        </div>
      </footer>

      {/* Enrollment Modal */}
      {isEnrollModalOpen && (
        <EnrollmentForm onClose={() => setIsEnrollModalOpen(false)} />
      )}
    </div>
  );
};
