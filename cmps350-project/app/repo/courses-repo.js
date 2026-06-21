import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class coursesRepo {
  async getCourses() {
    return await prisma.course.findMany({
      orderBy: { code: "asc" },
      include: {
        sections: true,
        prerequisites: true,
        isPrerequisiteFor: true,
      },
    });
  }

  async setCourses(courses) {
    await prisma.course.deleteMany();
    for (const course of courses) {
      await prisma.course.create({
        data: {
          courseUId: course.courseUId || course.id,
          code: course.code,
          name: course.name,
          credits: course.credits || 3,
          category: course.category || "General",
          description: course.description || "",
          registrationOpen: course.registrationOpen || false,
        },
      });
    }
    return "courses changed successfully";
  }

  async addCourse(course) {
    return await prisma.course.create({
      data: {
        courseUId: course.courseUId || course.id,
        code: course.code,
        name: course.name,
        credits: course.credits || 3,
        category: course.category || "General",
        description: course.description || "",
        registrationOpen: course.registrationOpen || false,
      },
    });
  }
}

export default new coursesRepo();
