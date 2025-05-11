/*
  Warnings:

  - You are about to drop the column `major` on the `student_profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "course_prerequisites" ADD COLUMN     "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "student_profiles" DROP COLUMN "major";
