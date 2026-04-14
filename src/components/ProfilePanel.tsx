import React from "react";
import { motion } from "motion/react";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  BookOpen, 
  Hash, 
  Briefcase,
  GraduationCap,
  Users,
  Building,
  Shield,
  ChevronRight,
  Download,
  Printer
} from "lucide-react";
import { Student, Teacher, Parent, ManagementProfile } from "../types";
import jsPDF from "jspdf";

interface ProfilePanelProps {
  profile: any;
  role: string;
}

export const ProfilePanel: React.FC<ProfilePanelProps> = ({ profile, role }) => {
  if (!profile) return null;

  const handleDownloadID = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [54, 86] // Standard ID card size CR80
    });

    // Background
    doc.setFillColor(79, 70, 229); // Indigo-600
    doc.rect(0, 0, 54, 25, "F");

    // Header Text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("SMART EDU", 27, 10, { align: "center" });
    doc.setFontSize(6);
    doc.text("INSTITUTIONAL ID CARD", 27, 14, { align: "center" });

    // Profile Image Placeholder (since we can't easily load external images into jsPDF without more complex logic)
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.5);
    doc.rect(17, 18, 20, 20, "S");
    doc.setFillColor(241, 245, 249);
    doc.rect(17, 18, 20, 20, "F");
    doc.setTextColor(79, 70, 229);
    doc.setFontSize(12);
    doc.text(profile.name.charAt(0), 27, 30, { align: "center" });

    // User Info
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(profile.name.toUpperCase(), 27, 45, { align: "center" });
    
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(6);
    doc.text(role.toUpperCase(), 27, 49, { align: "center" });

    doc.setDrawColor(226, 232, 240);
    doc.line(10, 52, 44, 52);

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(5);
    doc.setFont("helvetica", "normal");
    
    let y = 57;
    const addInfo = (label: string, value: string) => {
      doc.setTextColor(100, 116, 139);
      doc.text(`${label}:`, 10, y);
      doc.setTextColor(15, 23, 42);
      doc.text(value, 25, y);
      y += 4;
    };

    if (role === "Student") {
      addInfo("ROLL NO", profile.rollNumber || "N/A");
      addInfo("CLASS", `${profile.grade}-${profile.section}`);
      addInfo("FATHER", profile.fatherName || "N/A");
    } else if (role === "Teacher") {
      addInfo("ID", profile.id || "N/A");
      addInfo("SUBJECT", profile.subject || "N/A");
    } else {
      addInfo("ID", profile.id || "N/A");
      addInfo("ROLE", profile.role || role);
    }

    addInfo("PHONE", profile.phone || "N/A");
    addInfo("BLOOD", "B+"); // Placeholder

    // Footer
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 78, 54, 8, "F");
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(4);
    doc.text("VALID UNTIL: AUG 2026", 27, 82, { align: "center" });
    doc.text("WWW.SMARTEDU.COM", 27, 84, { align: "center" });

    doc.save(`${profile.name}_ID_Card.pdf`);
  };

  const renderDetail = (icon: any, label: string, value: string | number | undefined) => (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
        {React.createElement(icon, { className: "w-4 h-4 text-indigo-600" })}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-sm font-bold text-slate-900 leading-none">{value || "N/A"}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col h-full">
      <div className="bg-indigo-600 p-8 text-white relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16" />
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-20 h-20 rounded-2xl border-4 border-white/20 overflow-hidden shadow-2xl">
            <img 
              src={profile.profileImage || `https://picsum.photos/seed/${profile.name}/200/200`} 
              alt={profile.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h3 className="text-2xl font-black tracking-tighter leading-none mb-2">{profile.name}</h3>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full backdrop-blur-md">
              <Shield className="w-3 h-3" />
              <span className="text-[10px] font-black uppercase tracking-widest">{role}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
        <div className="space-y-4">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <User className="w-3 h-3" /> Personal Information
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {renderDetail(Mail, "Email", profile.email)}
            {renderDetail(Phone, "Phone", profile.phone)}
            {renderDetail(MapPin, "Address", profile.address)}
            {renderDetail(Calendar, "DOB", profile.dob)}
            {"gender" in profile && renderDetail(User, "Gender", profile.gender)}
            {"religion" in profile && renderDetail(Shield, "Religion", profile.religion)}
          </div>
        </div>

        {role === "Student" && (
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <GraduationCap className="w-3 h-3" /> Academic Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {renderDetail(Hash, "Roll Number", profile.rollNumber)}
              {renderDetail(BookOpen, "Class", profile.grade)}
              {renderDetail(Layers, "Section", profile.section)}
              {renderDetail(Calendar, "Admission Date", profile.admissionDate)}
              {renderDetail(User, "Father Name", profile.fatherName)}
              {renderDetail(User, "Mother Name", profile.motherName)}
            </div>
          </div>
        )}

        {role === "Teacher" && (
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Briefcase className="w-3 h-3" /> Professional Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {renderDetail(Hash, "Teacher ID", profile.id)}
              {renderDetail(BookOpen, "Subject", profile.subject)}
              {renderDetail(GraduationCap, "Qualification", profile.qualification)}
              {renderDetail(Building, "Assigned Classes", profile.assignedClasses?.join(", "))}
              {renderDetail(Calendar, "Joining Date", profile.joiningDate)}
              {renderDetail(DollarSign, "Salary", `$${profile.salary}`)}
            </div>
          </div>
        )}

        {(role === "Parent" || role === "Guardian") && (
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Users className="w-3 h-3" /> Linked Children
            </h4>
            <div className="space-y-3">
              {profile.linkedChildren?.map((child: any) => (
                <div key={child.id} className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <User className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 leading-none mb-1">{child.name}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Class {child.class}-{child.section} • Roll: {child.rollNumber}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-white rounded-lg transition-all text-indigo-600">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {["Headmaster", "Vice Principal", "Clerk", "Accountant", "Management Staff", "Head of Institute"].includes(role) && (
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Building className="w-3 h-3" /> Office Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {renderDetail(Hash, "Staff ID", profile.id)}
              {renderDetail(Briefcase, "Role", profile.role)}
              {renderDetail(Building, "Office", profile.officeDetails)}
              {renderDetail(Calendar, "Joining Date", profile.joiningDate)}
            </div>
          </div>
        )}

        <div className="pt-4">
          <button 
            onClick={handleDownloadID}
            className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-indigo-600 text-white font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 group"
          >
            <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
            Download ID Card
          </button>
        </div>
      </div>
    </div>
  );
};

const Layers = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const DollarSign = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);
