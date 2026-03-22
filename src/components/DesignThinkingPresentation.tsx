import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DTSlide } from "@/data/designThinkingSlidesData";
import EnhancedSlidePresentation, { SlideData } from "@/components/formation/EnhancedSlidePresentation";

interface DesignThinkingPresentationProps {
  slides: DTSlide[];
  title: string;
  onBack: () => void;
}

const DesignThinkingPresentation = ({ slides, title, onBack }: DesignThinkingPresentationProps) => {
  // Map DTSlide to SlideData
  const mappedSlides: SlideData[] = slides.map(s => ({
    ...s,
    type: s.type,
  }));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="container py-6 max-w-5xl mx-auto">
        <EnhancedSlidePresentation
          slides={mappedSlides}
          title={title}
          onBack={onBack}
        />
      </div>
    </div>
  );
};

export default DesignThinkingPresentation;
