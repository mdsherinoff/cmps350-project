import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient;

class MasterRepo{
    //Student
    async getStudents() {
        return await prisma.studentProfile.findMany({
            include:{
                user: true, // Include the associated User record
                enrollments: { // Include all enrollments for this student
                    include: {
                        section: { // For each enrollment, include the Section details
                            include: {
                                course: true, // For each section, include the Course details
                            },
                        },
                    },
                },
            },
        });
    }

    async getStudentByID(searchId){
               return await prisma.studentProfile.findUnique({
            where:{
                studentUId: searchId
            },
            include:{
                user: true, // Include the associated User record
                enrollments: { // Include all enrollments for this student
                    include: {
                        section: { // For each enrollment, include the Section details
                            include: {
                                course: true, // For each section, include the Course details
                            },
                        },
                    },
                },
            },
        }); 
    }

//Course
async  getCourseByCode(searchCode) {
  const course = await prisma.course.findUnique({
    where: {
      code: searchCode
    },
    include: {
      sections: { // Include all sections for this course
        include: {
          instructor: { // For each section, include the instructor's profile
            select: { name: true, department: true }, // Only get name and department
          },
        },
        orderBy: { semester: 'desc' }, // Order sections
      },
      prerequisites: { // Courses that are prerequisites FOR THIS course
        include: {
          prerequisite: { // The actual prerequisite course details
            select: { code: true, name: true },
          },
        },
      },
      isPrerequisiteFor: { // Courses FOR WHICH this course is a prerequisite
        include: {
          course: { // The course that has this one as a prerequisite
            select: { code: true, name: true },
          },
        },
      },
    },
  });
  console.log(course);
  return course;
}

}

export default new MasterRepo();