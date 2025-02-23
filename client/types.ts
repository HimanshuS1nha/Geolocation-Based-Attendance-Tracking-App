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
  day: number;
  isPresent?: boolean;
  timeSpent?: string;
  present?: number;
  total?: number;
};
