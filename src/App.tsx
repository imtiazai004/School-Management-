import { 
  CheckCircle2, 
  CircleDollarSign, 
  BarChart3, 
  UserRound, 
  Users, 
  Lightbulb, 
  User, 
  Building2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Package,
  Truck,
  BookOpen,
  ClipboardCheck,
  LayoutDashboard,
  Lock,
  LogOut,
  Bell,
  Settings,
  Search,
  Menu,
  X,
  ChevronDown,
  UserCheck
} from "lucide-react";
import { FeatureCard } from "@/components/FeatureCard";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { 
  ClassesSmartManagement, 
  FinancialSuite, 
  AcademicAnalytics,
  GuardianEngagementHub,
  StudentManagementPortal,
  ModulePlaceholder 
} from "@/components/Modules";

type UserRole = "Headmaster" | "Vice Principal" | "Teacher" | "Clerk" | "Guardian" | "Student";

const features = [
  {
    icon: CheckCircle2,
    title: "Classes Smart Management",
    urduTitle: "ذہین حاضری کا نظام",
    category: "Operations",
    description: "AI-driven attendance tracking with real-time guardian synchronization.",
    detailedDescription: "The Classes Smart Management utilizes advanced pattern recognition to track student and staff attendance. It automatically triggers multi-channel alerts (WhatsApp, SMS, App Push) and generates predictive absenteeism reports to help educators intervene early.",
    allowedRoles: ["Headmaster", "Vice Principal", "Teacher"],
  },
  {
    icon: CircleDollarSign,
    title: "Financial Operations Suite",
    urduTitle: "مالیاتی آپریشنز سویٹ",
    category: "Finance",
    description: "End-to-end fiscal management from automated billing to audit-ready reporting.",
    detailedDescription: "A comprehensive financial ecosystem that handles complex fee structures, scholarship distributions, and automated payroll. With integrated payment gateways and real-time ledger updates, it ensures 100% financial transparency and accuracy.",
    allowedRoles: ["Headmaster", "Vice Principal", "Clerk"],
  },
  {
    icon: BarChart3,
    title: "Academic Performance Analytics",
    urduTitle: "تعلیمی کارکردگی کے تجزیات",
    category: "Academic",
    description: "Deep-dive analytics into student progress with bilingual reporting.",
    detailedDescription: "Transform raw marks into meaningful growth charts. Our analytics engine compares student performance across terms and subjects, providing teachers with actionable insights to personalize learning paths for every student.",
    allowedRoles: ["Headmaster", "Vice Principal", "Teacher", "Guardian", "Student"],
  },
  {
    icon: UserRound,
    title: "Guardian Engagement Hub",
    urduTitle: "سرپرستوں کا مرکز",
    category: "Communication",
    description: "A centralized portal for seamless school-to-home collaboration.",
    detailedDescription: "Bridge the gap between school and home. The Hub allows parents to monitor their child's academic journey, pay fees, and communicate directly with faculty, fostering a collaborative environment for student success.",
    allowedRoles: ["Headmaster", "Vice Principal", "Guardian"],
  },
  {
    icon: Users,
    title: "Student Management Portal",
    urduTitle: "طلباء کا انتظام",
    category: "Core",
    description: "Manage the entire student journey from admission to withdrawal.",
    detailedDescription: "A robust portal tailored for education. Track admissions, maintain comprehensive digital portfolios, and manage student lifecycle. Every interaction is logged, providing a 360-degree view of the student's history.",
    allowedRoles: ["Headmaster", "Vice Principal", "Teacher"],
  },
  {
    icon: Lightbulb,
    title: "Predictive Intelligence Dashboard",
    urduTitle: "پیش گوئی کرنے والا ڈیش بورڈ",
    category: "Analytics",
    description: "AI-powered forecasting for institutional growth and student success.",
    detailedDescription: "Leverage the power of machine learning to forecast enrollment trends, financial health, and academic outcomes. The dashboard provides strategic insights that help school leaders make proactive, data-driven decisions.",
    allowedRoles: ["Headmaster", "Vice Principal"],
  },
  {
    icon: User,
    title: "Faculty Resource Planner",
    urduTitle: "فیکلٹی ریسورس پلانر",
    category: "HR",
    description: "Optimize staff allocation and professional development tracking.",
    detailedDescription: "Streamline HR operations with automated scheduling, leave management, and performance appraisal workflows. The planner ensures that your faculty is utilized effectively while tracking their professional growth milestones.",
    allowedRoles: ["Headmaster", "Vice Principal", "Clerk"],
  },
  {
    icon: Building2,
    title: "Global Campus Orchestrator",
    urduTitle: "گلوبل کیمپس آرکیسٹریٹر",
    category: "Enterprise",
    description: "Unified control for multi-campus school networks and franchises.",
    detailedDescription: "Designed for scale. The Orchestrator provides a bird's-eye view of all branches, allowing for standardized curriculum delivery, centralized financial control, and cross-campus performance benchmarking.",
    allowedRoles: ["Headmaster"],
  },
  {
    icon: Package,
    title: "Asset & Inventory Control",
    urduTitle: "اثاثہ جات اور انوینٹری کنٹرول",
    category: "Management",
    description: "Real-time tracking of school property, from furniture to lab equipment.",
    detailedDescription: "Maintain a digital ledger of all school assets. Track depreciation, manage procurement requests, and ensure that every piece of equipment is accounted for across all departments and branches.",
    allowedRoles: ["Headmaster", "Vice Principal", "Clerk"],
  },
  {
    icon: Truck,
    title: "Transport & Fleet Logistics",
    urduTitle: "ٹرانسپورٹ اور بیڑے کی لاجسٹکس",
    category: "Management",
    description: "GPS-enabled fleet management with automated route optimization.",
    detailedDescription: "Ensure student safety with real-time bus tracking. Parents get proximity alerts, while administrators can optimize routes to reduce fuel costs and monitor driver behavior for enhanced safety.",
    allowedRoles: ["Headmaster", "Vice Principal", "Clerk"],
  },
  {
    icon: BookOpen,
    title: "Library Digital Archive",
    urduTitle: "لائبریری ڈیجیٹل آرکائیو",
    category: "Management",
    description: "Modernized cataloging with digital lending and resource tracking.",
    detailedDescription: "Transform your library into a digital hub. Manage physical book circulation with barcode scanning and provide students with access to a curated digital library of e-books and research papers.",
    allowedRoles: ["Headmaster", "Vice Principal", "Teacher", "Student"],
  },
  {
    icon: ClipboardCheck,
    title: "Examination & Assessment Center",
    urduTitle: "امتحان اور تشخیصی مرکز",
    category: "Academic",
    description: "Secure exam scheduling, paper generation, and automated grading.",
    detailedDescription: "Simplify the examination lifecycle. From generating randomized question papers to managing secure online assessments and automated OMR grading, the center ensures integrity and efficiency in evaluations.",
    allowedRoles: ["Headmaster", "Vice Principal", "Teacher"],
  },
];

const NavItem = ({ label }: { label: string; key?: string }) => {
  return (
    <motion.a
      href="#"
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="relative text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors px-4 py-2 rounded-xl hover:bg-indigo-50/50 group"
    >
      {label}
      <motion.div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-indigo-600 rounded-full opacity-0 group-hover:w-1/2 group-hover:opacity-100 transition-all"
      />
    </motion.a>
  );
};

export default function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState<"login" | "signup">("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("Headmaster");
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [pendingModule, setPendingModule] = useState<string | null>(null);

  const allowedFeatures = features.filter(f => f.allowedRoles.includes(userRole));

  const openAuth = (type: "login" | "signup", moduleTitle?: string) => {
    setAuthType(type);
    setIsAuthModalOpen(true);
    if (moduleTitle) setPendingModule(moduleTitle);
  };

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
    
    // Set first allowed module as active
    const firstAllowed = features.find(f => f.allowedRoles.includes(role));
    setActiveModule(pendingModule || (firstAllowed ? firstAllowed.title : null));
    setPendingModule(null);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveModule(null);
  };

  const renderModule = () => {
    switch (activeModule) {
      case "Classes Smart Management":
        return <ClassesSmartManagement userRole={userRole} />;
      case "Financial Operations Suite":
        return <FinancialSuite userRole={userRole} />;
      case "Academic Performance Analytics":
        return <AcademicAnalytics userRole={userRole} />;
      case "Guardian Engagement Hub":
        return <GuardianEngagementHub userRole={userRole} />;
      case "Student Management Portal":
        return <StudentManagementPortal userRole={userRole} />;
      default:
        return <ModulePlaceholder title={activeModule || "Module"} />;
    }
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex">
        {/* Sidebar */}
        <motion.aside 
          initial={false}
          animate={{ width: isSidebarOpen ? 320 : 80 }}
          className="bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen z-40"
        >
          <div className="p-6 flex items-center justify-between">
            <div className={`flex items-center gap-3 ${!isSidebarOpen && "hidden"}`}>
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <Zap className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-black tracking-tighter text-slate-900">PakEducate</span>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {allowedFeatures.map((feature) => (
              <button
                key={feature.title}
                onClick={() => setActiveModule(feature.title)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${
                  activeModule === feature.title 
                    ? "bg-indigo-50 text-indigo-600" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <feature.icon className={`w-5 h-5 ${activeModule === feature.title ? "text-indigo-600" : "text-slate-400"}`} />
                {isSidebarOpen && <span className="text-sm truncate">{feature.title}</span>}
              </button>
            ))}
          </div>

          <div className="p-4 border-t border-slate-100">
            <button 
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold text-rose-500 hover:bg-rose-50 transition-all`}
            >
              <LogOut className="w-5 h-5" />
              {isSidebarOpen && <span className="text-sm">Logout</span>}
            </button>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-screen">
          <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-black text-slate-900">{activeModule}</h1>
              <Badge variant="outline" className="rounded-full bg-indigo-50 text-indigo-600 border-indigo-100">{userRole} Portal</Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Universal Search..." 
                  className="h-10 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 text-sm font-medium"
                />
              </div>
              <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
                <img src="https://picsum.photos/seed/admin/100/100" alt="Admin" referrerPolicy="no-referrer" />
              </div>
            </div>
          </header>

          <div className="p-8 flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeModule}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderModule()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 rotate-3 hover:rotate-0 transition-transform cursor-pointer">
              <Zap className="text-white w-7 h-7" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter text-slate-900 leading-none">PakEducate <span className="text-indigo-600">Pro</span></span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Enterprise OS</span>
            </div>
          </motion.div>
          
          <div className="hidden lg:flex items-center gap-2">
            {["Features", "Solutions", "Pricing", "About"].map((item) => (
              <NavItem key={`nav-${item}`} label={item} />
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => openAuth("login")}
              className="hidden sm:flex rounded-2xl px-6 font-bold text-slate-600 hover:bg-slate-100"
            >
              Login
            </Button>
            <Button 
              onClick={() => openAuth("signup")}
              className="rounded-2xl px-8 h-12 font-bold bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all hover:-translate-y-1 active:translate-y-0"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-48 pb-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/30 blur-[150px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-200/30 blur-[150px] rounded-full animate-pulse" />
        </div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-2xl font-bold text-xs uppercase tracking-widest mb-8 border border-indigo-100 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
              v4.0 Enterprise Release
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-10">
              Orchestrate <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-500">Excellence.</span>
            </h1>
            <p className="text-xl text-slate-500 mb-12 leading-relaxed max-w-xl font-medium">
              The world's most advanced school management ecosystem. AI-native, bilingual, and engineered for institutional scale.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Button 
                size="lg" 
                onClick={() => openAuth("signup")}
                className="rounded-3xl px-10 h-16 text-xl font-black bg-indigo-600 hover:bg-indigo-700 shadow-2xl shadow-indigo-200 transition-all hover:-translate-y-1"
              >
                Deploy Now <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-3xl px-10 h-16 text-xl font-black border-slate-200 bg-white hover:bg-slate-50 transition-all">
                View Architecture
              </Button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-200/60 overflow-hidden p-4">
              <div className="bg-slate-900 rounded-[2.5rem] aspect-[4/3] relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent" />
                <div className="p-10 h-full flex flex-col justify-between relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="h-2 w-24 bg-indigo-500/50 rounded-full" />
                      <div className="h-8 w-48 bg-white rounded-xl" />
                    </div>
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center">
                      <LayoutDashboard className="text-white w-6 h-6" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/10">
                      <p className="text-indigo-400 text-xs font-black uppercase tracking-widest mb-2">Efficiency</p>
                      <p className="text-4xl font-black text-white">+94%</p>
                    </div>
                    <div className="bg-indigo-600 rounded-3xl p-6 shadow-xl shadow-indigo-900/40">
                      <p className="text-indigo-200 text-xs font-black uppercase tracking-widest mb-2">Growth</p>
                      <p className="text-4xl font-black text-white">2.4x</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating 3D elements */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 bg-white p-6 rounded-[2rem] shadow-2xl border border-slate-100 flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
                <ShieldCheck className="text-white w-7 h-7" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-black uppercase tracking-widest">Security Status</p>
                <p className="text-lg font-black text-slate-900">Hardened</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { label: "Active Schools", value: "500+" },
            { label: "Students Managed", value: "200k+" },
            { label: "Daily Transactions", value: "50k+" },
            { label: "Uptime Guarantee", value: "99.9%" },
          ].map((stat, index) => (
            <div key={`stat-${index}`} className="text-center">
              <p className="text-4xl font-bold text-slate-900 mb-2">{stat.value}</p>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-40 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="max-w-2xl">
              <Badge className="mb-4 bg-indigo-600 text-white px-4 py-1 rounded-full">Intelligence Suite</Badge>
              <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
                Next-Gen Management <br />
                <span className="text-indigo-600">Capabilities.</span>
              </h2>
            </div>
            <p className="text-lg text-slate-500 max-w-md font-medium">
              Explore our modular ecosystem designed to handle every complexity of modern educational institutions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {allowedFeatures.map((feature, index) => (
              <FeatureCard 
                key={`feature-${index}`}
                {...feature}
                delay={index * 0.05}
                onRequestAccess={(title) => {
                  if (!isLoggedIn) {
                    openAuth("signup", title);
                  } else {
                    setActiveModule(title);
                  }
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto bg-indigo-600 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 blur-[80px] rounded-full -ml-32 -mb-32" />
          
          <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">Ready to Modernize Your School?</h2>
          <p className="text-xl text-indigo-100 mb-12 max-w-2xl mx-auto">
            Join hundreds of forward-thinking institutions that have already transformed their administrative experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => openAuth("signup")}
              className="rounded-full px-10 h-16 text-lg bg-white text-indigo-600 hover:bg-slate-50"
            >
              Get Started Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => openAuth("login")}
              className="rounded-full px-10 h-16 text-lg border-white/30 text-white hover:bg-white/10"
            >
              Talk to Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-32 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <Zap className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tighter">PakEducate</span>
            </div>
            <p className="text-slate-400 font-medium leading-relaxed mb-8">
              The definitive operating system for modern educational institutions. Engineered for excellence.
            </p>
            <div className="flex gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={`social-${i}`} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer">
                  <div className="w-4 h-4 bg-white/20 rounded-full" />
                </div>
              ))}
            </div>
          </div>
          
          {[
            { title: "Ecosystem", links: ["Intelligence", "Operations", "Finance", "Academic"] },
            { title: "Resources", links: ["Documentation", "API Reference", "Architecture", "Community"] },
            { title: "Company", links: ["Our Vision", "Careers", "Press Kit", "Contact"] },
          ].map((group, index) => (
            <div key={`footer-group-${index}`}>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-500 mb-8">{group.title}</h4>
              <ul className="space-y-6">
                {group.links.map((link) => (
                  <li key={`footer-link-${link}`}><a href="#" className="text-slate-400 hover:text-white transition-colors font-bold">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto px-6 mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-slate-500 text-sm font-bold">
            © {new Date().getFullYear()} PakEducate Pro Enterprise. All rights reserved.
          </p>
          <div className="flex items-center gap-8 text-slate-500 text-sm font-bold">
            <a href="#" className="hover:text-white transition-colors">Privacy Protocol</a>
            <a href="#" className="hover:text-white transition-colors">Service Terms</a>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>AES-256 Encrypted</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
        <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl">
          <AuthForm 
            type={authType} 
            onLogin={handleLogin} 
            onSwitch={() => setAuthType(authType === "login" ? "signup" : "login")} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

const AuthForm = ({ type, onLogin, onSwitch }: { type: "login" | "signup", onLogin: (role: UserRole) => void, onSwitch: () => void }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>("Headmaster");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const roles: UserRole[] = ["Headmaster", "Vice Principal", "Teacher", "Clerk", "Guardian", "Student"];

  const getPlaceholder = () => {
    if (selectedRole === "Student") return "Class ID (e.g. 10-A-001)";
    if (["Headmaster", "Vice Principal", "Teacher", "Clerk"].includes(selectedRole)) return "CNIC (e.g. 35202-xxxxxxx-x)";
    return "Email or Phone Number";
  };

  const getPasswordPlaceholder = () => {
    if (selectedRole === "Student") return "Class ID as Password";
    if (["Headmaster", "Vice Principal", "Teacher", "Clerk"].includes(selectedRole)) return "CNIC as Password";
    return "Password";
  };

  return (
    <div className="flex flex-col">
      <div className="bg-indigo-600 p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16" />
        <Zap className="w-12 h-12 mb-6" />
        <h2 className="text-3xl font-black tracking-tighter mb-2">
          {type === "login" ? "Welcome Back" : "Start Your Journey"}
        </h2>
        <p className="text-indigo-100 font-medium opacity-80">
          {type === "login" ? "Access your school's command center." : "Join the future of education management."}
        </p>
      </div>
      <div className="p-10 bg-white space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Login As</label>
            <div className="relative">
              <select 
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold appearance-none cursor-pointer"
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Identification</label>
            <input 
              type="text" 
              placeholder={getPlaceholder()} 
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Password</label>
            <input 
              type="password" 
              placeholder={getPasswordPlaceholder()} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold" 
            />
          </div>
        </div>
        <Button 
          onClick={() => onLogin(selectedRole)}
          className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-black text-lg shadow-xl shadow-indigo-100 flex items-center justify-center gap-3"
        >
          <UserCheck className="w-5 h-5" />
          {type === "login" ? "Authorize Access" : "Create Account"}
        </Button>
        <div className="text-center">
          <button 
            type="button"
            onClick={onSwitch}
            className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors"
          >
            {type === "login" ? "Don't have an account? Sign up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};


