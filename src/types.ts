export interface Student {
  id: string;
  rollNo?: string;
  name: string;
  fatherName: string;
  grade: string;
  dob?: string;
  gender?: string;
  contact?: string;
  address?: string;
  status: "Active" | "Withdrawn" | "Alumni";
  admissionDate?: string;
  examResults?: {
    math: number;
    science: number;
    english: number;
  };
  attendanceStatus?: string;
  attendanceTime?: string;
  checkedByParent?: boolean;
}

export interface FeeRecord {
  id: string;
  student: string;
  rollNo?: string;
  grade: string;
  amount: number;
  date: string;
  status: "Paid" | "Unpaid";
  method: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  qualification: string;
  joiningDate: string;
  salary: number;
  status: "Active" | "On Leave" | "Resigned";
  assignedClasses: string[];
}
