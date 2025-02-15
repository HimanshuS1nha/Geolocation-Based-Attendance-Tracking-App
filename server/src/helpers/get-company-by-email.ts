import { prisma } from "../libs/db";

export const getCompanyByEmail = async (email: string) => {
  const company = await prisma.companies.findUnique({
    where: {
      email,
    },
  });

  return company;
};
