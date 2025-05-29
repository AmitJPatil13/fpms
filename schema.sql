-- Users table (already exists)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Department enum
CREATE TYPE department_type AS ENUM (
    'Computer Science',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering'
);

-- Designation enum
CREATE TYPE designation_type AS ENUM (
    'Asst. Prof',
    'Assoc. Prof',
    'Professor'
);

-- Basic Info table
CREATE TABLE IF NOT EXISTS basic_info (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    department department_type NOT NULL,
    designation designation_type NOT NULL,
    joining_date DATE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
);

-- Teaching Activities table
CREATE TABLE IF NOT EXISTS teaching_activities (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    academic_year VARCHAR(9) NOT NULL,
    subject_name VARCHAR(255) NOT NULL,
    lecture_hours INTEGER NOT NULL DEFAULT 0,
    tutorial_hours INTEGER NOT NULL DEFAULT 0,
    practical_hours INTEGER NOT NULL DEFAULT 0,
    extra_hours INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
);

-- Publication type enum
CREATE TYPE publication_type AS ENUM (
    'Journal Paper',
    'Conference Paper',
    'Book',
    'Book Chapter',
    'Patent'
);

-- Publication level enum
CREATE TYPE publication_level AS ENUM (
    'National',
    'International'
);

-- Research Publications table
CREATE TABLE IF NOT EXISTS research_publications (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    title TEXT NOT NULL,
    publication_type publication_type NOT NULL,
    journal_name VARCHAR(255) NOT NULL,
    issn_isbn VARCHAR(20),
    impact_factor DECIMAL(4,2),
    date_published DATE NOT NULL,
    level publication_level NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
);

-- Project type enum
CREATE TYPE project_type AS ENUM (
    'Sponsored',
    'Consultancy',
    'Internal',
    'Industry Funded',
    'Government Funded'
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    project_title TEXT NOT NULL,
    funding_agency VARCHAR(255) NOT NULL,
    amount_funded DECIMAL(12,2) NOT NULL,
    project_type project_type NOT NULL,
    date_started DATE NOT NULL,
    date_completed DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
);

-- Degree type enum
CREATE TYPE degree_type AS ENUM (
    'M.Phil',
    'Ph.D.'
);

-- Thesis status enum
CREATE TYPE thesis_status AS ENUM (
    'Awarded',
    'Submitted',
    'Ongoing'
);

-- Research Guidance table
CREATE TABLE IF NOT EXISTS research_guidance (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    scholar_name VARCHAR(255) NOT NULL,
    degree degree_type NOT NULL,
    status thesis_status NOT NULL,
    year INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
);

-- Role title enum
CREATE TYPE role_title AS ENUM (
    'Head of Department',
    'Class Coordinator',
    'Exam Coordinator',
    'Timetable Coordinator',
    'Placement Coordinator',
    'Research Coordinator',
    'Academic Coordinator',
    'Laboratory In-charge',
    'Department Secretary',
    'Committee Member'
);

-- Administrative Roles table
CREATE TABLE IF NOT EXISTS administrative_roles (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    academic_year VARCHAR(9) NOT NULL,
    role_title role_title NOT NULL,
    hours_spent INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
);

-- Event type enum
CREATE TYPE event_type AS ENUM (
    'Seminar',
    'Faculty Development Program',
    'Workshop',
    'Conference',
    'Training Program',
    'Certification Course',
    'MOOC Course'
);

-- Professional Development table
CREATE TABLE IF NOT EXISTS professional_development (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    academic_year VARCHAR(9) NOT NULL,
    event_type event_type NOT NULL,
    event_title TEXT NOT NULL,
    duration_days INTEGER NOT NULL,
    date_from DATE NOT NULL,
    date_to DATE NOT NULL,
    organized_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
);

-- Teaching tool enum
CREATE TYPE teaching_tool AS ENUM (
    'PowerPoint',
    'Learning Management System',
    'Virtual Lab',
    'Simulation Software',
    'Video Content',
    'Interactive Quiz',
    'Online Whiteboard',
    'Collaborative Tools',
    'Other'
);

-- Teaching Innovations table
CREATE TABLE IF NOT EXISTS teaching_innovations (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    academic_year VARCHAR(9) NOT NULL,
    description TEXT NOT NULL,
    hours_spent INTEGER NOT NULL DEFAULT 0,
    tool_used teaching_tool NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
);

-- Certification type enum
CREATE TYPE certification_type AS ENUM (
    'Faculty Development Program',
    'Online Course',
    'Workshop',
    'Professional Certification'
);

-- Certifications table
CREATE TABLE IF NOT EXISTS certifications (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    cert_title VARCHAR(255) NOT NULL,
    domain VARCHAR(100) NOT NULL,
    issuing_organization VARCHAR(255) NOT NULL,
    cert_type certification_type NOT NULL,
    date_issued DATE NOT NULL,
    duration_hours INTEGER NOT NULL,
    cert_img TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
);

-- Entry type enum
CREATE TYPE entry_type AS ENUM (
    'Award',
    'Lecture',
    'Honor'
);

-- Recognition level enum
CREATE TYPE recognition_level AS ENUM (
    'College',
    'State',
    'National',
    'International'
);

-- Awards table
CREATE TABLE IF NOT EXISTS awards (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    entry_type entry_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    level recognition_level NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
);

-- Duty type enum
CREATE TYPE duty_type AS ENUM (
    'Paper Setting',
    'Invigilation',
    'Paper Evaluation',
    'Paper Moderation',
    'Practical Examination',
    'Viva Voce',
    'Exam Supervision'
);

-- Exam Duties table
CREATE TABLE IF NOT EXISTS exam_duties (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    academic_year VARCHAR(9) NOT NULL,
    duty_type duty_type NOT NULL,
    duty_date DATE NOT NULL,
    hours_spent INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
);

-- Activity type enum
CREATE TYPE activity_type AS ENUM (
    'NSS',
    'Club Mentor',
    'Industrial Visit',
    'Sports Coordinator',
    'Cultural Coordinator',
    'Technical Club',
    'Placement Coordinator'
);

-- Activity level enum
CREATE TYPE activity_level AS ENUM (
    'College',
    'State',
    'National',
    'International'
);

-- Co-curricular Activities table
CREATE TABLE IF NOT EXISTS co_curricular_activities (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    academic_year VARCHAR(9) NOT NULL,
    activity_type activity_type NOT NULL,
    hours_spent INTEGER NOT NULL DEFAULT 0,
    level activity_level NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
);
