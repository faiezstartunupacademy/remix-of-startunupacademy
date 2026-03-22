import EnhancedSlidePresentation, { SlideData } from "@/components/formation/EnhancedSlidePresentation";
import { greenBMSlides } from "@/data/greenBMSlides";
import { mapComplexSlide } from "@/utils/slideDataMapper";

interface GreenBMPresentationProps {
  onClose?: () => void;
}

const GreenBMPresentation = ({ onClose }: GreenBMPresentationProps = {}) => {
  const slides: SlideData[] = greenBMSlides.map(s => mapComplexSlide(s));

  return <EnhancedSlidePresentation slides={slides} title="Entrepreneuriat Vert" onBack={onClose} />;
};

export default GreenBMPresentation;
