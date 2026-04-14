export interface Student {
  id: string;
  rollNumber: string;
  name: string;
  gender: string;
  fatherName: string;
  motherName: string;
  dob: string;
  religion: string;
  email: string;
  admissionDate: string;
  grade: string; // Used as 'Class'
  section: string;
  address: string;
  phone: string;
  contact?: string; // Alias for phone for backward compatibility
  profileImage: string;
  status: "Active" | "Withdrawn" | "Alumni";
  examResults?: {
    math: number;
    science: number;
    english: number;
  };
  attendanceStatus?: string;
  attendanceTime?: string;
  checkedByParent?: boolean;
}

export interface Teacher {
  id: string;
  name: string;
  gender: string;
  dob: string;
  email: string;
  joiningDate: string;
  subject: string;
  assignedClasses: string[]; // Reverted to array for compatibility
  section: string;
  phone: string;
  address: string;
  profileImage: string;
  salary: number;
  status: "Active" | "On Leave" | "Resigned";
  qualification: string;
}

export interface Parent {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  profileImage: string;
  linkedChildren: {
    id: string;
    name: string;
    class: string;
    section: string;
    rollNumber: string;
  }[];
}

export interface ManagementProfile {
  id: string;
  name: string;
  gender: string;
  dob: string;
  joiningDate: string;
  role: string;
  email: string;
  phone: string;
  address: string;
  officeDetails: string;
  profileImage: string;
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

export interface Expense {
  id: string;
  title: string;
  category: "Utilities" | "Maintenance" | "Supplies" | "Events" | "Other";
  amount: number;
  date: string;
  description: string;
  status: "Pending" | "Approved" | "Paid";
}
