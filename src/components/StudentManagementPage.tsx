import React, { useState, useEffect } from "react";
import { 
  Users, 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  CheckCircle2,
  ChevronRight,
  Layout,
  FileText,
  Search,
  ArrowRight,
  Database,
  Clock,
  TrendingUp,
  MessageSquare,
  Building2,
  ArrowLeft
} from "lucide-react";
import { motion } from "motion/react";

interface StudentManagementPageProps {
  onBack: () => void;
  onEnroll: () => void;
}

export const StudentManagementPage: React.FC<StudentManagementPageProps> = ({ onBack, onEnroll }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700 overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 ${scrolled ? "h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm" : "h-20 bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
                <Building2 className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">Smart<span className="text-indigo-600">Edu</span></span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={onEnroll}
              className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              Book a Demo
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-40 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-50 rounded-full blur-[120px] opacity-50"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-50 rounded-full blur-[120px] opacity-50"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 bg-indigo-50 border border-indigo-100 rounded-full">
              <Users className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Student Management Module</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-8 max-w-4xl mx-auto">
              Stop drowning in paperwork. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Automate your student records.</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
              The most intuitive student management system built for modern schools. Manage profiles, track performance, and secure data in one centralized platform.
            </p>

            <div className="flex justify-center gap-4">
              <button 
                onClick={onEnroll}
                className="bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-2 group"
              >
                Start Free Trial
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-full text-lg font-bold hover:bg-slate-50 transition-all">
                View Pricing
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-indigo-600 font-bold text-sm uppercase tracking-widest mb-4">The Challenge</h2>
              <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
                Why managing students manually <br />is holding your school back.
              </h3>
              <div className="space-y-6">
                {[
                  { title: "Data Silos", desc: "Student information scattered across spreadsheets and paper files." },
                  { title: "Manual Errors", desc: "Inaccurate record-keeping leading to administrative headaches." },
                  { title: "Lack of Insights", desc: "Impossible to track long-term student growth and performance trends." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{item.title}</h4>
                      <p className="text-slate-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
                <div className="space-y-4 opacity-40 grayscale">
                  <div className="h-4 w-3/4 bg-slate-200 rounded-full"></div>
                  <div className="h-4 w-1/2 bg-slate-200 rounded-full"></div>
                  <div className="h-4 w-5/6 bg-slate-200 rounded-full"></div>
                  <div className="h-4 w-2/3 bg-slate-200 rounded-full"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-rose-500 text-white px-6 py-2 rounded-full font-bold shadow-lg">
                    Outdated Method
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-indigo-600 font-bold text-sm uppercase tracking-widest mb-4">The Solution</h2>
          <h3 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-16">
            A unified platform for student success.
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Centralized Data", desc: "Every student record, from enrollment to graduation, in one secure place.", icon: Database },
              { title: "Real-time Tracking", desc: "Monitor academic progress and attendance as it happens.", icon: BarChart3 },
              { title: "Smart Communication", desc: "Keep parents and staff aligned with automated updates.", icon: MessageSquare }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <item.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h4>
                <p className="text-slate-500 font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-2xl border border-slate-700">
                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Student Profile</p>
                      <p className="font-bold">Sarah Jenkins • Grade 10</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-700">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">GPA</p>
                      <p className="text-xl font-bold text-emerald-400">3.92</p>
                    </div>
                    <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-700">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Attendance</p>
                      <p className="text-xl font-bold text-indigo-400">98%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-indigo-400 font-bold text-sm uppercase tracking-widest mb-4">Core Features</h2>
              <h3 className="text-4xl font-extrabold mb-8 tracking-tight">Powerful tools for administrators.</h3>
              <div className="space-y-8">
                {[
                  { title: "Digital Student Profiles", desc: "Comprehensive 360-degree view of every student's journey.", icon: Layout },
                  { title: "Performance Analytics", desc: "Visual charts and reports to identify students who need support.", icon: TrendingUp },
                  { title: "Secure Data Management", desc: "Enterprise-grade encryption for sensitive student information.", icon: ShieldCheck }
                ].map((feature, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center shrink-0">
                      <feature.icon className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
                      <p className="text-slate-400 font-medium">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-indigo-600 font-bold text-sm uppercase tracking-widest mb-4">Benefits</h2>
            <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">Why schools love SmartEdu.</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { title: "Save 15+ Hours/Week", desc: "Automate repetitive data entry and report generation.", icon: Clock },
              { title: "Reduce Manual Work", desc: "Eliminate paper forms and manual filing systems.", icon: Zap },
              { title: "Improve Efficiency", desc: "Instant access to any student record from any device.", icon: CheckCircle2 }
            ].map((benefit, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <benefit.icon className="w-8 h-8 text-indigo-600" />
                </div>
                <h4 className="text-2xl font-bold text-slate-900 mb-4">{benefit.title}</h4>
                <p className="text-slate-500 font-medium leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-indigo-600 rounded-[3rem] p-12 lg:p-20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
              <div>
                <h3 className="text-3xl lg:text-4xl font-extrabold mb-6 leading-tight">
                  "SmartEdu transformed how we manage our 1,200 students. We've seen a 40% increase in administrative efficiency."
                </h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full"></div>
                  <div>
                    <p className="font-bold">Dr. Michael Chen</p>
                    <p className="text-indigo-200 text-sm">Principal, Westview Academy</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <p className="text-4xl lg:text-5xl font-black mb-2">500+</p>
                  <p className="text-indigo-200 font-bold uppercase tracking-widest text-xs">Schools</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl lg:text-5xl font-black mb-2">99.9%</p>
                  <p className="text-indigo-200 font-bold uppercase tracking-widest text-xs">Uptime</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8 leading-tight text-slate-900">
            Ready to streamline your <br />student management?
          </h2>
          <p className="text-xl text-slate-600 mb-12 font-medium leading-relaxed">
            Join hundreds of schools that have already modernised their operations. Get started today with a 14-day free trial.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={onEnroll}
              className="bg-indigo-600 text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-indigo-700 transition-all shadow-2xl active:scale-95"
            >
              Start Free Trial
            </button>
            <button className="bg-white text-slate-900 border border-slate-200 px-10 py-5 rounded-full text-lg font-bold hover:bg-slate-50 transition-all">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-sm font-medium">© 2026 SmartEdu Student Management. All rights reserved.</p>
      </footer>
    </div>
  );
};
