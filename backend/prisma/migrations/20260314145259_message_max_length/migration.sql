/*
  Warnings:

  - You are about to alter the column `message` on the `Message` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(300)`.

*/
-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "message" SET DATA TYPE VARCHAR(300);
