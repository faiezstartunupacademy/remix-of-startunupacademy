import EnhancedSlidePresentation, { SlideData } from "@/components/formation/EnhancedSlidePresentation";
import { MARKETING_SLIDES } from "@/data/startupMarketingSlidesData";
import { mapComplexSlide } from "@/utils/slideDataMapper";

interface StartupMarketingPresentationProps {
  onClose: () => void;
}

const StartupMarketingPresentation = ({ onClose }: StartupMarketingPresentationProps) => {
  const slides: SlideData[] = MARKETING_SLIDES.map(s => mapComplexSlide(s));

  return <EnhancedSlidePresentation slides={slides} title="Startup Marketing" onBack={onClose} />;
};

export default StartupMarketingPresentation;
