/*
  Warnings:

  - The values [NAM,NU] on the enum `LoaiDanhMuc` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `NoiDung` on the `PHANHOI` table. All the data in the column will be lost.
  - The primary key for the `PHIEUNHAPHANG` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `MaCTSP` on the `PHIEUNHAPHANG` table. All the data in the column will be lost.
  - You are about to drop the column `MaPNNH` on the `PHIEUNHAPHANG` table. All the data in the column will be lost.
  - You are about to drop the column `MatKhau` on the `TAIKHOAN` table. All the data in the column will be lost.
  - You are about to drop the column `FreeShip` on the `VOUCHER` table. All the data in the column will be lost.
  - You are about to drop the `NHACUNGCAP` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[Email]` on the table `TAIKHOAN` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `DiaChi` to the `DONHANG` table without a default value. This is not possible if the table is not empty.
  - Added the required column `SoDienThoai` to the `DONHANG` table without a default value. This is not possible if the table is not empty.
  - Added the required column `TenNM` to the `DONHANG` table without a default value. This is not possible if the table is not empty.
  - Made the column `BinhLuan` on table `PHANHOI` required. This step will fail if there are existing NULL values in that column.
  - The required column `MaPNH` was added to the `PHIEUNHAPHANG` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Made the column `MaTKNVQL` on table `PHIEUNHAPHANG` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `slug` to the `SANPHAM` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `MauSac` on the `SANPHAM` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `Code` to the `VOUCHER` table without a default value. This is not possible if the table is not empty.
  - Added the required column `LoaiVoucher` to the `VOUCHER` table without a default value. This is not possible if the table is not empty.
  - Added the required column `SoLuong` to the `VOUCHER` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Hsd` to the `VOUCHER_KHACHHANG` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LoaiVoucher" AS ENUM ('FreeShip', 'GiamGia');

-- CreateEnum
CREATE TYPE "PhuongThucTT" AS ENUM ('VNPAY', 'PAYPAL');

-- CreateEnum
CREATE TYPE "LoaiTB" AS ENUM ('VOUCHER', 'SUKIENUUDAI');

-- AlterEnum
BEGIN;
CREATE TYPE "LoaiDanhMuc_new" AS ENUM ('AO', 'QUAN', 'PHU_KIEN');
ALTER TABLE "DANHMUC" ALTER COLUMN "LoaiDanhMuc" TYPE "LoaiDanhMuc_new" USING ("LoaiDanhMuc"::text::"LoaiDanhMuc_new");
ALTER TYPE "LoaiDanhMuc" RENAME TO "LoaiDanhMuc_old";
ALTER TYPE "LoaiDanhMuc_new" RENAME TO "LoaiDanhMuc";
DROP TYPE "public"."LoaiDanhMuc_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."PHIEUNHAPHANG" DROP CONSTRAINT "PHIEUNHAPHANG_MaCTSP_fkey";

-- DropForeignKey
ALTER TABLE "public"."PHIEUNHAPHANG" DROP CONSTRAINT "PHIEUNHAPHANG_MaNCC_fkey";

-- DropForeignKey
ALTER TABLE "public"."PHIEUNHAPHANG" DROP CONSTRAINT "PHIEUNHAPHANG_MaTKNVQL_fkey";

-- AlterTable
ALTER TABLE "DONHANG" ADD COLUMN     "DiaChi" TEXT NOT NULL,
ADD COLUMN     "SoDienThoai" TEXT NOT NULL,
ADD COLUMN     "TenNM" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PHANHOI" DROP COLUMN "NoiDung",
ALTER COLUMN "BinhLuan" SET NOT NULL;

-- AlterTable
ALTER TABLE "PHIEUNHAPHANG" DROP CONSTRAINT "PHIEUNHAPHANG_pkey",
DROP COLUMN "MaCTSP",
DROP COLUMN "MaPNNH",
ADD COLUMN     "MaPNH" TEXT NOT NULL,
ALTER COLUMN "MaTKNVQL" SET NOT NULL,
ALTER COLUMN "NoiDung" DROP NOT NULL,
ADD CONSTRAINT "PHIEUNHAPHANG_pkey" PRIMARY KEY ("MaPNH");

-- AlterTable
ALTER TABLE "SANPHAM" ADD COLUMN     "slug" TEXT NOT NULL,
DROP COLUMN "MauSac",
ADD COLUMN     "MauSac" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TAIKHOAN" DROP COLUMN "MatKhau",
ADD COLUMN     "DisplayName" TEXT,
ADD COLUMN     "Email" TEXT;

-- AlterTable
ALTER TABLE "VOUCHER" DROP COLUMN "FreeShip",
ADD COLUMN     "Code" TEXT NOT NULL,
ADD COLUMN     "LoaiVoucher" "LoaiVoucher" NOT NULL,
ADD COLUMN     "SoLuong" INTEGER NOT NULL,
ALTER COLUMN "SoTien" DROP NOT NULL,
ALTER COLUMN "Dieukien" DROP NOT NULL;

-- AlterTable
ALTER TABLE "VOUCHER_KHACHHANG" ADD COLUMN     "Hsd" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "public"."NHACUNGCAP";

-- DropEnum
DROP TYPE "public"."MauSac";

-- CreateTable
CREATE TABLE "CHITIETNHAPHANG" (
    "MaCTNH" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DonGia" INTEGER NOT NULL,
    "SoLuong" INTEGER NOT NULL,
    "MaPNH" TEXT NOT NULL,
    "MaCTSP" TEXT NOT NULL,

    CONSTRAINT "CHITIETNHAPHANG_pkey" PRIMARY KEY ("MaCTNH")
);

-- CreateTable
CREATE TABLE "THANHTOAN" (
    "MaTTDH" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "MaDH" TEXT NOT NULL,
    "MaKH" TEXT NOT NULL,
    "MaGD" TEXT NOT NULL,
    "PhuongThuc" "PhuongThucTT" NOT NULL,
    "SoTien" INTEGER NOT NULL,

    CONSTRAINT "THANHTOAN_pkey" PRIMARY KEY ("MaTTDH")
);

-- CreateTable
CREATE TABLE "THONGBAO" (
    "MaTB" TEXT NOT NULL,
    "Loai" "LoaiTB" NOT NULL,
    "MaVoucher" TEXT,
    "MaSK" TEXT,

    CONSTRAINT "THONGBAO_pkey" PRIMARY KEY ("MaTB")
);

-- CreateIndex
CREATE UNIQUE INDEX "TAIKHOAN_Email_key" ON "TAIKHOAN"("Email");

-- AddForeignKey
ALTER TABLE "CHITIETNHAPHANG" ADD CONSTRAINT "CHITIETNHAPHANG_MaCTSP_fkey" FOREIGN KEY ("MaCTSP") REFERENCES "CHITIETSANPHAM"("MaCTSP") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CHITIETNHAPHANG" ADD CONSTRAINT "CHITIETNHAPHANG_MaPNH_fkey" FOREIGN KEY ("MaPNH") REFERENCES "PHIEUNHAPHANG"("MaPNH") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "THANHTOAN" ADD CONSTRAINT "THANHTOAN_MaKH_fkey" FOREIGN KEY ("MaKH") REFERENCES "TAIKHOAN"("MaTK") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "THANHTOAN" ADD CONSTRAINT "THANHTOAN_MaDH_fkey" FOREIGN KEY ("MaDH") REFERENCES "DONHANG"("MaDH") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PHIEUNHAPHANG" ADD CONSTRAINT "PHIEUNHAPHANG_MaNCC_fkey" FOREIGN KEY ("MaNCC") REFERENCES "TAIKHOAN"("MaTK") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PHIEUNHAPHANG" ADD CONSTRAINT "PHIEUNHAPHANG_MaTKNVQL_fkey" FOREIGN KEY ("MaTKNVQL") REFERENCES "TAIKHOAN"("MaTK") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "THONGBAO" ADD CONSTRAINT "THONGBAO_MaSK_fkey" FOREIGN KEY ("MaSK") REFERENCES "SUKIENUUDAI"("MaSK") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "THONGBAO" ADD CONSTRAINT "THONGBAO_MaVoucher_fkey" FOREIGN KEY ("MaVoucher") REFERENCES "VOUCHER"("MaVoucher") ON DELETE SET NULL ON UPDATE CASCADE;
