-- CreateTable
CREATE TABLE "NotificationSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" BOOLEAN NOT NULL DEFAULT true,
    "push" BOOLEAN NOT NULL DEFAULT true,
    "sms" BOOLEAN NOT NULL DEFAULT false,
    "frequency" TEXT NOT NULL DEFAULT 'immediate',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NotificationSettings_userId_key" ON "NotificationSettings"("userId");

-- AddForeignKey
ALTER TABLE "NotificationSettings" ADD CONSTRAINT "NotificationSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
