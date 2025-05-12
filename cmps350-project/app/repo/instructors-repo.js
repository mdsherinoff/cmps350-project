import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class instructorsRepo {
  constructor() {
    console.log("Current working directory:", process.cwd());
  }
  async getInstructors() {
    return await prisma.instructor.findMany({
      orderBy: { name: "asc" },
    });
  }
  async setInstructors(instructors) {
    for (const instructor of instructors) {
      await prisma.instructor.update({
        where: { id: instructor.id },
        data: instructor,
      });
    }
    return "instructors changed successfully";
  }
}
export default new instructorsRepo();
