// libs
import { PrismaClient } from "@prisma/client";
// seeders
import { userRoleSeeder } from "./seeders/userRoleSeeder";
import { userSeeder } from "./seeders/userSeeder";
import { subscriptionPackageSeeder } from "./seeders/subscriptionPackageSeeder";

const prisma = new PrismaClient();

const main = async () => {
  /* delete first */
  await prisma.user.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.subscriptionPackage.deleteMany();

  /* user role */
  await userRoleSeeder(prisma);
  /* user */
  await userSeeder(prisma);
  /* subscription package */
  await subscriptionPackageSeeder(prisma);
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
