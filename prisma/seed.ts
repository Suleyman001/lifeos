import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting LifeOS Database Seed...");

  // 1. Create Default User Anchor
  const user = await prisma.user.upsert({
    where: { id: "default-user-id" },
    update: {
      name: "Administrator",
    },
    create: {
      id: "default-user-id",
      name: "Administrator",
      email: "admin@lifeos.local",
    },
  });

  console.log(`✅ User seeded: ${user.name} (${user.id})`);

  // 2. Create User Settings
  await prisma.settings.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      theme: "dark",
      accentColor: "#047857", // Dark Emerald Islamic accent
      territoryWeights: JSON.stringify({
        deen: 1.5,
        health: 1.2,
        knowledge: 1.2,
        career: 1.1,
        family: 1.1,
        relationships: 1.0,
        mind: 1.0,
        finance: 1.0,
        adventure: 0.9,
        home: 0.9,
      }),
    },
  });

  console.log("✅ User Settings seeded.");

  // 3. Create 10 Core Territories
  const territoriesData = [
    {
      slug: "deen",
      name: "Deen",
      description: "Every step you take toward Allah is rewarded.",
      icon: "Moon",
      color: "#047857", // Dark Emerald
      weight: 1.5,
    },
    {
      slug: "health",
      name: "Health",
      description: "Your body is an amanah entrusted to you.",
      icon: "Activity",
      color: "#059669", // Emerald
      weight: 1.2,
    },
    {
      slug: "knowledge",
      name: "Knowledge",
      description: "The angels lower their wings for the seeker of knowledge.",
      icon: "BookOpen",
      color: "#0d9488", // Teal
      weight: 1.2,
    },
    {
      slug: "career",
      name: "Career",
      description: "Build excellence and strive for mastery in your craft.",
      icon: "Briefcase",
      color: "#0891b2", // Cyan
      weight: 1.1,
    },
    {
      slug: "family",
      name: "Family",
      description: "The best of you are those who are best to their families.",
      icon: "Heart",
      color: "#2563eb", // Blue
      weight: 1.1,
    },
    {
      slug: "relationships",
      name: "Relationships",
      description: "Surround yourself with pious and inspiring companions.",
      icon: "Users",
      color: "#4f46e5", // Indigo
      weight: 1.0,
    },
    {
      slug: "mind",
      name: "Mind",
      description: "Guard your heart and cultivate mental clarity and peace.",
      icon: "Brain",
      color: "#7c3aed", // Violet
      weight: 1.0,
    },
    {
      slug: "finance",
      name: "Finance",
      description: "Manage your wealth responsibly and give generously in charity.",
      icon: "DollarSign",
      color: "#10b981", // Emerald light
      weight: 1.0,
    },
    {
      slug: "adventure",
      name: "Adventure",
      description: "Explore Allah's creation with wonder, courage, and gratitude.",
      icon: "Compass",
      color: "#d97706", // Amber
      weight: 0.9,
    },
    {
      slug: "home",
      name: "Home",
      description: "Create a serene sanctuary that nurtures your soul and family.",
      icon: "Home",
      color: "#475569", // Slate
      weight: 0.9,
    },
  ];

  const territoryMap: Record<string, string> = {};

  for (const t of territoriesData) {
    const created = await prisma.territory.upsert({
      where: { slug: t.slug },
      update: t,
      create: t,
    });
    territoryMap[t.slug] = created.id;
  }

  console.log("✅ 10 Core Territories seeded.");

  // 4. Seed Starter Habits
  const starterHabits = [
    // Deen Habits
    {
      title: "Fajr Prayer",
      description: "Perform Fajr prayer on time.",
      territoryId: territoryMap["deen"],
      type: "BINARY" as const,
      targetValue: 1,
      unit: "times",
      frequency: "DAILY" as const,
    },
    {
      title: "Dhuhr Prayer",
      description: "Perform Dhuhr prayer on time.",
      territoryId: territoryMap["deen"],
      type: "BINARY" as const,
      targetValue: 1,
      unit: "times",
      frequency: "DAILY" as const,
    },
    {
      title: "Asr Prayer",
      description: "Perform Asr prayer on time.",
      territoryId: territoryMap["deen"],
      type: "BINARY" as const,
      targetValue: 1,
      unit: "times",
      frequency: "DAILY" as const,
    },
    {
      title: "Maghrib Prayer",
      description: "Perform Maghrib prayer on time.",
      territoryId: territoryMap["deen"],
      type: "BINARY" as const,
      targetValue: 1,
      unit: "times",
      frequency: "DAILY" as const,
    },
    {
      title: "Isha Prayer",
      description: "Perform Isha prayer on time.",
      territoryId: territoryMap["deen"],
      type: "BINARY" as const,
      targetValue: 1,
      unit: "times",
      frequency: "DAILY" as const,
    },
    {
      title: "Tahajjud",
      description: "Night prayer before Fajr.",
      territoryId: territoryMap["deen"],
      type: "BINARY" as const,
      targetValue: 1,
      unit: "times",
      frequency: "DAILY" as const,
    },
    {
      title: "Morning Adhkar",
      description: "Recite morning remembrance of Allah.",
      territoryId: territoryMap["deen"],
      type: "BINARY" as const,
      targetValue: 1,
      unit: "times",
      frequency: "DAILY" as const,
    },
    {
      title: "Evening Adhkar",
      description: "Recite evening remembrance of Allah.",
      territoryId: territoryMap["deen"],
      type: "BINARY" as const,
      targetValue: 1,
      unit: "times",
      frequency: "DAILY" as const,
    },
    {
      title: "Quran Recitation",
      description: "Daily Quran reading time.",
      territoryId: territoryMap["deen"],
      type: "TIME_BASED" as const,
      targetValue: 30,
      unit: "minutes",
      frequency: "DAILY" as const,
    },
    // Health Habits
    {
      title: "7,500 Steps Daily",
      description: "Walk at least 7,500 steps today.",
      territoryId: territoryMap["health"],
      type: "NUMERIC" as const,
      targetValue: 7500,
      unit: "steps",
      frequency: "DAILY" as const,
    },
    {
      title: "Water Intake",
      description: "Hydrate properly with clean water.",
      territoryId: territoryMap["health"],
      type: "NUMERIC" as const,
      targetValue: 2.5,
      unit: "L",
      frequency: "DAILY" as const,
    },
    // Knowledge Habits
    {
      title: "German Practice",
      description: "Study German vocabulary and grammar.",
      territoryId: territoryMap["knowledge"],
      type: "TIME_BASED" as const,
      targetValue: 45,
      unit: "minutes",
      frequency: "DAILY" as const,
    },
    // Mind Habits
    {
      title: "No Porn",
      description: "Maintain spiritual purity and mental discipline.",
      territoryId: territoryMap["mind"],
      type: "BINARY" as const,
      targetValue: 1,
      unit: "days",
      frequency: "DAILY" as const,
    },
    {
      title: "No Scrolling",
      description: "Avoid mindless social media doomscrolling.",
      territoryId: territoryMap["mind"],
      type: "BINARY" as const,
      targetValue: 1,
      unit: "days",
      frequency: "DAILY" as const,
    },
    // Family Habits
    {
      title: "Family Call / Interaction",
      description: "Spend quality time or call family members.",
      territoryId: territoryMap["family"],
      type: "BINARY" as const,
      targetValue: 1,
      unit: "times",
      frequency: "DAILY" as const,
    },
    // Home Habits
    {
      title: "Room Cleaning",
      description: "Tidy up workspace and living area.",
      territoryId: territoryMap["home"],
      type: "BINARY" as const,
      targetValue: 1,
      unit: "times",
      frequency: "DAILY" as const,
    },
  ];

  for (const h of starterHabits) {
    const existing = await prisma.habit.findFirst({
      where: { userId: user.id, title: h.title },
    });
    if (!existing) {
      await prisma.habit.create({
        data: {
          ...h,
          userId: user.id,
        },
      });
    }
  }

  console.log("✅ Starter Habits seeded.");

  // 5. Seed Master Library Challenges (20+)
  const masterChallenges = [
    {
      title: "Wake Before Fajr For 7 Days",
      description: "Consistent early rising for Tahajjud and Fajr in congregation.",
      territoryId: territoryMap["deen"],
      category: "DEEN" as const,
      durationDays: 7,
      targetType: "BINARY" as const,
      targetValue: 7,
      unit: "days",
      rewardXp: 150,
    },
    {
      title: "Recite Surah Baqarah For 30 Days",
      description: "Bring blessing and protection into your home.",
      territoryId: territoryMap["deen"],
      category: "DEEN" as const,
      durationDays: 30,
      targetType: "BINARY" as const,
      targetValue: 30,
      unit: "days",
      rewardXp: 500,
    },
    {
      title: "Complete One Juz",
      description: "Read 20 pages or complete one full Juz of the Holy Quran.",
      territoryId: territoryMap["deen"],
      category: "DEEN" as const,
      durationDays: 7,
      targetType: "NUMERIC" as const,
      targetValue: 20,
      unit: "pages",
      rewardXp: 200,
    },
    {
      title: "Attend Islamic Class",
      description: "Attend a live or online halaqah or Islamic lecture.",
      territoryId: territoryMap["deen"],
      category: "DEEN" as const,
      durationDays: 1,
      targetType: "BINARY" as const,
      targetValue: 1,
      unit: "session",
      rewardXp: 100,
    },
    {
      title: "Learn 10 Names of Allah",
      description: "Memorize and reflect upon 10 beautiful names of Allah.",
      territoryId: territoryMap["deen"],
      category: "DEEN" as const,
      durationDays: 5,
      targetType: "NUMERIC" as const,
      targetValue: 10,
      unit: "names",
      rewardXp: 150,
    },
    {
      title: "Fast White Days",
      description: "Fast on the 13th, 14th, and 15th of the Hijri month.",
      territoryId: territoryMap["deen"],
      category: "DEEN" as const,
      durationDays: 3,
      targetType: "BINARY" as const,
      targetValue: 3,
      unit: "days",
      rewardXp: 300,
    },
    {
      title: "7,500 Steps Daily for 30 Days",
      description: "Build robust cardiovascular health and daily physical endurance.",
      territoryId: territoryMap["health"],
      category: "HEALTH" as const,
      durationDays: 30,
      targetType: "NUMERIC" as const,
      targetValue: 30,
      unit: "days",
      rewardXp: 400,
    },
    {
      title: "30 Days Without Sugar",
      description: "Eliminate refined sugar and sweet beverages completely.",
      territoryId: territoryMap["health"],
      category: "HEALTH" as const,
      durationDays: 30,
      targetType: "BINARY" as const,
      targetValue: 30,
      unit: "days",
      rewardXp: 450,
    },
    {
      title: "Track Spending For 30 Days",
      description: "Log every single transaction to gain full control of finances.",
      territoryId: territoryMap["finance"],
      category: "WEALTH" as const,
      durationDays: 30,
      targetType: "BINARY" as const,
      targetValue: 30,
      unit: "days",
      rewardXp: 300,
    },
    {
      title: "Start A Faceless Brand",
      description: "Research niche, create account, and post initial piece of content.",
      territoryId: territoryMap["career"],
      category: "CAREER" as const,
      durationDays: 14,
      targetType: "BINARY" as const,
      targetValue: 1,
      unit: "milestone",
      rewardXp: 350,
    },
    {
      title: "Write 100 Duas",
      description: "Compile a personal dua journal for Dunya and Akhirah.",
      territoryId: territoryMap["deen"],
      category: "DEEN" as const,
      durationDays: 10,
      targetType: "NUMERIC" as const,
      targetValue: 100,
      unit: "duas",
      rewardXp: 250,
    },
    {
      title: "Make A New Friend From The Masjid",
      description: "Greet a fellow brother, strike a conversation, and stay connected.",
      territoryId: territoryMap["relationships"],
      category: "RELATIONSHIPS" as const,
      durationDays: 7,
      targetType: "BINARY" as const,
      targetValue: 1,
      unit: "friend",
      rewardXp: 200,
    },
    {
      title: "Visit A Sick Muslim",
      description: "Fulfill the sunnah of visiting a sick friend or relative.",
      territoryId: territoryMap["relationships"],
      category: "RELATIONSHIPS" as const,
      durationDays: 7,
      targetType: "BINARY" as const,
      targetValue: 1,
      unit: "visit",
      rewardXp: 250,
    },
    {
      title: "Spend One Hour With Parents",
      description: "Undivided quality time with parents without phones or distractions.",
      territoryId: territoryMap["family"],
      category: "RELATIONSHIPS" as const,
      durationDays: 1,
      targetType: "TIME_BASED" as const,
      targetValue: 60,
      unit: "minutes",
      rewardXp: 200,
    },
    {
      title: "No Complaining For One Day",
      description: "Practice absolute Al-Hamdulillah and positive speech for 24 hours.",
      territoryId: territoryMap["mind"],
      category: "MIND" as const,
      durationDays: 1,
      targetType: "BINARY" as const,
      targetValue: 1,
      unit: "day",
      rewardXp: 150,
    },
    {
      title: "Read 10 Pages Daily",
      description: "Read 10 pages of a non-fiction book every day for 14 days.",
      territoryId: territoryMap["knowledge"],
      category: "KNOWLEDGE" as const,
      durationDays: 14,
      targetType: "NUMERIC" as const,
      targetValue: 14,
      unit: "days",
      rewardXp: 250,
    },
    {
      title: "Complete an AWS module",
      description: "Finish one full learning module for AWS Cloud Architect.",
      territoryId: territoryMap["career"],
      category: "CAREER" as const,
      durationDays: 7,
      targetType: "BINARY" as const,
      targetValue: 1,
      unit: "module",
      rewardXp: 300,
    },
    {
      title: "Apply to 5 jobs",
      description: "Submit 5 tailored applications in target EU countries.",
      territoryId: territoryMap["career"],
      category: "CAREER" as const,
      durationDays: 7,
      targetType: "NUMERIC" as const,
      targetValue: 5,
      unit: "applications",
      rewardXp: 300,
    },
    {
      title: "Learn 50 German words",
      description: "Master 50 high-frequency German vocabulary words.",
      territoryId: territoryMap["knowledge"],
      category: "KNOWLEDGE" as const,
      durationDays: 5,
      targetType: "NUMERIC" as const,
      targetValue: 50,
      unit: "words",
      rewardXp: 200,
    },
  ];

  for (const c of masterChallenges) {
    const existing = await prisma.challenge.findFirst({
      where: { title: c.title },
    });
    if (!existing) {
      await prisma.challenge.create({
        data: c,
      });
    }
  }

  console.log("✅ 20 Master Challenges seeded.");

  // 6. Seed Initial Achievements
  const achievements = [
    {
      code: "FIRST_STEP",
      title: "First Step",
      description: "Complete your very first task in LifeOS.",
      icon: "CheckCircle",
    },
    {
      code: "FAJR_WARRIOR",
      title: "Fajr Warrior",
      description: "Maintain a 7-day streak for Fajr prayer.",
      icon: "Sunrise",
    },
    {
      code: "DEEP_DIVER",
      title: "Deep Work Master",
      description: "Complete 10 deep work sessions.",
      icon: "Zap",
    },
    {
      code: "PURITY_KEEPER",
      title: "Purity Keeper",
      description: "Reach 30 days without porn.",
      icon: "ShieldCheck",
    },
    {
      code: "SEEKER_OF_KNOWLEDGE",
      title: "Seeker of Knowledge",
      description: "Complete your first Juz of Quran.",
      icon: "BookOpen",
    },
    {
      code: "MOMENTUM_BUILDER",
      title: "Momentum Builder",
      description: "Achieve a 7-day consistent habit momentum.",
      icon: "TrendingUp",
    },
  ];

  for (const a of achievements) {
    await prisma.achievement.upsert({
      where: { code: a.code },
      update: a,
      create: {
        ...a,
        userId: user.id,
      },
    });
  }

  console.log("✅ Initial Achievements seeded.");

  // 7. Seed Initial Mission
  const existingMission = await prisma.mission.findFirst({
    where: { userId: user.id, isCurrentMission: true },
  });

  if (!existingMission) {
    await prisma.mission.create({
      data: {
        title: "AWS Certification Study",
        description: "Highest-impact available activity right now. Master AWS Cloud Architect.",
        userId: user.id,
        territoryId: territoryMap["career"],
        priority: "HIGH",
        status: "ACTIVE",
        progressPercent: 35.0,
        isCurrentMission: true,
      },
    });
  }

  console.log("✅ Initial Mission seeded.");

  // 8. Seed Sample Learning Items
  const existingLearning = await prisma.learningItem.findFirst({
    where: { userId: user.id, title: "German Vocabulary (B1 Goal)" },
  });

  if (!existingLearning) {
    await prisma.learningItem.create({
      data: {
        title: "German Vocabulary (B1 Goal)",
        category: "GERMAN",
        userId: user.id,
        territoryId: territoryMap["knowledge"],
        progressPercent: 44.0,
        vocabLearned: 220,
        targetVocab: 500,
        status: "IN_PROGRESS",
      },
    });
  }

  console.log("✅ Learning items seeded.");
  console.log("🎉 LifeOS Database Seeding Completed Successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
