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
import { useState, useEffect, ReactNode } from "react";
import React from "react";
import { Student, FeeRecord } from "./types";
import { 
  ClassesSmartManagement, 
  FinanceManagement, 
  AcademicAnalytics, 
  GuardianEngagementHub, 
  StudentManagementPortal, 
  TeacherManagementPortal, 
  ExaminationAssessmentCenter,
  ModulePlaceholder 
} from "./components/Modules";

type UserRole = "Headmaster" | "Vice Principal" | "Teacher" | "Clerk" | "Accountant" | "Guardian" | "Student";

interface UserData {
  role: UserRole;
  email?: string;
}

const features = [
  {
    icon: CheckCircle2,
    title: "Classes Smart Management",
    urduTitle: "ذہین حاضری کا نظام",
    category: "Operations",
    description: "AI-driven attendance tracking with real-time guardian synchronization.",
    detailedDescription: "The Classes Smart Management utilizes advanced pattern recognition to track student and staff attendance. It automatically triggers multi-channel alerts (WhatsApp, SMS, App Push) and generates predictive absenteeism reports to help educators intervene early.",
    allowedRoles: ["Headmaster", "Vice Principal", "Teacher"],
    isAcademic: true,
  },
  {
    icon: Users,
    title: "Student Management Portal",
    urduTitle: "طلباء کا انتظام",
    category: "Core",
    description: "Manage the entire student journey from admission to withdrawal.",
    detailedDescription: "A robust portal tailored for education. Track admissions, maintain comprehensive digital portfolios, and manage student lifecycle. Every interaction is logged, providing a 360-degree view of the student's history.",
    allowedRoles: ["Headmaster", "Vice Principal", "Teacher"],
    isAcademic: true,
  },
  {
    icon: UserCheck,
    title: "Teacher Management Portal",
    urduTitle: "اساتذہ کا انتظام",
    category: "HR",
    description: "Comprehensive faculty lifecycle management for school leadership.",
    detailedDescription: "Empower school leaders with a centralized dashboard to manage the teaching staff. From onboarding new faculty and tracking qualifications to dynamic class allocation and performance monitoring, this portal ensures your human resources are optimized for academic excellence.",
    allowedRoles: ["Headmaster", "Vice Principal"],
    isAcademic: true,
  },
  {
    icon: ClipboardCheck,
    title: "Examination & Assessment Center",
    urduTitle: "امتحان اور تشخیصی مرکز",
    category: "Academic",
    description: "Secure exam scheduling, paper generation, and automated grading.",
    detailedDescription: "Simplify the examination lifecycle. From generating randomized question papers to managing secure online assessments and automated OMR grading, the center ensures integrity and efficiency in evaluations.",
    allowedRoles: ["Headmaster", "Vice Principal", "Teacher"],
    isAcademic: true,
  },
  {
    icon: LayoutDashboard,
    title: "Finance Overview",
    urduTitle: "مالیاتی جائزہ",
    category: "Finance",
    description: "Real-time financial health dashboard with revenue and expense tracking.",
    detailedDescription: "Get a high-level view of your institution's financial status. Monitor total revenue, outstanding fees, and operating costs through interactive charts and real-time metrics.",
    allowedRoles: ["Headmaster", "Vice Principal", "Clerk", "Accountant"],
    isFinance: true,
  },
  {
    icon: CircleDollarSign,
    title: "Fee Management",
    urduTitle: "فیس کا انتظام",
    category: "Finance",
    description: "Complete fee lifecycle management from structure setup to collection.",
    detailedDescription: "Manage every aspect of student fees. Define grade-wise fee structures, record collections with multiple payment methods, and track defaulters with automated reminder systems.",
    allowedRoles: ["Headmaster", "Teacher", "Accountant"],
    isFinance: true,
  },
  {
    icon: UserCheck,
    title: "Salary Management",
    urduTitle: "تنخواہ کا انتظام",
    category: "Finance",
    description: "Automated payroll processing and salary history tracking.",
    detailedDescription: "Streamline staff payments with a robust salary management system. Define pay scales, manage global deductions, and track monthly and yearly salary expenditures with ease.",
    allowedRoles: ["Headmaster", "Vice Principal", "Clerk", "Accountant"],
    isFinance: true,
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

const HeaderTooltip = ({ text, children }: { text: string; children: ReactNode }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-black rounded-lg whitespace-nowrap z-[60] shadow-xl pointer-events-none"
          >
            {text}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState<"login" | "signup">("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("Headmaster");
  const [userEmail, setUserEmail] = useState<string>("");
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAcademicsExpanded, setIsAcademicsExpanded] = useState(true);
  const [isFinanceExpanded, setIsFinanceExpanded] = useState(true);
  const [pendingModule, setPendingModule] = useState<string | null>(null);

  // Header States
  const [globalSearch, setGlobalSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  // User Settings Modal States
  const [isUserSettingsOpen, setIsUserSettingsOpen] = useState(false);
  const [userSettingsTab, setUserSettingsTab] = useState<"profile" | "security">("profile");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<UserRole>("Headmaster");
  
  // App Settings States
  const [appLanguage, setAppLanguage] = useState("English");
  const [appPerformance, setAppPerformance] = useState("High");
  const [appSecurity, setAppSecurity] = useState("AES-256");
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null);

  // Global Data States
  const [students, setStudents] = useState<Student[]>([
    { id: 1, rollNo: "10A-001", name: "Ahmad Hassan", fatherName: "Hassan Ali", grade: "Grade 10-A", dob: "2010-05-15", gender: "Male", contact: "0300-1234567", address: "House 123, Street 4, Lahore", status: "Active", admissionDate: "2022-04-01", examResults: { math: 85, science: 92, english: 78 }, attendanceStatus: "present", attendanceTime: "08:15 AM" },
    { id: 2, rollNo: "10A-002", name: "Sara Khan", fatherName: "Imran Khan", grade: "Grade 10-A", dob: "2010-08-22", gender: "Female", contact: "0321-7654321", address: "Flat 45, Model Town, Lahore", status: "Active", admissionDate: "2022-04-01", examResults: { math: 72, science: 68, english: 85 }, attendanceStatus: "absent", attendanceTime: "-" },
    { id: 3, rollNo: "10A-003", name: "Zainab Ali", fatherName: "Ali Raza", grade: "Grade 10-A", dob: "2011-01-10", gender: "Female", contact: "0333-9876543", address: "Sector C, DHA, Lahore", status: "Active", admissionDate: "2022-04-01", examResults: { math: 95, science: 88, english: 92 }, attendanceStatus: "present", attendanceTime: "08:20 AM" },
    { id: 4, rollNo: "10A-004", name: "Bilal Ahmed", fatherName: "Ahmed Shah", grade: "Grade 10-A", dob: "2010-11-30", gender: "Male", contact: "0345-1122334", address: "Johar Town, Lahore", status: "Active", admissionDate: "2022-04-01", examResults: { math: 65, science: 70, english: 60 }, attendanceStatus: "late", attendanceTime: "08:45 AM" },
    { id: 5, rollNo: "10A-005", name: "Fatima Noor", fatherName: "Noor Muhammad", grade: "Grade 10-A", dob: "2011-03-05", gender: "Female", contact: "0300-5566778", address: "Gulberg III, Lahore", status: "Active", admissionDate: "2022-04-01", examResults: { math: 88, science: 85, english: 80 }, attendanceStatus: "present", attendanceTime: "08:10 AM" },
    { id: 6, rollNo: "10B-001", name: "John Doe", fatherName: "Richard Doe", grade: "Grade 10-B", dob: "2010-02-14", gender: "Male", contact: "0312-9988776", address: "Wapda Town, Lahore", status: "Active", admissionDate: "2022-04-01", examResults: { math: 80, science: 75, english: 70 }, attendanceStatus: "present", attendanceTime: "08:05 AM" },
  ]);

  const [fees, setFees] = useState<FeeRecord[]>([
    { id: 1, student: "Ahmad Hassan", rollNo: "10A-001", grade: "Grade 10-A", amount: 15000, date: "2023-10-12", status: "Paid", method: "Bank Transfer" },
    { id: 2, student: "Sara Khan", rollNo: "10A-002", grade: "Grade 10-A", amount: 15000, date: "2023-10-11", status: "Paid", method: "Cash" },
    { id: 3, student: "Zainab Ali", rollNo: "10A-003", grade: "Grade 10-A", amount: 15000, date: "-", status: "Unpaid", method: "-" },
  ]);

  const [notifications] = useState([
    { id: 1, title: "New Admission", message: "Zaid Khan registered for Grade 10-A", time: "2m ago", read: false },
    { id: 2, title: "Security Alert", message: "OTP requested for promotion", time: "15m ago", read: true },
    { id: 3, title: "Fee Payment", message: "Sara Khan's fee processed", time: "1h ago", read: true },
  ]);

  const allowedFeatures = features.filter(f => f.allowedRoles.includes(userRole));
  const academicFeatures = allowedFeatures.filter(f => (f as any).isAcademic);
  const financeFeatures = allowedFeatures.filter(f => (f as any).isFinance);
  const otherFeatures = allowedFeatures.filter(f => !(f as any).isAcademic && !(f as any).isFinance);

  const openAuth = (type: "login" | "signup", moduleTitle?: string) => {
    setAuthType(type);
    setIsAuthModalOpen(true);
    if (moduleTitle) setPendingModule(moduleTitle);
  };

  const handleLogin = (role: UserRole, email?: string) => {
    setUserRole(role);
    if (email) setUserEmail(email);
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
        return <ClassesSmartManagement userRole={userRole} students={students} setStudents={setStudents} />;
      case "Finance Overview":
        return <FinanceManagement userRole={userRole} initialTab="overview" students={students} fees={fees} setFees={setFees} />;
      case "Fee Management":
        return <FinanceManagement userRole={userRole} initialTab="fees" students={students} fees={fees} setFees={setFees} />;
      case "Salary Management":
        return <FinanceManagement userRole={userRole} initialTab="salaries" students={students} fees={fees} setFees={setFees} />;
      case "Academic Performance Analytics":
        return <AcademicAnalytics userRole={userRole} students={students} />;
      case "Guardian Engagement Hub":
        return <GuardianEngagementHub userRole={userRole} />;
      case "Student Management Portal":
        return <StudentManagementPortal userRole={userRole} userEmail={userEmail} students={students} setStudents={setStudents} />;
      case "Teacher Management Portal":
        return <TeacherManagementPortal userRole={userRole} />;
      case "Examination & Assessment Center":
        return <ExaminationAssessmentCenter userRole={userRole} students={students} setStudents={setStudents} />;
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
              <span className="text-xl font-black tracking-tighter text-slate-900">Smart Education</span>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {/* Academics Group */}
            {academicFeatures.length > 0 && (
              <div className="space-y-1">
                <button
                  onClick={() => setIsAcademicsExpanded(!isAcademicsExpanded)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl font-black transition-all ${
                    academicFeatures.some(f => f.title === activeModule)
                      ? "bg-indigo-50/50 text-indigo-600"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className={`w-5 h-5 ${academicFeatures.some(f => f.title === activeModule) ? "text-indigo-600" : "text-slate-400"}`} />
                    {isSidebarOpen && <span className="text-sm uppercase tracking-wider">Academics</span>}
                  </div>
                  {isSidebarOpen && (
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isAcademicsExpanded ? "rotate-180" : ""}`} />
                  )}
                </button>
                
                <AnimatePresence initial={false}>
                  {isAcademicsExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pl-4 space-y-1"
                    >
                      {academicFeatures.map((feature) => (
                        <button
                          key={feature.title}
                          onClick={() => setActiveModule(feature.title)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${
                            activeModule === feature.title 
                              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          <feature.icon className={`w-4 h-4 ${activeModule === feature.title ? "text-white" : "text-slate-400"}`} />
                          {isSidebarOpen && <span className="text-xs truncate">{feature.title}</span>}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Finance Group */}
            {financeFeatures.length > 0 && (
              <div className="space-y-1">
                <button
                  onClick={() => setIsFinanceExpanded(!isFinanceExpanded)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl font-black transition-all ${
                    financeFeatures.some(f => f.title === activeModule)
                      ? "bg-indigo-50/50 text-indigo-600"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CircleDollarSign className={`w-5 h-5 ${financeFeatures.some(f => f.title === activeModule) ? "text-indigo-600" : "text-slate-400"}`} />
                    {isSidebarOpen && <span className="text-sm uppercase tracking-wider">Finance Management</span>}
                  </div>
                  {isSidebarOpen && (
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isFinanceExpanded ? "rotate-180" : ""}`} />
                  )}
                </button>
                
                <AnimatePresence initial={false}>
                  {isFinanceExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pl-4 space-y-1"
                    >
                      {financeFeatures.map((feature) => (
                        <button
                          key={feature.title}
                          onClick={() => setActiveModule(feature.title)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${
                            activeModule === feature.title 
                              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          <feature.icon className={`w-4 h-4 ${activeModule === feature.title ? "text-white" : "text-slate-400"}`} />
                          {isSidebarOpen && <span className="text-xs truncate">{feature.title}</span>}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Other Features */}
            {otherFeatures.map((feature) => (
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
              {/* Universal Search */}
              <div className="relative hidden md:block">
                <HeaderTooltip text="Universal Search">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={globalSearch}
                      onChange={(e) => setGlobalSearch(e.target.value)}
                      placeholder="Universal Search..." 
                      className="h-10 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 text-sm font-medium"
                    />
                  </div>
                </HeaderTooltip>
                {globalSearch && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                    {allowedFeatures.filter(f => f.title.toLowerCase().includes(globalSearch.toLowerCase())).length > 0 ? (
                      allowedFeatures
                        .filter(f => f.title.toLowerCase().includes(globalSearch.toLowerCase()))
                        .map(f => (
                          <button 
                            key={f.title}
                            onClick={() => {
                              setActiveModule(f.title);
                              setGlobalSearch("");
                            }}
                            className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-all"
                          >
                            <f.icon className="w-4 h-4 text-indigo-600" />
                            <span className="text-sm font-bold text-slate-700">{f.title}</span>
                          </button>
                        ))
                    ) : (
                      <p className="p-4 text-xs font-bold text-slate-400 text-center">No modules found</p>
                    )}
                  </div>
                )}
              </div>

              {/* Notifications */}
              <div className="relative">
                <HeaderTooltip text="Notifications">
                  <button 
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowSettings(false);
                      setShowProfile(false);
                    }}
                    className={`p-2 hover:bg-slate-100 rounded-lg transition-all relative ${showNotifications ? "bg-slate-100 text-indigo-600" : "text-slate-400"}`}
                  >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                  </button>
                </HeaderTooltip>
                {showNotifications && (
                  <div className="absolute top-full right-0 w-80 mt-2 bg-white rounded-[2rem] border border-slate-200 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                      <h4 className="font-black text-slate-900">Notifications</h4>
                      <Badge className="bg-indigo-50 text-indigo-600 border-indigo-100">3 New</Badge>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map(n => (
                        <div key={n.id} className="p-4 hover:bg-slate-50 border-b border-slate-50 transition-all cursor-pointer group">
                          <div className="flex justify-between items-start mb-1">
                            <p className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{n.title}</p>
                            <span className="text-[10px] font-bold text-slate-400">{n.time}</span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed">{n.message}</p>
                        </div>
                      ))}
                    </div>
                    <button className="w-full p-4 text-xs font-black text-indigo-600 hover:bg-indigo-50 transition-all">View All Activity</button>
                  </div>
                )}
              </div>

              {/* Settings */}
              <div className="relative">
                <HeaderTooltip text="Quick Settings">
                  <button 
                    onClick={() => {
                      setShowSettings(!showSettings);
                      setShowNotifications(false);
                      setShowProfile(false);
                    }}
                    className={`p-2 hover:bg-slate-100 rounded-lg transition-all ${showSettings ? "bg-slate-100 text-indigo-600" : "text-slate-400"}`}
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                </HeaderTooltip>
                {showSettings && (
                  <div className="absolute top-full right-0 w-64 mt-2 bg-white rounded-[2rem] border border-slate-200 shadow-2xl z-50 p-2 animate-in fade-in slide-in-from-top-2">
                    <div className="p-4 border-b border-slate-100 mb-2">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Quick Settings</p>
                    </div>
                    {[
                      { 
                        icon: Globe, 
                        label: "Language", 
                        value: appLanguage,
                        options: ["English", "Urdu", "Arabic"],
                        setter: setAppLanguage 
                      },
                      { 
                        icon: Zap, 
                        label: "Performance", 
                        value: appPerformance,
                        options: ["High", "Balanced", "Eco"],
                        setter: setAppPerformance 
                      },
                      { 
                        icon: ShieldCheck, 
                        label: "Security", 
                        value: appSecurity,
                        options: ["AES-256", "RSA-4096", "Quantum"],
                        setter: setAppSecurity 
                      },
                    ].map(item => (
                      <div key={item.label} className="space-y-1">
                        <div className="flex items-center justify-between p-3 rounded-xl">
                          <div className="flex items-center gap-3">
                            <item.icon className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-bold text-slate-700">{item.label}</span>
                          </div>
                        </div>
                        <div className="flex gap-1 px-2 pb-2">
                          {item.options.map(opt => (
                            <button
                              key={opt}
                              onClick={() => {
                                item.setter(opt);
                                setToast({ message: `${item.label} updated to ${opt}`, type: "success" });
                                setTimeout(() => setToast(null), 3000);
                              }}
                              className={`flex-1 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                                item.value === opt 
                                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" 
                                  : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Profile */}
              <div className="relative">
                <HeaderTooltip text="User Profile">
                  <button 
                    onClick={() => {
                      setShowProfile(!showProfile);
                      setShowNotifications(false);
                      setShowSettings(false);
                    }}
                    className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden hover:ring-2 hover:ring-indigo-500 transition-all"
                  >
                    <img src={`https://picsum.photos/seed/${userRole}/100/100`} alt="User" referrerPolicy="no-referrer" />
                  </button>
                </HeaderTooltip>
                {showProfile && (
                  <div className="absolute top-full right-0 w-72 mt-2 bg-white rounded-[2rem] border border-slate-200 shadow-2xl z-50 p-6 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                        <User className="text-white w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 truncate max-w-[160px]">{userEmail || "Administrator"}</p>
                        <p className="text-xs font-bold text-indigo-600">{userRole}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <button 
                        onClick={() => {
                          setEditEmail(userEmail);
                          setEditRole(userRole);
                          setUserSettingsTab("profile");
                          setIsUserSettingsOpen(true);
                          setShowProfile(false);
                        }}
                        className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-all text-slate-600 font-bold text-sm"
                      >
                        <UserRound className="w-4 h-4" /> My Profile
                      </button>
                      <button 
                        onClick={() => {
                          setEditEmail(userEmail);
                          setEditRole(userRole);
                          setUserSettingsTab("security");
                          setIsUserSettingsOpen(true);
                          setShowProfile(false);
                        }}
                        className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-all text-slate-600 font-bold text-sm"
                      >
                        <ShieldCheck className="w-4 h-4" /> Security
                      </button>
                      <Separator className="my-2" />
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-3 hover:bg-rose-50 rounded-xl transition-all text-rose-500 font-bold text-sm"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="p-8 flex-1">
            {/* Global Toast Notification */}
            <AnimatePresence>
              {toast && (
                <motion.div
                  initial={{ opacity: 0, y: -20, x: "-50%" }}
                  animate={{ opacity: 1, y: 0, x: "-50%" }}
                  exit={{ opacity: 0, y: -20, x: "-50%" }}
                  className="fixed top-24 left-1/2 z-50"
                >
                  <div className={`px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-black text-sm ${
                    toast.type === "success" ? "bg-emerald-600 text-white shadow-emerald-100" : "bg-indigo-600 text-white shadow-indigo-100"
                  }`}>
                    <CheckCircle2 className="w-5 h-5" />
                    {toast.message}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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

          {/* User Settings Modal */}
          <Dialog open={isUserSettingsOpen} onOpenChange={setIsUserSettingsOpen}>
            <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl">
              <div className="flex h-[500px]">
                {/* Modal Sidebar */}
                <div className="w-48 bg-slate-50 border-r border-slate-100 p-6 flex flex-col gap-2">
                  <div className="mb-8">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Account</p>
                    <button 
                      onClick={() => setUserSettingsTab("profile")}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold text-sm transition-all ${
                        userSettingsTab === "profile" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      <User className="w-4 h-4" /> Profile
                    </button>
                    <button 
                      onClick={() => setUserSettingsTab("security")}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold text-sm transition-all ${
                        userSettingsTab === "security" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      <Lock className="w-4 h-4" /> Security
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="flex-1 bg-white p-10 overflow-y-auto">
                  {userSettingsTab === "profile" ? (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-3xl font-black text-slate-900 mb-2">My Profile</h2>
                        <p className="text-slate-500 font-medium">Manage your public identity and personal information.</p>
                      </div>

                      <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <div className="w-20 h-20 rounded-[1.5rem] bg-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-100">
                          <User className="text-white w-10 h-10" />
                        </div>
                        <div>
                          <p className="text-xl font-black text-slate-900">{userEmail || "Administrator"}</p>
                          <p className="text-sm font-bold text-indigo-600">{userRole}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                            <input 
                              type="text" 
                              defaultValue={userEmail.split('@')[0].replace('.', ' ')}
                              className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Employee ID</label>
                            <input 
                              type="text" 
                              defaultValue="PE-2026-001"
                              readOnly
                              className="w-full h-12 px-4 rounded-xl bg-slate-100 border border-slate-200 font-bold text-slate-400 outline-none cursor-not-allowed"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Department</label>
                          <input 
                            type="text" 
                            defaultValue="Administration"
                            className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-3xl font-black text-slate-900 mb-2">Security & Access</h2>
                        <p className="text-slate-500 font-medium">Update login credentials for the current administrative role.</p>
                      </div>

                      <div className="p-6 bg-rose-50 rounded-3xl border border-rose-100 flex items-start gap-4">
                        <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center shrink-0">
                          <ShieldCheck className="text-rose-600 w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-rose-900 mb-1">Critical Action</p>
                          <p className="text-xs text-rose-700 font-medium leading-relaxed">
                            Changing these details will update the global access for the <strong>{userRole}</strong> role. Use this when handing over duties to a new person.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Administrative Email</label>
                          <input 
                            type="email" 
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                            className="w-full h-14 px-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Assigned Role</label>
                          <select 
                            value={editRole}
                            onChange={(e) => setEditRole(e.target.value as UserRole)}
                            className="w-full h-14 px-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                          >
                            <option value="Headmaster">Headmaster</option>
                            <option value="Vice Principal">Vice Principal</option>
                            <option value="Teacher">Teacher</option>
                            <option value="Clerk">Clerk</option>
                          </select>
                        </div>

                        <div className="pt-4">
                          <Button 
                            onClick={() => {
                              setUserEmail(editEmail);
                              setUserRole(editRole);
                              setIsUserSettingsOpen(false);
                              setToast({ message: "Administrative credentials updated successfully", type: "success" });
                              setTimeout(() => setToast(null), 3000);
                            }}
                            className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-black text-lg shadow-xl shadow-indigo-100"
                          >
                            Update Credentials
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
              <span className="text-2xl font-black tracking-tighter text-slate-900 leading-none">Smart Education <span className="text-indigo-600">Pro</span></span>
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

const AuthForm = ({ type, onLogin, onSwitch }: { type: "login" | "signup", onLogin: (role: UserRole, email?: string) => void, onSwitch: () => void }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>("Headmaster");
  const [identifier, setIdentifier] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const roles: UserRole[] = ["Headmaster", "Vice Principal", "Teacher", "Clerk", "Accountant", "Guardian", "Student"];

  const getPlaceholder = () => {
    if (selectedRole === "Student") return "Class ID (e.g. 10-A-001)";
    if (["Headmaster", "Vice Principal", "Teacher", "Clerk", "Accountant"].includes(selectedRole)) return "CNIC (e.g. 35202-xxxxxxx-x)";
    return "Phone Number";
  };

  const getPasswordPlaceholder = () => {
    if (selectedRole === "Student") return "Class ID as Password";
    if (["Headmaster", "Vice Principal", "Teacher", "Clerk", "Accountant"].includes(selectedRole)) return "CNIC as Password";
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
          {type === "signup" && (
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Official Email</label>
              <input 
                type="email" 
                placeholder="official@school.edu" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold" 
              />
            </div>
          )}
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
          onClick={() => onLogin(selectedRole, email)}
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


