import EnhancedSlidePresentation, { SlideData } from "@/components/formation/EnhancedSlidePresentation";
import { BMI_SLIDES } from "@/data/businessModelInnovationSlidesData";
import { mapComplexSlide } from "@/utils/slideDataMapper";

interface BMInnovationPresentationProps {
  onClose: () => void;
}

const BMInnovationPresentation = ({ onClose }: BMInnovationPresentationProps) => {
  const slides: SlideData[] = BMI_SLIDES.map(s => mapComplexSlide({
    ...s,
    module: s.module,
  }));

  return <EnhancedSlidePresentation slides={slides} title="Business Model Innovation" onBack={onClose} />;
};

export default BMInnovationPresentation;
