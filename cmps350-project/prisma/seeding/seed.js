// seed.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import fs from "fs-extra";
import path from "path";

const courseData = await fs.readJSON(
  path.join(process.cwd(), "app/data/courses.json")
);
const instructorData = await fs.readJSON(
  path.join(process.cwd(), "app/data/instructors.json")
);
const studentData = await fs.readJSON(
  path.join(process.cwd(), "app/data/students.json")
);
const userData = await fs.readJSON(
  path.join(process.cwd(), "app/data/users.json")
);

// --- Main Seeding Function ---
async function seed() {
  console.log("Start seeding ...");

  // 1. Seed Users and their Profiles (Students/Instructors)
  const createdUsersMap = new Map();
  const createdInstructorProfilesMap = new Map();
  const createdStudentProfilesMap = new Map();

  console.log("-----------------------------------------------------------");
  console.log("\nSeeding Users, InstructorProfiles, and StudentProfiles...");
  console.log("-----------------------------------------------------------");
  for (const u of userData) {
    let user;
    try {
      user = await prisma.User.create({
        data: {
          username: u.username,
          passwordHash: u.password,
          role: u.role.toUpperCase(),
        },
      });
      createdUsersMap.set(u.id, user.id);
      console.log(`Created user: ${user.username} (ID: ${user.id})`);

      if (user.role == "INSTRUCTOR") {
        const iData = instructorData.find((instr) => {
          return instr.instructorUId === u.id;
        });
        if (iData) {
          const instructorProfile = await prisma.instructor.create({
            data: {
              instructorUId: iData.instructorUId,
              name: iData.name,
              department: iData.department,
              userId: user.id,
            },
          });
          createdInstructorProfilesMap.set(
            iData.instructorUId,
            instructorProfile.id
          );
          console.log(
            `Created instructor profile for: ${instructorProfile.name}`
          );
        }
      }

      if (user.role == "STUDENT") {
        const iData = studentData.find((stud) => {
          return stud.studentUId === u.id;
        });

        if (iData) {
          const studentProfile = await prisma.student.create({
            data: {
              studentUId: iData.studentUId,
              name: iData.name,
              year: iData.year,
              userId: user.id,
            },
          });
          createdStudentProfilesMap.set(iData.studentUId, studentProfile.id);
          console.log(`Created Student profile for: ${studentProfile.name}`);
        }
      }
    } catch (error) {
      if (error.code === "P2002") {
        // Unique constraint violation
        console.warn(
          `User or profile likely already exists for username: ${u.username}. Skipping.`
        );
        // Optionally, fetch existing user to use their ID
        const existingUser = await prisma.user.findUnique({
          where: { username: u.username },
        });
        if (existingUser) createdUsersMap.set(u.id, existingUser.id);
      } else {
        console.error(`Error creating user ${u.username}:`, error);
      }
    }
  }

  // 2. Seed Courses and their Sections
  const createdCoursesMap = new Map();
  const createdSectionsMap = new Map();

  console.log("-----------------------------------------------------------");
  console.log("\nSeeding Courses and Sections...");
  console.log("-----------------------------------------------------------");

  for (const cData of courseData) {
    let courseRecord;
    try {
      courseRecord = await prisma.Course.create({
        data: {
          courseUId: cData.id,
          code: cData.code,
          name: cData.name,
          credits: cData.credits,
          category: cData.category,
          description: cData.description,
          registrationOpen: cData.registrationOpen,
        },
      });
      createdCoursesMap.set(cData.id, courseRecord.id);
      console.log(
        `Created course: ${courseRecord.name} (ID: ${courseRecord.id})`
      );

      // Seed sections for this course
      for (const sData of cData.sections) {
        // console.log(sData);
        console.log("here");
        const instructorProfileId = createdInstructorProfilesMap.get(
          sData.instructor
        );
        console.log(instructorProfileId);
        if (!instructorProfileId) {
          console.warn(
            `  Could not find instructor profile for "${sData.instructor}" to link section ${sData.crn}. Skipping section.`
          );
          continue;
        }
        try {
          const sectionRecord = await prisma.section.create({
            data: {
              crn: sData.crn,
              semester: "Spring 2024",
              schedule: sData.schedule,
              location: sData.location,
              enrolledCount: sData.enrolled,
              capacity: sData.capacity,
              status: sData.status.toUpperCase(),
              courseId: courseRecord.id,
              instructorProfileId: instructorProfileId,
            },
          });
          createdSectionsMap.set(sData.crn, sectionRecord.id);
          console.log(
            `  Created section: CRN ${sectionRecord.crn} for course ${courseRecord.code}`
          );
        } catch (sectionError) {
          if (sectionError.code === "P2002") {
            console.warn(
              `  Section with CRN ${sData.crn} likely already exists. Skipping.`
            );
          } else {
            console.error(
              `  Error creating section CRN ${sData.crn}:`,
              sectionError
            );
          }
        }
      }
      // 3. Seed Course Prerequisites (if any)
      console.log(
        "-----------------------------------------------------------"
      );
      console.log("\nSeeding Course Prerequisites...");
      console.log(
        "-----------------------------------------------------------"
      );
      if (
        courseRecord &&
        cData.prerequisites &&
        cData.prerequisites.length > 0
      ) {
        for (const prereqUId of cData.prerequisites) {
          const mainCourseId = createdCoursesMap.get(cData.id);
          const prerequisiteCourseActualId = createdCoursesMap.get(prereqUId);

          if (mainCourseId && prerequisiteCourseActualId) {
            try {
              await prisma.coursePrerequisite.create({
                data: {
                  courseId: mainCourseId,
                  prerequisiteCourseId: prerequisiteCourseActualId,
                },
              });
              console.log(
                `  Created prerequisite: ${prereqUId} for course ${cData.code}`
              );
            } catch (prereqError) {
              if (prereqError.code === "P2002") {
                // Composite key violation
                console.warn(
                  `  Prerequisite link between ${cData.code} and ${prereqUId} likely already exists.`
                );
              } else {
                console.error(
                  `  Error creating prerequisite for ${cData.code}:`,
                  prereqError
                );
              }
            }
          } else {
            console.warn(
              `  Could not find DB IDs for prerequisite linking: ${cData.id} -> ${prereqUId}. Skipping.`
            );
          }
        }
      } else {
        console.log(
          "  No prerequisites to seed for the current course data or course not created."
        );
      }
    } catch (courseError) {
      if (courseError.code === "P2002") {
        console.warn(
          `Course with code ${cData.code} or UId ${cData.id} likely already exists. Skipping.`
        );
      } else {
        console.error(`Error creating course ${cData.name}:`, courseError);
      }
    }
  }

  // 4. Seed Enrollments
  console.log("-----------------------------------------------------------");
  console.log("\nSeeding Enrollments...");
  console.log("-----------------------------------------------------------");
  for (const student of studentData) {

    const sProfileId = createdStudentProfilesMap.get(student.studentUId);


    if (sProfileId) {
      for (const enrollmentData of student.enrollments) {
        const sectionId = createdSectionsMap.get(enrollmentData.sectionId);

        if (sectionId) {
          try {
            await prisma.enrollment.create({
              data: {
                studentProfileId: sProfileId,
                sectionId: sectionId,
                grade: enrollmentData.grade,
                status: enrollmentData.status.toUpperCase(),
                semester: enrollmentData.semester,
              },
            });
            console.log(
              `  Enrolled student ${studentData.name} in section CRN ${enrollmentData.sectionId}`
            );
          } catch (enrollError) {
            if (enrollError.code === "P2002") {
              // Unique constraint (studentProfileId, sectionId)
              console.warn(
                `  Student ${studentData.name} likely already enrolled in CRN ${enrollmentData.sectionId}.`
              );
            } else {
              console.error(
                `  Error enrolling student in CRN ${enrollmentData.sectionId}:`,
                enrollError
              );
            }
          }
        } else {
          console.warn(
            `  Could not find section with CRN ${enrollmentData.sectionId} for enrollment. Skipping.`
          );
        }
      }
    } else {
      console.warn("  Student profile not found for seeding enrollments.");
    }
  }

  console.log("\nSeeding finished.");
}

await seed();
