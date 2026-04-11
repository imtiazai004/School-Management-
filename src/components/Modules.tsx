import React, { useState, useRef } from "react";
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
  Layers
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

// --- Classes Smart Management ---
export const ClassesSmartManagement = ({ userRole }: { userRole?: string }) => {
  const [activeTab, setActiveTab] = useState<"attendance" | "exams" | "bulk">("attendance");
  const [examSubTab, setExamSubTab] = useState<"enter" | "view">("view");
  const [selectedTerm, setSelectedTerm] = useState("First Term");
  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);
  const [isProcessingExamBulk, setIsProcessingExamBulk] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const manualEntryRef = useRef<HTMLDivElement>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState("Grade 10-A");
  const [examSearchQuery, setExamSearchQuery] = useState("");
  const [newStudent, setNewStudent] = useState({ name: "", grade: "Grade 10-A", fatherName: "" });
  const [reportConfig, setReportConfig] = useState({
    type: "daily",
    scope: "class",
    studentId: ""
  });

  const [students, setStudents] = useState([
    { id: 1, name: "Ahmad Hassan", fatherName: "Hassan Ali", grade: "Grade 10-A", status: "present", time: "08:15 AM", examResults: { math: 85, science: 92, english: 78 }, checkedByParent: false },
    { id: 2, name: "Sara Khan", fatherName: "Imran Khan", grade: "Grade 10-A", status: "absent", time: "-", examResults: { math: 72, science: 68, english: 85 }, checkedByParent: true },
    { id: 3, name: "Zainab Ali", fatherName: "Ali Raza", grade: "Grade 10-A", status: "present", time: "08:20 AM", examResults: { math: 95, science: 88, english: 92 }, checkedByParent: false },
    { id: 4, name: "Bilal Ahmed", fatherName: "Ahmed Shah", grade: "Grade 10-A", status: "late", time: "08:45 AM", examResults: { math: 65, science: 70, english: 60 }, checkedByParent: false },
    { id: 5, name: "Fatima Noor", fatherName: "Noor Muhammad", grade: "Grade 10-A", status: "present", time: "08:10 AM", examResults: { math: 88, science: 85, english: 80 }, checkedByParent: true },
    { id: 6, name: "John Doe", fatherName: "Richard Doe", grade: "Grade 10-B", status: "present", time: "08:05 AM", examResults: { math: 80, science: 75, english: 70 }, checkedByParent: false },
  ]);

  const filteredStudents = students.filter(s => s.grade === selectedClass);

  const [attendanceData, setAttendanceData] = useState(
    students.reduce((acc, student) => ({ ...acc, [student.id]: student.status }), {})
  );

  const updateAttendance = (studentId: number, status: string) => {
    setAttendanceData(prev => ({ ...prev, [studentId]: status }));
  };

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.grade) return;
    
    const studentToAdd = {
      id: Date.now(),
      name: newStudent.name,
      fatherName: newStudent.fatherName || "N/A",
      grade: newStudent.grade,
      status: "present",
      time: "-",
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
      status: attendanceData[s.id] || s.status,
      time: attendanceData[s.id] === "present" ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"
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
            [date, (attendanceData[student?.id || 0] || "N/A").toUpperCase(), student?.time || "-"]
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
            (attendanceData[s.id] || s.status).toUpperCase(),
            s.time
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
              <p className="text-4xl font-black text-emerald-600">{filteredStudents.filter(s => s.status === 'present').length}</p>
            </CardContent>
          </Card>
          <Card className="rounded-[2rem] border-slate-200/60 shadow-sm">
            <CardContent className="p-6">
              <p className="text-xs font-black text-rose-500 uppercase tracking-widest mb-2">Absent</p>
              <p className="text-4xl font-black text-rose-600">{filteredStudents.filter(s => s.status === 'absent').length}</p>
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
                        student.status === "present" ? "bg-emerald-100 text-emerald-700" :
                        student.status === "absent" ? "bg-rose-100 text-rose-700" :
                        "bg-amber-100 text-amber-700"
                      }`}>
                        {student.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-500">{student.time}</td>
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
                {
                  inlineData: {
                    data: base64Data,
                    mimeType: file.type
                  }
                }
              ]
            }
          ],
          config: {
            responseMimeType: "application/json"
          }
        });

        const text = response.text;
        const jsonMatch = text.match(/\[.*\]/s);
        if (jsonMatch) {
          const extractedData = JSON.parse(jsonMatch[0]);
          // Map extracted data to students
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
    // Focus the first input after a short delay to allow for scrolling
    setTimeout(() => {
      const firstInput = manualEntryRef.current?.querySelector('input[type="number"]') as HTMLInputElement;
      firstInput?.focus();
    }, 500);
  };

  const renderExamsTab = () => {
    const searchedStudents = students.filter(s => {
      const matchesClass = s.grade === selectedClass;
      const matchesSearch = s.name.toLowerCase().includes(examSearchQuery.toLowerCase()) || 
                           s.id.toString().includes(examSearchQuery) ||
                           (s.fatherName && s.fatherName.toLowerCase().includes(examSearchQuery.toLowerCase()));
      return matchesClass && matchesSearch;
    });

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Exams & Results</h2>
            <p className="text-slate-500 font-medium">Manage academic performance and term reports</p>
          </div>
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
            <button 
              onClick={() => setExamSubTab("view")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${examSubTab === "view" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
            >
              View Results
            </button>
            <button 
              onClick={() => setExamSubTab("enter")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${examSubTab === "enter" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
            >
              Enter Results
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
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Search Student (Name, R.No, Father Name)</label>
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
                  onClick={() => generatePDF(`${selectedTerm}_Results_${selectedClass}`, searchedStudents.map(s => [s.id.toString(), s.name, s.fatherName, s.examResults.math.toString(), s.examResults.science.toString(), s.examResults.english.toString()]), [['R.No', 'Student', 'Father Name', 'Math', 'Science', 'English']])}
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
                        <td className="px-8 py-4 font-medium text-slate-500">{student.fatherName}</td>
                        <td className="px-8 py-4 text-center font-bold text-indigo-600">{student.examResults.math}</td>
                        <td className="px-8 py-4 text-center font-bold text-indigo-600">{student.examResults.science}</td>
                        <td className="px-8 py-4 text-center font-bold text-indigo-600">{student.examResults.english}</td>
                        <td className="px-8 py-4 text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => generatePDF(`Result_${student.name}`, [[student.id.toString(), student.name, student.fatherName, student.examResults.math.toString(), student.examResults.science.toString(), student.examResults.english.toString()]], [['R.No', 'Student', 'Father Name', 'Math', 'Science', 'English']])}
                            className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {searchedStudents.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-8 py-12 text-center text-slate-400 font-medium">
                          No students found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        ) : (
          <div className="space-y-6">
            {saveSuccess && (
              <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-xl shadow-emerald-100 flex items-center gap-3 font-black">
                  <CheckCircle2 className="w-5 h-5" />
                  Results Saved Successfully!
                </div>
              </div>
            )}
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
                    {filteredStudents.map(student => (
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

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
        {[
          { id: "attendance", label: "Attendance", icon: Users },
          { id: "exams", label: "Exams", icon: ClipboardCheck },
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
      {activeTab === "exams" && renderExamsTab()}
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


// --- Financial Operations Suite ---
export const FinancialSuite = ({ userRole }: { userRole?: string }) => {
  const data = [
    { name: 'Jan', revenue: 4000, expenses: 2400 },
    { name: 'Feb', revenue: 3000, expenses: 1398 },
    { name: 'Mar', revenue: 2000, expenses: 9800 },
    { name: 'Apr', revenue: 2780, expenses: 3908 },
    { name: 'May', revenue: 1890, expenses: 4800 },
    { name: 'Jun', revenue: 2390, expenses: 3800 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Financial Command Center</h2>
          <p className="text-slate-500 font-medium">Enterprise-grade fiscal management and reporting</p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold gap-2">
            <Plus className="w-4 h-4" /> Generate Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Revenue", value: "$124,500", trend: "+12%", up: true },
          { label: "Outstanding Fees", value: "$12,300", trend: "-5%", up: false },
          { label: "Operating Costs", value: "$45,200", trend: "+2%", up: true },
          { label: "Net Profit", value: "$79,300", trend: "+18%", up: true },
        ].map((stat, i) => (
          <Card key={i} className="rounded-[2rem] border-slate-200/60 shadow-sm">
            <CardContent className="p-6">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                <div className={`flex items-center text-xs font-bold ${stat.up ? "text-emerald-600" : "text-rose-600"}`}>
                  {stat.up ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                  {stat.trend}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-[2rem] border-slate-200/60 shadow-sm p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-lg font-black tracking-tight">Revenue vs Expenses</CardTitle>
          </CardHeader>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                <Area type="monotone" dataKey="expenses" stroke="#94a3b8" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="rounded-[2rem] border-slate-200/60 shadow-sm p-6">
          <CardHeader className="px-0 pt-0 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-black tracking-tight">Recent Transactions</CardTitle>
            <Button variant="ghost" size="sm" className="font-bold text-indigo-600">View All</Button>
          </CardHeader>
          <div className="space-y-4">
            {[
              { name: "Grade 10-A Monthly Fee", date: "Oct 12, 2023", amount: "+$450.00", status: "completed" },
              { name: "Lab Equipment Purchase", date: "Oct 11, 2023", amount: "-$1,200.00", status: "pending" },
              { name: "Faculty Payroll - Sep", date: "Oct 10, 2023", amount: "-$15,400.00", status: "completed" },
              { name: "Scholarship Disbursement", date: "Oct 09, 2023", amount: "-$2,000.00", status: "completed" },
              { name: "Donation - Alumni Fund", date: "Oct 08, 2023", amount: "+$5,000.00", status: "completed" },
            ].map((t, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.amount.startsWith("+") ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}>
                    <CircleDollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                    <p className="text-xs text-slate-400 font-medium">{t.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-black text-sm ${t.amount.startsWith("+") ? "text-emerald-600" : "text-slate-900"}`}>{t.amount}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.status}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// --- Academic Performance Analytics ---
export const AcademicAnalytics = ({ userRole }: { userRole?: string }) => {
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
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl font-black">
                ZA
              </div>
              <div>
                <p className="text-xl font-black">Zoya Ahmed</p>
                <p className="text-indigo-200 font-medium">Grade 10-A</p>
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
export const StudentManagementPortal = ({ userRole }: { userRole?: string }) => {
  const [activeTab, setActiveTab] = useState<"directory" | "admission" | "promotion" | "withdrawal">("directory");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isHeadmaster, setIsHeadmaster] = useState(userRole === "Headmaster");
  const [promotionClass, setPromotionClass] = useState("Grade 10-A");
  const [isPromoting, setIsPromoting] = useState(false);

  // Sync isHeadmaster with userRole prop
  React.useEffect(() => {
    setIsHeadmaster(userRole === "Headmaster");
  }, [userRole]);

  const [students, setStudents] = useState([
    { id: 1, name: "Ahmad Hassan", fatherName: "Hassan Ali", grade: "Grade 10-A", dob: "2010-05-15", gender: "Male", contact: "0300-1234567", address: "House 123, Street 4, Lahore", status: "Active", admissionDate: "2022-04-01" },
    { id: 2, name: "Sara Khan", fatherName: "Imran Khan", grade: "Grade 10-A", dob: "2010-08-22", gender: "Female", contact: "0321-7654321", address: "Flat 45, Model Town, Lahore", status: "Active", admissionDate: "2022-04-01" },
    { id: 3, name: "Zainab Ali", fatherName: "Ali Raza", grade: "Grade 10-A", dob: "2011-01-10", gender: "Female", contact: "0333-9876543", address: "Sector C, DHA, Lahore", status: "Active", admissionDate: "2022-04-01" },
    { id: 4, name: "Bilal Ahmed", fatherName: "Ahmed Shah", grade: "Grade 10-A", dob: "2010-11-30", gender: "Male", contact: "0345-1122334", address: "Johar Town, Lahore", status: "Active", admissionDate: "2022-04-01" },
    { id: 5, name: "Fatima Noor", fatherName: "Noor Muhammad", grade: "Grade 10-A", dob: "2011-03-05", gender: "Female", contact: "0300-5566778", address: "Gulberg III, Lahore", status: "Active", admissionDate: "2022-04-01" },
    { id: 6, name: "John Doe", fatherName: "Richard Doe", grade: "Grade 10-B", dob: "2010-02-14", gender: "Male", contact: "0312-9988776", address: "Wapda Town, Lahore", status: "Active", admissionDate: "2022-04-01" },
  ]);

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
      setIsSubmitting(false);
      setShowSuccess(true);
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
                  This will move all students in <span className="font-bold">{promotionClass}</span> to the next academic level. This action cannot be undone.
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
                }, 2000);
              }}
              className="w-full h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-black text-lg shadow-xl shadow-indigo-100 gap-3"
            >
              {isPromoting ? <Loader2 className="w-6 h-6 animate-spin" /> : <ArrowUpCircle className="w-6 h-6" />}
              {isPromoting ? "Promoting..." : `Promote ${promotionClass}`}
            </Button>
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
                  CRITICAL: This operation affects <span className="font-bold">all active students</span>. Ensure all final term results are finalized before proceeding.
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
              <p className="text-2xl font-black text-slate-900">{students.length}</p>
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
              <p className="text-2xl font-black text-slate-900">98%</p>
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
              <p className="text-2xl font-black text-slate-900">12</p>
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
              <p className="text-2xl font-black text-slate-900">3</p>
            </div>
          </div>
        </Card>
      </div>

      {activeTab === "directory" && renderDirectory()}
      {activeTab === "admission" && renderAdmission()}
      {activeTab === "promotion" && renderPromotion()}
      {activeTab === "withdrawal" && (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-white rounded-[3rem] border border-slate-200/60 shadow-sm">
          <div className="w-20 h-20 bg-rose-50 rounded-[2rem] flex items-center justify-center">
            <UserMinus className="w-10 h-10 text-rose-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">Student Withdrawal Portal</h3>
          <p className="text-slate-500 font-medium max-w-md">Manage student leavings, generate SLCs (School Leaving Certificates), and archive historical records securely.</p>
          <Button className="bg-rose-600 hover:bg-rose-700 rounded-xl font-black px-8 h-12 shadow-lg shadow-rose-100">Process Withdrawal</Button>
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
