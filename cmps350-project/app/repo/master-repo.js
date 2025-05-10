import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class MasterRepo {
  //User
  async findUserByUsername(username) {
    return await prisma.User.findUnique({
      where: { username },
      include: {
        // Optionally include profiles
        studentProfile: true,
        instructorProfile: true,
      },
    });
  }

  //Student
  async findStudentProfileByUId(studentUId) {
    return await prisma.StudentProfile.findUnique({
      where: { studentUId },
      include: {
        user: true, // Include the associated User record
        enrollments: {
          // Include all enrollments for this student
          orderBy: { semester: "desc" },
          include: {
            section: {
              // For each enrollment, include Section details
              include: {
                course: { select: { code: true, name: true, courseUId: true } }, // And Course details
                instructor: { select: { name: true, instructorUId: true } }, // And Instructor details
              },
            },
          },
        },
      },
    });
  }

  async findInstructorProfileByUId(instructorUId) {
    return await prisma.InstructorProfile.findUnique({
      where: { instructorUId },
      include: {
        user: { select: { username: true, role: true } }, // Include associated User details
        sectionsTaught: {
          // Include sections taught by this instructor
          orderBy: { semester: "desc" },
          include: {
            course: { select: { code: true, name: true, courseUId: true } }, // Course details for each section
          },
        },
      },
    });
  }

  async getAllStudents() {
    return await prisma.studentProfile.findMany({
      orderBy: { name: "asc" },
      include: {
        user: { select: { username: true } },
      },
    });
  }

  async findCourseByUId(courseUId) {
    return await prisma.course.findUnique({
      where: { courseUId },
      include: {
        sections: {
          orderBy: { crn: "asc" },
          include: {
            instructor: {
              select: { name: true, instructorUId: true, department: true },
            },
          },
        },
        prerequisites: {
          // Prerequisites FOR this course
          select: {
            prerequisite: {
              select: { code: true, name: true, courseUId: true },
            },
          },
        },
        isPrerequisiteFor: {
          // Courses THIS course is a prerequisite FOR
          select: {
            course: { select: { code: true, name: true, courseUId: true } },
          },
        },
      },
    });
  }

  async findCourseByCode(courseCode) {
    return await prisma.course.findUnique({
      where: { code: courseCode },
      include: {
        // Same include structure as findCourseByUId for consistency
        sections: {
          orderBy: { crn: "asc" },
          include: {
            instructor: {
              select: { name: true, instructorUId: true, department: true },
            },
          },
        },
        prerequisites: {
          select: {
            prerequisite: {
              select: { code: true, name: true, courseUId: true },
            },
          },
        },
        isPrerequisiteFor: {
          select: {
            course: { select: { code: true, name: true, courseUId: true } },
          },
        },
      },
    });
  }
  async findSectionByCRN(crn) {
    return await prisma.section.findUnique({
      where: { crn },
      include: {
        course: true,
        instructor: true,
        enrollments: {
          include: {
            student: { select: { name: true, studentUId: true } },
          },
        },
      },
    });
  }
  async getEnrollmentsForStudent(studentUId) {
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { studentUId },
      select: { id: true },
    });

    if (!studentProfile) {
      console.warn(`Student with UId "${studentUId}" not found.`);
      return [];
    }

    return await prisma.enrollment.findMany({
      where: { studentProfileId: studentProfile.id },
      orderBy: [{ semester: "desc" }, { section: { course: { code: "asc" } } }],
      include: {
        section: {
          include: {
            course: { select: { code: true, name: true, credits: true } },
            instructor: { select: { name: true } },
          },
        },
      },
    });
  }

  async getStudentsEnrolledInSection(sectionCRN, skip = 0, take = 20) {
    const section = await prisma.section.findUnique({
      where: { crn: sectionCRN },
      select: { id: true }, // Get DB ID of the section
    });

    if (!section) {
      console.warn(`Section with CRN "${sectionCRN}" not found.`);
      return [];
    }

    return await prisma.enrollment.findMany({
      where: { sectionId: section.id },
      skip,
      take,
      orderBy: { student: { name: "asc" } },
      include: {
        student: {
          // Include the student's profile details
          include: {
            user: { select: { username: true } },
          },
        },
        // Optionally include grade, status from enrollment itself
        // select: { grade: true, status: true, student: { ... } }
      },
    });
  }
}

export default new MasterRepo();
