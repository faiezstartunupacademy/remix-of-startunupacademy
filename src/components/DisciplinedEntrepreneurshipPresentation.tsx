import EnhancedSlidePresentation, { SlideData } from "@/components/formation/EnhancedSlidePresentation";
import { DISCIPLINED_ENTREPRENEURSHIP_SLIDES } from "@/data/disciplinedEntrepreneurshipSlidesData";
import { mapComplexSlide } from "@/utils/slideDataMapper";

interface DisciplinedEntrepreneurshipPresentationProps {
  onClose: () => void;
}

const DisciplinedEntrepreneurshipPresentation = ({ onClose }: DisciplinedEntrepreneurshipPresentationProps) => {
  const slides: SlideData[] = DISCIPLINED_ENTREPRENEURSHIP_SLIDES.map(s => mapComplexSlide(s));

  return <EnhancedSlidePresentation slides={slides} title="Disciplined Entrepreneurship — Startup Tactics" onBack={onClose} />;
};

export default DisciplinedEntrepreneurshipPresentation;
