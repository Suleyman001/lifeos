-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT 'Administrator',
    "email" TEXT,
    "avatarUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'dark',
    "accentColor" TEXT NOT NULL DEFAULT '#047857',
    "territoryWeights" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Territory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT NOT NULL DEFAULT '#047857',
    "weight" REAL NOT NULL DEFAULT 1.0,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "weeklyScore" REAL NOT NULL DEFAULT 0.0,
    "monthlyScore" REAL NOT NULL DEFAULT 0.0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "userId" TEXT NOT NULL DEFAULT 'default-user-id',
    "territoryId" TEXT,
    "missionId" TEXT,
    "activeChallengeId" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "energyRequired" TEXT NOT NULL DEFAULT 'MEDIUM',
    "estimatedDurationMinutes" INTEGER,
    "recurrenceType" TEXT NOT NULL DEFAULT 'NONE',
    "recurrenceRule" TEXT,
    "startTime" TEXT,
    "endTime" TEXT,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Task_territoryId_fkey" FOREIGN KEY ("territoryId") REFERENCES "Territory" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Task_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Task_activeChallengeId_fkey" FOREIGN KEY ("activeChallengeId") REFERENCES "ActiveChallenge" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TaskOccurrence" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "taskId" TEXT NOT NULL,
    "userId" TEXT NOT NULL DEFAULT 'default-user-id',
    "scheduledDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "completedAt" DATETIME,
    "actualDurationMinutes" INTEGER,
    "xpEarned" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TaskOccurrence_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TaskOccurrence_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Habit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "userId" TEXT NOT NULL DEFAULT 'default-user-id',
    "territoryId" TEXT NOT NULL,
    "activeChallengeId" TEXT,
    "type" TEXT NOT NULL DEFAULT 'BINARY',
    "targetValue" REAL NOT NULL DEFAULT 1.0,
    "unit" TEXT,
    "frequency" TEXT NOT NULL DEFAULT 'DAILY',
    "targetDays" TEXT,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "momentum" REAL NOT NULL DEFAULT 100.0,
    "totalCompletions" INTEGER NOT NULL DEFAULT 0,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Habit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Habit_territoryId_fkey" FOREIGN KEY ("territoryId") REFERENCES "Territory" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Habit_activeChallengeId_fkey" FOREIGN KEY ("activeChallengeId") REFERENCES "ActiveChallenge" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HabitLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "habitId" TEXT NOT NULL,
    "userId" TEXT NOT NULL DEFAULT 'default-user-id',
    "date" DATETIME NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "value" REAL NOT NULL DEFAULT 0.0,
    "xpEarned" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "HabitLog_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habit" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "HabitLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Challenge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "territoryId" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'DEEN',
    "durationDays" INTEGER NOT NULL DEFAULT 30,
    "targetType" TEXT NOT NULL DEFAULT 'BINARY',
    "targetValue" REAL NOT NULL DEFAULT 1.0,
    "unit" TEXT,
    "rewardXp" INTEGER NOT NULL DEFAULT 100,
    "isSystem" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Challenge_territoryId_fkey" FOREIGN KEY ("territoryId") REFERENCES "Territory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ActiveChallenge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "challengeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL DEFAULT 'default-user-id',
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "currentValue" REAL NOT NULL DEFAULT 0.0,
    "progressPercent" REAL NOT NULL DEFAULT 0.0,
    "completedAt" DATETIME,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ActiveChallenge_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ActiveChallenge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LearningItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'OTHER',
    "userId" TEXT NOT NULL DEFAULT 'default-user-id',
    "territoryId" TEXT NOT NULL,
    "progressPercent" REAL NOT NULL DEFAULT 0.0,
    "timeSpentMinutes" INTEGER NOT NULL DEFAULT 0,
    "lessonsCompleted" INTEGER NOT NULL DEFAULT 0,
    "totalLessons" INTEGER,
    "vocabLearned" INTEGER NOT NULL DEFAULT 0,
    "targetVocab" INTEGER,
    "targetDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LearningItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LearningItem_territoryId_fkey" FOREIGN KEY ("territoryId") REFERENCES "Territory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LearningSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "learningItemId" TEXT NOT NULL,
    "userId" TEXT NOT NULL DEFAULT 'default-user-id',
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "durationMinutes" INTEGER NOT NULL,
    "itemsLearned" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "xpEarned" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LearningSession_learningItemId_fkey" FOREIGN KEY ("learningItemId") REFERENCES "LearningItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LearningSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CareerApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "company" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "location" TEXT,
    "workType" TEXT NOT NULL DEFAULT 'HYBRID',
    "status" TEXT NOT NULL DEFAULT 'SAVED',
    "appliedDate" DATETIME,
    "salary" TEXT,
    "visaSponsorship" BOOLEAN NOT NULL DEFAULT false,
    "followUpDate" DATETIME,
    "jobUrl" TEXT,
    "notes" TEXT,
    "userId" TEXT NOT NULL DEFAULT 'default-user-id',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CareerApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "JournalEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL DEFAULT 'default-user-id',
    "date" DATETIME NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'DAILY',
    "whatWentWell" TEXT,
    "whatToImprove" TEXT,
    "gratitude" TEXT,
    "distractions" TEXT,
    "whatILearned" TEXT,
    "closerToAllah" TEXT,
    "energyDrainers" TEXT,
    "energyGivers" TEXT,
    "smallWin" TEXT,
    "tomorrowAction" TEXT,
    "moodScore" INTEGER DEFAULT 5,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "JournalEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DailySummary" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL DEFAULT 'default-user-id',
    "date" DATETIME NOT NULL,
    "betterThanYesterdayScore" REAL NOT NULL DEFAULT 0.0,
    "focusedTimeMinutes" INTEGER NOT NULL DEFAULT 0,
    "deepWorkMinutes" INTEGER NOT NULL DEFAULT 0,
    "wastedTimeMinutes" INTEGER NOT NULL DEFAULT 0,
    "productivePercent" REAL NOT NULL DEFAULT 0.0,
    "plannedTimeMinutes" INTEGER NOT NULL DEFAULT 0,
    "completedTimeMinutes" INTEGER NOT NULL DEFAULT 0,
    "habitsCompleted" INTEGER NOT NULL DEFAULT 0,
    "totalHabits" INTEGER NOT NULL DEFAULT 0,
    "tasksCompleted" INTEGER NOT NULL DEFAULT 0,
    "totalXpEarned" INTEGER NOT NULL DEFAULT 0,
    "momentumScore" REAL NOT NULL DEFAULT 100.0,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DailySummary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WeeklySummary" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL DEFAULT 'default-user-id',
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "averageBetterScore" REAL NOT NULL DEFAULT 0.0,
    "totalDeepWorkMinutes" INTEGER NOT NULL DEFAULT 0,
    "habitCompletionRate" REAL NOT NULL DEFAULT 0.0,
    "totalXpEarned" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WeeklySummary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MonthlySummary" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL DEFAULT 'default-user-id',
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "averageBetterScore" REAL NOT NULL DEFAULT 0.0,
    "totalDeepWorkMinutes" INTEGER NOT NULL DEFAULT 0,
    "habitCompletionRate" REAL NOT NULL DEFAULT 0.0,
    "totalXpEarned" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MonthlySummary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL DEFAULT 'default-user-id',
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "territoryId" TEXT,
    "xpEarned" INTEGER NOT NULL DEFAULT 0,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ActivityLog_territoryId_fkey" FOREIGN KEY ("territoryId") REFERENCES "Territory" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "XPLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL DEFAULT 'default-user-id',
    "amount" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "territoryId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "XPLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "XPLog_territoryId_fkey" FOREIGN KEY ("territoryId") REFERENCES "Territory" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "isUnlocked" BOOLEAN NOT NULL DEFAULT false,
    "unlockedAt" DATETIME,
    "userId" TEXT NOT NULL DEFAULT 'default-user-id',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Achievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Mission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "userId" TEXT NOT NULL DEFAULT 'default-user-id',
    "territoryId" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'HIGH',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "progressPercent" REAL NOT NULL DEFAULT 0.0,
    "startDate" DATETIME,
    "targetDate" DATETIME,
    "isCurrentMission" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Mission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Mission_territoryId_fkey" FOREIGN KEY ("territoryId") REFERENCES "Territory" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FuturePlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'OTHER',
    "targetDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'PLANNED',
    "notes" TEXT,
    "userId" TEXT NOT NULL DEFAULT 'default-user-id',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FuturePlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InboxItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "convertedToType" TEXT,
    "convertedId" TEXT,
    "userId" TEXT NOT NULL DEFAULT 'default-user-id',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InboxItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Settings_userId_key" ON "Settings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Territory_name_key" ON "Territory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Territory_slug_key" ON "Territory"("slug");

-- CreateIndex
CREATE INDEX "TaskOccurrence_scheduledDate_idx" ON "TaskOccurrence"("scheduledDate");

-- CreateIndex
CREATE INDEX "TaskOccurrence_taskId_scheduledDate_idx" ON "TaskOccurrence"("taskId", "scheduledDate");

-- CreateIndex
CREATE INDEX "HabitLog_date_idx" ON "HabitLog"("date");

-- CreateIndex
CREATE UNIQUE INDEX "HabitLog_habitId_date_key" ON "HabitLog"("habitId", "date");

-- CreateIndex
CREATE INDEX "JournalEntry_date_idx" ON "JournalEntry"("date");

-- CreateIndex
CREATE UNIQUE INDEX "JournalEntry_userId_date_type_key" ON "JournalEntry"("userId", "date", "type");

-- CreateIndex
CREATE UNIQUE INDEX "DailySummary_date_key" ON "DailySummary"("date");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklySummary_userId_startDate_key" ON "WeeklySummary"("userId", "startDate");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlySummary_userId_year_month_key" ON "MonthlySummary"("userId", "year", "month");

-- CreateIndex
CREATE INDEX "ActivityLog_timestamp_idx" ON "ActivityLog"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_code_key" ON "Achievement"("code");
