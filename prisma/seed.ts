import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  // Create superadmin user
  const superadminPassword = await argon2.hash("superadminpassword");

  await prisma.user.upsert({
    where: { email_address: "superadmin@example.com" },
    update: {},
    create: {
      firstName: "Super",
      lastName: "Admin",
      email_address: "superadmin@example.com",
      password: superadminPassword,
      phone_number: "",
      gender: "male",
      roles: ["admin"],
    },
  });
}

main()
  .then(() => {
    console.log("Seeding completed.");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
