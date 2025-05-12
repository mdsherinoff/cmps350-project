import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class coursesRepo {
  constructor() {
    console.log("Current working directory:", process.cwd());
  }
  async getCourses() {
    return await prisma.course.findMany({
      orderBy: { code: "asc" },
    });
  }
  async setCourses(courses) {
    for (const course of courses) {
      await prisma.course.update({
        where: { id: course.id },
        data: course,
      });
    }
    return "courses changed successfully";
  }
  async addCourse(course) {
    const courses = await this.getCourses();
    courses.push(course);
    await prisma.course.create({
      data: course,
    });
    return course;
  }
}
export default new coursesRepo();
