import React, { useState, useEffect } from "react";
import { 
  CreditCard, 
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
  ArrowLeft,
  Bell,
  Receipt,
  PieChart,
  DollarSign,
  Wallet,
  Briefcase,
  ArrowUpRight
} from "lucide-react";
import { motion } from "motion/react";

interface FinanceManagementPageProps {
  onBack: () => void;
  onEnroll: () => void;
  onNavigateToSubFeature: (feature: string) => void;
}

export const FinanceManagementPage: React.FC<FinanceManagementPageProps> = ({ 
  onBack, 
  onEnroll,
  onNavigateToSubFeature
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const subFeatures = [
    {
      id: "overview",
      title: "Finance Overview",
      desc: "Real-time financial insights and summaries of your institution's health.",
      icon: PieChart,
      color: "bg-blue-50 text-blue-600",
      link: "/finance/overview"
    },
    {
      id: "fees",
      title: "Fee Management",
      desc: "Automate fee collection, tracking, and digital receipt generation.",
      icon: CreditCard,
      color: "bg-emerald-50 text-emerald-600",
      link: "/finance/fees"
    },
    {
      id: "salary",
      title: "Salary Management",
      desc: "Manage staff salaries, payroll processing, and payment history.",
      icon: Briefcase,
      color: "bg-indigo-50 text-indigo-600",
      link: "/finance/salary"
    },
    {
      id: "expenses",
      title: "Expense Management",
      desc: "Track school expenditures and maintain strict budget control.",
      icon: Wallet,
      color: "bg-rose-50 text-rose-600",
      link: "/finance/expenses"
    }
  ];

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
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-50 rounded-full blur-[120px] opacity-50"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-50 rounded-full blur-[120px] opacity-50"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 bg-indigo-50 border border-indigo-100 rounded-full">
              <DollarSign className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Finance Management System</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-8 max-w-4xl mx-auto">
              Complete Financial <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">Management for Your School.</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
              Manage fees, salaries, and expenses in one powerful system. Gain full transparency and control over your institution's financial health.
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
                Book a Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-indigo-600 font-bold text-sm uppercase tracking-widest mb-4">Centralized Control</h2>
              <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
                One module to rule <br />all your financial operations.
              </h3>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed font-medium">
                Finance Management is the core engine of SmartEdu, designed to provide school administrators with a 360-degree view of their cash flow. From student fee collection to staff payroll and daily expenditures, everything is synchronized in real-time.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {["Finance Overview", "Fee Management", "Salary Management", "Expense Management"].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="font-bold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden">
                <div className="flex justify-between items-center mb-8">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Revenue</p>
                    <p className="text-3xl font-black text-slate-900">$128,450.00</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 w-3/4"></div>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-slate-400">
                    <span>FEES COLLECTED</span>
                    <span>75%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sub-Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-indigo-600 font-bold text-sm uppercase tracking-widest mb-4">The Modules</h2>
            <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">Deep-dive into our sub-features.</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {subFeatures.map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="group p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer"
                onClick={() => onNavigateToSubFeature(feature.id)}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center`}>
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
                <h4 className="text-2xl font-bold text-slate-900 mb-3">{feature.title}</h4>
                <p className="text-slate-500 font-medium mb-6 leading-relaxed">{feature.desc}</p>
                <span className="text-sm font-bold text-indigo-600 group-hover:underline">Explore {feature.title}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-indigo-400 font-bold text-sm uppercase tracking-widest mb-4">Why Finance Management?</h2>
            <h3 className="text-4xl font-extrabold tracking-tight">Financial excellence, simplified.</h3>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { title: "Full Transparency", desc: "Every transaction is logged and traceable in real-time.", icon: ShieldCheck },
              { title: "Reduced Errors", desc: "Automated calculations eliminate manual reconciliation mistakes.", icon: Zap },
              { title: "Better Planning", desc: "Data-driven insights help you plan budgets more effectively.", icon: BarChart3 },
              { title: "Time-saving", desc: "Automate repetitive tasks like payroll and fee reminders.", icon: Clock }
            ].map((benefit, i) => (
              <div key={i} className="space-y-4">
                <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center">
                  <benefit.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <h4 className="text-xl font-bold">{benefit.title}</h4>
                <p className="text-slate-400 font-medium leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Section */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-100">
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <h5 className="font-black text-slate-900">Monthly Cash Flow</h5>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                      <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                    </div>
                  </div>
                  <div className="h-64 flex items-end gap-3">
                    {[60, 40, 80, 50, 90, 70, 85].map((h, i) => (
                      <div key={i} className="flex-1 space-y-2">
                        <div className="w-full bg-indigo-600 rounded-t-lg" style={{ height: `${h}%` }}></div>
                        <div className="w-full bg-emerald-400 rounded-t-lg" style={{ height: `${h * 0.6}%` }}></div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-8">
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Inflow</p>
                      <p className="font-black text-indigo-600">$84k</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Outflow</p>
                      <p className="font-black text-rose-500">$32k</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Net</p>
                      <p className="font-black text-emerald-600">$52k</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-indigo-600 font-bold text-sm uppercase tracking-widest mb-4">Visual Insights</h2>
              <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
                Turn raw data into <br />strategic decisions.
              </h3>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed font-medium">
                Our dashboard provides visual representations of your school's financial health. Identify trends, monitor budget adherence, and generate professional reports with a single click.
              </p>
              <button className="flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all">
                Explore Analytics Dashboard <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-indigo-600 rounded-[3rem] p-12 lg:p-20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
              <div>
                <h3 className="text-3xl lg:text-4xl font-extrabold mb-6 leading-tight">
                  "The Finance module is a game-changer. We've reduced our audit time by 70% and eliminated all manual entry errors."
                </h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full"></div>
                  <div>
                    <p className="font-bold">Robert Sterling</p>
                    <p className="text-indigo-200 text-sm">CFO, Heritage Group of Schools</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <p className="text-4xl lg:text-5xl font-black mb-2">100%</p>
                  <p className="text-indigo-200 font-bold uppercase tracking-widest text-xs">Accuracy</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl lg:text-5xl font-black mb-2">$50M+</p>
                  <p className="text-indigo-200 font-bold uppercase tracking-widest text-xs">Processed</p>
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
            Take control of your <br />school finances today.
          </h2>
          <p className="text-xl text-slate-600 mb-12 font-medium leading-relaxed">
            Join the elite schools managing their finances with precision. Start your journey towards financial excellence now.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={onEnroll}
              className="bg-indigo-600 text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-indigo-700 transition-all shadow-2xl active:scale-95"
            >
              Get Started
            </button>
            <button className="bg-white text-slate-900 border border-slate-200 px-10 py-5 rounded-full text-lg font-bold hover:bg-slate-50 transition-all">
              Book a Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-sm font-medium">© 2026 SmartEdu Finance Management. All rights reserved.</p>
      </footer>
    </div>
  );
};
