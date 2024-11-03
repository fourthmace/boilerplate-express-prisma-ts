// libs
import { Prisma, PrismaClient, SubscriptionPackage } from "@prisma/client";
// helpers
import { generateUUID } from "../../src/helpers/utils";

export const arr_subscription_package: SubscriptionPackage[] = [
  {
    subscription_package_id: generateUUID(),
    contact_quota: 200,
    instance_quota: 1,
    discount: new Prisma.Decimal(0),
    discount_type: "absolute",
    name: "welcome plan",
    price: new Prisma.Decimal(0),
    type: "welcome",
    deleted: false,
    created_user_id: "seeder",
    created_at: new Date(),
    updated_user_id: null,
    updated_at: null,
    deleted_user_id: null,
    deleted_at: null,
  },
];

export const subscriptionPackageSeeder = async (prisma: PrismaClient) => {
  /* insert with looping */
  for (
    let iteration = 0;
    iteration < arr_subscription_package.length;
    iteration++
  ) {
    await prisma.subscriptionPackage.create({
      data: arr_subscription_package[iteration],
    });
  }
};
