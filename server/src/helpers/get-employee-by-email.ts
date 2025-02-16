import { prisma } from "../libs/db";

export const getEmployeeByEmail = async (email: string) => {
  const employee = await prisma.employees.findUnique({
    where: {
      email,
    },
  });

  return employee;
};
