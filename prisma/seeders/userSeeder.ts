// libs
import { PrismaClient, User } from "@prisma/client";
// seeder data
import { arr_user_role } from "./userRoleSeeder";
// helpers
import { generateUUID } from "../../src/helpers/utils";
import { encrypt } from "../../src/helpers/crypto";

export const arr_user: User[] = [
  {
    user_id: generateUUID(),
    user_role_id: arr_user_role[0].user_role_id,
    email: "admin1@gmail.com",
    phone_number: "",
    password: encrypt("admin1"),
    first_name: "admin",
    last_name: "1",
    is_verify: true,
    deleted: false,
    created_user_id: "seeder",
    created_at: new Date(),
    updated_user_id: null,
    updated_at: null,
    deleted_user_id: null,
    deleted_at: null,
  },
];

export const userSeeder = async (prisma: PrismaClient) => {
  /* insert with looping */
  for (let iteration = 0; iteration < arr_user.length; iteration++) {
    await prisma.user.create({
      data: arr_user[iteration],
    });
  }
};
