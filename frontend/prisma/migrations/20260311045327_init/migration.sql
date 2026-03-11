-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "password" TEXT,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Calculation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "cityName" TEXT NOT NULL,
    "score" REAL NOT NULL,
    "impact" TEXT NOT NULL,
    "co2Emissions" REAL NOT NULL,
    "airQualityIndex" REAL NOT NULL,
    "renewableEnergy" REAL NOT NULL,
    "wasteRecycling" REAL NOT NULL,
    "greenSpace" REAL NOT NULL,
    "publicTransport" REAL NOT NULL,
    "waterQuality" REAL NOT NULL,
    "energyEfficiency" REAL NOT NULL,
    "recommendations" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Calculation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
