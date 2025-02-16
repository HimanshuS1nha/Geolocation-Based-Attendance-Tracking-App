export type UserType = {
  id: string;
  name: string;
  email: string;
  image: string;
  designation?: string;
  type: "employee" | "company";
  hasAddedOfficeLocation?: boolean;
};
