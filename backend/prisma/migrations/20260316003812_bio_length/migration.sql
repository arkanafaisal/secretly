/*
  Warnings:

  - You are about to alter the column `bio` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(160)` to `VarChar(120)`.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "bio" SET DATA TYPE VARCHAR(120);
