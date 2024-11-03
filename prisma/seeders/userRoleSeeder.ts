// libs
import { PrismaClient, UserRole } from "@prisma/client";
// helpers
import { generateUUID } from "../../src/helpers/utils";

export const arr_user_role: UserRole[] = [
  {
    user_role_id: generateUUID(),
    name: "admin",
    deleted: false,
    created_user_id: "seeder",
    created_at: new Date(),
    updated_user_id: null,
    updated_at: null,
    deleted_user_id: null,
    deleted_at: null,
  },
  {
    user_role_id: generateUUID(),
    name: "user",
    deleted: false,
    created_user_id: "seeder",
    created_at: new Date(),
    updated_user_id: null,
    updated_at: null,
    deleted_user_id: null,
    deleted_at: null,
  },
];

export const userRoleSeeder = async (prisma: PrismaClient) => {
  /* insert with looping */
  for (let iteration = 0; iteration < arr_user_role.length; iteration++) {
    await prisma.userRole.create({
      data: arr_user_role[iteration],
    });
  }
};
