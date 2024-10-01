import parsedEnv from "@/env";
import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const userData: Omit<Prisma.UserCreateInput, "password">[] = [
  {
    email: "amjad@desolint.com",
  },
];

async function main() {
  console.log(`Start seeding ... 🌱`);

  await prisma.user.deleteMany({
    where: {
      email: { in: userData.map((u) => u.email) },
    },
  });

  for (const u of userData) {
    const user = await prisma.user.create({
      data: {
        ...u,
        password: bcrypt.hashSync(parsedEnv.DEFAULT_USER_PASSWORD, 8),
      },
    });

    console.log(`Created user with id: ${user.id}`);
  }

  console.log(`Seeding finished. 🌱`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
