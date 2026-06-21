import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class usersRepo {
  async getUsers() {
    return await prisma.user.findMany({
      include: {
        studentProfile: true,
        instructorProfile: true,
      },
    });
  }

  async setUsers(users) {
    await prisma.user.deleteMany();
    for (const user of users) {
      await prisma.user.create({
        data: {
          username: user.username,
          passwordHash: user.passwordHash || "",
          role: user.role || "STUDENT",
        },
      });
    }
    return "users changed successfully";
  }
}

export default new usersRepo();
