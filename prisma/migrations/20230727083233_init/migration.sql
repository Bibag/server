-- CreateTable
CREATE TABLE "City" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "District" (
    "code" TEXT NOT NULL,
    "city_code" TEXT NOT NULL,
    "don_vi" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,

    CONSTRAINT "District_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "Ward" (
    "code" TEXT NOT NULL,
    "city_code" TEXT NOT NULL,
    "district_code" TEXT NOT NULL,
    "don_vi" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Ward_pkey" PRIMARY KEY ("code")
);

-- CreateIndex
CREATE UNIQUE INDEX "City_code_key" ON "City"("code");

-- CreateIndex
CREATE UNIQUE INDEX "District_code_key" ON "District"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Ward_code_key" ON "Ward"("code");

-- AddForeignKey
ALTER TABLE "District" ADD CONSTRAINT "District_city_code_fkey" FOREIGN KEY ("city_code") REFERENCES "City"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ward" ADD CONSTRAINT "Ward_district_code_fkey" FOREIGN KEY ("district_code") REFERENCES "District"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ward" ADD CONSTRAINT "Ward_city_code_fkey" FOREIGN KEY ("city_code") REFERENCES "City"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
