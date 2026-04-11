import React, { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { 
  CheckCircle2, 
  XCircle, 
  CircleDollarSign, 
  BarChart3, 
  Users, 
  Search,
  Plus,
  Filter,
  Download,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  FileText,
  Calendar,
  User,
  ChevronRight,
  ClipboardCheck,
  UserRound,
  FileUp,
  Loader2,
  Upload,
  Save,
  UserPlus,
  GraduationCap,
  FileUser,
  ArrowRightLeft,
  UserMinus,
  IdCard,
  Printer,
  Mail,
  Phone,
  MapPin,
  ShieldAlert,
  Lock,
  Unlock,
  ArrowUpCircle,
  ArrowDownCircle,
  Layers,
  ShieldCheck,
  Key,
  Settings,
  Bell,
  LayoutDashboard,
  UserCheck
} from "lucide-react";
import { GoogleGenAI, Type } from "@google/genai";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Student, FeeRecord } from "../types";

// --- Classes Smart Management ---
export const ClassesSmartManagement = ({ 
  userRole, 
  students, 
  setStudents 
}: { 
  userRole?: string;
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}) => {
  const [activeTab, setActiveTab] = useState<"attendance" | "bulk" | "schedule">("attendance");
  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState("Grade 10-A");
  const [newStudent, setNewStudent] = useState({ name: "", grade: "Grade 10-A", fatherName: "" });
  const [reportConfig, setReportConfig] = useState({
    type: "daily",
    scope: "class",
    studentId: ""
  });

  const [scheduleSearch, setScheduleSearch] = useState({ class: "All Classes", teacher: "" });
  const [schedules, setSchedules] = useState([
    { id: 1, class: "Grade 10-A", subject: "Mathematics", teacher: "Mr. Ahmed Ali", time: "08:00 AM - 09:00 AM", day: "Monday", room: "Room 101" },
    { id: 2, class: "Grade 10-A", subject: "Physics", teacher: "Ms. Sara Khan", time: "09:00 AM - 10:00 AM", day: "Monday", room: "Lab 1" },
    { id: 3, class: "Grade 10-B", subject: "Chemistry", teacher: "Dr. Bilal Ahmed", time: "08:00 AM - 09:00 AM", day: "Tuesday", room: "Lab 2" },
    { id: 4, class: "Grade 11-A", subject: "English", teacher: "Ms. Fatima Noor", time: "10:30 AM - 11:30 AM", day: "Wednesday", room: "Room 205" },
    { id: 5, class: "Grade 11-B", subject: "Computer Science", teacher: "Mr. Zain Raza", time: "11:30 AM - 12:30 PM", day: "Thursday", room: "Comp Lab" },
  ]);

  const filteredSchedules = schedules.filter(s => {
    const matchesClass = scheduleSearch.class === "All Classes" || s.class === scheduleSearch.class;
    const matchesTeacher = s.teacher.toLowerCase().includes(scheduleSearch.teacher.toLowerCase());
    return matchesClass && matchesTeacher;
  });

  const filteredStudents = students.filter(s => s.grade === selectedClass);

  const [attendanceData, setAttendanceData] = useState(
    students.reduce((acc, student) => ({ ...acc, [student.id]: student.attendanceStatus || "present" }), {})
  );

  const updateAttendance = (studentId: number, status: string) => {
    setAttendanceData(prev => ({ ...prev, [studentId]: status }));
  };

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.grade) return;
    
    const studentToAdd: Student = {
      id: Date.now(),
      name: newStudent.name,
      fatherName: newStudent.fatherName || "N/A",
      grade: newStudent.grade,
      status: "Active",
      attendanceStatus: "present",
      attendanceTime: "-",
      examResults: { math: 0, science: 0, english: 0 },
      checkedByParent: false
    };
    
    setStudents([...students, studentToAdd]);
    setAttendanceData(prev => ({ ...prev, [studentToAdd.id]: "present" }));
    setNewStudent({ name: "", grade: "Grade 10-A", fatherName: "" });
    setShowManualEntry(false);
  };

  const saveAttendance = () => {
    setStudents(students.map(s => ({
      ...s,
      attendanceStatus: attendanceData[s.id] || s.attendanceStatus,
      attendanceTime: attendanceData[s.id] === "present" ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"
    })));
    setIsMarkingAttendance(false);
  };

  const generatePDF = (customTitle?: string, customBody?: any[][], customHead?: string[][]) => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
    
    doc.setFontSize(20);
    doc.setTextColor(79, 70, 229);
    doc.text(customTitle || "Attendance Report", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${date}`, 14, 30);

    if (customBody && customHead) {
      autoTable(doc, {
        startY: 40,
        head: customHead,
        body: customBody,
        headStyles: { fillColor: [79, 70, 229] }
      });
    } else {
      doc.text(`Report Type: ${reportConfig.type.toUpperCase()}`, 14, 35);
      doc.text(`Scope: ${reportConfig.scope === "class" ? "Whole Class" : "Individual Student"}`, 14, 40);

      if (reportConfig.scope === "student") {
        const student = students.find(s => s.id.toString() === reportConfig.studentId);
        doc.text(`Student: ${student?.name || "N/A"}`, 14, 45);
        
        autoTable(doc, {
          startY: 55,
          head: [['Date', 'Status', 'Check-in Time']],
          body: [
            [date, (attendanceData[student?.id || 0] || "N/A").toUpperCase(), student?.attendanceTime || "-"]
          ],
          headStyles: { fillColor: [79, 70, 229] }
        });
      } else {
        autoTable(doc, {
          startY: 50,
          head: [['Student Name', 'Grade', 'Status', 'Check-in Time']],
          body: filteredStudents.map(s => [
            s.name,
            s.grade,
            (attendanceData[s.id] || s.attendanceStatus).toUpperCase(),
            s.attendanceTime
          ]),
          headStyles: { fillColor: [79, 70, 229] }
        });
      }
    }

    doc.save(`${customTitle || "Report"}_${date}.pdf`);
    setShowReportModal(false);
  };

  const markAsChecked = (id: number) => {
    setStudents(students.map(s => s.id === id ? { ...s, checkedByParent: true } : s));
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingBulk(true);
    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
      });
      reader.readAsDataURL(file);
      const base64Data = await base64Promise;

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              { text: "Extract a list of students from this document. Return a JSON array of objects, where each object has 'name' and 'grade' properties. If the grade is not clear, default to 'Grade 10-A'." },
              { inlineData: { data: base64Data, mimeType: file.type } }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                grade: { type: Type.STRING }
              },
              required: ["name", "grade"]
            }
          }
        }
      });

      const extractedStudents = JSON.parse(response.text || "[]");
      
      if (Array.isArray(extractedStudents) && extractedStudents.length > 0) {
        const newStudents = extractedStudents.map((s: any, index: number) => ({
          id: Date.now() + index,
          name: s.name,
          grade: s.grade || "Grade 10-A",
          status: "present",
          time: "-",
          examResults: { math: 0, science: 0, english: 0 },
          checkedByParent: false
        }));
        setStudents(prev => [...prev, ...newStudents]);
        alert(`Successfully imported ${newStudents.length} students!`);
      } else {
        alert("No students could be extracted from the document. Please try a clearer image.");
      }
    } catch (error) {
      console.error("Bulk upload error:", error);
      alert("Failed to process the document. Please try again.");
    } finally {
      setIsProcessingBulk(false);
      if (e.target) e.target.value = "";
    }
  };

  const renderBulkUploadTab = () => {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Bulk Student Import</h2>
            <p className="text-slate-500 font-medium">Upload hard copies or lists to automatically extract student data</p>
          </div>
        </div>

        <Card className="rounded-[2.5rem] border-dashed border-2 border-slate-200 bg-slate-50/50 p-12 text-center">
          <div className="max-w-md mx-auto space-y-6">
            <div className="w-20 h-20 bg-indigo-100 rounded-3xl flex items-center justify-center mx-auto text-indigo-600">
              {isProcessingBulk ? (
                <Loader2 className="w-10 h-10 animate-spin" />
              ) : (
                <FileUp className="w-10 h-10" />
              )}
            </div>
            
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-2">
                {isProcessingBulk ? "Processing Document..." : "Upload Student List"}
              </h3>
              <p className="text-slate-500 font-medium">
                {isProcessingBulk 
                  ? "Gemini AI is analyzing your document and extracting student details. This will only take a moment." 
                  : "Snap a photo of your handwritten or printed student list. Our AI will automatically 'pitch' the names and grades into the system."}
              </p>
            </div>

            {!isProcessingBulk && (
              <div className="flex flex-col gap-3">
                <label className="cursor-pointer">
                  <input 
                    type="file" 
                    accept="image/*,.pdf" 
                    className="hidden" 
                    onChange={handleBulkUpload}
                  />
                  <div className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black h-14 flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 transition-all">
                    <Upload className="w-5 h-5" /> Select File or Take Photo
                  </div>
                </label>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Supports JPG, PNG, and PDF</p>
              </div>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="rounded-[2rem] border-slate-200/60 shadow-sm p-6">
            <h4 className="font-black text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              How it works
            </h4>
            <ul className="space-y-3 text-sm text-slate-600 font-medium">
              <li className="flex gap-2">
                <span className="text-indigo-600 font-black">1.</span>
                Upload a clear photo of your student register or list.
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-600 font-black">2.</span>
                Gemini AI identifies names and class details.
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-600 font-black">3.</span>
                Students are automatically added to your database.
              </li>
            </ul>
          </Card>
          <Card className="rounded-[2rem] border-slate-200/60 shadow-sm p-6">
            <h4 className="font-black text-slate-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Pro Tips
            </h4>
            <ul className="space-y-3 text-sm text-slate-600 font-medium">
              <li className="flex gap-2">
                • Ensure good lighting for handwritten lists.
              </li>
              <li className="flex gap-2">
                • Keep the paper flat and avoid shadows.
              </li>
              <li className="flex gap-2">
                • You can upload multiple pages one by one.
              </li>
            </ul>
          </Card>
        </div>
      </div>
    );
  };

  const renderAttendanceTab = () => {
    if (isMarkingAttendance) {
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900">Mark Attendance</h2>
              <p className="text-slate-500 font-medium">Session Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setIsMarkingAttendance(false)} className="rounded-xl font-bold">Cancel</Button>
              <Button onClick={saveAttendance} className="bg-indigo-600 hover:bg-indigo-700 rounded-xl font-black px-8 h-12 shadow-lg shadow-indigo-100">
                Save Attendance
              </Button>
            </div>
          </div>

          <Card className="rounded-[2.5rem] border-slate-200/60 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Student Name</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Present</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Absent</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Late</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Leave</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
                          {student.name.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-900">{student.name}</span>
                      </div>
                    </td>
                    {["present", "absent", "late", "leave"].map((status) => (
                      <td key={status} className="px-8 py-5 text-center">
                        <button 
                          onClick={() => updateAttendance(student.id, status)}
                          className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center mx-auto ${
                            attendanceData[student.id] === status 
                            ? "border-indigo-600 bg-indigo-600 text-white" 
                            : "border-slate-200 hover:border-indigo-300"
                          }`}
                        >
                          {attendanceData[student.id] === status && <div className="w-2 h-2 rounded-full bg-white" />}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      );
    }

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Attendance</h2>
            <p className="text-slate-500 font-medium">Daily attendance management</p>
          </div>
          <Button 
            onClick={() => setShowManualEntry(true)}
            variant="outline" 
            className="rounded-xl font-bold border-indigo-100 text-indigo-600 hover:bg-indigo-50"
          >
            <Plus className="w-4 h-4 mr-2" /> Manual Entry
          </Button>
        </div>

        {showManualEntry && (
          <Card className="rounded-[2rem] border-indigo-200 bg-indigo-50/30 p-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1">Student Name</label>
                <input 
                  type="text" 
                  placeholder="Enter full name" 
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                  className="w-full h-12 px-4 rounded-xl bg-white border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold" 
                />
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1">Father Name</label>
                <input 
                  type="text" 
                  placeholder="Enter father's name" 
                  value={newStudent.fatherName}
                  onChange={(e) => setNewStudent({...newStudent, fatherName: e.target.value})}
                  className="w-full h-12 px-4 rounded-xl bg-white border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold" 
                />
              </div>
              <div className="w-48 space-y-2">
                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1">Grade</label>
                <select 
                  value={newStudent.grade}
                  onChange={(e) => setNewStudent({...newStudent, grade: e.target.value})}
                  className="w-full h-12 px-4 rounded-xl bg-white border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold appearance-none cursor-pointer"
                >
                  <option value="">Select Grade</option>
                  <option value="Grade 10-A">Grade 10-A</option>
                  <option value="Grade 10-B">Grade 10-B</option>
                  <option value="Grade 11-A">Grade 11-A</option>
                  <option value="Grade 11-B">Grade 11-B</option>
                </select>
              </div>
              <Button 
                onClick={handleAddStudent}
                className="h-12 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold px-6"
              >
                Add Student
              </Button>
              <Button variant="ghost" onClick={() => setShowManualEntry(false)} className="h-12 rounded-xl font-bold text-slate-500">Cancel</Button>
            </div>
          </Card>
        )}

        <div className="flex flex-wrap gap-6 items-end bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Select Class</label>
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold w-64 appearance-none cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <option value="Grade 10-A">Grade 10-A</option>
              <option value="Grade 10-B">Grade 10-B</option>
              <option value="Grade 11-A">Grade 11-A</option>
              <option value="Grade 11-B">Grade 11-B</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Attendance Date</label>
            <input 
              type="date" 
              defaultValue={new Date().toISOString().split('T')[0]}
              className="h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold w-64 cursor-pointer hover:bg-slate-100 transition-colors"
            />
          </div>

          <div className="flex-1" />

          <div className="flex gap-4">
            <Button 
              onClick={() => setIsMarkingAttendance(true)}
              className="bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-black gap-2 h-14 px-8 shadow-lg shadow-indigo-100"
            >
              <CheckCircle2 className="w-5 h-5" /> Mark Attendance
            </Button>
            <Button 
              onClick={() => setShowReportModal(true)}
              variant="outline" 
              className="rounded-2xl font-black gap-2 h-14 px-8 border-slate-200 hover:bg-slate-50"
            >
              <BarChart3 className="w-5 h-5" /> Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="rounded-[2rem] border-slate-200/60 shadow-sm">
            <CardContent className="p-6">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Total Students</p>
              <p className="text-4xl font-black text-slate-900">{filteredStudents.length}</p>
            </CardContent>
          </Card>
          <Card className="rounded-[2rem] border-slate-200/60 shadow-sm">
            <CardContent className="p-6">
              <p className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-2">Present Today</p>
              <p className="text-4xl font-black text-emerald-600">{filteredStudents.filter(s => s.attendanceStatus === 'present').length}</p>
            </CardContent>
          </Card>
          <Card className="rounded-[2rem] border-slate-200/60 shadow-sm">
            <CardContent className="p-6">
              <p className="text-xs font-black text-rose-500 uppercase tracking-widest mb-2">Absent</p>
              <p className="text-4xl font-black text-rose-600">{filteredStudents.filter(s => s.attendanceStatus === 'absent').length}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-[2rem] border-slate-200/60 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div className="relative w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search students..." 
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
              />
            </div>
            <Button variant="ghost" className="rounded-xl font-bold gap-2 text-slate-500">
              <Filter className="w-4 h-4" /> Filter
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Student Name</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Grade</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Check-in</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                          {student.name.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-900">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-500">{student.grade}</td>
                    <td className="px-6 py-4">
                      <Badge className={`rounded-full px-3 py-1 font-bold ${
                        student.attendanceStatus === "present" ? "bg-emerald-100 text-emerald-700" :
                        student.attendanceStatus === "absent" ? "bg-rose-100 text-rose-700" :
                        "bg-amber-100 text-amber-700"
                      }`}>
                        {(student.attendanceStatus || "present").toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-500">{student.attendanceTime}</td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setIsMarkingAttendance(true)}
                        className="rounded-lg font-bold text-indigo-600 hover:bg-indigo-50"
                      >
                        Edit Entry
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  };

  const renderScheduleTab = () => {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Classes Schedule</h2>
            <p className="text-slate-500 font-medium">Weekly academic timetable and faculty allocation</p>
          </div>
          {(userRole === "Headmaster" || userRole === "Vice Principal") && (
            <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-xl font-black gap-2 shadow-lg shadow-indigo-100">
              <Plus className="w-4 h-4" /> Add Schedule
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-6 items-end bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Filter by Class</label>
            <select 
              value={scheduleSearch.class}
              onChange={(e) => setScheduleSearch({...scheduleSearch, class: e.target.value})}
              className="h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold w-64 appearance-none cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <option value="All Classes">All Classes</option>
              <option value="Grade 10-A">Grade 10-A</option>
              <option value="Grade 10-B">Grade 10-B</option>
              <option value="Grade 11-A">Grade 11-A</option>
              <option value="Grade 11-B">Grade 11-B</option>
            </select>
          </div>
          
          <div className="space-y-2 flex-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Search Teacher</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by teacher name..." 
                value={scheduleSearch.teacher}
                onChange={(e) => setScheduleSearch({...scheduleSearch, teacher: e.target.value})}
                className="h-14 pl-12 pr-6 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold w-full hover:bg-slate-100 transition-colors"
              />
            </div>
          </div>
        </div>

        <Card className="rounded-[2.5rem] border-slate-200/60 shadow-sm overflow-hidden">
          <div className="p-0">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/30">
                  <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Day</th>
                  <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Time</th>
                  <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Class</th>
                  <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Subject</th>
                  <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Teacher</th>
                  <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Room</th>
                  {(userRole === "Headmaster" || userRole === "Vice Principal") && (
                    <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSchedules.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-4">
                      <Badge className="bg-indigo-50 text-indigo-600 border-none font-bold rounded-lg">{item.day}</Badge>
                    </td>
                    <td className="px-8 py-4 font-medium text-slate-600">{item.time}</td>
                    <td className="px-8 py-4 font-bold text-slate-900">{item.class}</td>
                    <td className="px-8 py-4 font-bold text-indigo-600">{item.subject}</td>
                    <td className="px-8 py-4 font-medium text-slate-700">{item.teacher}</td>
                    <td className="px-8 py-4 font-medium text-slate-500">{item.room}</td>
                    {(userRole === "Headmaster" || userRole === "Vice Principal") && (
                      <td className="px-8 py-4 text-right">
                        <Button variant="ghost" size="sm" className="rounded-lg p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
                {filteredSchedules.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-8 py-12 text-center text-slate-400 font-medium">
                      No schedules found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
        {[
          { id: "attendance", label: "Attendance", icon: Users },
          { id: "schedule", label: "Classes Schedule", icon: Calendar },
          { id: "bulk", label: "Bulk Import", icon: FileUp },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all ${
              activeTab === tab.id 
                ? "bg-white text-indigo-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "attendance" && renderAttendanceTab()}
      {activeTab === "schedule" && renderScheduleTab()}
      {activeTab === "bulk" && renderBulkUploadTab()}

      {showReportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <Card className="w-full max-w-xl rounded-[2.5rem] border-none shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 bg-indigo-600 text-white">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black tracking-tight">Generate Report</h3>
                  <p className="text-indigo-100 font-medium">Select parameters for your PDF export</p>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowReportModal(false)}
                  className="text-white hover:bg-white/10 rounded-full w-10 h-10 p-0"
                >
                  <XCircle className="w-6 h-6" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setReportConfig({...reportConfig, scope: 'class'})}
                  className={`p-4 rounded-2xl border-2 transition-all text-left ${reportConfig.scope === 'class' ? 'bg-white text-indigo-600 border-white' : 'bg-white/10 border-white/20 hover:bg-white/20'}`}
                >
                  <Users className="w-6 h-6 mb-2" />
                  <p className="font-black text-sm">Whole Class</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">{selectedClass}</p>
                </button>
                <button 
                  onClick={() => setReportConfig({...reportConfig, scope: 'student'})}
                  className={`p-4 rounded-2xl border-2 transition-all text-left ${reportConfig.scope === 'student' ? 'bg-white text-indigo-600 border-white' : 'bg-white/10 border-white/20 hover:bg-white/20'}`}
                >
                  <User className="w-6 h-6 mb-2" />
                  <p className="font-black text-sm">Single Student</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Individual Data</p>
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6 bg-white">
              {reportConfig.scope === 'student' && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Student</label>
                  <select 
                    value={reportConfig.studentId}
                    onChange={(e) => setReportConfig({...reportConfig, studentId: e.target.value})}
                    className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold appearance-none cursor-pointer"
                  >
                    <option value="">Choose a student...</option>
                    {filteredStudents.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Report Frequency</label>
                <div className="grid grid-cols-4 gap-2">
                  {['daily', 'weekly', 'monthly', 'yearly'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setReportConfig({...reportConfig, type})}
                      className={`h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        reportConfig.type === type 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <Button 
                  onClick={() => setShowReportModal(false)}
                  variant="ghost" 
                  className="flex-1 h-14 rounded-2xl font-black text-slate-500"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => generatePDF()}
                  disabled={reportConfig.scope === 'student' && !reportConfig.studentId}
                  className="flex-[2] h-14 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-black gap-2 shadow-lg shadow-indigo-100"
                >
                  <Download className="w-5 h-5" /> Download PDF Report
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};


// --- Finance Management ---
export const FinanceManagement = ({ 
  userRole, 
  initialTab = "overview",
  students,
  fees,
  setFees
}: { 
  userRole?: string; 
  initialTab?: "overview" | "fees" | "salaries";
  students: Student[];
  fees: FeeRecord[];
  setFees: React.Dispatch<React.SetStateAction<FeeRecord[]>>;
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "fees" | "salaries">(initialTab);
  
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const [feeTab, setFeeTab] = useState<"collection" | "structure" | "defaulters" | "tracking">("structure");
  const [salaryTab, setSalaryTab] = useState<"monthly" | "yearly" | "setup">("monthly");
  const [showCollectFeeModal, setShowCollectFeeModal] = useState(false);
  const [newFee, setNewFee] = useState({ student: "", grade: "Grade 10-A", amount: "", method: "Cash" });
  const [selectedGrade, setSelectedGrade] = useState("Grade 10-A");
  const [isUploading, setIsUploading] = useState(false);
  const [trackingSearch, setTrackingSearch] = useState("");
  const [trackingGrade, setTrackingGrade] = useState("All Grades");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = () => {
    const headers = ["Student Name", "Grade", "Amount", "Payment Method"];
    const rows = [
      ["John Doe", "Grade 10-A", "15000", "Cash"],
      ["Jane Smith", "Grade 11-B", "18000", "Bank Transfer"]
    ];
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "fee_collection_template.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUploadRecords = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    // Simulate parsing delay
    setTimeout(() => {
      const newEntries = [
        { id: fees.length + 1, student: "Bulk Student 1", grade: "Grade 10-A", amount: 15000, date: new Date().toISOString().split('T')[0], status: "Paid" as const, method: "Bulk Upload" },
        { id: fees.length + 2, student: "Bulk Student 2", grade: "Grade 11-B", amount: 18000, date: new Date().toISOString().split('T')[0], status: "Paid" as const, method: "Bulk Upload" },
      ];
      setFees([...newEntries, ...fees]);
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }, 1500);
  };

  // Mock Data for Salaries
  const [salaries, setSalaries] = useState([
    { id: 1, name: "Dr. Arshad Mehmood", role: "Headmaster", basic: 150000, allowances: 25000, deductions: 5000, net: 170000, status: "Paid", month: "October 2023" },
    { id: 2, name: "Ms. Saima Khan", role: "Senior Teacher", basic: 85000, allowances: 12000, deductions: 2000, net: 95000, status: "Paid", month: "October 2023" },
    { id: 3, name: "Mr. Bilal Ahmed", role: "Junior Teacher", basic: 55000, allowances: 8000, deductions: 1500, net: 61500, status: "Pending", month: "October 2023" },
  ]);

  const [salarySetup, setSalarySetup] = useState([
    { role: "Headmaster", basic: 150000, medical: 15000, conveyance: 10000 },
    { role: "Senior Teacher", basic: 85000, medical: 8000, conveyance: 4000 },
    { role: "Junior Teacher", basic: 55000, medical: 5000, conveyance: 3000 },
    { role: "Clerk", basic: 45000, medical: 4000, conveyance: 2500 },
  ]);

  const data = [
    { name: 'Jan', revenue: 4000, expenses: 2400 },
    { name: 'Feb', revenue: 3000, expenses: 1398 },
    { name: 'Mar', revenue: 2000, expenses: 9800 },
    { name: 'Apr', revenue: 2780, expenses: 3908 },
    { name: 'May', revenue: 1890, expenses: 4800 },
    { name: 'Jun', revenue: 2390, expenses: 3800 },
  ];

  const handleCollectFee = () => {
    if (!newFee.student || !newFee.amount) return;
    const fee = {
      id: fees.length + 1,
      student: newFee.student,
      grade: newFee.grade,
      amount: parseInt(newFee.amount),
      date: new Date().toISOString().split('T')[0],
      status: "Paid" as const,
      method: newFee.method
    };
    setFees([fee, ...fees]);
    setShowCollectFeeModal(false);
    setNewFee({ student: "", grade: "Grade 10-A", amount: "", method: "Cash" });
  };

  const renderOverview = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1- Total Revenue Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <CircleDollarSign className="text-white w-6 h-6" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">Total Revenue Summary</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "Total Revenue", value: "Rs. 1,245,000", trend: "+12%", up: true },
            { label: "Outstanding Fees", value: "Rs. 123,000", trend: "-5%", up: false },
            { label: "Operating Costs", value: "Rs. 452,000", trend: "+2%", up: true },
            { label: "Net Profit", value: "Rs. 793,000", trend: "+18%", up: true },
          ].map((stat, i) => (
            <Card key={i} className="rounded-[2rem] border-slate-200/60 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                  <div className={`flex items-center text-[10px] font-bold ${stat.up ? "text-emerald-600" : "text-rose-600"}`}>
                    {stat.up ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                    {stat.trend}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 2- Class Wise Revenue Section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <Layers className="text-white w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Class Wise Revenue</h3>
          </div>
          
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Select Grade:</span>
            <select 
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="h-10 px-4 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm appearance-none cursor-pointer min-w-[140px]"
            >
              <option>Grade 10-A</option>
              <option>Grade 10-B</option>
              <option>Grade 11-A</option>
              <option>Grade 11-B</option>
              <option>Grade 12-A</option>
              <option>Grade 12-B</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 rounded-[2.5rem] border-slate-200/60 shadow-sm p-8 bg-white">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h4 className="text-xl font-black text-slate-900">{selectedGrade} Revenue Analytics</h4>
                <p className="text-sm text-slate-500 font-medium">Monthly collection trend for the selected grade</p>
              </div>
              <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-black">Active Session</Badge>
            </div>
            
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { month: 'Aug', amount: 120000 },
                  { month: 'Sep', amount: 145000 },
                  { month: 'Oct', amount: 138000 },
                  { month: 'Nov', amount: 152000 },
                  { month: 'Dec', amount: 160000 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#94a3b8'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#94a3b8'}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="amount" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-8 rounded-[2.5rem] border-slate-200/60 shadow-sm bg-slate-900 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[40px] rounded-full -mr-16 -mt-16" />
              <div className="relative z-10">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Collected This Month</p>
                <h4 className="text-4xl font-black mb-2">Rs. 152,000</h4>
                <p className="text-xs text-slate-400 font-medium">From 24 students in {selectedGrade}</p>
              </div>
            </Card>

            <Card className="p-8 rounded-[2.5rem] border-slate-200/60 shadow-sm bg-white">
              <h4 className="text-sm font-black text-slate-900 mb-6">Revenue Breakdown</h4>
              <div className="space-y-4">
                {[
                  { label: "Tuition Fees", amount: "Rs. 120,000", color: "bg-indigo-500" },
                  { label: "Lab Charges", amount: "Rs. 22,000", color: "bg-emerald-500" },
                  { label: "Sports Fund", amount: "Rs. 10,000", color: "bg-amber-500" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${item.color}`} />
                      <span className="text-sm font-bold text-slate-500">{item.label}</span>
                    </div>
                    <span className="text-sm font-black text-slate-900">{item.amount}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFeeManagement = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm w-fit">
        {[
          { id: "structure", label: "Fee Structure", icon: Settings },
          { id: "collection", label: "Fee Collection", icon: CircleDollarSign },
          { id: "defaulters", label: "Defaulters List", icon: ShieldAlert },
          { id: "tracking", label: "Fee Tracking", icon: Search },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFeeTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black transition-all ${
              feeTab === tab.id 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {feeTab === "collection" && (
        <Card className="rounded-[3rem] border-slate-200/60 shadow-xl overflow-hidden bg-white">
          <div className="p-8 border-b border-slate-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h3 className="text-2xl font-black text-slate-900">Fee Collection</h3>
              <p className="text-slate-500 font-medium">Record and manage student fee payments</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleUploadRecords} 
                className="hidden" 
                accept=".csv, .xlsx, .xls, image/*"
              />
              
              <Button 
                variant="outline"
                onClick={handleDownloadTemplate}
                className="rounded-2xl font-black px-6 h-14 border-slate-200 gap-2 hover:bg-slate-50"
              >
                <Download className="w-5 h-5" /> Template
              </Button>

              <Button 
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="rounded-2xl font-black px-6 h-14 border-slate-200 gap-2 hover:bg-slate-50"
              >
                {isUploading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Upload className="w-5 h-5" />
                )}
                Upload Records
              </Button>

              <Button 
                onClick={() => setShowCollectFeeModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-black px-8 h-14 gap-2 shadow-lg shadow-indigo-100"
              >
                <Plus className="w-5 h-5" /> Collect New Fee
              </Button>
            </div>
          </div>
          <div className="p-0">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Grade</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Method</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {fees.map((fee) => (
                  <tr key={fee.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <p className="font-black text-slate-900">{fee.student}</p>
                    </td>
                    <td className="px-8 py-5">
                      <Badge variant="outline" className="rounded-lg font-bold border-slate-200">{fee.grade}</Badge>
                    </td>
                    <td className="px-8 py-5">
                      <p className="font-black text-slate-900">Rs. {fee.amount.toLocaleString()}</p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-slate-500">{fee.date}</p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-slate-500">{fee.method}</p>
                    </td>
                    <td className="px-8 py-5">
                      <Badge className={`rounded-lg font-black ${fee.status === "Paid" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"}`}>
                        {fee.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {feeTab === "structure" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { grade: "Playgroup - Nursery", tuition: 8500, sports: 500, lab: 0, total: 9000 },
            { grade: "Grade 1 - 5", tuition: 12000, sports: 1000, lab: 500, total: 13500 },
            { grade: "Grade 6 - 8", tuition: 14500, sports: 1000, lab: 1500, total: 17000 },
            { grade: "Grade 9 - 10", tuition: 16000, sports: 1500, lab: 2500, total: 20000 },
            { grade: "Grade 11 - 12", tuition: 22000, sports: 2000, lab: 4000, total: 28000 },
          ].map((item, i) => (
            <Card key={i} className="p-8 rounded-[2.5rem] border-slate-200/60 shadow-sm bg-white space-y-6">
              <div className="flex justify-between items-start">
                <h4 className="text-xl font-black text-slate-900">{item.grade}</h4>
                <Button variant="ghost" size="sm" className="text-indigo-600 font-bold p-0 h-auto">Edit</Button>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium text-slate-500">
                  <span>Tuition Fee</span>
                  <span className="font-black text-slate-900">Rs. {item.tuition.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-slate-500">
                  <span>Sports Fund</span>
                  <span className="font-black text-slate-900">Rs. {item.sports.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-slate-500">
                  <span>Lab Charges</span>
                  <span className="font-black text-slate-900">Rs. {item.lab.toLocaleString()}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-lg font-black text-indigo-600">
                  <span>Monthly Total</span>
                  <span>Rs. {item.total.toLocaleString()}</span>
                </div>
              </div>
              <Button 
                onClick={() => {
                  setNewFee({ ...newFee, grade: item.grade, amount: item.total.toString() });
                  setShowCollectFeeModal(true);
                }}
                className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black gap-2"
              >
                <CircleDollarSign className="w-4 h-4" /> Collect Fee
              </Button>
            </Card>
          ))}
          <Card className="p-8 rounded-[2.5rem] border-dashed border-2 border-slate-200 flex flex-col items-center justify-center text-center space-y-4 cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center">
              <Plus className="w-7 h-7 text-slate-400" />
            </div>
            <div>
              <p className="font-black text-slate-900">Add New Category</p>
              <p className="text-xs text-slate-500 font-medium">Define fees for a new grade level</p>
            </div>
          </Card>
        </div>
      )}

      {feeTab === "defaulters" && (
        <Card className="rounded-[3rem] border-slate-200/60 shadow-xl overflow-hidden bg-white">
          <div className="p-8 border-b border-slate-100 bg-rose-50/30 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center">
                <ShieldAlert className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">Defaulters List</h3>
                <p className="text-slate-500 font-medium">Students with outstanding balances for Oct 2023</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="rounded-2xl font-black border-slate-200 gap-2">
                <Printer className="w-4 h-4" /> Print Notices
              </Button>
              <Button className="bg-rose-600 hover:bg-rose-700 rounded-2xl font-black gap-2">
                <Bell className="w-4 h-4" /> Send Reminders
              </Button>
            </div>
          </div>
          <div className="p-0">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Grade</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Due Amount</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Reminder</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { name: "Ahmad Ali", grade: "Grade 11-B", amount: 18000, last: "2 days ago" },
                  { name: "Zoya Khan", grade: "Grade 9-A", amount: 16000, last: "Never" },
                  { name: "Bilal Nasir", grade: "Grade 10-B", amount: 32000, last: "1 week ago" },
                ].map((s, i) => (
                  <tr key={i} className="hover:bg-rose-50/20 transition-colors">
                    <td className="px-8 py-5 font-black text-slate-900">{s.name}</td>
                    <td className="px-8 py-5 font-bold text-slate-500">{s.grade}</td>
                    <td className="px-8 py-5 font-black text-rose-600">Rs. {s.amount.toLocaleString()}</td>
                    <td className="px-8 py-5 font-bold text-slate-400">{s.last}</td>
                    <td className="px-8 py-5">
                      <Button 
                        size="sm"
                        onClick={() => {
                          setNewFee({ ...newFee, student: s.name, grade: s.grade, amount: s.amount.toString() });
                          setShowCollectFeeModal(true);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-xs gap-2"
                      >
                        <CircleDollarSign className="w-3 h-3" /> Collect Fee
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {feeTab === "tracking" && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text"
                placeholder="Search by Name or Roll No..."
                value={trackingSearch}
                onChange={(e) => setTrackingSearch(e.target.value)}
                className="w-full h-14 pl-12 pr-6 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold shadow-sm"
              />
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <select 
                value={trackingGrade}
                onChange={(e) => setTrackingGrade(e.target.value)}
                className="h-14 px-6 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold shadow-sm appearance-none cursor-pointer min-w-[160px]"
              >
                <option>All Grades</option>
                <option>Grade 10-A</option>
                <option>Grade 11-B</option>
                <option>Grade 9-A</option>
              </select>
              <Button variant="outline" className="h-14 px-6 rounded-2xl border-slate-200 font-black gap-2">
                <Filter className="w-5 h-5" /> Filter
              </Button>
            </div>
          </div>

          <Card className="rounded-[3rem] border-slate-200/60 shadow-xl overflow-hidden bg-white">
            <div className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Roll No</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Grade</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Payment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {fees
                    .filter(f => {
                      const matchesSearch = f.student.toLowerCase().includes(trackingSearch.toLowerCase()) || 
                                          (f.rollNo && f.rollNo.toLowerCase().includes(trackingSearch.toLowerCase()));
                      const matchesGrade = trackingGrade === "All Grades" || f.grade === trackingGrade;
                      return matchesSearch && matchesGrade;
                    })
                    .map((fee) => (
                      <tr key={fee.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-5">
                          <Badge variant="secondary" className="rounded-lg font-mono font-bold">{fee.rollNo || "N/A"}</Badge>
                        </td>
                        <td className="px-8 py-5 font-black text-slate-900">{fee.student}</td>
                        <td className="px-8 py-5 font-bold text-slate-500">{fee.grade}</td>
                        <td className="px-8 py-5 font-black text-slate-900">Rs. {fee.amount.toLocaleString()}</td>
                        <td className="px-8 py-5">
                          <Badge className={`rounded-lg font-black ${fee.status === "Paid" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"}`}>
                            {fee.status}
                          </Badge>
                        </td>
                        <td className="px-8 py-5 text-sm font-bold text-slate-400">{fee.date}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {fees.filter(f => {
                const matchesSearch = f.student.toLowerCase().includes(trackingSearch.toLowerCase()) || 
                                    (f.rollNo && f.rollNo.toLowerCase().includes(trackingSearch.toLowerCase()));
                const matchesGrade = trackingGrade === "All Grades" || f.grade === trackingGrade;
                return matchesSearch && matchesGrade;
              }).length === 0 && (
                <div className="p-20 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-10 h-10 text-slate-300" />
                  </div>
                  <h4 className="text-xl font-black text-slate-900 mb-2">No Records Found</h4>
                  <p className="text-slate-500 font-medium">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      <Dialog open={showCollectFeeModal} onOpenChange={setShowCollectFeeModal}>
        <DialogContent className="rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden max-w-lg">
          <div className="p-8 bg-indigo-600 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black tracking-tight">Collect New Fee</DialogTitle>
              <p className="text-indigo-100 font-medium">Enter payment details for the student</p>
            </DialogHeader>
          </div>
          <div className="p-8 space-y-6 bg-white">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Student Name</label>
              <input 
                type="text"
                value={newFee.student}
                onChange={(e) => setNewFee({...newFee, student: e.target.value})}
                placeholder="Enter full name"
                className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Grade</label>
                <select 
                  value={newFee.grade}
                  onChange={(e) => setNewFee({...newFee, grade: e.target.value})}
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold appearance-none cursor-pointer"
                >
                  <option>Grade 10-A</option>
                  <option>Grade 10-B</option>
                  <option>Grade 11-A</option>
                  <option>Grade 11-B</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Amount (Rs.)</label>
                <input 
                  type="number"
                  value={newFee.amount}
                  onChange={(e) => setNewFee({...newFee, amount: e.target.value})}
                  placeholder="15000"
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {['Cash', 'Bank', 'Online'].map((m) => (
                  <button
                    key={m}
                    onClick={() => setNewFee({...newFee, method: m})}
                    className={`h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      newFee.method === m 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div className="pt-4 flex gap-3">
              <Button 
                onClick={() => setShowCollectFeeModal(false)}
                variant="ghost" 
                className="flex-1 h-14 rounded-2xl font-black text-slate-500"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCollectFee}
                disabled={!newFee.student || !newFee.amount}
                className="flex-[2] h-14 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-black gap-2 shadow-lg shadow-indigo-100"
              >
                <CheckCircle2 className="w-5 h-5" /> Confirm Payment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  const renderSalaryManagement = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm w-fit">
        {[
          { id: "monthly", label: "Monthly Record", icon: Calendar },
          { id: "yearly", label: "Yearly Record", icon: BarChart3 },
          { id: "setup", label: "Salary Setup", icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSalaryTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black transition-all ${
              salaryTab === tab.id 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {salaryTab === "monthly" && (
        <Card className="rounded-[3rem] border-slate-200/60 shadow-xl overflow-hidden bg-white">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-black text-slate-900">Monthly Salary Record</h3>
              <p className="text-slate-500 font-medium">Payroll management for October 2023</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="rounded-2xl font-black border-slate-200 gap-2 h-14 px-6">
                <Printer className="w-5 h-5" /> Print Payslips
              </Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-black px-8 h-14 gap-2 shadow-lg shadow-indigo-100">
                <Zap className="w-5 h-5" /> Process Payroll
              </Button>
            </div>
          </div>
          <div className="p-0">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Basic</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Allowances</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Deductions</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Salary</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {salaries.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <p className="font-black text-slate-900">{s.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{s.role}</p>
                    </td>
                    <td className="px-8 py-5 font-bold text-slate-600">Rs. {s.basic.toLocaleString()}</td>
                    <td className="px-8 py-5 font-bold text-emerald-600">+Rs. {s.allowances.toLocaleString()}</td>
                    <td className="px-8 py-5 font-bold text-rose-600">-Rs. {s.deductions.toLocaleString()}</td>
                    <td className="px-8 py-5 font-black text-slate-900">Rs. {s.net.toLocaleString()}</td>
                    <td className="px-8 py-5">
                      <Badge className={`rounded-lg font-black ${s.status === "Paid" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}>
                        {s.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {salaryTab === "yearly" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-8 rounded-[2.5rem] bg-indigo-600 text-white shadow-xl shadow-indigo-100">
              <p className="text-xs font-black uppercase tracking-widest text-indigo-200 mb-2">Total Yearly Payout</p>
              <p className="text-4xl font-black">Rs. 18.4M</p>
              <div className="mt-4 flex items-center text-xs font-bold text-indigo-200">
                <ArrowUpRight className="w-4 h-4 mr-1" /> +8% from last year
              </div>
            </Card>
            <Card className="p-8 rounded-[2.5rem] bg-white border-slate-200/60 shadow-sm">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Avg Monthly Payroll</p>
              <p className="text-4xl font-black text-slate-900">Rs. 1.53M</p>
              <p className="mt-4 text-xs font-bold text-slate-400 uppercase">Across 45 Employees</p>
            </Card>
            <Card className="p-8 rounded-[2.5rem] bg-white border-slate-200/60 shadow-sm">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Tax Deductions</p>
              <p className="text-4xl font-black text-slate-900">Rs. 840k</p>
              <p className="mt-4 text-xs font-bold text-slate-400 uppercase">Year-to-date</p>
            </Card>
          </div>
          
          <Card className="p-8 rounded-[3rem] border-slate-200/60 shadow-sm bg-white">
            <h4 className="text-xl font-black text-slate-900 mb-8">Salary Expenditure Trend</h4>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { month: 'Jan', amount: 1450000 },
                  { month: 'Feb', amount: 1450000 },
                  { month: 'Mar', amount: 1520000 },
                  { month: 'Apr', amount: 1520000 },
                  { month: 'May', amount: 1520000 },
                  { month: 'Jun', amount: 1600000 },
                  { month: 'Jul', amount: 1600000 },
                  { month: 'Aug', amount: 1600000 },
                  { month: 'Sep', amount: 1650000 },
                  { month: 'Oct', amount: 1650000 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#94a3b8'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#94a3b8'}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="amount" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {salaryTab === "setup" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-10 rounded-[3rem] border-slate-200/60 shadow-xl bg-white space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center">
                <Settings className="w-7 h-7 text-indigo-600" />
              </div>
              <div>
                <h4 className="text-2xl font-black text-slate-900">Salary Structure</h4>
                <p className="text-slate-500 font-medium">Define pay scales by role</p>
              </div>
            </div>
            
            <div className="space-y-6">
              {salarySetup.map((role, i) => (
                <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="font-black text-slate-900">{role.role}</p>
                    <Button variant="ghost" size="sm" className="text-indigo-600 font-bold">Edit Scale</Button>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Basic</p>
                      <p className="font-bold text-slate-900">Rs. {role.basic.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Medical</p>
                      <p className="font-bold text-emerald-600">Rs. {role.medical.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Conveyance</p>
                      <p className="font-bold text-emerald-600">Rs. {role.conveyance.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-10 rounded-[3rem] border-slate-200/60 shadow-xl bg-slate-900 text-white space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full -mr-32 -mt-32" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-indigo-400" />
              </div>
              <div>
                <h4 className="text-2xl font-black">Global Deductions</h4>
                <p className="text-slate-400 font-medium">Tax and policy settings</p>
              </div>
            </div>
            
            <div className="space-y-6 relative z-10">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                  <p className="font-bold">Income Tax (Slab A)</p>
                  <Badge className="bg-indigo-500 text-white border-none">5%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-bold">Provident Fund</p>
                  <Badge className="bg-indigo-500 text-white border-none">2.5%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-bold">Social Security</p>
                  <Badge className="bg-indigo-500 text-white border-none">Rs. 500</Badge>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-4">
                <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0" />
                <p className="text-xs text-amber-200 font-medium leading-relaxed">
                  Changes to global deductions will be applied to the next payroll cycle. Authorization from the Board of Governors may be required.
                </p>
              </div>

              <Button className="w-full h-16 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-black text-lg shadow-2xl">
                Update Global Policies
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900">
            {activeTab === "overview" ? "Finance Overview" : activeTab === "fees" ? "Fee Management" : "Salary Management"}
          </h2>
          <p className="text-slate-500 font-medium">
            {activeTab === "overview" 
              ? "Real-time fiscal health and revenue analytics" 
              : activeTab === "fees" 
                ? "Comprehensive student fee lifecycle control" 
                : "Automated payroll and staff expenditure tracking"}
          </p>
        </div>
      </div>

      {activeTab === "overview" && renderOverview()}
      {activeTab === "fees" && renderFeeManagement()}
      {activeTab === "salaries" && renderSalaryManagement()}
    </div>
  );
};

// --- Academic Performance Analytics ---
export const AcademicAnalytics = ({ 
  userRole,
  students
}: { 
  userRole?: string;
  students: Student[];
}) => {
  const data = [
    { subject: 'Math', score: 85, average: 72 },
    { subject: 'Science', score: 92, average: 78 },
    { subject: 'English', score: 78, average: 82 },
    { subject: 'History', score: 88, average: 75 },
    { subject: 'Physics', score: 95, average: 70 },
    { subject: 'Arts', score: 82, average: 85 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Academic Analytics</h2>
          <p className="text-slate-500 font-medium">Performance benchmarking and growth tracking</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 rounded-[2rem] border-slate-200/60 shadow-sm p-8">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-xl font-black tracking-tight">Subject Performance Index</CardTitle>
          </CardHeader>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#94a3b8'}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="score" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={40} name="Current Score" />
                <Bar dataKey="average" fill="#e2e8f0" radius={[6, 6, 0, 0]} barSize={40} name="Class Average" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-[2rem] border-slate-200/60 shadow-sm p-6 bg-indigo-600 text-white">
            <h4 className="text-xs font-black uppercase tracking-widest text-indigo-200 mb-4">Top Performer</h4>
            {students.length > 0 ? (
              <>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl font-black">
                    {students[0].name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xl font-black">{students[0].name}</p>
                    <p className="text-indigo-200 font-medium">{students[0].grade}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-2xl p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-1">GPA</p>
                    <p className="text-2xl font-black">3.98</p>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-1">Rank</p>
                    <p className="text-2xl font-black">#1</p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-indigo-200 font-medium">No student data available</p>
            )}
          </Card>

          <Card className="rounded-[2rem] border-slate-200/60 shadow-sm p-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Growth Insights</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <p className="text-sm font-medium text-slate-600">Math scores improved by <span className="font-bold text-slate-900">15%</span> compared to last term.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                  <Filter className="w-4 h-4" />
                </div>
                <p className="text-sm font-medium text-slate-600">English requires attention in <span className="font-bold text-slate-900">34%</span> of students.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// --- Guardian Engagement Hub ---
export const GuardianEngagementHub = ({ userRole }: { userRole?: string }) => {
  const [selectedClass, setSelectedClass] = useState("Grade 10-A");
  const [students, setStudents] = useState([
    { id: 1, name: "Ahmad Hassan", grade: "Grade 10-A", examResults: { math: 85, science: 92, english: 78 }, checkedByParent: false },
    { id: 2, name: "Sara Khan", grade: "Grade 10-A", examResults: { math: 72, science: 68, english: 85 }, checkedByParent: true },
    { id: 3, name: "Zainab Ali", grade: "Grade 10-A", examResults: { math: 95, science: 88, english: 92 }, checkedByParent: false },
    { id: 4, name: "Bilal Ahmed", grade: "Grade 10-A", examResults: { math: 65, science: 70, english: 60 }, checkedByParent: false },
    { id: 5, name: "Fatima Noor", grade: "Grade 10-A", examResults: { math: 88, science: 85, english: 80 }, checkedByParent: true },
    { id: 6, name: "John Doe", grade: "Grade 10-B", examResults: { math: 80, science: 75, english: 70 }, checkedByParent: false },
  ]);

  const filteredStudents = students.filter(s => s.grade === selectedClass);

  const markAsChecked = (id: number) => {
    setStudents(students.map(s => s.id === id ? { ...s, checkedByParent: true } : s));
  };

  const generatePDF = (customTitle: string, customBody: any[][], customHead: string[][]) => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
    
    doc.setFontSize(20);
    doc.setTextColor(79, 70, 229);
    doc.text(customTitle, 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${date}`, 14, 30);

    autoTable(doc, {
      startY: 40,
      head: customHead,
      body: customBody,
      headStyles: { fillColor: [79, 70, 229] }
    });

    doc.save(`${customTitle}_${date}.pdf`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Guardian Engagement Hub</h2>
          <p className="text-slate-500 font-medium">View and verify your child's academic progress</p>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Select Class</label>
          <select 
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="h-12 px-6 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold w-48 appearance-none cursor-pointer hover:bg-slate-100 transition-colors"
          >
            <option value="Grade 10-A">Grade 10-A</option>
            <option value="Grade 10-B">Grade 10-B</option>
            <option value="Grade 11-A">Grade 11-A</option>
            <option value="Grade 11-B">Grade 11-B</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredStudents.map(student => (
          <Card key={student.id} className="rounded-[2.5rem] border-slate-200/60 shadow-sm overflow-hidden group hover:border-indigo-300 transition-all">
            <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center text-3xl font-black text-indigo-600 shadow-inner">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">{student.name}</h3>
                  <p className="text-slate-500 font-medium">{student.grade} • Roll #00{student.id}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {student.checkedByParent ? (
                      <Badge className="bg-emerald-100 text-emerald-700 rounded-full px-3 py-1 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Checked by Parent
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-700 rounded-full px-3 py-1 font-bold">
                        Pending Review
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 min-w-[100px] text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Math</p>
                  <p className="text-xl font-black text-slate-900">{student.examResults.math}%</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 min-w-[100px] text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Science</p>
                  <p className="text-xl font-black text-slate-900">{student.examResults.science}%</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 min-w-[100px] text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">English</p>
                  <p className="text-xl font-black text-slate-900">{student.examResults.english}%</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={() => generatePDF(`Report_Card_${student.name}`, [[student.name, student.examResults.math.toString(), student.examResults.science.toString(), student.examResults.english.toString()]], [['Student', 'Math', 'Science', 'English']])}
                  variant="outline" 
                  className="rounded-xl font-bold border-slate-200 hover:bg-slate-50 gap-2 h-12"
                >
                  <Download className="w-4 h-4" /> Download
                </Button>
                {!student.checkedByParent && (
                  <Button 
                    onClick={() => markAsChecked(student.id)}
                    className="bg-indigo-600 hover:bg-indigo-700 rounded-xl font-black gap-2 h-12 shadow-lg shadow-indigo-100"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Mark Checked
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
        {filteredStudents.length === 0 && (
          <Card className="p-12 text-center rounded-[2.5rem] border-dashed border-2 border-slate-200">
            <UserRound className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No students found in this class.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

// --- Student Management Portal ---
export const StudentManagementPortal = ({ 
  userRole, 
  userEmail,
  students,
  setStudents
}: { 
  userRole?: string; 
  userEmail?: string;
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}) => {
  const [activeTab, setActiveTab] = useState<"directory" | "admission" | "promotion" | "withdrawal">("directory");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isHeadmaster, setIsHeadmaster] = useState(userRole === "Headmaster");
  const [promotionClass, setPromotionClass] = useState("Grade 10-A");
  const [isPromoting, setIsPromoting] = useState(false);
  const [isDegrading, setIsDegrading] = useState(false);
  const [verificationStep, setVerificationStep] = useState<"none" | "sending" | "pending" | "verified">("none");
  const [verificationCode, setVerificationCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [isVerifiedForDegrade, setIsVerifiedForDegrade] = useState(false);
  const [showDegradeOption, setShowDegradeOption] = useState(false);

  // Withdrawal States
  const [withdrawalSearch, setWithdrawalSearch] = useState("");
  const [selectedWithdrawalId, setSelectedWithdrawalId] = useState<number | null>(null);
  const [withdrawalReason, setWithdrawalReason] = useState("Transfer to Other School");
  const [withdrawalDate, setWithdrawalDate] = useState(new Date().toISOString().split('T')[0]);
  const [withdrawalRemarks, setWithdrawalRemarks] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawalStep, setWithdrawalStep] = useState<"search" | "details" | "verification" | "success">("search");
  const [withdrawnStudents, setWithdrawnStudents] = useState([
    { id: 901, name: "Hamza Malik", grade: "Grade 10-A", reason: "Transfer", date: "2026-03-15" },
    { id: 902, name: "Ayesha Bibi", grade: "Grade 9-B", reason: "Relocation", date: "2026-03-20" },
  ]);

  const [admissionData, setAdmissionData] = useState({
    name: "",
    fatherName: "",
    dob: "",
    gender: "Male",
    grade: "Grade 10-A",
    contact: "",
    address: "",
    guardianName: "",
    guardianContact: "",
    previousSchool: ""
  });

  // Sync isHeadmaster with userRole prop
  React.useEffect(() => {
    setIsHeadmaster(userRole === "Headmaster");
  }, [userRole]);

  const sendVerificationCode = async () => {
    setVerificationStep("sending");
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(code);
    
    try {
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail || "headmaster@school.edu",
          otp: code,
          action: `Degrade ${promotionClass}`
        })
      });

      const data = await response.json();

      if (response.ok) {
        setVerificationStep("pending");
        if (data.demoMode) {
          console.log(`[DEMO MODE] Verification code: ${code}`);
          // We can optionally show a small toast or message here
        }
      } else {
        setVerificationStep("none");
        console.error("Failed to send OTP:", data.error);
        // We could add a toast or error state here
      }
    } catch (error) {
      setVerificationStep("none");
      console.error("Error calling OTP API:", error);
    }
  };

  const handleVerify = () => {
    if (inputCode === verificationCode) {
      setVerificationStep("verified");
      setIsVerifiedForDegrade(true);
    } else {
      // Use a custom UI alert instead of window.alert
      setInputCode("");
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesClass = selectedClass === "All Classes" || s.grade === selectedClass;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         s.fatherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         s.id.toString().includes(searchQuery);
    return matchesClass && matchesSearch;
  });

  const handleAdmission = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const newStudentEntry: Student = {
        id: Date.now(),
        rollNo: `${admissionData.grade.split(' ')[1]}-${Math.floor(100 + Math.random() * 900)}`,
        name: admissionData.name,
        fatherName: admissionData.fatherName,
        grade: admissionData.grade,
        dob: admissionData.dob,
        gender: admissionData.gender,
        contact: admissionData.contact,
        address: admissionData.address,
        status: "Active",
        admissionDate: new Date().toISOString().split('T')[0],
        examResults: { math: 0, science: 0, english: 0 },
        attendanceStatus: "present",
        attendanceTime: "-"
      };
      setStudents([...students, newStudentEntry]);
      setIsSubmitting(false);
      setShowSuccess(true);
      setAdmissionData({
        name: "",
        fatherName: "",
        dob: "",
        gender: "Male",
        grade: "Grade 10-A",
        contact: "",
        address: "",
        guardianName: "",
        guardianContact: "",
        previousSchool: ""
      });
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const renderDirectory = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-wrap gap-6 items-end bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Filter by Class</label>
          <select 
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold w-64 appearance-none cursor-pointer hover:bg-slate-100 transition-colors"
          >
            <option value="All Classes">All Classes</option>
            <option value="Grade 10-A">Grade 10-A</option>
            <option value="Grade 10-B">Grade 10-B</option>
            <option value="Grade 11-A">Grade 11-A</option>
            <option value="Grade 11-B">Grade 11-B</option>
          </select>
        </div>
        
        <div className="space-y-2 flex-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Search Directory</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Name, Father Name or ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-14 pl-12 pr-6 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold w-full hover:bg-slate-100 transition-colors"
            />
          </div>
        </div>
      </div>

      <Card className="rounded-[2.5rem] border-slate-200/60 shadow-sm overflow-hidden">
        <div className="p-0">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/30">
                <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">ID</th>
                <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Student Info</th>
                <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Grade</th>
                <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Contact</th>
                <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map(student => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6 font-medium text-slate-400">#00{student.id}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-lg">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-900">{student.name}</p>
                        <p className="text-xs text-slate-500 font-medium">S/O {student.fatherName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <Badge variant="outline" className="rounded-full bg-slate-50 text-slate-600 border-slate-200 font-bold">
                      {student.grade}
                    </Badge>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <Phone className="w-3 h-3" /> {student.contact}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
                        <MapPin className="w-3 h-3" /> {student.address.split(',')[0]}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <Badge className="bg-emerald-100 text-emerald-700 rounded-full px-3 py-1 font-bold">
                      {student.status}
                    </Badge>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50">
                        <FileUser className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
                        <IdCard className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
                        <Printer className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderPromotion = () => {
    if (!isHeadmaster) {
      return (
        <div className="flex flex-col items-center justify-center py-32 text-center space-y-8 bg-white rounded-[3rem] border border-slate-200/60 shadow-sm animate-in fade-in duration-500">
          <div className="w-24 h-24 bg-rose-50 rounded-[2.5rem] flex items-center justify-center shadow-inner">
            <ShieldAlert className="w-12 h-12 text-rose-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-black text-slate-900">Restricted Access</h3>
            <p className="text-slate-500 font-medium max-w-md mx-auto">
              Promotion operations are critical and restricted to the <span className="text-indigo-600 font-bold">Headmaster</span> only. Please verify your credentials to proceed.
            </p>
          </div>
          <Button 
            onClick={() => setIsHeadmaster(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black px-10 h-16 shadow-xl gap-3"
          >
            <Lock className="w-5 h-5" /> Verify Headmaster Access
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-8 animate-in zoom-in-95 duration-500">
        <div className="flex items-center justify-between bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -mr-32 -mt-32" />
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
              <Unlock className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tight">Headmaster Promotion Console</h3>
              <p className="text-indigo-100 font-medium opacity-80">Authorized access active. Exercise caution with bulk operations.</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setIsHeadmaster(false)}
            className="bg-white/10 border-white/20 hover:bg-white/20 text-white rounded-xl font-bold relative z-10"
          >
            Lock Console
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Single Class Promotion */}
          <Card className="p-10 rounded-[3rem] border-slate-200/60 shadow-sm bg-white space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center">
                <ArrowUpCircle className="w-7 h-7 text-indigo-600" />
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900">Promote Single Class</h4>
                <p className="text-slate-500 text-sm font-medium">Advance one specific section</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Select Class to Promote</label>
                <select 
                  value={promotionClass}
                  onChange={(e) => setPromotionClass(e.target.value)}
                  className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold appearance-none cursor-pointer"
                >
                  <option value="Grade 10-A">Grade 10-A</option>
                  <option value="Grade 10-B">Grade 10-B</option>
                  <option value="Grade 11-A">Grade 11-A</option>
                  <option value="Grade 11-B">Grade 11-B</option>
                </select>
              </div>
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 font-medium leading-relaxed">
                  This will move all students in <span className="font-bold">{promotionClass}</span> to the next academic level. This action can be reversed via security protocol.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Button 
                disabled={isPromoting || isDegrading}
                onClick={() => {
                  setIsPromoting(true);
                  setTimeout(() => {
                    setIsPromoting(false);
                    setShowSuccess(true);
                    setShowDegradeOption(true);
                    setTimeout(() => setShowSuccess(false), 3000);
                  }, 2000);
                }}
                className="w-full h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-black text-lg shadow-xl shadow-indigo-100 gap-3"
              >
                {isPromoting ? <Loader2 className="w-6 h-6 animate-spin" /> : <ArrowUpCircle className="w-6 h-6" />}
                {isPromoting ? "Promoting..." : `Promote ${promotionClass}`}
              </Button>

              {showDegradeOption && (
                <div className="space-y-4 pt-4 border-t border-slate-100 animate-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-black text-slate-900">Security Protocol Required</h5>
                    {!isVerifiedForDegrade && verificationStep === "none" && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={sendVerificationCode}
                        className="text-indigo-600 font-bold hover:bg-indigo-50"
                      >
                        Request Undo Code
                      </Button>
                    )}
                  </div>

                  {verificationStep === "sending" && (
                    <div className="flex items-center gap-2 text-slate-400 font-medium text-xs">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Sending code to {userEmail || 'headmaster@school.edu'}...
                    </div>
                  )}

                  {verificationStep === "pending" && (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-500 font-medium flex items-center justify-between">
                        <span>Enter the 6-digit code sent to your official email:</span>
                        <span className="text-[10px] text-indigo-400 font-black uppercase tracking-tighter">(Check console for Demo Code)</span>
                      </p>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          maxLength={6}
                          placeholder="000000"
                          value={inputCode}
                          onChange={(e) => setInputCode(e.target.value)}
                          className="flex-1 h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-bold text-center tracking-[0.5em]"
                        />
                        <Button 
                          onClick={handleVerify}
                          className="h-12 px-6 rounded-xl bg-slate-900 text-white font-bold"
                        >
                          Verify
                        </Button>
                      </div>
                    </div>
                  )}

                  {isVerifiedForDegrade && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                        <ShieldCheck className="w-4 h-4" />
                        Identity Verified. Undo option activated.
                      </div>
                      <Button 
                        disabled={isDegrading}
                        onClick={() => {
                          setIsDegrading(true);
                          setTimeout(() => {
                            setIsDegrading(false);
                            setShowDegradeOption(false);
                            setIsVerifiedForDegrade(false);
                            setVerificationStep("none");
                            setInputCode("");
                          }, 2000);
                        }}
                        className="w-full h-16 rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 font-black text-lg gap-3"
                      >
                        {isDegrading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ArrowDownCircle className="w-6 h-6" />}
                        {isDegrading ? "Degrading..." : `Degrade ${promotionClass}`}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Global Promotion */}
          <Card className="p-10 rounded-[3rem] border-slate-200/60 shadow-sm bg-slate-900 text-white space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 blur-3xl rounded-full" />
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                <Layers className="w-7 h-7 text-indigo-400" />
              </div>
              <div>
                <h4 className="text-xl font-black">Global Promotion</h4>
                <p className="text-slate-400 text-sm font-medium">Promote all classes simultaneously</p>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <p className="text-slate-300 text-sm font-medium leading-relaxed">
                The Global Promotion Engine advances the entire institution's academic standing. All active grades will be incremented, and graduating classes will be moved to the Alumni Archive.
              </p>
              <div className="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/20 flex gap-3">
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <p className="text-xs text-rose-200 font-medium leading-relaxed">
                  CRITICAL: This operation affects <span className="font-bold">all active students</span>.
                </p>
              </div>
            </div>

            <Button 
              disabled={isPromoting}
              onClick={() => {
                setIsPromoting(true);
                setTimeout(() => {
                  setIsPromoting(false);
                  setShowSuccess(true);
                  setTimeout(() => setShowSuccess(false), 3000);
                }, 3000);
              }}
              className="w-full h-16 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-black text-lg shadow-2xl gap-3 relative z-10"
            >
              {isPromoting ? <Loader2 className="w-6 h-6 animate-spin text-slate-900" /> : <Layers className="w-6 h-6 text-indigo-600" />}
              {isPromoting ? "Executing Global Shift..." : "Promote All Classes"}
            </Button>
          </Card>
        </div>
      </div>
    );
  };

  const renderWithdrawal = () => {
    const selectedStudent = students.find(s => s.id === selectedWithdrawalId);

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Process */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 rounded-[3rem] border-slate-200/60 shadow-sm bg-white overflow-hidden relative">
              {withdrawalStep === "search" && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center">
                      <UserMinus className="w-7 h-7 text-rose-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">Initiate Withdrawal</h3>
                      <p className="text-slate-500 font-medium">Search for a student to begin the exit process</p>
                    </div>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text"
                      placeholder="Search by name, roll number or ID..."
                      value={withdrawalSearch}
                      onChange={(e) => setWithdrawalSearch(e.target.value)}
                      className="w-full h-16 pl-16 pr-6 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500 font-bold text-lg"
                    />
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Search Results</p>
                    <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {students
                        .filter(s => s.name.toLowerCase().includes(withdrawalSearch.toLowerCase()) || s.id.toString().includes(withdrawalSearch))
                        .map(student => (
                          <button
                            key={student.id}
                            onClick={() => {
                              setSelectedWithdrawalId(student.id);
                              setWithdrawalStep("details");
                            }}
                            className="flex items-center justify-between p-5 rounded-2xl bg-white border border-slate-100 hover:border-rose-200 hover:bg-rose-50/30 transition-all group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-500 group-hover:bg-rose-100 group-hover:text-rose-600 transition-colors">
                                {student.name.charAt(0)}
                              </div>
                              <div className="text-left">
                                <p className="font-black text-slate-900">{student.name}</p>
                                <p className="text-xs text-slate-500 font-medium">{student.grade} • ID: {student.id}</p>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {withdrawalStep === "details" && selectedStudent && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center">
                        <FileText className="w-7 h-7 text-rose-600" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-slate-900">Withdrawal Details</h3>
                        <p className="text-slate-500 font-medium">Processing exit for {selectedStudent.name}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      onClick={() => setWithdrawalStep("search")}
                      className="text-slate-400 hover:text-slate-900 font-bold"
                    >
                      Change Student
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Reason for Withdrawal</label>
                      <select 
                        value={withdrawalReason}
                        onChange={(e) => setWithdrawalReason(e.target.value)}
                        className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500 font-bold appearance-none cursor-pointer"
                      >
                        <option>Transfer to Other School</option>
                        <option>Relocation / Moving City</option>
                        <option>Completion of Studies</option>
                        <option>Financial Reasons</option>
                        <option>Drop Out</option>
                        <option>Medical Grounds</option>
                        <option>Disciplinary Action</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Withdrawal Date</label>
                      <input 
                        type="date"
                        value={withdrawalDate}
                        onChange={(e) => setWithdrawalDate(e.target.value)}
                        className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500 font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Administrative Remarks</label>
                    <textarea 
                      rows={3}
                      value={withdrawalRemarks}
                      onChange={(e) => setWithdrawalRemarks(e.target.value)}
                      placeholder="Enter details about the withdrawal decision..."
                      className="w-full p-6 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500 font-bold resize-none"
                    />
                  </div>

                  <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 space-y-4">
                    <div className="flex items-center gap-2 text-amber-700 font-black text-sm">
                      <ShieldCheck className="w-5 h-5" />
                      Clearance Checklist
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { label: "Accounts", status: "Cleared", color: "text-emerald-600" },
                        { label: "Library", status: "Cleared", color: "text-emerald-600" },
                        { label: "Lab/Assets", status: "Cleared", color: "text-emerald-600" },
                      ].map((item, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-xl border border-amber-200/50 flex flex-col items-center text-center">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                          <p className={`text-sm font-black ${item.color}`}>{item.status}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={() => {
                      if (isHeadmaster) {
                        setWithdrawalStep("verification");
                      } else {
                        alert("Only Headmaster can authorize withdrawals.");
                      }
                    }}
                    className="w-full h-16 rounded-2xl bg-rose-600 hover:bg-rose-700 font-black text-lg shadow-xl shadow-rose-100 gap-3"
                  >
                    <ShieldAlert className="w-6 h-6" />
                    Authorize Withdrawal
                  </Button>
                </div>
              )}

              {withdrawalStep === "verification" && (
                <div className="space-y-8 py-10">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center">
                      <Lock className="w-10 h-10 text-indigo-600" />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900">Security Protocol</h3>
                    <p className="text-slate-500 font-medium max-w-sm">
                      Withdrawal is a critical action. Please verify your identity to proceed with the removal of <strong>{selectedStudent?.name}</strong>.
                    </p>
                  </div>

                  <div className="max-w-md mx-auto space-y-6">
                    {verificationStep === "none" && (
                      <Button 
                        onClick={sendVerificationCode}
                        className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-black text-lg shadow-xl shadow-indigo-100 gap-3"
                      >
                        <Mail className="w-5 h-5" />
                        Request Withdrawal Code
                      </Button>
                    )}

                    {verificationStep === "sending" && (
                      <div className="flex flex-col items-center gap-4 py-4">
                        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                        <p className="text-sm font-bold text-slate-500">Dispatching secure code to {userEmail}...</p>
                      </div>
                    )}

                    {verificationStep === "pending" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <p className="text-xs text-slate-500 font-medium flex items-center justify-between">
                            <span>Enter the 6-digit code:</span>
                            <span className="text-[10px] text-indigo-400 font-black uppercase tracking-tighter">(Check console for Demo Code)</span>
                          </p>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              maxLength={6}
                              value={inputCode}
                              onChange={(e) => setInputCode(e.target.value)}
                              placeholder="000000"
                              className="flex-1 h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-black text-center text-2xl tracking-[0.5em]"
                            />
                            <Button 
                              onClick={handleVerify}
                              className="h-14 px-8 rounded-2xl bg-slate-900 text-white font-black"
                            >
                              Verify
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {isVerifiedForDegrade && (
                      <div className="space-y-6 animate-in zoom-in-95 duration-300">
                        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3 text-emerald-700 font-bold text-sm">
                          <ShieldCheck className="w-5 h-5" />
                          Identity Verified. Authorization Granted.
                        </div>
                        <Button 
                          disabled={isWithdrawing}
                          onClick={() => {
                            setIsWithdrawing(true);
                            setTimeout(() => {
                              if (selectedStudent) {
                                setWithdrawnStudents([
                                  {
                                    id: selectedStudent.id,
                                    name: selectedStudent.name,
                                    grade: selectedStudent.grade,
                                    reason: withdrawalReason,
                                    date: withdrawalDate
                                  },
                                  ...withdrawnStudents
                                ]);
                                setStudents(students.filter(s => s.id !== selectedStudent.id));
                              }
                              setIsWithdrawing(false);
                              setWithdrawalStep("success");
                            }, 2000);
                          }}
                          className="w-full h-16 rounded-2xl bg-rose-600 hover:bg-rose-700 font-black text-lg shadow-xl shadow-rose-100 gap-3"
                        >
                          {isWithdrawing ? <Loader2 className="w-6 h-6 animate-spin" /> : <UserMinus className="w-6 h-6" />}
                          {isWithdrawing ? "Finalizing..." : "Confirm Final Withdrawal"}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {withdrawalStep === "success" && (
                <div className="py-20 flex flex-col items-center text-center space-y-8 animate-in zoom-in-95 duration-500">
                  <div className="w-24 h-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center relative">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-900">Withdrawal Complete</h3>
                    <p className="text-slate-500 font-medium max-w-sm mx-auto mt-2">
                      The student has been successfully withdrawn and records have been archived.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <Button 
                      onClick={() => {
                        setWithdrawalStep("search");
                        setSelectedWithdrawalId(null);
                        setIsVerifiedForDegrade(false);
                        setVerificationStep("none");
                        setInputCode("");
                      }}
                      variant="outline"
                      className="h-14 px-8 rounded-2xl font-bold border-slate-200"
                    >
                      Process Another
                    </Button>
                    <Button 
                      className="h-14 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-black gap-2"
                    >
                      <Printer className="w-5 h-5" />
                      Print SLC
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column: History & Stats */}
          <div className="space-y-6">
            <Card className="p-8 rounded-[2.5rem] border-slate-200/60 shadow-sm bg-white">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-black text-slate-900">Recent Withdrawals</h4>
                <Badge className="bg-rose-50 text-rose-600 border-rose-100 font-black">Archive</Badge>
              </div>
              <div className="space-y-4">
                {withdrawnStudents.map((student) => (
                  <div key={student.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-slate-400 text-xs">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{student.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{student.reason}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-900">{student.date}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">{student.grade}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-6 text-indigo-600 font-black text-sm hover:bg-indigo-50 rounded-xl">
                View Full Archive
              </Button>
            </Card>

            <Card className="p-8 rounded-[2.5rem] border-slate-200/60 shadow-sm bg-indigo-600 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-2xl rounded-full -mr-16 -mt-16" />
              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <IdCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-black">SLC Generation</h4>
                  <p className="text-indigo-100 text-xs font-medium leading-relaxed">
                    School Leaving Certificates are automatically generated with secure QR verification for all withdrawn students.
                  </p>
                </div>
                <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50 font-black rounded-xl">
                  Configure Template
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  const renderAdmission = () => (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="rounded-[3rem] border-slate-200/60 shadow-xl overflow-hidden bg-white">
        <div className="bg-indigo-600 p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -mr-32 -mt-32" />
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-black tracking-tight">New Student Registration</h3>
          </div>
          <p className="text-indigo-100 font-medium opacity-80">Enter comprehensive details for the new academic admission.</p>
        </div>
        
        <form onSubmit={handleAdmission} className="p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
              <input required type="text" placeholder="Student's full name" className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Father's Name</label>
              <input required type="text" placeholder="Father's full name" className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Date of Birth</label>
              <input required type="date" className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Gender</label>
              <select className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold appearance-none cursor-pointer">
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Admission Grade</label>
              <select className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold appearance-none cursor-pointer">
                <option>Grade 10-A</option>
                <option>Grade 10-B</option>
                <option>Grade 11-A</option>
                <option>Grade 11-B</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Assign Roll Number</label>
              <input required type="text" placeholder="e.g. 101" className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Parent's Contact Number</label>
              <input required type="tel" placeholder="03xx-xxxxxxx" className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Student's Contact Number</label>
              <input type="tel" placeholder="03xx-xxxxxxx (Optional)" className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Residential Address</label>
            <textarea rows={3} placeholder="Complete home address..." className="w-full p-6 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold resize-none"></textarea>
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-black text-lg shadow-xl shadow-indigo-100 gap-3"
            >
              {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
              {isSubmitting ? "Processing..." : "Register Student"}
            </Button>
            <Button type="button" variant="outline" className="h-16 px-8 rounded-2xl font-bold border-slate-200">
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );

  return (
    <div className="space-y-8">
      {showSuccess && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-emerald-600 text-white px-8 py-4 rounded-[2rem] shadow-2xl shadow-emerald-100 flex items-center gap-3 font-black">
            <CheckCircle2 className="w-6 h-6" />
            Student Registered Successfully!
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900">Student Management</h2>
          <p className="text-slate-500 font-medium">Lifecycle tracking, admissions, and directory control</p>
        </div>
        <div className="flex p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          {[
            { id: "directory", label: "Directory", icon: Users },
            { id: "admission", label: "Admission", icon: UserPlus },
            { id: "promotion", label: "Promotion", icon: ArrowRightLeft },
            { id: "withdrawal", label: "Withdrawal", icon: UserMinus },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black transition-all ${
                activeTab === tab.id 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 rounded-[2rem] border-slate-200/60 shadow-sm bg-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Students</p>
              <p className="text-2xl font-black text-slate-900">{filteredStudents.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 rounded-[2rem] border-slate-200/60 shadow-sm bg-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Now</p>
              <p className="text-2xl font-black text-slate-900">
                {filteredStudents.length > 0 
                  ? `${Math.round((filteredStudents.filter(s => s.status === "Active").length / filteredStudents.length) * 100)}%` 
                  : "0%"}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-6 rounded-[2rem] border-slate-200/60 shadow-sm bg-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
              <Plus className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">New Admissions</p>
              <p className="text-2xl font-black text-slate-900">
                {filteredStudents.filter(s => s.admissionDate?.includes("2026")).length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-6 rounded-[2rem] border-slate-200/60 shadow-sm bg-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center">
              <UserMinus className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Withdrawn</p>
              <p className="text-2xl font-black text-slate-900">
                {withdrawnStudents.filter(s => selectedClass === "All Classes" || s.grade === selectedClass).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {activeTab === "directory" && renderDirectory()}
      {activeTab === "admission" && renderAdmission()}
      {activeTab === "promotion" && renderPromotion()}
      {activeTab === "withdrawal" && renderWithdrawal()}
    </div>
  );
};

// --- Teacher Management Portal ---
export const TeacherManagementPortal = ({ userRole }: { userRole?: string }) => {
  const [activeTab, setActiveTab] = useState<"list" | "add" | "classes">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [teachers, setTeachers] = useState([
    { 
      id: 1, 
      name: "Prof. Salman Ahmed", 
      email: "salman.ahmed@smartedu.com", 
      phone: "+92 300 1234567",
      subject: "Mathematics", 
      qualification: "M.Sc Mathematics",
      joiningDate: "2020-08-15",
      salary: 75000,
      status: "Active",
      assignedClasses: ["Grade 10-A", "Grade 9-B"]
    },
    { 
      id: 2, 
      name: "Ms. Ayesha Khan", 
      email: "ayesha.khan@smartedu.com", 
      phone: "+92 301 7654321",
      subject: "Physics", 
      qualification: "M.Phil Physics",
      joiningDate: "2021-03-10",
      salary: 68000,
      status: "Active",
      assignedClasses: ["Grade 11-A", "Grade 10-B"]
    },
    { 
      id: 3, 
      name: "Mr. Bilal Raza", 
      email: "bilal.raza@smartedu.com", 
      phone: "+92 321 9876543",
      subject: "Computer Science", 
      qualification: "BS Computer Science",
      joiningDate: "2022-01-05",
      salary: 62000,
      status: "On Leave",
      assignedClasses: ["Grade 9-A", "Grade 8-B"]
    },
    { 
      id: 4, 
      name: "Dr. Fatima Zahra", 
      email: "fatima.zahra@smartedu.com", 
      phone: "+92 333 4567890",
      subject: "Chemistry", 
      qualification: "Ph.D Chemistry",
      joiningDate: "2019-11-20",
      salary: 95000,
      status: "Active",
      assignedClasses: ["Grade 12-A", "Grade 11-B"]
    }
  ]);

  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    qualification: "",
    joiningDate: new Date().toISOString().split('T')[0],
    salary: 0,
  });

  const handleAddTeacher = () => {
    if (!newTeacher.name || !newTeacher.email) return;
    setIsSaving(true);
    setTimeout(() => {
      const teacherToAdd = {
        id: Date.now(),
        ...newTeacher,
        status: "Active",
        assignedClasses: []
      };
      setTeachers([...teachers, teacherToAdd]);
      setNewTeacher({
        name: "",
        email: "",
        phone: "",
        subject: "",
        qualification: "",
        joiningDate: new Date().toISOString().split('T')[0],
        salary: 0,
      });
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setActiveTab("list");
    }, 1000);
  };

  const removeTeacher = (id: number) => {
    if (confirm("Are you sure you want to remove this teacher from the system?")) {
      setTeachers(teachers.filter(t => t.id !== id));
    }
  };

  const updateTeacherClasses = (id: number, classes: string[]) => {
    setTeachers(teachers.map(t => t.id === id ? { ...t, assignedClasses: classes } : t));
  };

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderTeacherList = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm">
        <div className="relative w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name, subject or email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 pl-12 pr-6 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold hover:bg-slate-100 transition-colors"
          />
        </div>
        <div className="flex gap-4">
          <Button 
            onClick={() => setActiveTab("add")}
            className="bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-black gap-2 h-14 px-8 shadow-lg shadow-indigo-100"
          >
            <UserPlus className="w-5 h-5" /> Add New Teacher
          </Button>
          <Button 
            variant="outline" 
            className="rounded-2xl font-black gap-2 h-14 px-8 border-slate-200 hover:bg-slate-50"
          >
            <Download className="w-5 h-5" /> Export Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map(teacher => (
          <Card key={teacher.id} className="rounded-[2.5rem] border-slate-200/60 shadow-sm hover:shadow-xl transition-all group overflow-hidden">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-2xl shadow-inner">
                  {teacher.name.charAt(0)}
                </div>
                <Badge className={`rounded-full px-3 py-1 font-bold ${
                  teacher.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                }`}>
                  {teacher.status}
                </Badge>
              </div>
              
              <div className="space-y-1 mb-6">
                <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{teacher.name}</h3>
                <p className="text-sm font-bold text-indigo-600">{teacher.subject} Specialist</p>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-slate-500">
                  <Mail className="w-4 h-4" />
                  <span className="text-xs font-bold truncate">{teacher.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <Phone className="w-4 h-4" />
                  <span className="text-xs font-bold">{teacher.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <GraduationCap className="w-4 h-4" />
                  <span className="text-xs font-bold">{teacher.qualification}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Assigned Classes</p>
                  <div className="flex -space-x-2">
                    {teacher.assignedClasses.map((cls, idx) => (
                      <div key={idx} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-600" title={cls}>
                        {cls.split(' ')[1]}
                      </div>
                    ))}
                    {teacher.assignedClasses.length === 0 && <span className="text-xs font-bold text-slate-300 italic">None</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setActiveTab("classes")}
                    className="rounded-xl hover:bg-indigo-50 text-indigo-600"
                  >
                    <Layers className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeTeacher(teacher.id)}
                    className="rounded-xl hover:bg-rose-50 text-rose-500"
                  >
                    <UserMinus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAddTeacher = () => (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-10 rounded-[3rem] border border-slate-200/60 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/2 -z-10" />
        
        <div className="mb-10">
          <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-2">Onboard New Faculty</h2>
          <p className="text-slate-500 font-medium text-lg">Enter professional and personal details to register a new teacher.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="e.g. Salman Ahmed" 
                value={newTeacher.name}
                onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
                className="w-full h-14 pl-12 pr-6 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="email" 
                placeholder="teacher@smartedu.com" 
                value={newTeacher.email}
                onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})}
                className="w-full h-14 pl-12 pr-6 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="+92 3XX XXXXXXX" 
                value={newTeacher.phone}
                onChange={(e) => setNewTeacher({...newTeacher, phone: e.target.value})}
                className="w-full h-14 pl-12 pr-6 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Specialization/Subject</label>
            <div className="relative">
              <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="e.g. Mathematics" 
                value={newTeacher.subject}
                onChange={(e) => setNewTeacher({...newTeacher, subject: e.target.value})}
                className="w-full h-14 pl-12 pr-6 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Qualification</label>
            <div className="relative">
              <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="e.g. M.Sc Mathematics" 
                value={newTeacher.qualification}
                onChange={(e) => setNewTeacher({...newTeacher, qualification: e.target.value})}
                className="w-full h-14 pl-12 pr-6 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Joining Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="date" 
                value={newTeacher.joiningDate}
                onChange={(e) => setNewTeacher({...newTeacher, joiningDate: e.target.value})}
                className="w-full h-14 pl-12 pr-6 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Monthly Salary (PKR)</label>
            <div className="relative">
              <CircleDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="number" 
                placeholder="75000" 
                value={newTeacher.salary || ""}
                onChange={(e) => setNewTeacher({...newTeacher, salary: parseInt(e.target.value) || 0})}
                className="w-full h-14 pl-12 pr-6 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold" 
              />
            </div>
          </div>
        </div>

        <div className="mt-12 flex gap-4">
          <Button 
            onClick={handleAddTeacher}
            disabled={isSaving}
            className="flex-1 h-16 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-black text-xl shadow-2xl shadow-indigo-100 transition-all"
          >
            {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : "Complete Registration"}
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setActiveTab("list")}
            className="h-16 px-10 rounded-2xl font-black text-slate-500 hover:bg-slate-100"
          >
            Discard
          </Button>
        </div>
      </div>
    </div>
  );

  const renderManageClasses = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm">
        <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Class Assignments</h2>
        <p className="text-slate-500 font-medium">Allocate faculty resources to specific grades and sections.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {teachers.map(teacher => (
          <Card key={teacher.id} className="rounded-[2.5rem] border-slate-200/60 shadow-sm p-8">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex items-center gap-4 w-full md:w-1/3">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl">
                  {teacher.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-black text-slate-900">{teacher.name}</h4>
                  <p className="text-xs font-bold text-slate-400">{teacher.subject} Specialist</p>
                </div>
              </div>

              <div className="flex-1 w-full">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Assigned Classes</p>
                <div className="flex flex-wrap gap-2">
                  {["Grade 8-A", "Grade 8-B", "Grade 9-A", "Grade 9-B", "Grade 10-A", "Grade 10-B", "Grade 11-A", "Grade 11-B", "Grade 12-A", "Grade 12-B"].map(cls => (
                    <button
                      key={cls}
                      onClick={() => {
                        const isAssigned = teacher.assignedClasses.includes(cls);
                        const newClasses = isAssigned 
                          ? teacher.assignedClasses.filter(c => c !== cls)
                          : [...teacher.assignedClasses, cls];
                        updateTeacherClasses(teacher.id, newClasses);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                        teacher.assignedClasses.includes(cls)
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                          : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                      }`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {saveSuccess && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-xl shadow-emerald-100 flex items-center gap-3 font-black">
            <CheckCircle2 className="w-5 h-5" />
            Teacher Registered Successfully!
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab("list")}
            className={`px-6 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${
              activeTab === "list" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Users className="w-4 h-4" /> Faculty Directory
          </button>
          <button 
            onClick={() => setActiveTab("add")}
            className={`px-6 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${
              activeTab === "add" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <UserPlus className="w-4 h-4" /> Onboard Teacher
          </button>
          <button 
            onClick={() => setActiveTab("classes")}
            className={`px-6 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${
              activeTab === "classes" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Layers className="w-4 h-4" /> Manage Assignments
          </button>
        </div>
      </div>

      {activeTab === "list" && renderTeacherList()}
      {activeTab === "add" && renderAddTeacher()}
      {activeTab === "classes" && renderManageClasses()}
    </div>
  );
};

// --- Examination & Assessment Center ---
export const ExaminationAssessmentCenter = ({ 
  userRole,
  students,
  setStudents
}: { 
  userRole?: string;
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}) => {
  const [examSubTab, setExamSubTab] = useState<"enter" | "view">("view");
  const [selectedTerm, setSelectedTerm] = useState("First Term");
  const [isProcessingExamBulk, setIsProcessingExamBulk] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedClass, setSelectedClass] = useState("Grade 10-A");
  const [examSearchQuery, setExamSearchQuery] = useState("");
  const manualEntryRef = useRef<HTMLDivElement>(null);

  const generatePDF = (customTitle?: string, customBody?: any[][], customHead?: string[][]) => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
    
    doc.setFontSize(20);
    doc.setTextColor(79, 70, 229);
    doc.text(customTitle || "Examination Report", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${date}`, 14, 30);

    if (customBody && customHead) {
      autoTable(doc, {
        startY: 40,
        head: customHead,
        body: customBody,
        headStyles: { fillColor: [79, 70, 229] }
      });
    }

    doc.save(`${customTitle || "Report"}_${date}.pdf`);
  };

  const handleExamBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingExamBulk(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(",")[1];
        
        const prompt = `
          Extract exam results from this document. 
          Return a JSON array of objects with these fields:
          - rollNo (number)
          - name (string)
          - math (number)
          - science (number)
          - english (number)
          Format: [{"rollNo": 1, "name": "John", "math": 80, "science": 75, "english": 70}]
        `;

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [
            {
              parts: [
                { text: prompt },
                { inlineData: { data: base64Data, mimeType: file.type } }
              ]
            }
          ],
          config: { responseMimeType: "application/json" }
        });

        const text = response.text;
        const jsonMatch = text.match(/\[.*\]/s);
        if (jsonMatch) {
          const extractedData = JSON.parse(jsonMatch[0]);
          const updatedStudents = students.map(student => {
            const extracted = extractedData.find((d: any) => d.rollNo === student.id || d.name.toLowerCase() === student.name.toLowerCase());
            if (extracted) {
              return {
                ...student,
                examResults: {
                  math: extracted.math || student.examResults.math,
                  science: extracted.science || student.examResults.science,
                  english: extracted.english || student.examResults.english
                }
              };
            }
            return student;
          });
          setStudents(updatedStudents);
        }
        setIsProcessingExamBulk(false);
      };
    } catch (error) {
      console.error("Error processing exam bulk upload:", error);
      setIsProcessingExamBulk(false);
    }
  };

  const saveExamResults = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1500);
  };

  const startManualEntry = () => {
    manualEntryRef.current?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      const firstInput = manualEntryRef.current?.querySelector('input[type="number"]') as HTMLInputElement;
      firstInput?.focus();
    }, 500);
  };

  const searchedStudents = students.filter(s => {
    const matchesClass = s.grade === selectedClass;
    const matchesSearch = s.name.toLowerCase().includes(examSearchQuery.toLowerCase()) || 
                         s.id.toString().includes(examSearchQuery) ||
                         (s.fatherName && s.fatherName.toLowerCase().includes(examSearchQuery.toLowerCase()));
    return matchesClass && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900">Examination & Assessment Center</h2>
          <p className="text-slate-500 font-medium text-lg">Centralized academic evaluation and performance tracking</p>
        </div>
        <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl">
          <button 
            onClick={() => setExamSubTab("view")}
            className={`px-6 py-3 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${examSubTab === "view" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
          >
            <BarChart3 className="w-4 h-4" /> View Results
          </button>
          <button 
            onClick={() => setExamSubTab("enter")}
            className={`px-6 py-3 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${examSubTab === "enter" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
          >
            <Plus className="w-4 h-4" /> Enter Results
          </button>
        </div>
      </div>

      {examSubTab === "view" ? (
        <>
          {saveSuccess && (
            <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-xl shadow-emerald-100 flex items-center gap-3 font-black">
                <CheckCircle2 className="w-5 h-5" />
                Results Saved Successfully!
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-6 items-end bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Select Class</label>
              <select 
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold w-64 appearance-none cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <option value="Grade 10-A">Grade 10-A</option>
                <option value="Grade 10-B">Grade 10-B</option>
                <option value="Grade 11-A">Grade 11-A</option>
                <option value="Grade 11-B">Grade 11-B</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Select Term</label>
              <select 
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold w-64 appearance-none cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <option value="First Term">First Term</option>
                <option value="Second Term/Mid Term">Second Term/Mid Term</option>
                <option value="Final Term">Final Term</option>
              </select>
            </div>
            
            <div className="space-y-2 flex-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Search Student</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search by Name, Roll Number or Father Name..." 
                  value={examSearchQuery}
                  onChange={(e) => setExamSearchQuery(e.target.value)}
                  className="h-14 pl-12 pr-6 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold w-full hover:bg-slate-100 transition-colors"
                />
              </div>
            </div>
          </div>

          <Card className="rounded-[2.5rem] border-slate-200/60 shadow-sm overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-black tracking-tight flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
                {selectedTerm} Results - {selectedClass}
              </CardTitle>
              <Button 
                onClick={() => generatePDF(`${selectedTerm}_Results_${selectedClass}`, searchedStudents.map(s => [s.id.toString(), s.name, s.fatherName || "N/A", s.examResults.math.toString(), s.examResults.science.toString(), s.examResults.english.toString()]), [['R.No', 'Student', 'Father Name', 'Math', 'Science', 'English']])}
                className="bg-indigo-600 hover:bg-indigo-700 rounded-xl font-black gap-2 shadow-lg shadow-indigo-100"
              >
                <Download className="w-4 h-4" /> Download Report
              </Button>
            </CardHeader>
            <div className="p-0">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/30">
                    <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">R.No</th>
                    <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Student</th>
                    <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Father Name</th>
                    <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Math</th>
                    <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Sci</th>
                    <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Eng</th>
                    <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {searchedStudents.map(student => (
                    <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-4 font-medium text-slate-400">#00{student.id}</td>
                      <td className="px-8 py-4 font-bold text-slate-900">{student.name}</td>
                      <td className="px-8 py-4 font-medium text-slate-500">{student.fatherName || "N/A"}</td>
                      <td className="px-8 py-4 text-center font-bold text-indigo-600">{student.examResults.math}</td>
                      <td className="px-8 py-4 text-center font-bold text-indigo-600">{student.examResults.science}</td>
                      <td className="px-8 py-4 text-center font-bold text-indigo-600">{student.examResults.english}</td>
                      <td className="px-8 py-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => generatePDF(`Result_${student.name}`, [[student.id.toString(), student.name, student.fatherName || "N/A", student.examResults.math.toString(), student.examResults.science.toString(), student.examResults.english.toString()]], [['R.No', 'Student', 'Father Name', 'Math', 'Science', 'English']])}
                          className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card 
              onClick={startManualEntry}
              className="p-8 rounded-[2.5rem] border-slate-200/60 shadow-sm bg-white flex flex-col items-center text-center space-y-4 cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all group"
            >
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                <Plus className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Manual Entry</h3>
                <p className="text-slate-500 text-sm font-medium">Enter results student by student</p>
              </div>
              <Badge className="bg-slate-100 text-slate-600 rounded-full px-4 py-1 font-bold">Click to Start</Badge>
            </Card>

            <Card className="p-8 rounded-[2.5rem] border-indigo-200 shadow-sm bg-indigo-50/30 flex flex-col items-center text-center space-y-4 relative overflow-hidden group">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                {isProcessingExamBulk ? <Loader2 className="w-8 h-8 text-white animate-spin" /> : <Upload className="w-8 h-8 text-white" />}
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Bulk Upload</h3>
                <p className="text-slate-500 text-sm font-medium">Upload Excel, Image or PDF results</p>
              </div>
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={handleExamBulkUpload}
                accept=".xlsx,.xls,.pdf,image/*"
              />
              <Badge className="bg-indigo-600 text-white rounded-full px-4 py-1 font-bold">AI Powered</Badge>
            </Card>

            <Card className="p-8 rounded-[2.5rem] border-slate-200/60 shadow-sm bg-white flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center">
                {isSaving ? <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" /> : <Save className="w-8 h-8 text-emerald-600" />}
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Finalize Data</h3>
                <p className="text-slate-500 text-sm font-medium">Save all changes to database</p>
              </div>
              <Button 
                onClick={saveExamResults} 
                disabled={isSaving}
                className="bg-emerald-600 hover:bg-emerald-700 rounded-xl font-black w-full gap-2"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isSaving ? "Saving..." : "Save Data"}
              </Button>
            </Card>
          </div>

          <Card ref={manualEntryRef} id="manual-entry-table" className="rounded-[2.5rem] border-slate-200/60 shadow-sm overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-black tracking-tight flex items-center gap-3">
                <ClipboardCheck className="w-6 h-6 text-indigo-600" />
                Enter Results - {selectedClass}
              </CardTitle>
              <div className="flex gap-4">
                <select 
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="h-10 px-4 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-bold appearance-none cursor-pointer"
                >
                  <option value="Grade 10-A">Grade 10-A</option>
                  <option value="Grade 10-B">Grade 10-B</option>
                  <option value="Grade 11-A">Grade 11-A</option>
                  <option value="Grade 11-B">Grade 11-B</option>
                </select>
              </div>
            </CardHeader>
            <div className="p-0">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/30">
                    <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">R.No</th>
                    <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Student</th>
                    <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Math</th>
                    <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Science</th>
                    <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">English</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {searchedStudents.map(student => (
                    <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-4 font-medium text-slate-400">#00{student.id}</td>
                      <td className="px-8 py-4 font-bold text-slate-900">{student.name}</td>
                      <td className="px-8 py-4">
                        <input 
                          type="number" 
                          value={student.examResults.math}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setStudents(students.map(s => s.id === student.id ? { ...s, examResults: { ...s.examResults, math: val } } : s));
                          }}
                          className="w-20 h-10 mx-auto block text-center rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-bold"
                        />
                      </td>
                      <td className="px-8 py-4">
                        <input 
                          type="number" 
                          value={student.examResults.science}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setStudents(students.map(s => s.id === student.id ? { ...s, examResults: { ...s.examResults, science: val } } : s));
                          }}
                          className="w-20 h-10 mx-auto block text-center rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-bold"
                        />
                      </td>
                      <td className="px-8 py-4">
                        <input 
                          type="number" 
                          value={student.examResults.english}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setStudents(students.map(s => s.id === student.id ? { ...s, examResults: { ...s.examResults, english: val } } : s));
                          }}
                          className="w-20 h-10 mx-auto block text-center rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-bold"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

// --- Placeholder for other modules ---
export const ModulePlaceholder = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
    <div className="w-24 h-24 bg-slate-100 rounded-[2rem] flex items-center justify-center">
      <Zap className="w-12 h-12 text-slate-300" />
    </div>
    <div>
      <h2 className="text-3xl font-black tracking-tight text-slate-900">{title}</h2>
      <p className="text-slate-500 font-medium max-w-md mx-auto">
        This module is currently being provisioned for your enterprise environment. 
        Check back soon for full functionality.
      </p>
    </div>
    <Button variant="outline" className="rounded-xl font-bold">
      View Documentation
    </Button>
  </div>
);
