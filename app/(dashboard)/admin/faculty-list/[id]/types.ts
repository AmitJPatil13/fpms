export type FacultyData = {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  basicInfo: {
    department: string;
    designation: string;
    isHod: boolean;
    bio: string | null;
  } | null;
  teachings: Array<{
    id: number;
    userEmail: string;
    academicYear: string;
    subjectName: string;
    lectureHours: number;
    tutorialHours: number;
    practicalHours: number;
    extraHours: number;
    createdAt: Date | null;
  }>;
  publications: Array<{
    id: number;
    userEmail: string;
    title: string;
    publicationType: string;
    journalName: string;
    issnIsbn: string | null;
    impactFactor: string | null;
    datePublished: string;
    level: string;
    createdAt: Date | null;
  }>;
  projects: Array<{
    id: number;
    userEmail: string;
    projectTitle: string;
    fundingAgency: string;
    amountFunded: string;
    projectType: string;
    dateStarted: string;
    dateCompleted: string | null;
    createdAt: Date | null;
  }>;
  guidance: Array<{
    id: number;
    userEmail: string;
    scholarName: string;
    degree: string;
    status: string;
    year: number;
    createdAt: Date | null;
  }>;
  roles: Array<{
    id: number;
    userEmail: string;
    academicYear: string;
    roleTitle: string;
    hoursSpent: number;
    createdAt: Date | null;
  }>;
  development: Array<{
    id: number;
    userEmail: string;
    eventTitle: string;
    eventType: string;
    academicYear: string;
    durationDays: number;
    dateFrom: string;
    dateTo: string;
    organizedBy: string;
    createdAt: Date | null;
  }>;
  innovations: Array<{
    id: number;
    userEmail: string;
    academicYear: string;
    description: string;
    hoursSpent: number;
    toolUsed: string;
    createdAt: Date | null;
  }>;
  certifications: Array<{
    id: number;
    userEmail: string;
    certTitle: string;
    domain: string;
    certType: string;
    issuingOrganization: string;
    dateIssued: string;
    durationHours: number;
    createdAt: Date | null;
  }>;
  awards: Array<{
    id: number;
    userEmail: string;
    title: string;
    entryType: string;
    level: string;
    date: string;
    createdAt: Date | null;
  }>;
  duties: Array<{
    id: number;
    userEmail: string;
    academicYear: string;
    dutyType: string;
    dutyDate: string;
    hoursSpent: number;
    createdAt: Date | null;
  }>;
  activities: Array<{
    id: number;
    userEmail: string;
    academicYear: string;
    activityType: string;
    hoursSpent: number;
    level: string;
    createdAt: Date | null;
  }>;
};

export type PerformanceScore = {
  totalScore: number;
  componentScores: {
    teaching: number;
    research: number;
    administrative: number;
    professional: number;
    innovation: number;
    additional: number;
  };
  grade: string;
  insights: string[];
  lastUpdated: string;
}; 