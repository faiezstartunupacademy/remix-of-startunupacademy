import EnhancedSlidePresentation, { SlideData } from "@/components/formation/EnhancedSlidePresentation";
import { BMC_SLIDES } from "@/data/bmcGuideSlidesData";
import { mapComplexSlide } from "@/utils/slideDataMapper";

interface BMCGuidePresentationProps {
  onClose: () => void;
}

const BMCGuidePresentation = ({ onClose }: BMCGuidePresentationProps) => {
  const slides: SlideData[] = BMC_SLIDES.map(s => mapComplexSlide(s));

  return <EnhancedSlidePresentation slides={slides} title="Guide BMC Pratique" onBack={onClose} />;
};

export default BMCGuidePresentation;
