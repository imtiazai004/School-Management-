import React from "react";
import { motion } from "motion/react";
import { 
  BarChart3, 
  Users, 
  CheckCircle2, 
  CircleDollarSign, 
  BookOpen, 
  ClipboardCheck, 
  LayoutDashboard,
  Bell,
  Calendar,
  Clock,
  ArrowRight,
  Zap,
  TrendingUp,
  ShieldCheck,
  MessageSquare,
  FileText,
  Search,
  UserPlus,
  Settings,
  LogOut,
  ChevronRight,
  Info,
  ListTodo,
  Megaphone,
  UserCircle
} from "lucide-react";
import { ProfilePanel } from "./ProfilePanel";

interface UnifiedDashboardProps {
  userRole: string;
  profile: any;
  onNavigate: (module: string) => void;
}

export const UnifiedDashboard: React.FC<UnifiedDashboardProps> = ({ 
  userRole, 
  profile, 
  onNavigate 
}) => {
  const getWidgets = () => {
    switch (userRole) {
      case "Student":
        return [
          { title: "My Attendance", value: "94%", detail: "Last 30 days", icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600", module: "Classes Smart Management" },
          { title: "Academic Progress", value: "3.8 GPA", detail: "Term 2", icon: BarChart3, color: "bg-blue-50 text-blue-600", module: "Academic Performance Analytics" },
          { title: "Pending Fees", value: "$0.00", detail: "All clear", icon: CircleDollarSign, color: "bg-indigo-50 text-indigo-600", module: "Guardian Engagement Hub" },
          { title: "Upcoming Exams", value: "3", detail: "Starts in 5 days", icon: ClipboardCheck, color: "bg-amber-50 text-amber-600", module: "Examination & Assessment Center" }
        ];
      case "Teacher":
        return [
          { title: "Class Attendance", value: "92%", detail: "Grade 10-A", icon: Users, color: "bg-emerald-50 text-emerald-600", module: "Classes Smart Management" },
          { title: "Grading Pending", value: "12", detail: "Physics Quiz", icon: FileText, color: "bg-blue-50 text-blue-600", module: "Examination & Assessment Center" },
          { title: "My Salary", value: "$85k", detail: "Paid on 1st April", icon: CircleDollarSign, color: "bg-indigo-50 text-indigo-600", module: "Finance Overview" },
          { title: "Lesson Plans", value: "4/5", detail: "This week", icon: BookOpen, color: "bg-purple-50 text-purple-600", module: "Academic Performance Analytics" }
        ];
      case "Guardian":
      case "Parent":
        return [
          { title: "Child Attendance", value: "98%", detail: "Zaid Khan", icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600", module: "Guardian Engagement Hub" },
          { title: "Fee Due", value: "$450", detail: "Due by 15th April", icon: CircleDollarSign, color: "bg-rose-50 text-rose-600", module: "Guardian Engagement Hub" },
          { title: "Latest Result", value: "A+", detail: "Mathematics", icon: BarChart3, color: "bg-blue-50 text-blue-600", module: "Academic Performance Analytics" },
          { title: "School Notices", value: "2 New", detail: "Parent-Teacher Meeting", icon: Bell, color: "bg-indigo-50 text-indigo-600", module: "Guardian Engagement Hub" }
        ];
      default: // Headmaster / Management
        return [
          { title: "Total Revenue", value: "$128k", detail: "+12% this month", icon: TrendingUp, color: "bg-emerald-50 text-emerald-600", module: "Finance Overview" },
          { title: "Staff Attendance", value: "96%", detail: "48/50 Present", icon: Users, color: "bg-blue-50 text-blue-600", module: "Classes Smart Management" },
          { title: "New Admissions", value: "24", detail: "Last 7 days", icon: Zap, color: "bg-indigo-50 text-indigo-600", module: "Student Management Portal" },
          { title: "Campus Safety", value: "Secure", detail: "All systems active", icon: ShieldCheck, color: "bg-purple-50 text-purple-600", module: "Predictive Intelligence Dashboard" }
        ];
    }
  };

  const widgets = getWidgets();

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-8 max-w-[1600px] mx-auto">
      <div className="flex-1 space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Welcome back, {(profile?.name || "User").split(' ')[0]}!</h2>
            <p className="text-slate-500 font-medium">Here's what's happening in your school today.</p>
          </div>
          <div className="hidden sm:flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="pr-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Today</p>
              <p className="text-sm font-bold text-slate-900 leading-none">April 14, 2026</p>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {widgets.map((widget, i) => (
            <motion.button
              key={i}
              whileHover={{ y: -5 }}
              onClick={() => onNavigate(widget.module)}
              className="p-6 bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all text-left group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 group-hover:bg-indigo-50 transition-colors" />
              <div className={`w-12 h-12 ${widget.color} rounded-2xl flex items-center justify-center mb-4 relative z-10`}>
                <widget.icon className="w-6 h-6" />
              </div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">{widget.title}</p>
              <h4 className="text-2xl font-black text-slate-900 mb-1 relative z-10">{widget.value}</h4>
              <p className="text-xs font-bold text-slate-500 relative z-10">{widget.detail}</p>
              <div className="mt-4 flex items-center gap-2 text-indigo-600 font-bold text-xs opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                Open Portal <ArrowRight className="w-3 h-3" />
              </div>
            </motion.button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {userRole === "Student" && (
            <>
              {/* Class Schedule */}
              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                    <Clock className="w-5 h-5 text-indigo-600" /> Class Schedule (Grade {profile?.grade || "N/A"})
                  </h3>
                  <button className="text-xs font-bold text-indigo-600 hover:underline">Full Schedule</button>
                </div>
                <div className="space-y-4">
                  {[
                    { subject: "Mathematics", time: "08:00 AM", teacher: "Dr. Sarah Wilson", room: "Room 101" },
                    { subject: "Physics", time: "09:30 AM", teacher: "Prof. Ahmed", room: "Lab 2" },
                    { subject: "English", time: "11:00 AM", teacher: "Ms. Noor", room: "Room 205" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                          <BookOpen className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">{item.subject}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.time} • {item.room}</p>
                        </div>
                      </div>
                      <p className="text-xs font-bold text-slate-500">{item.teacher}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notice Board */}
              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                    <Megaphone className="w-5 h-5 text-indigo-600" /> Notice Board
                  </h3>
                </div>
                <div className="space-y-4">
                  {[
                    { title: "Sports Day Registration", date: "April 20", type: "Event" },
                    { title: "Mid-term Syllabus Released", date: "April 12", type: "Academic" },
                    { title: "Library Books Due", date: "April 15", type: "Reminder" }
                  ].map((notice, i) => (
                    <div key={i} className="p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all cursor-pointer">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">{notice.type}</span>
                        <span className="text-[10px] font-bold text-slate-400">{notice.date}</span>
                      </div>
                      <p className="text-sm font-bold text-slate-900">{notice.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {(userRole === "Parent" || userRole === "Guardian") && (
            <>
              {/* Children Tracking */}
              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 col-span-full">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                    <Users className="w-5 h-5 text-indigo-600" /> My Children
                  </h3>
                  <button className="text-xs font-bold text-indigo-600 hover:underline">Add Child</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile?.linkedChildren?.map((child: any) => (
                    <div key={child.id} className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 hover:shadow-lg transition-all">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                          <UserCircle className="w-10 h-10 text-indigo-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-slate-900">{child.name}</h4>
                          <p className="text-xs font-bold text-slate-500">Grade {child.class}-{child.section} • Roll: {child.rollNumber}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <button className="p-3 rounded-xl bg-white border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-indigo-600 hover:text-white transition-all">
                          Track Result
                        </button>
                        <button className="p-3 rounded-xl bg-white border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-indigo-600 hover:text-white transition-all">
                          View Fees
                        </button>
                        <button className="p-3 rounded-xl bg-white border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-indigo-600 hover:text-white transition-all">
                          Performance
                        </button>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button className="flex-1 p-3 rounded-xl bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all">
                          Request Meeting
                        </button>
                        <button className="flex-1 p-3 rounded-xl bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all">
                          Complaint
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {["Head of Institute", "Headmaster", "Vice Principal", "Management Staff"].includes(userRole) && (
            <>
              {/* Daily Tasks */}
              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                    <Clock className="w-5 h-5 text-indigo-600" /> Daily Tasks
                  </h3>
                  <button className="text-xs font-bold text-indigo-600 hover:underline">View All</button>
                </div>
                <div className="space-y-4">
                  {[
                    { task: "Review attendance reports", time: "09:00 AM", status: "Completed" },
                    { task: "Staff coordination meeting", time: "11:30 AM", status: "Upcoming" },
                    { task: "Financial audit Q1", time: "02:00 PM", status: "Upcoming" },
                    { task: "Parent-Teacher feedback", time: "04:30 PM", status: "Upcoming" }
                  ].map((task, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:bg-white hover:shadow-md transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${task.status === "Completed" ? "bg-emerald-500" : "bg-amber-500"}`} />
                        <div>
                          <p className="text-sm font-bold text-slate-900">{task.task}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{task.time}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${task.status === "Completed" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                        {task.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notifications / Updates */}
              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                    <Bell className="w-5 h-5 text-indigo-600" /> Recent Updates
                  </h3>
                  <button className="text-xs font-bold text-indigo-600 hover:underline">Mark as Read</button>
                </div>
                <div className="space-y-4">
                  {[
                    { title: "New Policy Update", desc: "Digital learning guidelines for 2026", icon: MessageSquare, color: "bg-blue-50 text-blue-600" },
                    { title: "System Maintenance", desc: "Scheduled for Sunday at 2:00 AM", icon: Zap, color: "bg-purple-50 text-purple-600" },
                    { title: "Fee Collection High", desc: "98% collection achieved for Grade 10", icon: TrendingUp, color: "bg-emerald-50 text-emerald-600" }
                  ].map((update, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer group">
                      <div className={`w-10 h-10 ${update.color} rounded-xl flex items-center justify-center shrink-0`}>
                        <update.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{update.title}</p>
                        <p className="text-xs text-slate-500 font-medium">{update.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Profile Sidebar */}
      <div className="w-full lg:w-[400px] shrink-0">
        <div className="sticky top-28">
          <ProfilePanel profile={profile} role={userRole} />
        </div>
      </div>
    </div>
  );
};
