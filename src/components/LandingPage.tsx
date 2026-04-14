import React, { useState, useEffect } from "react";
import { 
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
  Phone,
  Layout,
  FileText,
  Search,
  ChevronRight,
  CircleDollarSign,
  Layers,
  CreditCard,
  Lock,
  Activity,
  Server,
  Terminal,
  Code2,
  GraduationCap,
  BookOpen,
  School,
  Building,
  Settings,
  Newspaper,
  LifeBuoy,
  Book,
  PlayCircle,
  MessageSquare,
  Menu,
  X,
  ChevronDown,
  DollarSign
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { EnrollmentForm } from "./EnrollmentForm";

interface LandingPageProps {
  onLogin: () => void;
  onNavigateToStudentManagement: () => void;
  onNavigateToFinanceManagement: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onLogin, 
  onNavigateToStudentManagement,
  onNavigateToFinanceManagement 
}) => {
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuData = {
    Features: [
      { title: "Student Management", desc: "Manage student profiles and records.", icon: Users },
      { title: "Attendance Tracking", desc: "Real-time attendance monitoring.", icon: CheckCircle2 },
      { title: "Exams & Results", desc: "Automated grading and reports.", icon: FileText },
      { title: "Finance Management", desc: "Complete financial control system.", icon: DollarSign },
      { title: "Parent Communication", desc: "Instant updates and alerts.", icon: MessageSquare },
    ],
    Solutions: [
      { title: "For Schools", desc: "Tailored for K-12 institutions.", icon: Building2 },
      { title: "For Colleges", desc: "Advanced higher-ed management.", icon: GraduationCap },
      { title: "For Coaching Centers", desc: "Optimized for private tutoring.", icon: BookOpen },
    ],
    Schools: [
      { title: "Primary School", desc: "Foundational learning tools.", icon: School },
      { title: "High School", desc: "Comprehensive academic tracking.", icon: Building },
      { title: "Academy Setup", desc: "Custom configurations for academies.", icon: Settings },
    ],
    Resources: [
      { title: "Blog", desc: "Latest trends in ed-tech.", icon: Newspaper },
      { title: "Help Center", desc: "24/7 support and guides.", icon: LifeBuoy },
      { title: "Documentation", desc: "Detailed API and setup docs.", icon: Book },
      { title: "Tutorials", desc: "Step-by-step video guides.", icon: PlayCircle },
    ],
  };

  const countries = [
    { name: "Pakistan", languages: ["English", "Urdu"] },
    { name: "India", languages: ["English", "Hindi"] },
    { name: "United Kingdom", languages: ["English"] },
    { name: "United States", languages: ["English", "Spanish"] },
    { name: "United Arab Emirates", languages: ["English", "Arabic"] },
    { name: "Global", languages: ["English"] }
  ];

  const currentCountryData = countries.find(c => c.name === selectedCountry);

  const features = [
    {
      title: "Intelligent Analytics",
      desc: "Real-time insights into student performance and institutional health.",
      icon: BarChart3,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: "Secure Infrastructure",
      desc: "Enterprise-grade security protecting sensitive educational data.",
      icon: ShieldCheck,
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
    {
      title: "Global Payments",
      desc: "Seamless fee collection with support for 135+ currencies.",
      icon: CreditCard,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10"
    },
    {
      title: "Automated Workflows",
      desc: "Streamline administrative tasks with AI-powered automation.",
      icon: Zap,
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
    {
      title: "Developer API",
      desc: "Extensible platform with robust APIs for custom integrations.",
      icon: Terminal,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      title: "Mobile Ecosystem",
      desc: "Native apps for teachers, students, and parents on all platforms.",
      icon: Smartphone,
      color: "text-rose-500",
      bg: "bg-rose-500/10"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700 overflow-x-hidden">
      {/* Navigation */}
      <nav 
        className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
          scrolled || activeDropdown 
            ? "bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm" 
            : "bg-transparent"
        }`}
        onMouseLeave={() => setActiveDropdown(null)}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 group cursor-pointer shrink-0">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">
              <Building2 className="text-white w-5 h-5" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">Smart<span className="text-indigo-600">Edu</span></span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {Object.keys(menuData).map((item) => (
              <div 
                key={item} 
                className="relative"
                onMouseEnter={() => setActiveDropdown(item)}
              >
                <button className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold transition-colors rounded-full ${activeDropdown === item ? "text-indigo-600 bg-indigo-50/50" : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"}`}>
                  {item}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === item ? "rotate-180" : ""}`} />
                </button>
              </div>
            ))}
            <a href="#" className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Pricing</a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button onClick={onLogin} className="hidden sm:block text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Sign in</button>
            <button 
              onClick={onLogin}
              className="hidden sm:flex items-center gap-2 bg-amber-50 text-amber-600 px-6 py-2.5 rounded-full text-sm font-bold hover:bg-amber-100 transition-all border border-amber-100"
            >
              <Zap className="w-4 h-4" /> Try Demo
            </button>
            <button 
              onClick={() => setIsEnrollModalOpen(true)}
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              Start now
            </button>
            <button 
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Dropdown Panel */}
        <AnimatePresence>
          {activeDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-2xl overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
                  {menuData[activeDropdown as keyof typeof menuData].map((subItem, idx) => (
                    <motion.a
                      key={subItem.title}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (subItem.title === "Student Management") {
                          onNavigateToStudentManagement();
                        }
                        if (subItem.title === "Finance Management") {
                          onNavigateToFinanceManagement();
                        }
                      }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all group"
                    >
                      <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <subItem.icon className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{subItem.title}</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">{subItem.desc}</p>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
              <div className="bg-slate-50 py-6">
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ready to transform your institution?</p>
                  <a href="#" className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:gap-2 transition-all">
                    View all {activeDropdown.toLowerCase()} <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
            >
              <div className="px-6 py-8 space-y-6">
                {Object.entries(menuData).map(([category, items]) => (
                  <div key={category}>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{category}</h4>
                    <div className="grid grid-cols-1 gap-4">
                      {items.map((item) => (
                        <a key={item.title} href="#" className="flex items-center gap-3 text-sm font-semibold text-slate-700 hover:text-indigo-600">
                          <item.icon className="w-4 h-4 text-indigo-600" />
                          {item.title}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="pt-6 border-t border-slate-100 flex flex-col gap-4">
                  <button onClick={onLogin} className="text-sm font-bold text-slate-600">Sign in</button>
                  <button 
                    onClick={() => setIsEnrollModalOpen(true)}
                    className="bg-indigo-600 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20"
                  >
                    Start now
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-40 overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-100 rounded-full blur-[120px] opacity-50 animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-100 rounded-full blur-[120px] opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-30 animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 bg-indigo-50 border border-indigo-100 rounded-full">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600"></span>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">New: AI-Powered Analytics 2.0</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-8">
              The operating system <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">for global education.</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl font-medium">
              Millions of institutions of all sizes—from local schools to global universities—use SmartEdu to manage operations, automate workflows, and scale their educational impact.
            </p>

            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setIsEnrollModalOpen(true)}
                className="bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-2 group"
              >
                Start free trial
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={onLogin}
                className="bg-amber-50 text-amber-600 border border-amber-100 px-8 py-4 rounded-full text-lg font-bold hover:bg-amber-100 transition-all flex items-center gap-2"
              >
                <Zap className="w-5 h-5" /> Try Demo
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            {/* Dashboard Mockup - Glassmorphism */}
            <div className="relative z-10 bg-white/40 backdrop-blur-2xl border border-white/60 rounded-3xl p-4 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                <div className="h-10 bg-slate-50 border-b border-slate-100 flex items-center px-4 gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-8">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Gross Revenue</p>
                      <p className="text-3xl font-extrabold text-slate-900">$124,592.00</p>
                    </div>
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                      <Activity className="w-6 h-6 text-indigo-600" />
                    </div>
                  </div>
                  <div className="h-48 w-full bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center">
                    <div className="flex items-end gap-2 h-32">
                      {[40, 70, 45, 90, 65, 80, 55, 95, 75, 85].map((h, i) => (
                        <motion.div 
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                          className="w-4 bg-indigo-600/20 rounded-t-sm hover:bg-indigo-600 transition-colors cursor-pointer"
                        ></motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 z-20 flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payment Success</p>
                <p className="text-sm font-bold text-slate-900">+$2,400.00</p>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 z-20 flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Students</p>
                <p className="text-sm font-bold text-slate-900">12,402</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 border-y border-slate-100 bg-slate-50/30">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-12">Trusted by innovative institutions</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            {["Stanford", "MIT", "Harvard", "Oxford", "Cambridge", "Yale"].map((brand) => (
              <span key={brand} className="text-xl lg:text-2xl font-black tracking-tighter text-slate-900">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-20">
            <h2 className="text-indigo-600 font-bold text-sm uppercase tracking-widest mb-4">Features</h2>
            <h3 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Everything you need to run <br />your institution at scale.
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h4>
                <p className="text-slate-600 leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-32 px-6 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] -mr-64 -mt-64"></div>
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
          <div>
            <h2 className="text-indigo-400 font-bold text-sm uppercase tracking-widest mb-4">Developer First</h2>
            <h3 className="text-4xl lg:text-5xl font-extrabold mb-8 tracking-tight leading-tight">
              The most extensible <br />education API ever built.
            </h3>
            <p className="text-lg text-slate-400 mb-10 leading-relaxed font-medium">
              Integrate SmartEdu into your existing tech stack in minutes. Our robust API and SDKs give you total control over your data and workflows.
            </p>
            <div className="space-y-4">
              {[
                "Webhooks for real-time event handling",
                "Comprehensive documentation & SDKs",
                "Sandbox environment for testing"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-indigo-600/20 flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                  </div>
                  <span className="text-slate-300 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl p-1 border border-slate-700 shadow-2xl">
            <div className="bg-slate-950 rounded-xl overflow-hidden">
              <div className="h-10 bg-slate-900 border-b border-slate-800 flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                </div>
                <div className="ml-4 flex items-center gap-2">
                  <Code2 className="w-3 h-3 text-slate-500" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">enroll_student.js</span>
                </div>
              </div>
              <div className="p-6 font-mono text-sm">
                <pre className="text-indigo-300">
                  <code>{`const smartEdu = require('smartedu')('sk_test_...');

await smartEdu.students.create({
  name: 'Alex Johnson',
  email: 'alex@example.edu',
  class_id: 'cls_928374',
  metadata: {
    enrollment_year: 2026
  }
});`}</code>
                </pre>
                <div className="mt-6 pt-6 border-t border-slate-800">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Response: 200 OK</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-indigo-600 font-bold text-sm uppercase tracking-widest mb-4">Process</h2>
            <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">Get started in three steps.</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Create your account",
                desc: "Sign up in minutes and configure your institutional settings.",
                icon: Layout
              },
              {
                step: "02",
                title: "Import your data",
                desc: "Seamlessly migrate students, staff, and records from any format.",
                icon: Server
              },
              {
                step: "03",
                title: "Launch & Scale",
                desc: "Go live with your new operating system and start growing.",
                icon: Zap
              }
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-8xl font-black text-slate-50 absolute -top-10 -left-4 -z-10">{item.step}</div>
                <div className="w-16 h-16 bg-white shadow-lg rounded-2xl flex items-center justify-center mb-8 border border-slate-100">
                  <item.icon className="w-8 h-8 text-indigo-600" />
                </div>
                <h4 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h4>
                <p className="text-slate-600 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-32 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-indigo-600 font-bold text-sm uppercase tracking-widest mb-4">Pricing</h2>
            <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">Simple, transparent pricing.</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-10 rounded-[2.5rem] bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all">
              <h4 className="text-xl font-bold text-slate-900 mb-2">Growth</h4>
              <p className="text-slate-500 mb-8 font-medium">For growing institutions.</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-extrabold text-slate-900">$49</span>
                <span className="text-slate-500 font-bold">/mo</span>
              </div>
              <ul className="space-y-4 mb-10">
                {["Up to 500 students", "Basic analytics", "Mobile apps", "Email support"].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 rounded-full border-2 border-slate-200 font-bold text-slate-900 hover:bg-slate-50 transition-all">Get started</button>
            </div>

            <div className="p-10 rounded-[2.5rem] bg-white border-2 border-indigo-600 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-indigo-600 text-white px-6 py-1 text-[10px] font-bold uppercase tracking-widest rounded-bl-xl">Popular</div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Enterprise</h4>
              <p className="text-slate-500 mb-8 font-medium">For large-scale operations.</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-extrabold text-slate-900">$199</span>
                <span className="text-slate-500 font-bold">/mo</span>
              </div>
              <ul className="space-y-4 mb-10">
                {["Unlimited students", "Advanced AI analytics", "Full API access", "24/7 Priority support", "Custom branding"].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 rounded-full bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">Contact sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600 -z-10"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[80%] bg-purple-500 rounded-full blur-[120px] opacity-30"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[80%] bg-blue-500 rounded-full blur-[120px] opacity-30"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8 leading-tight">
            Ready to build the future <br />of your institution?
          </h2>
          <p className="text-xl text-indigo-100 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Join thousands of schools worldwide that are already scaling their impact with SmartEdu.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => setIsEnrollModalOpen(true)}
              className="bg-white text-indigo-600 px-10 py-5 rounded-full text-lg font-bold hover:bg-indigo-50 transition-all shadow-2xl active:scale-95"
            >
              Start now
            </button>
            <button className="bg-indigo-700/50 text-white border border-indigo-400/30 px-10 py-5 rounded-full text-lg font-bold hover:bg-indigo-700/70 transition-all backdrop-blur-sm">
              Contact sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-5 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Building2 className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">Smart<span className="text-indigo-600">Edu</span></span>
            </div>
            <p className="text-slate-500 font-medium leading-relaxed max-w-xs mb-8">
              The definitive operating system for modern education. Built for scale, security, and speed.
            </p>
            <div className="flex gap-4">
              {["Twitter", "LinkedIn", "GitHub"].map(s => (
                <a key={s} href="#" className="text-slate-400 hover:text-indigo-600 transition-colors font-bold text-sm uppercase tracking-widest">{s}</a>
              ))}
            </div>
          </div>
          
          {[
            { title: "Products", links: ["Intelligence", "Operations", "Security", "Analytics"] },
            { title: "Resources", links: ["Documentation", "API Reference", "Support", "Guides"] },
            { title: "Company", links: ["About", "Careers", "Press", "Legal"] }
          ].map((group, i) => (
            <div key={i}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-6">{group.title}</h4>
              <ul className="space-y-4">
                {group.links.map(link => (
                  <li key={link}><a href="#" className="text-slate-500 hover:text-indigo-600 transition-colors font-semibold text-sm">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-sm font-medium">© 2026 Smart Education. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors text-sm font-medium">Privacy Policy</a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors text-sm font-medium">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* Enrollment Modal */}
      {isEnrollModalOpen && (
        <EnrollmentForm onClose={() => setIsEnrollModalOpen(false)} />
      )}
    </div>
  );
};
