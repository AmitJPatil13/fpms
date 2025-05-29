import { pgTable, serial, varchar, text, timestamp, date, integer, decimal, boolean } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  name: varchar('name', { length: 256 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Basic Info table
export const basicInfo = pgTable('basic_info', {
  id: serial('id').primaryKey(),
  userEmail: varchar('user_email', { length: 256 }).references(() => users.email).notNull(),
  department: varchar('department', { length: 100 }).notNull(),
  designation: varchar('designation', { length: 100 }).notNull(),
  isHod: boolean('is_hod').default(false).notNull(),
  bio: text('bio'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Teaching Activities table
export const teachingActivities = pgTable('teaching_activities', {
  id: serial('id').primaryKey(),
  userEmail: varchar('user_email', { length: 255 })
    .notNull()
    .references(() => users.email, { onDelete: 'cascade' }),
  academicYear: varchar('academic_year', { length: 9 }).notNull(),
  subjectName: varchar('subject_name', { length: 255 }).notNull(),
  lectureHours: integer('lecture_hours').notNull().default(0),
  tutorialHours: integer('tutorial_hours').notNull().default(0),
  practicalHours: integer('practical_hours').notNull().default(0),
  extraHours: integer('extra_hours').notNull().default(0),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Research Publications table
export const researchPublications = pgTable('research_publications', {
  id: serial('id').primaryKey(),
  userEmail: varchar('user_email', { length: 255 })
    .notNull()
    .references(() => users.email, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  publicationType: varchar('publication_type', { length: 50 }).notNull(),
  journalName: varchar('journal_name', { length: 255 }).notNull(),
  issnIsbn: varchar('issn_isbn', { length: 20 }),
  impactFactor: decimal('impact_factor', { precision: 4, scale: 2 }),
  datePublished: date('date_published').notNull(),
  level: varchar('level', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Projects table
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  userEmail: varchar('user_email', { length: 255 })
    .notNull()
    .references(() => users.email, { onDelete: 'cascade' }),
  projectTitle: text('project_title').notNull(),
  fundingAgency: varchar('funding_agency', { length: 255 }).notNull(),
  amountFunded: decimal('amount_funded', { precision: 12, scale: 2 }).notNull(),
  projectType: varchar('project_type', { length: 50 }).notNull(),
  dateStarted: date('date_started').notNull(),
  dateCompleted: date('date_completed'),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Research Guidance table
export const researchGuidance = pgTable('research_guidance', {
  id: serial('id').primaryKey(),
  userEmail: varchar('user_email', { length: 255 })
    .notNull()
    .references(() => users.email, { onDelete: 'cascade' }),
  scholarName: varchar('scholar_name', { length: 255 }).notNull(),
  degree: varchar('degree', { length: 50 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  year: integer('year').notNull(),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Administrative Roles table
export const administrativeRoles = pgTable('administrative_roles', {
  id: serial('id').primaryKey(),
  userEmail: varchar('user_email', { length: 255 })
    .notNull()
    .references(() => users.email, { onDelete: 'cascade' }),
  academicYear: varchar('academic_year', { length: 9 }).notNull(),
  roleTitle: varchar('role_title', { length: 100 }).notNull(),
  hoursSpent: integer('hours_spent').notNull().default(0),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Professional Development table
export const professionalDevelopment = pgTable('professional_development', {
  id: serial('id').primaryKey(),
  userEmail: varchar('user_email', { length: 255 })
    .notNull()
    .references(() => users.email, { onDelete: 'cascade' }),
  academicYear: varchar('academic_year', { length: 9 }).notNull(),
  eventType: varchar('event_type', { length: 50 }).notNull(),
  eventTitle: text('event_title').notNull(),
  durationDays: integer('duration_days').notNull(),
  dateFrom: date('date_from').notNull(),
  dateTo: date('date_to').notNull(),
  organizedBy: varchar('organized_by', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Teaching Innovations table
export const teachingInnovations = pgTable('teaching_innovations', {
  id: serial('id').primaryKey(),
  userEmail: varchar('user_email', { length: 255 })
    .notNull()
    .references(() => users.email, { onDelete: 'cascade' }),
  academicYear: varchar('academic_year', { length: 9 }).notNull(),
  description: text('description').notNull(),
  hoursSpent: integer('hours_spent').notNull().default(0),
  toolUsed: varchar('tool_used', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Certifications table
export const certifications = pgTable('certifications', {
  id: serial('id').primaryKey(),
  userEmail: varchar('user_email', { length: 255 })
    .notNull()
    .references(() => users.email, { onDelete: 'cascade' }),
  certTitle: varchar('cert_title', { length: 255 }).notNull(),
  domain: varchar('domain', { length: 100 }).notNull(),
  issuingOrganization: varchar('issuing_organization', { length: 255 }).notNull(),
  certType: varchar('cert_type', { length: 50 }).notNull(),
  dateIssued: date('date_issued').notNull(),
  durationHours: integer('duration_hours').notNull(),
  certImg: text('cert_img').notNull(),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Awards table
export const awards = pgTable('awards', {
  id: serial('id').primaryKey(),
  userEmail: varchar('user_email', { length: 255 })
    .notNull()
    .references(() => users.email, { onDelete: 'cascade' }),
  entryType: varchar('entry_type', { length: 50 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  date: date('date').notNull(),
  level: varchar('level', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Exam Duties table
export const examDuties = pgTable('exam_duties', {
  id: serial('id').primaryKey(),
  userEmail: varchar('user_email', { length: 255 })
    .notNull()
    .references(() => users.email, { onDelete: 'cascade' }),
  academicYear: varchar('academic_year', { length: 9 }).notNull(),
  dutyType: varchar('duty_type', { length: 50 }).notNull(),
  dutyDate: date('duty_date').notNull(),
  hoursSpent: integer('hours_spent').notNull().default(0),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Co-curricular Activities table
export const coCurricularActivities = pgTable('co_curricular_activities', {
  id: serial('id').primaryKey(),
  userEmail: varchar('user_email', { length: 255 })
    .notNull()
    .references(() => users.email, { onDelete: 'cascade' }),
  academicYear: varchar('academic_year', { length: 9 }).notNull(),
  activityType: varchar('activity_type', { length: 50 }).notNull(),
  hoursSpent: integer('hours_spent').notNull().default(0),
  level: varchar('level', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
}); 