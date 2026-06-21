import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class instructorsRepo {
  async getInstructors() {
    return await prisma.instructor.findMany({
      include: {
        user: true,
        sectionsTaught: true,
      },
    });
  }

  async setInstructors(instructors) {
    await prisma.instructor.deleteMany();
    for (const instructor of instructors) {
      const user = await prisma.user.findUnique({
        where: { username: instructor.username || instructor.instructorUId },
      });

      if (user) {
        await prisma.instructor.create({
          data: {
            instructorUId: instructor.instructorUId || instructor.id,
            name: instructor.name,
            department: instructor.department || "Engineering",
            userId: user.id,
          },
        });
      }
    }
    return "instructors changed successfully";
  }
}

export default new instructorsRepo();
