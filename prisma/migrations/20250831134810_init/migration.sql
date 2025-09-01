/*
  Warnings:

  - You are about to alter the column `weekday_price` on the `Field` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `weekend_price` on the `Field` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "public"."Field" ALTER COLUMN "weekday_price" SET DATA TYPE INTEGER,
ALTER COLUMN "weekend_price" DROP NOT NULL,
ALTER COLUMN "weekend_price" SET DATA TYPE INTEGER;
