import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class usersRepo {
  constructor() {
    console.log("Current working directory:", process.cwd());
  }
  async getUsers() {
    return await prisma.user.findMany({
      orderBy: { username: "asc" },
    });
  }
  async setUsers(users) {
    for (const user of users) {
      await prisma.user.update({
        where: { id: user.id },
        data: user,
      });
    }
    return "users changed successfully";
  }
}
export default new usersRepo();
