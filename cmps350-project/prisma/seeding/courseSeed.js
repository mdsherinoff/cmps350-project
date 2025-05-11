import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import fs from "fs-extra";
import path from "path";

const courseData = await fs.readJSON(
  path.join(process.cwd(), "app/data/courses.json")
);

async function seed() {
  console.log("Start seeding courses...");

  const createdCoursesMap = new Map();
  const createdSectionsMap = new Map();

  console.log("\nSeeding Courses and Sections...");
  for (const cData of courseData) {
    let courseRecord;
    try {
      courseRecord = await prisma.course.create({
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

      for (const sData of cData.sections) {
        const sectionRecord = await prisma.section.create({
          data: {
            crn: sData.crn,
            semester: "Spring 2024", // Example semester, adjust as needed or get from data
            schedule: sData.schedule,
            location: sData.location,
            enrolledCount: sData.enrolled,
            capacity: sData.capacity,
            status: sData.status.toUpperCase(), // Ensure this matches your SectionStatus enum (e.g., OPEN, CLOSED)
            courseId: courseRecord.id,
            instructorProfileId: instructorProfileId,
          },
        });
        createdSectionsMap.set(sData.crn, sectionRecord.id);
        console.log(
          `  Created section: CRN ${sectionRecord.crn} for course ${courseRecord.code}`
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
    if (
      (cData.prerequisites = [
        {
          courseId: "some_course_uid",
          prerequisiteCourseId: "other_course_uid",
        },
      ])
    ) {
      console.log("\nSeeding Course Prerequisites...");
      if (
        courseRecord &&
        cData.prerequisites &&
        cData.prerequisites.length > 0
      ) {
        for (const prereqUId of cData.prerequisites) {
          const mainCourseId = createdCoursesMap.get(cData.id); // ID of the current course
          const prerequisiteCourseActualId = createdCoursesMap.get(prereqUId); // ID of the prerequisite course

          if (mainCourseId && prerequisiteCourseActualId) {
            try {
              await prisma.CoursePrerequisite.create({
                data: {
                  courseId: mainCourseId,
                  prerequisiteCourseId: prerequisiteCourseActualId,
                },
              });
              console.log(
                `  Created prerequisite: ${prereqUId} for course ${cData.code}`
              );
            } catch (prereqError) {
              // Composite key violation
              if (prereqError.code === "P2002") {
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
    }

    console.log("\nSeeding courses finished.");
  }
}

await seed();
