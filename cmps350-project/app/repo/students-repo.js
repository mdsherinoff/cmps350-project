import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class studentsRepo {
  async getStudents() {
    return await prisma.student.findMany({
      include: {
        user: true,
        enrollments: true,
      },
    });
  }

  async setStudents(students) {
    await prisma.student.deleteMany();
    for (const student of students) {
      const user = await prisma.user.findUnique({
        where: { username: student.username || student.studentUId },
      });

      if (user) {
        await prisma.student.create({
          data: {
            studentUId: student.studentUId || student.id,
            name: student.name,
            year: student.year || "1",
            userId: user.id,
          },
        });
      }
    }
    return "returned successfully";
  }
}

export default new studentsRepo();
