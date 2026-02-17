-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('blocking', 'major', 'minor', 'suggestion');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('pending_verification', 'open', 'in_progress', 'resolved', 'closed', 'incoming', 'acknowledged', 'review', 'triaged', 'investigating', 'pending');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('urgent', 'high', 'medium', 'low');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('status_change', 'assignment', 'resolution', 'update');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "stepsToReproduce" TEXT[],
    "severity" "Severity" NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'pending_verification',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userEmail" TEXT NOT NULL,
    "userFullName" TEXT NOT NULL,
    "submitterId" TEXT,
    "category" TEXT,
    "labels" TEXT[],
    "priority" "Priority",
    "assignedTo" TEXT[],
    "dueDate" TIMESTAMP(3),
    "estimatedHours" DOUBLE PRECISION,
    "actualHours" DOUBLE PRECISION,
    "resolvedAt" TIMESTAMP(3),
    "resolutionSummary" TEXT,
    "environmentDetails" JSONB,
    "attachments" JSONB,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "mentions" TEXT[],

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatusHistory" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changedBy" TEXT NOT NULL,
    "reason" TEXT,

    CONSTRAINT "StatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_submitterId_fkey" FOREIGN KEY ("submitterId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatusHistory" ADD CONSTRAINT "StatusHistory_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
