import React from "react";
import { ArrowLeft, Building2, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

interface FinanceSubPageProps {
  title: string;
  description: string;
  onBack: () => void;
  onEnroll: () => void;
}

export const FinanceSubPage: React.FC<FinanceSubPageProps> = ({ 
  title, 
  description, 
  onBack, 
  onEnroll 
}) => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <nav className="h-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
                <Building2 className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">Smart<span className="text-indigo-600">Edu</span></span>
            </div>
          </div>
          <button 
            onClick={onEnroll}
            className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-indigo-700 transition-all"
          >
            Get Started
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">{title}</h1>
          <p className="text-xl text-slate-600 mb-12 leading-relaxed">{description}</p>
          
          <div className="bg-slate-50 rounded-[2.5rem] p-12 border border-slate-100 mb-12">
            <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg animate-pulse"></div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Module Coming Soon</h2>
            <p className="text-slate-500 max-w-md mx-auto">
              We're currently polishing the {title} experience. Sign up for a demo to see the full version in action.
            </p>
          </div>

          <button 
            onClick={onEnroll}
            className="bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-2 mx-auto"
          >
            Book a Demo
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      </main>
    </div>
  );
};
