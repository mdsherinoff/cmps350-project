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
    try {
      if (!course.code || !course.name) {
        throw new Error("Missing required fields: code and name are required");
      }

      const existingCourse = await prisma.course.findUnique({
        where: { code: course.code },
      });

      if (existingCourse) {
        throw new Error(`Course with code ${course.code} already exists`);
      }

      const courseUId = course.code.replace(/\s+/g, "").toUpperCase();

      const newCourse = await prisma.course.create({
        data: {
          courseUId: courseUId,
          code: course.code,
          name: course.name,
          credits: course.credits || 3,
          category: course.category,
          description: course.description || "",
          registrationOpen: course.registrationOpen ?? false,
        },
      });

      if (course.prerequisites && course.prerequisites.length > 0) {
        const prerequisiteCourses = await prisma.course.findMany({
          where: {
            code: {
              in: course.prerequisites,
            },
          },
        });

        await Promise.all(
          prerequisiteCourses.map((prereq) =>
            prisma.coursePrerequisite.create({
              data: {
                courseId: newCourse.id,
                prerequisiteCourseId: prereq.id,
              },
            })
          )
        );
      }

      if (course.sections && course.sections.length > 0) {
        await Promise.all(
          course.sections.map((section) =>
            prisma.section.create({
              data: {
                crn: section.crn,
                semester: "2024-SPRING",
                schedule: section.schedule,
                location: section.location,
                capacity: section.capacity || 30,
                enrolledCount: section.enrolled || 0,
                status: section.status === "open" ? "OPEN" : "CLOSED",
                courseId: newCourse.id,
              },
            })
          )
        );
      }

      return await prisma.course.findUnique({
        where: { id: newCourse.id },
        include: {
          prerequisites: {
            include: {
              prerequisite: true,
            },
          },
          sections: true,
        },
      });
    } catch (error) {
      console.error("Error in addCourse:", error);
      throw error;
    }
  }
}
export default new coursesRepo();
