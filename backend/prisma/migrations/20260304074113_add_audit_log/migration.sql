-- CreateTable
CREATE TABLE "AUDIT_LOG" (
    "MaLog" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "MaTK" TEXT,
    "HanhDong" TEXT NOT NULL,
    "Module" TEXT NOT NULL,
    "ChiTiet" TEXT,
    "IP" TEXT,
    "UserAgent" TEXT,

    CONSTRAINT "AUDIT_LOG_pkey" PRIMARY KEY ("MaLog")
);
