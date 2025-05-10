/*
  Warnings:

  - You are about to drop the column `createdAt` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `sections` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `sections` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "courses" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "sections" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";
