import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  // Create superadmin user
  const superadminPassword = await argon2.hash("P455W0Rd");

  await prisma.user.upsert({
    where: { emailAddress: "superadmin@example.com" },
    update: {},
    create: {
      firstName: "Super",
      lastName: "Admin",
      emailAddress: "superadmin@example.com",
      password: superadminPassword,
      gender: "male",
      role: "superadmin",
    },
  });

  await prisma.user.upsert({
    where: { emailAddress: "admin@example.com" },
    update: {},
    create: {
      firstName: "Admin",
      lastName: "User",
      emailAddress: "admin@example.com",
      password: superadminPassword,
      gender: "female",
      role: "admin",
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
