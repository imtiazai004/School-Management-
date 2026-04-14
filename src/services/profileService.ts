import { Student, Teacher, Parent, ManagementProfile } from "../types";

export const getMockProfile = (role: string, email: string | null): any => {
  const baseEmail = email || "user@school.edu";
  
  switch (role) {
    case "Student":
      return {
        id: "STU-2026-001",
        rollNumber: "10-A-042",
        name: "Zaid Khan",
        gender: "Male",
        fatherName: "Ahmed Khan",
        motherName: "Saira Ahmed",
        dob: "2010-05-15",
        religion: "Islam",
        email: baseEmail,
        admissionDate: "2021-08-20",
        grade: "10th",
        section: "A",
        address: "House 42, Street 7, Gulberg, Lahore",
        phone: "+92 300 1234567",
        profileImage: "https://picsum.photos/seed/zaid/200/200",
        status: "Active"
      } as Student;

    case "Teacher":
      return {
        id: "TCH-2026-005",
        name: "Dr. Sarah Wilson",
        gender: "Female",
        dob: "1985-11-12",
        email: baseEmail,
        joiningDate: "2018-03-10",
        subject: "Mathematics & Physics",
        assignedClasses: ["10th-A", "10th-B"],
        section: "A",
        phone: "+92 321 9876543",
        address: "Apartment 12B, Sky View, Islamabad",
        profileImage: "https://picsum.photos/seed/sarah/200/200",
        salary: 85000,
        status: "Active",
        qualification: "Ph.D. in Mathematics"
      } as Teacher;

    case "Guardian":
    case "Parent":
      return {
        id: "PRN-2026-099",
        name: "Mr. Salman Sheikh",
        email: baseEmail,
        phone: "+92 333 5556667",
        address: "DHA Phase 5, Block K, Karachi",
        profileImage: "https://picsum.photos/seed/salman/200/200",
        linkedChildren: [
          { id: "STU-2026-001", name: "Zaid Khan", class: "10th", section: "A", rollNumber: "10-A-042" },
          { id: "STU-2026-002", name: "Ayesha Khan", class: "7th", section: "B", rollNumber: "07-B-015" }
        ]
      } as Parent;

    case "Headmaster":
    case "Head of Institute":
    case "Vice Principal":
    case "Clerk":
    case "Accountant":
    case "Management Staff":
      return {
        id: "MGT-2026-001",
        name: "Prof. Imtiaz Ahmed",
        gender: "Male",
        dob: "1975-06-15",
        joiningDate: "2015-01-01",
        role: role,
        email: baseEmail,
        phone: "+92 345 0001112",
        address: "Admin Block, Smart Education Campus",
        officeDetails: "Room 101, Ground Floor",
        profileImage: "https://picsum.photos/seed/admin/200/200"
      } as ManagementProfile;

    default:
      return null;
  }
};
