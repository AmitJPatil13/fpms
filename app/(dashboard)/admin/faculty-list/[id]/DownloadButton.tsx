'use client';

import React, { useState, useEffect } from 'react';
import { generateFacultyReport } from './generatePDF';
import pdfMake from 'pdfmake/build/pdfmake';

export default function DownloadButton({ 
  faculty, 
  performanceScore 
}: { 
  faculty: any;
  performanceScore: any;
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFontsLoaded, setIsFontsLoaded] = useState(false);

  useEffect(() => {
    // Check if fonts are loaded
    const checkFonts = () => {
      if (pdfMake.vfs) {
        setIsFontsLoaded(true);
      } else {
        setTimeout(checkFonts, 100);
      }
    };
    checkFonts();
  }, []);

  const handleDownload = () => {
    if (!isFontsLoaded) {
      alert('Please wait for PDF generator to initialize...');
      return;
    }

    try {
      setIsGenerating(true);
      generateFacultyReport(faculty, performanceScore);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating || !isFontsLoaded}
      className={`flex items-center gap-2 ${
        isGenerating || !isFontsLoaded ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'
      } text-white px-4 py-2 rounded-lg transition-colors`}
    >
      {isGenerating || !isFontsLoaded ? (
        <>
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {isGenerating ? 'Generating...' : 'Initializing...'}
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Download Report
        </>
      )}
    </button>
  );
} 