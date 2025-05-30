'use server'

import { db } from "@/db";
import { 
  users, 
  basicInfo, 
  teachingActivities, 
  researchPublications, 
  projects,
  researchGuidance,
  administrativeRoles,
  professionalDevelopment,
  teachingInnovations,
  certifications,
  awards,
  examDuties,
  coCurricularActivities
} from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getFacultyDetails(id: string) {
  try {
    // Get user and basic info
    const [faculty] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
        basicInfo: {
          department: basicInfo.department,
          designation: basicInfo.designation,
          isHod: basicInfo.isHod,
          bio: basicInfo.bio,
        }
      })
      .from(users)
      .leftJoin(basicInfo, eq(users.email, basicInfo.userEmail))
      .where(eq(users.id, parseInt(id)));

    if (!faculty) {
      return { error: 'Faculty member not found' };
    }

    // Get teaching activities
    const teachings = await db
      .select()
      .from(teachingActivities)
      .where(eq(teachingActivities.userEmail, faculty.email));

    // Get research publications
    const publications = await db
      .select()
      .from(researchPublications)
      .where(eq(researchPublications.userEmail, faculty.email));

    // Get projects
    const facultyProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.userEmail, faculty.email));

    // Get research guidance
    const guidance = await db
      .select()
      .from(researchGuidance)
      .where(eq(researchGuidance.userEmail, faculty.email));

    // Get administrative roles
    const roles = await db
      .select()
      .from(administrativeRoles)
      .where(eq(administrativeRoles.userEmail, faculty.email));

    // Get professional development
    const development = await db
      .select()
      .from(professionalDevelopment)
      .where(eq(professionalDevelopment.userEmail, faculty.email));

    // Get teaching innovations
    const innovations = await db
      .select()
      .from(teachingInnovations)
      .where(eq(teachingInnovations.userEmail, faculty.email));

    // Get certifications
    const facultyCertifications = await db
      .select()
      .from(certifications)
      .where(eq(certifications.userEmail, faculty.email));

    // Get awards
    const facultyAwards = await db
      .select()
      .from(awards)
      .where(eq(awards.userEmail, faculty.email));

    // Get exam duties
    const duties = await db
      .select()
      .from(examDuties)
      .where(eq(examDuties.userEmail, faculty.email));

    // Get co-curricular activities
    const activities = await db
      .select()
      .from(coCurricularActivities)
      .where(eq(coCurricularActivities.userEmail, faculty.email));

    return {
      data: {
        ...faculty,
        teachings,
        publications,
        projects: facultyProjects,
        guidance,
        roles,
        development,
        innovations,
        certifications: facultyCertifications,
        awards: facultyAwards,
        duties,
        activities
      }
    };
  } catch (error) {
    console.error('Error fetching faculty details:', error);
    return { error: 'Failed to fetch faculty details' };
  }
}

export async function calculatePerformanceScore(id: string) {
  try {
    const { data: faculty, error } = await getFacultyDetails(id);
    
    if (error || !faculty) {
      return { error: error || 'Faculty not found' };
    }

    // Initialize score components
    let scores = {
      teaching: 0,        // 25% weightage
      research: 0,        // 25% weightage
      administrative: 0,  // 15% weightage
      professional: 0,    // 15% weightage
      innovation: 0,      // 10% weightage
      additional: 0       // 10% weightage
    };

    // 1. Teaching Score (25%)
    // Based on teaching hours, subjects taught, and extra hours
    const teachingHoursScore = faculty.teachings.reduce((acc, curr) => {
      return acc + (curr.lectureHours + curr.tutorialHours + curr.practicalHours + curr.extraHours);
    }, 0);
    scores.teaching = Math.min((teachingHoursScore / 300) * 25, 25); // Cap at 25%

    // 2. Research Score (25%)
    // Publications score (15%)
    const publicationScore = faculty.publications.reduce((acc, pub) => {
      const impactFactor = parseFloat(pub.impactFactor || '0');
      const levelScore = pub.level === 'International' ? 2 : 1;
      return acc + (impactFactor * levelScore);
    }, 0);
    
    // Projects score (10%)
    const projectScore = faculty.projects.reduce((acc, proj) => {
      const amount = parseFloat(proj.amountFunded.replace(/[^0-9.-]+/g, ''));
      return acc + (amount / 1000000); // Score based on project value in millions
    }, 0);
    
    scores.research = Math.min(
      ((publicationScore * 15) + (projectScore * 10)) / 25,
      25
    );

    // 3. Administrative Score (15%)
    const adminScore = faculty.roles.reduce((acc, role) => {
      return acc + (role.hoursSpent / 100);
    }, 0);
    scores.administrative = Math.min(adminScore, 15);

    // 4. Professional Development Score (15%)
    const pdScore = faculty.development.reduce((acc, dev) => {
      return acc + (dev.durationDays * 0.5);
    }, 0);
    scores.professional = Math.min(pdScore, 15);

    // 5. Innovation Score (10%)
    const innovationScore = faculty.innovations.reduce((acc, inn) => {
      return acc + (inn.hoursSpent / 50);
    }, 0);
    scores.innovation = Math.min(innovationScore, 10);

    // 6. Additional Activities Score (10%)
    // Combine certifications, awards, exam duties, and co-curricular activities
    const certScore = faculty.certifications.length * 0.5;
    const awardScore = faculty.awards.length * 1;
    const dutyScore = faculty.duties.reduce((acc, duty) => acc + (duty.hoursSpent / 100), 0);
    const activityScore = faculty.activities.reduce((acc, act) => acc + (act.hoursSpent / 100), 0);
    
    scores.additional = Math.min(
      certScore + awardScore + dutyScore + activityScore,
      10
    );

    // Calculate total score
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

    // Generate performance insights
    const insights = [];
    if (scores.teaching < 15) insights.push('Consider taking more teaching responsibilities');
    if (scores.research < 15) insights.push('Focus on research publications and funded projects');
    if (scores.administrative < 10) insights.push('Participate more in administrative duties');
    if (scores.professional < 10) insights.push('Attend more professional development programs');
    if (scores.innovation < 7) insights.push('Implement more teaching innovations');
    if (scores.additional < 7) insights.push('Participate in more extracurricular activities');

    // Performance grade
    let grade = 'C';
    if (totalScore >= 90) grade = 'A+';
    else if (totalScore >= 80) grade = 'A';
    else if (totalScore >= 70) grade = 'B+';
    else if (totalScore >= 60) grade = 'B';
    else if (totalScore >= 50) grade = 'C+';

    return {
      data: {
        totalScore: Math.round(totalScore * 100) / 100,
        componentScores: scores,
        grade,
        insights,
        lastUpdated: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error calculating performance score:', error);
    return { error: 'Failed to calculate performance score' };
  }
} 