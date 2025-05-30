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

    // Initialize score components with weighted calculations
    let scores = {
      teaching: 0,        // 25% weightage
      research: 0,        // 25% weightage
      administrative: 0,  // 15% weightage
      professional: 0,    // 15% weightage
      innovation: 0,      // 10% weightage
      additional: 0       // 10% weightage
    };

    // 1. Teaching Score (25%)
    const teachingMetrics = {
      hoursScore: 0,      // 15%
      diversityScore: 0,  // 5%
      extraScore: 0       // 5%
    };

    // Calculate teaching hours score (15%)
    const totalTeachingHours = faculty.teachings.reduce((acc, curr) => {
      return acc + (curr.lectureHours + curr.tutorialHours + curr.practicalHours);
    }, 0);
    teachingMetrics.hoursScore = Math.min((totalTeachingHours / 300) * 15, 15);

    // Calculate subject diversity score (5%)
    const uniqueSubjects = new Set(faculty.teachings.map(t => t.subjectName)).size;
    teachingMetrics.diversityScore = Math.min((uniqueSubjects / 5) * 5, 5);

    // Calculate extra hours contribution (5%)
    const extraHours = faculty.teachings.reduce((acc, curr) => acc + curr.extraHours, 0);
    teachingMetrics.extraScore = Math.min((extraHours / 50) * 5, 5);

    scores.teaching = teachingMetrics.hoursScore + teachingMetrics.diversityScore + teachingMetrics.extraScore;

    // 2. Research Score (25%)
    const researchMetrics = {
      publicationScore: 0,    // 15%
      projectScore: 0,        // 5%
      guidanceScore: 0        // 5%
    };

    // Publications score (15%)
    researchMetrics.publicationScore = faculty.publications.reduce((acc, pub) => {
      const impactFactor = parseFloat(pub.impactFactor || '0');
      const levelMultiplier = pub.level === 'International' ? 2 : pub.level === 'National' ? 1.5 : 1;
      const typeMultiplier = pub.publicationType === 'Journal' ? 1.2 : 1;
      return acc + (impactFactor * levelMultiplier * typeMultiplier);
    }, 0);
    researchMetrics.publicationScore = Math.min((researchMetrics.publicationScore / 10) * 15, 15);
    
    // Projects score (5%)
    researchMetrics.projectScore = faculty.projects.reduce((acc, proj) => {
      const amount = parseFloat(proj.amountFunded.replace(/[^0-9.-]+/g, ''));
      const completionMultiplier = proj.dateCompleted ? 1.2 : 1;
      return acc + ((amount / 1000000) * completionMultiplier);
    }, 0);
    researchMetrics.projectScore = Math.min(researchMetrics.projectScore, 5);

    // Research guidance score (5%)
    researchMetrics.guidanceScore = faculty.guidance.reduce((acc, guide) => {
      const statusMultiplier = guide.status === 'Completed' ? 1.5 : 1;
      const degreeMultiplier = guide.degree === 'Ph.D.' ? 2 : guide.degree === 'M.Phil.' ? 1.5 : 1;
      return acc + (statusMultiplier * degreeMultiplier);
    }, 0);
    researchMetrics.guidanceScore = Math.min((researchMetrics.guidanceScore / 5) * 5, 5);

    scores.research = researchMetrics.publicationScore + researchMetrics.projectScore + researchMetrics.guidanceScore;

    // 3. Administrative Score (15%)
    const adminMetrics = {
      roleScore: 0,       // 10%
      hodBonus: 0,        // 5%
    };

    // Role score based on hours spent and role importance
    adminMetrics.roleScore = faculty.roles.reduce((acc, role) => {
      const roleImportance = role.roleTitle.toLowerCase().includes('coordinator') ? 1.5 :
                            role.roleTitle.toLowerCase().includes('head') ? 2 : 1;
      return acc + ((role.hoursSpent / 100) * roleImportance);
    }, 0);
    adminMetrics.roleScore = Math.min(adminMetrics.roleScore, 10);

    // HOD bonus
    adminMetrics.hodBonus = faculty.basicInfo?.isHod ? 5 : 0;

    scores.administrative = adminMetrics.roleScore + adminMetrics.hodBonus;

    // 4. Professional Development Score (15%)
    const pdMetrics = {
      trainingScore: 0,     // 10%
      certificationScore: 0  // 5%
    };

    // Training and development score
    pdMetrics.trainingScore = faculty.development.reduce((acc, dev) => {
      const durationWeight = dev.durationDays * 0.5;
      const typeMultiplier = dev.eventType === 'Workshop' ? 1.2 : 
                            dev.eventType === 'Conference' ? 1.5 : 1;
      return acc + (durationWeight * typeMultiplier);
    }, 0);
    pdMetrics.trainingScore = Math.min(pdMetrics.trainingScore, 10);

    // Certifications score
    pdMetrics.certificationScore = faculty.certifications.reduce((acc, cert) => {
      const durationWeight = cert.durationHours / 40; // Normalize to typical certification duration
      const typeMultiplier = cert.certType === 'Professional' ? 1.5 : 1;
      return acc + (durationWeight * typeMultiplier);
    }, 0);
    pdMetrics.certificationScore = Math.min(pdMetrics.certificationScore, 5);

    scores.professional = pdMetrics.trainingScore + pdMetrics.certificationScore;

    // 5. Innovation Score (10%)
    scores.innovation = faculty.innovations.reduce((acc, inn) => {
      const hoursWeight = inn.hoursSpent / 50;
      const toolMultiplier = inn.toolUsed ? 1.2 : 1;
      return acc + (hoursWeight * toolMultiplier);
    }, 0);
    scores.innovation = Math.min(scores.innovation, 10);

    // 6. Additional Activities Score (10%)
    const additionalMetrics = {
      awardsScore: 0,     // 4%
      dutiesScore: 0,     // 3%
      activitiesScore: 0  // 3%
    };

    // Awards score
    additionalMetrics.awardsScore = faculty.awards.reduce((acc, award) => {
      const levelMultiplier = award.level === 'International' ? 2 :
                             award.level === 'National' ? 1.5 : 1;
      return acc + levelMultiplier;
    }, 0);
    additionalMetrics.awardsScore = Math.min(additionalMetrics.awardsScore, 4);

    // Exam duties score
    additionalMetrics.dutiesScore = faculty.duties.reduce((acc, duty) => {
      return acc + (duty.hoursSpent / 100);
    }, 0);
    additionalMetrics.dutiesScore = Math.min(additionalMetrics.dutiesScore, 3);

    // Co-curricular activities score
    additionalMetrics.activitiesScore = faculty.activities.reduce((acc, activity) => {
      const levelMultiplier = activity.level === 'International' ? 1.5 :
                             activity.level === 'National' ? 1.2 : 1;
      return acc + ((activity.hoursSpent / 50) * levelMultiplier);
    }, 0);
    additionalMetrics.activitiesScore = Math.min(additionalMetrics.activitiesScore, 3);

    scores.additional = additionalMetrics.awardsScore + additionalMetrics.dutiesScore + additionalMetrics.activitiesScore;

    // Calculate total score
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

    // Generate performance insights based on detailed metrics
    const insights = [];
    
    if (teachingMetrics.hoursScore < 10) 
      insights.push('Increase teaching hours and engagement in core subjects');
    if (teachingMetrics.diversityScore < 3) 
      insights.push('Consider teaching a wider variety of subjects');
    
    if (researchMetrics.publicationScore < 10) 
      insights.push('Focus on publishing in high-impact international journals');
    if (researchMetrics.projectScore < 3) 
      insights.push('Seek more funded research projects');
    
    if (adminMetrics.roleScore < 7) 
      insights.push('Take up more administrative responsibilities');
    
    if (pdMetrics.trainingScore < 7) 
      insights.push('Participate in more professional development programs');
    if (pdMetrics.certificationScore < 3) 
      insights.push('Obtain relevant professional certifications');
    
    if (scores.innovation < 7) 
      insights.push('Implement more innovative teaching methodologies');
    
    if (additionalMetrics.awardsScore < 2) 
      insights.push('Work towards achieving recognition in your field');
    if (additionalMetrics.activitiesScore < 2) 
      insights.push('Increase participation in co-curricular activities');

    // Performance grade with more granular grading
    let grade = 'C';
    if (totalScore >= 95) grade = 'A+';
    else if (totalScore >= 90) grade = 'A';
    else if (totalScore >= 85) grade = 'A-';
    else if (totalScore >= 80) grade = 'B+';
    else if (totalScore >= 75) grade = 'B';
    else if (totalScore >= 70) grade = 'B-';
    else if (totalScore >= 65) grade = 'C+';
    else if (totalScore >= 60) grade = 'C';
    else grade = 'D';

    return {
      data: {
        totalScore: Math.round(totalScore * 100) / 100,
        componentScores: scores,
        grade,
        insights: insights.slice(0, 6), // Limit to top 6 insights
        lastUpdated: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error calculating performance score:', error);
    return { error: 'Failed to calculate performance score' };
  }
} 