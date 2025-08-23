/*
  Warnings:

  - You are about to drop the column `bookingDate` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `customerName` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `customerPhone` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `fieldId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Field` table. All the data in the column will be lost.
  - You are about to drop the column `weekdayPrice` on the `Field` table. All the data in the column will be lost.
  - You are about to drop the column `weekendPrice` on the `Field` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - Added the required column `booking_date` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_name` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_phone` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_time` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `field_id` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weekday_price` to the `Field` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weekend_price` to the `Field` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Booking" DROP CONSTRAINT "Booking_fieldId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Booking" DROP CONSTRAINT "Booking_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Booking" DROP COLUMN "bookingDate",
DROP COLUMN "createdAt",
DROP COLUMN "customerName",
DROP COLUMN "customerPhone",
DROP COLUMN "endTime",
DROP COLUMN "fieldId",
DROP COLUMN "startTime",
DROP COLUMN "userId",
ADD COLUMN     "booking_date" DATE NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "customer_name" TEXT NOT NULL,
ADD COLUMN     "customer_phone" TEXT NOT NULL,
ADD COLUMN     "end_time" TIME NOT NULL,
ADD COLUMN     "field_id" INTEGER NOT NULL,
ADD COLUMN     "start_time" TIME NOT NULL,
ADD COLUMN     "user_id" INTEGER;

-- AlterTable
ALTER TABLE "public"."Field" DROP COLUMN "createdAt",
DROP COLUMN "weekdayPrice",
DROP COLUMN "weekendPrice",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "weekday_price" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "weekend_price" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "createdAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "public"."Field"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
