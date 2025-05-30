import { db } from "@/db";
import { sql } from "drizzle-orm";
import { 
  teachingActivities, 
  researchPublications, 
  basicInfo,
  professionalDevelopment,
  projects,
  researchGuidance,
  administrativeRoles,
  teachingInnovations,
  certifications,
  awards,
  examDuties,
  coCurricularActivities
} from "@/db/schema";

interface StatsResponse {
  success: boolean;
  data?: {
    teachingHours: number;
    publicationsCount: number;
    upcomingActivitiesCount: number;
    projectsCount: number;
    certificationsCount: number;
    hoursChange: number;
    monthlyHours: Array<{
      month: string;
      hours: number;
    }>;
  };
  error?: string;
}

interface CompletionResponse {
  success: boolean;
  data?: {
    isComplete: boolean;
    completedSections: {
      basicInfo: boolean;
      teaching: boolean;
      research: boolean;
      professional: boolean;
      administrative: boolean;
      certifications: boolean;
      awards: boolean;
    };
  };
  error?: string;
}

export async function getFacultyStats(email: string): Promise<StatsResponse> {
  try {
    // Get current month's teaching hours
    const [currentMonthHours] = await db
      .select({
        hours: sql<number>`SUM(lecture_hours + tutorial_hours + practical_hours)`,
      })
      .from(teachingActivities)
      .where(sql`user_email = ${email} AND EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)`);

    // Get last month's teaching hours
    const [lastMonthHours] = await db
      .select({
        hours: sql<number>`SUM(lecture_hours + tutorial_hours + practical_hours)`,
      })
      .from(teachingActivities)
      .where(sql`user_email = ${email} AND EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '1 month')`);

    // Calculate hours change percentage
    const hoursChange = lastMonthHours?.hours 
      ? ((currentMonthHours?.hours || 0) - lastMonthHours.hours) / lastMonthHours.hours * 100 
      : 0;

    // Get publications count this year
    const [publicationsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(researchPublications)
      .where(sql`user_email = ${email} AND EXTRACT(YEAR FROM date_published) = EXTRACT(YEAR FROM CURRENT_DATE)`);

    // Get projects count
    const [projectsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(projects)
      .where(sql`user_email = ${email}`);

    // Get certifications count
    const [certificationsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(certifications)
      .where(sql`user_email = ${email}`);

    // Get upcoming activities count
    const [upcomingActivities] = await db
      .select({ count: sql<number>`count(*)` })
      .from(professionalDevelopment)
      .where(sql`user_email = ${email} AND date_from > CURRENT_DATE`);

    // Get monthly hours for the last 6 months
    const monthlyHours = await db
      .select({
        month: sql<string>`TO_CHAR(created_at, 'Mon YY')`,
        hours: sql<number>`SUM(lecture_hours + tutorial_hours + practical_hours)`,
      })
      .from(teachingActivities)
      .where(sql`user_email = ${email}`)
      .groupBy(sql`TO_CHAR(created_at, 'Mon YY')`)
      .orderBy(sql`TO_CHAR(created_at, 'Mon YY')`)
      .limit(6);

    return {
      success: true,
      data: {
        teachingHours: currentMonthHours?.hours || 0,
        publicationsCount: publicationsCount.count,
        upcomingActivitiesCount: upcomingActivities.count,
        projectsCount: projectsCount.count,
        certificationsCount: certificationsCount.count,
        hoursChange,
        monthlyHours: monthlyHours.map(h => ({ month: h.month, hours: h.hours }))
      }
    };
  } catch (error) {
    console.error('Error fetching faculty stats:', error);
    return {
      success: false,
      error: 'Failed to fetch faculty statistics'
    };
  }
}

export async function checkProfileCompletion(email: string): Promise<CompletionResponse> {
  try {
    // Check basic info completion
    const [basicInfoCheck] = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(basicInfo)
      .where(sql`user_email = ${email} AND 
        department IS NOT NULL AND 
        designation IS NOT NULL`);

    // Check teaching activities
    const [teachingCheck] = await db
      .select({ count: sql<number>`count(*)` })
      .from(teachingActivities)
      .where(sql`user_email = ${email}`);

    // Check research activities (publications or projects or guidance)
    const [researchCheck] = await db
      .select({
        count: sql<number>`(
          SELECT COUNT(*) FROM research_publications WHERE user_email = ${email}
        ) + (
          SELECT COUNT(*) FROM projects WHERE user_email = ${email}
        ) + (
          SELECT COUNT(*) FROM research_guidance WHERE user_email = ${email}
        )`
      })
      .from(sql`(SELECT 1) as dummy`);  // Add a dummy table to make it a valid query

    // Check professional development
    const [professionalCheck] = await db
      .select({ count: sql<number>`count(*)` })
      .from(professionalDevelopment)
      .where(sql`user_email = ${email}`);

    // Check administrative roles
    const [adminCheck] = await db
      .select({ count: sql<number>`count(*)` })
      .from(administrativeRoles)
      .where(sql`user_email = ${email}`);

    // Check certifications
    const [certCheck] = await db
      .select({ count: sql<number>`count(*)` })
      .from(certifications)
      .where(sql`user_email = ${email}`);

    // Check awards
    const [awardsCheck] = await db
      .select({ count: sql<number>`count(*)` })
      .from(awards)
      .where(sql`user_email = ${email}`);

    const completedSections = {
      basicInfo: basicInfoCheck.count > 0,
      teaching: teachingCheck.count > 0,
      research: researchCheck.count > 0,
      professional: professionalCheck.count > 0,
      administrative: adminCheck.count > 0,
      certifications: certCheck.count > 0,
      awards: awardsCheck.count > 0
    };

    // Profile is complete if basic info and at least 4 other sections are filled
    const completedSectionsCount = Object.values(completedSections).filter(Boolean).length;
    const isComplete = completedSections.basicInfo && completedSectionsCount >= 5;

    return {
      success: true,
      data: {
        isComplete,
        completedSections
      }
    };
  } catch (error) {
    console.error('Error checking profile completion:', error);
    return {
      success: false,
      error: 'Failed to check profile completion'
    };
  }
} 