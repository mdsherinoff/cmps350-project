import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class studentsRepo {
  constructor() {
    console.log("Current working directory:", process.cwd());
  }
  async getStudents() {
    return await prisma.student.findMany({
      orderBy: { name: "asc" },
    });
  }
  async setStudents(students) {
    for (const student of students) {
      await prisma.student.update({
        where: { id: student.id },
        data: student,
      });
    }
    return "students changed successfully";
  }
}
export default new studentsRepo();
