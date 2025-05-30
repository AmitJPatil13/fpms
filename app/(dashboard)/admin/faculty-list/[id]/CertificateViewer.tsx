"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CertificateViewerProps {
  certImg: string | null;
}

export default function CertificateViewer({ certImg }: CertificateViewerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  if (!certImg) {
    return null;
  }

  return (
    <>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setIsOpen(true)}
        className="ml-auto"
      >
        View Certificate
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Certificate View</DialogTitle>
          </DialogHeader>
          <div className="relative w-full aspect-[4/3] mt-2">
            <img
              src={certImg}
              alt="Certificate"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 