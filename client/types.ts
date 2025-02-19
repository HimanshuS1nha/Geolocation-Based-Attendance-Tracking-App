export type UserType = {
  id: string;
  name: string;
  email: string;
  image: string;
  designation?: string;
  type: "employee" | "company";
  hasAddedOfficeLocation?: boolean;
};

export type EmployeeType = {
  id: string;
  name: string;
  email: string;
  image: string;
  designation?: string;
};

export type AttendanceRecordType = {
  date: string;
  day: string;
  isPresent: boolean;
  timeSpent?: string;
};
