import pdfMake from 'pdfmake/build/pdfmake';
import { TDocumentDefinitions, Content, ContentTable } from 'pdfmake/interfaces';
import { FacultyData, PerformanceScore } from './types';

// We need to load the vfs_fonts differently in Next.js
if (typeof window !== 'undefined') {
  // Client-side-only code
  import('pdfmake/build/vfs_fonts').then((vfs) => {
    // @ts-ignore - vfs has a different structure than type definitions suggest
    pdfMake.vfs = vfs.default.pdfMake?.vfs || vfs.default;
  });
}

const formatValue = (value: any): string => {
  if (value === null || value === undefined) return 'N/A';
  if (typeof value === 'string' && !value.trim()) return 'N/A';
  return String(value);
};

export function generateFacultyReport(
  faculty: FacultyData,
  performanceScore: PerformanceScore
): void {
  const docDefinition: TDocumentDefinitions = {
    content: [
      { text: 'Faculty Performance Report', style: 'header' },
      { text: '\n' },
      
      // Basic Information
      { text: 'Basic Information', style: 'subheader' },
      {
        table: {
          widths: ['*', '*'],
          body: [
            ['Name', formatValue(faculty.name)],
            ['Email', formatValue(faculty.email)],
            ['Department', formatValue(faculty.basicInfo?.department)],
            ['Designation', formatValue(faculty.basicInfo?.designation)],
            ['Role', faculty.basicInfo?.isHod ? 'Head of Department' : 'Faculty Member'],
            ['Joined On', faculty.createdAt ? new Date(faculty.createdAt).toLocaleDateString() : 'N/A']
          ]
        }
      },
      { text: '\n' },

      // Performance Score
      { text: 'Performance Score Overview', style: 'subheader' },
      {
        text: `Overall Score: ${performanceScore.totalScore} (Grade: ${performanceScore.grade})`,
        margin: [0, 0, 0, 10] as [number, number, number, number]
      },
      {
        table: {
          widths: ['*', 'auto'],
          body: [
            ['Component', 'Score'],
            ...Object.entries(performanceScore.componentScores).map(([key, value]) => [
              key.charAt(0).toUpperCase() + key.slice(1),
              value.toFixed(1)
            ])
          ]
        }
      },
      { text: '\n' },

      // Insights
      { text: 'Performance Insights', style: 'subheader' },
      performanceScore.insights.length > 0 ? {
        ul: performanceScore.insights
      } : { text: 'No performance insights available', italics: true },
      { text: '\n' },

      // Teaching Activities
      { text: 'Teaching Activities', style: 'subheader' },
      faculty.teachings.length > 0 ? {
        table: {
          widths: ['*', '*', 'auto', 'auto', 'auto'],
          body: [
            ['Academic Year', 'Subject', 'Lecture Hrs', 'Tutorial Hrs', 'Practical Hrs'],
            ...faculty.teachings.map(t => [
              formatValue(t.academicYear),
              formatValue(t.subjectName),
              formatValue(t.lectureHours),
              formatValue(t.tutorialHours),
              formatValue(t.practicalHours)
            ])
          ]
        }
      } : { text: 'No teaching activities available', italics: true },
      { text: '\n' },

      // Publications
      { text: 'Research Publications', style: 'subheader' },
      faculty.publications.length > 0 ? [
        ...faculty.publications.map(pub => ([
          { text: formatValue(pub.title), bold: true },
          {
            table: {
              widths: ['*', '*'],
              body: [
                ['Type', formatValue(pub.publicationType)],
                ['Journal', formatValue(pub.journalName)],
                ['Impact Factor', formatValue(pub.impactFactor)],
                ['Level', formatValue(pub.level)],
                ['Published Date', pub.datePublished ? new Date(pub.datePublished).toLocaleDateString() : 'N/A']
              ]
            },
            margin: [0, 5, 0, 15] as [number, number, number, number]
          }
        ] as Content[])).flat()
      ] : { text: 'No research publications available', italics: true },
      { text: '\n' },

      // Projects
      { text: 'Research Projects', style: 'subheader' },
      faculty.projects.length > 0 ? [
        ...faculty.projects.map(proj => ([
          { text: formatValue(proj.projectTitle), bold: true },
          {
            table: {
              widths: ['*', '*'],
              body: [
                ['Funding Agency', formatValue(proj.fundingAgency)],
                ['Amount Funded', proj.amountFunded ? `₹${proj.amountFunded}` : 'N/A'],
                ['Type', formatValue(proj.projectType)],
                ['Start Date', proj.dateStarted ? new Date(proj.dateStarted).toLocaleDateString() : 'N/A'],
                ['Status', proj.dateCompleted ? 
                  `Completed (${new Date(proj.dateCompleted).toLocaleDateString()})` : 
                  'Ongoing']
              ]
            },
            margin: [0, 5, 0, 15] as [number, number, number, number]
          }
        ] as Content[])).flat()
      ] : { text: 'No research projects available', italics: true }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 10] as [number, number, number, number]
      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 5] as [number, number, number, number]
      }
    },
    defaultStyle: {
      fontSize: 10
    }
  };

  pdfMake.createPdf(docDefinition).download(`${faculty.name.replace(/\s+/g, '_')}_performance_report.pdf`);
} 