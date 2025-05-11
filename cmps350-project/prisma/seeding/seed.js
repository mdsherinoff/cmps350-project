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
  // We need a way to map original user IDs/names to created User records for linking profiles.
  const createdUsersMap = new Map(); // Maps original user ID (from JSON) to new User UUID
  const createdInstructorProfilesMap = new Map(); // Maps instructor name to new InstructorProfile UUID
  const createdStudentProfilesMap = new Map(); // Maps original student ID (studentUId) to new StudentProfile UUID

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
      createdUsersMap.set(u.id, user.id); // Store mapping from original ID to new UUID
      console.log(`Created user: ${user.username} (ID: ${user.id})`);

      // If user is an instructor, find matching instructor data and create profile
      if (user.role == "INSTRUCTOR") {
        console.log(`Looking for instructorData with userId === ${u.id}`);
        // const iData = instructorData.find((instr) => instr.userId === u.id);
        const iData = instructorData.find((instr) => {
          console.log(`Comparing instructor userId ${instr.instructorUId} to ${u.id}`);
          return instr.instructorUId === u.id;
        });
        if (iData) {
          const instructorProfile = await prisma.Instructor.create({
            data: {
              instructorUId: iData.instructorUId,
              name: iData.name,
              department: iData.department,
              userId: user.id,
            },
          });
          createdInstructorProfilesMap.set(iData.name, instructorProfile.id); // Map by name for section linking
          console.log(
            `  Created instructor profile for: ${instructorProfile.name}`
          );
        }
      }

      // If user is a student, find matching student data and create profile
      if (u.role === "STUDENT" && u.id === studentData.id) {
        // Assuming studentData is a single object for now
        const studentProfile = await prisma.Student.create({
          data: {
            studentUId: studentData.id, // Original student ID
            name: studentData.name,
            major: studentData.major,
            year: studentData.year,
            userId: user.id, // Link to the created User
          },
        });
        createdStudentProfilesMap.set(studentData.id, studentProfile.id);
        console.log(`  Created student profile for: ${studentProfile.name}`);
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
  // const createdCoursesMap = new Map(); // Maps original course ID (courseUId) to new Course UUID
  // const createdSectionsMap = new Map(); // Maps CRN to new Section UUID

  // console.log("-----------------------------------------------------------");
  // console.log("\nSeeding Courses and Sections...");
  // console.log("-----------------------------------------------------------");

  // for (const cData of courseData) {
  //   let courseRecord;
  //   try {
  //     courseRecord = await prisma.Course.create({
  //       data: {
  //         courseUId: cData.id,
  //         code: cData.code,
  //         name: cData.name,
  //         credits: cData.credits,
  //         category: cData.category,
  //         description: cData.description,
  //         registrationOpen: cData.registrationOpen,
  //       },
  //     });
  //     createdCoursesMap.set(cData.id, courseRecord.id);
  //     console.log(
  //       `Created course: ${courseRecord.name} (ID: ${courseRecord.id})`
  //     );

  //     // Seed sections for this course
  //     for (const sData of cData.sections) {
  //       const instructorProfileId = createdInstructorProfilesMap.get(
  //         sData.instructor
  //       );
  //       if (!instructorProfileId) {
  //         console.warn(
  //           `  Could not find instructor profile for "${sData.instructor}" to link section ${sData.crn}. Skipping section.`
  //         );
  //         continue;
  //       }
  //       try {
  //         const sectionRecord = await prisma.section.create({
  //           data: {
  //             crn: sData.crn,
  //             semester: "Spring 2024", // Example semester, adjust as needed or get from data
  //             schedule: sData.schedule,
  //             location: sData.location,
  //             enrolledCount: sData.enrolled,
  //             capacity: sData.capacity,
  //             status: sData.status, // Ensure this matches your SectionStatus enum (e.g., OPEN, CLOSED)
  //             courseId: courseRecord.id,
  //             instructorProfileId: instructorProfileId,
  //           },
  //         });
  //         createdSectionsMap.set(sData.crn, sectionRecord.id);
  //         console.log(
  //           `  Created section: CRN ${sectionRecord.crn} for course ${courseRecord.code}`
  //         );
  //       } catch (sectionError) {
  //         if (sectionError.code === "P2002") {
  //           console.warn(
  //             `  Section with CRN ${sData.crn} likely already exists. Skipping.`
  //           );
  //         } else {
  //           console.error(
  //             `  Error creating section CRN ${sData.crn}:`,
  //             sectionError
  //           );
  //         }
  //       }
  //     }
  //     // 3. Seed Course Prerequisites (if any)
  //     console.log("\nSeeding Course Prerequisites...");
  //     if (
  //       courseRecord &&
  //       cData.prerequisites &&
  //       cData.prerequisites.length > 0
  //     ) {
  //       for (const prereqUId of cData.prerequisites) {
  //         const mainCourseId = createdCoursesMap.get(cData.id); // ID of the current course
  //         const prerequisiteCourseActualId = createdCoursesMap.get(prereqUId); // ID of the prerequisite course

  //         if (mainCourseId && prerequisiteCourseActualId) {
  //           try {
  //             await prisma.coursePrerequisite.create({
  //               data: {
  //                 courseId: mainCourseId,
  //                 prerequisiteCourseId: prerequisiteCourseActualId,
  //               },
  //             });
  //             console.log(
  //               `  Created prerequisite: ${prereqUId} for course ${cData.code}`
  //             );
  //           } catch (prereqError) {
  //             if (prereqError.code === "P2002") {
  //               // Composite key violation
  //               console.warn(
  //                 `  Prerequisite link between ${cData.code} and ${prereqUId} likely already exists.`
  //               );
  //             } else {
  //               console.error(
  //                 `  Error creating prerequisite for ${cData.code}:`,
  //                 prereqError
  //               );
  //             }
  //           }
  //         } else {
  //           console.warn(
  //             `  Could not find DB IDs for prerequisite linking: ${cData.id} -> ${prereqUId}. Skipping.`
  //           );
  //         }
  //       }
  //     } else {
  //       console.log(
  //         "  No prerequisites to seed for the current course data or course not created."
  //       );
  //     }
  //   } catch (courseError) {
  //     if (courseError.code === "P2002") {
  //       console.warn(
  //         `Course with code ${cData.code} or UId ${cData.id} likely already exists. Skipping.`
  //       );
  //     } else {
  //       console.error(`Error creating course ${cData.name}:`, courseError);
  //     }
  //   }
  // }

  // // 4. Seed Enrollments
  // console.log("\nSeeding Enrollments...");
  // // Assuming studentData is a single object for this example
  // const sProfileId = createdStudentProfilesMap.get(studentData.id);
  // if (sProfileId) {
  //   for (const enrollmentData of studentData.courses) {
  //     const sectionId = createdSectionsMap.get(enrollmentData.crn);
  //     // We also need to ensure the course for this enrollment exists if it's not the main one we seeded.
  //     // For simplicity, this seed script assumes CRNs are unique and map to sections created above.
  //     // If an enrollment refers to a CRN not in `courseData.sections`, it won't be found.

  //     if (sectionId) {
  //       try {
  //         await prisma.enrollment.create({
  //           data: {
  //             studentProfileId: sProfileId,
  //             sectionId: sectionId,
  //             grade: enrollmentData.grade,
  //             status: enrollmentData.status, // Ensure matches EnrollmentStatus enum
  //             semester: enrollmentData.semester,
  //           },
  //         });
  //         console.log(
  //           `  Enrolled student ${studentData.name} in section CRN ${enrollmentData.crn}`
  //         );
  //       } catch (enrollError) {
  //         if (enrollError.code === "P2002") {
  //           // Unique constraint (studentProfileId, sectionId)
  //           console.warn(
  //             `  Student ${studentData.name} likely already enrolled in CRN ${enrollmentData.crn}.`
  //           );
  //         } else {
  //           console.error(
  //             `  Error enrolling student in CRN ${enrollmentData.crn}:`,
  //             enrollError
  //           );
  //         }
  //       }
  //     } else {
  //       console.warn(
  //         `  Could not find section with CRN ${enrollmentData.crn} for enrollment. Skipping.`
  //       );
  //     }
  //   }
  // } else {
  //   console.warn("  Student profile not found for seeding enrollments.");
  // }

  console.log("\nSeeding finished.");
}

await seed();
