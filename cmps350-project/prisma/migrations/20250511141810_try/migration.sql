/*
  Warnings:

  - You are about to drop the column `assignedAt` on the `course_prerequisites` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `instructor_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `instructor_profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "course_prerequisites" DROP COLUMN "assignedAt";

-- AlterTable
ALTER TABLE "instructor_profiles" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";
