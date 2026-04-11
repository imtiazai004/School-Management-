export interface Student {
  id: number;
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
  id: number;
  student: string;
  rollNo?: string;
  grade: string;
  amount: number;
  date: string;
  status: "Paid" | "Unpaid";
  method: string;
}
