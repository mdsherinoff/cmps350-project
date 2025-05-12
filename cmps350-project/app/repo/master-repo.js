import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class MasterRepo {



  async getUsers() {
    return await prisma.user.findMany({
      orderBy: { username: "asc" }
    });
  }

    async getAllStudents() {
    return await prisma.student.findMany({
      orderBy: { name: "asc" },
      include: {
        user: { select: { username: true } },
      },
    });
  }

    async getUserbyId(id) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }


  async findUserByUsername(username) {
    return await prisma.user.findUnique({
      where: { username },
    });
  }

  async findStudentProfileByUId(studentUId) {
    return await prisma.StudentProfile.findUnique({
      where: { studentUId },
      include: {
        user: true,
        enrollments: {
          orderBy: { semester: "desc" },
          include: {
            section: {
              include: {
                course: { select: { code: true, name: true, courseUId: true } },
                instructor: { select: { name: true, instructorUId: true } },
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
        user: { select: { username: true, role: true } },
        sectionsTaught: {
          orderBy: { semester: "desc" },
          include: {
            course: { select: { code: true, name: true, courseUId: true } },
          },
        },
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

  async findCourseByCode(courseCode) {
    return await prisma.course.findUnique({
      where: { code: courseCode },
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
      select: { id: true },
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
          include: {
            user: { select: { username: true } },
          },
        },
      },
    });
  }

  async createCourse(courseData) {
    const newCourse = await prisma.course.create({
      data: {
        courseUId: courseData.id,
        code: courseData.code,
        name: courseData.name,
        credits: courseData.credits,
        category: courseData.category,
        description: courseData.description || null,
        sections: course.sections,
        prerequisites: courseData.prerequisite,
      },
    });
    return newCourse;
  }

  async updateStudentGrade(studentUId, crn, grade) {
    const student = await prisma.student.findUnique({
      where: { studentUId },
      select: { studentUId: true },
    });

    if (!student) {
      throw new Error(`Student with UId "${studentUId}" not found.`);
    }

    const section = await prisma.section.findUnique({
      where: { crn },
      select: { id: true },
    });

    if (!section) {
      throw new Error(`Section with CRN "${crn}" not found.`);
    }

    const updatedEnrollment = await prisma.enrollment.update({
      where: {
        studentProfileId: student.studentUId,
        sectionId: section.id,
      },
      data: {
        grade,
      },
    });

    if (updatedEnrollment.count === 0) {
      throw new Error(
        `Enrollment not found for student ${studentUId} in section ${crn}`
      );
    }

    return { message: "Grade updated successfully." };
  }

  async registerStudentInCourse(studentUId, courseUId, crn) {
    const studentProfile = await prisma.StudentProfile.findUnique({
      where: { studentUId },
      select: { id: true },
    });

    if (!studentProfile) {
      throw new Error(`Student with UId "${studentUId}" not found.`);
    }

    const section = await prisma.enrollment.findUnique({
      where: { crn },
      select: { id: true },
    });

    if (!section) {
      throw new Error(`Section with CRN "${crn}" not found.`);
    }

    const newEnrollment = await prisma.enrollment.create({
      data: {
        studentProfileId: studentProfile.id,
        sectionId: section.id,
      },
    });

    return newEnrollment;
  }

  // Instructor Analytics
  async getInstructorAnalytics() {
    // Total number of instructors
    const totalInstructors = await prisma.instructor.count();

    // Instructors by department
    const instructorsByDepartment = await prisma.instructor.groupBy({
      by: ["department"],
      _count: {
        instructorUId: true,
      },
    });

    const allInstructorsWithSections = await prisma.instructor.findMany({
      include: {
        sectionsTaught: true,
      },
    });

    // Instructors with no sections
    const instructorsWithNoSections = allInstructorsWithSections.filter(
      (instructor) => instructor.sectionsTaught.length === 0
    ).length;

    // Instructors with most sections
    const instructorsWithSections = allInstructorsWithSections
      .map((instructor) => ({
        name: instructor.name,
        department: instructor.department,
        sectionsCount: instructor.sectionsTaught.length,
      }))
      .sort((a, b) => b.sectionsCount - a.sectionsCount);

    const maxSections = instructorsWithSections[0]?.sectionsCount || 0;

    const instructorsWithMostSections = instructorsWithSections.filter(
      (instructor) => instructor.sectionsCount === maxSections
    );

    return {
      totalInstructors,
      instructorsByDepartment,
      instructorsWithMostSections,
      instructorsWithNoSections,
    };
  }

  // Course Analytics
  async getCourseAnalytics() {
    // Total number of courses
    const totalCourses = await prisma.course.count();

    // Courses by category
    const coursesByCategory = await prisma.course.groupBy({
      by: ["category"],
      _count: {
        courseUId: true,
      },
    });

    const allCourses = await prisma.course.findMany({
      include: {
        sections: {
          include: {
            enrollments: {
              where: {
                grade: "A",
              },
            },
          },
        },
      },
    });

    // Total A grade for each course
    const coursesWithACounts = allCourses.map((course) => ({
      ...course,
      aCount: course.sections.reduce(
        (sum, section) => sum + section.enrollments.length,
        0
      ),
    }));

    // Courses with the maximum number of A grades
    const maxACount = Math.max(
      ...coursesWithACounts.map((course) => course.aCount)
    );

    // Courses with most A grades
    const coursesWithMostAs = coursesWithACounts
      .filter((course) => course.aCount === maxACount)
      .sort((a, b) => a.code.localeCompare(b.code));

    // Courses open for registration
    const coursesWithOpenRegistration = await prisma.course.count({
      where: {
        registrationOpen: true,
      },
    });

    return {
      totalCourses,
      coursesByCategory,
      coursesWithMostAs,
      coursesWithOpenRegistration,
    };
  }

  // Student Analytics
  async getStudentAnalytics() {
    // Total number of students
    const totalStudents = await prisma.student.count();

    const studentsWithGrades = await prisma.student.findMany({
      include: {
        enrollments: {
          include: {
            section: {
              include: {
                course: true,
              },
            },
          },
        },
      },
    });

    // GPA for each student
    const studentsWithGPA = studentsWithGrades.map((student) => {
      const grades = student.enrollments
        .filter((e) => e.grade)
        .map((e) => {
          const gradeMap = {
            A: 4.0,
            "A-": 3.7,
            "B+": 3.3,
            B: 3.0,
            "B-": 2.7,
            "C+": 2.3,
            C: 2.0,
            "C-": 1.7,
            "D+": 1.3,
            D: 1.0,
            "D-": 0.7,
            F: 0.0,
          };
          return {
            grade: gradeMap[e.grade] || 0,
            credits: e.section.course.credits,
          };
        });

      const totalCredits = grades.reduce((sum, g) => sum + g.credits, 0);
      const gpa =
        totalCredits > 0
          ? grades.reduce((sum, g) => sum + g.grade * g.credits, 0) /
            totalCredits
          : 0;

      return {
        ...student,
        gpa: Number(gpa.toFixed(2)),
      };
    });

    // Top 5 students by GPA
    const topStudentsByGPA = studentsWithGPA
      .sort((a, b) => b.gpa - a.gpa)
      .slice(0, 5);

    // Students in each year
    const studentsByYear = await prisma.student.groupBy({
      by: ["year"],
      _count: {
        studentUId: true,
      },
    });

    return {
      totalStudents,
      topStudentsByGPA,
      studentsByYear,
    };
  }
}

export default new MasterRepo();
