import EnhancedSlidePresentation, { SlideData } from "@/components/formation/EnhancedSlidePresentation";
import { LICORNE_OPERATING_SLIDES } from "@/data/licorneOperatingSlidesData";
import { mapComplexSlide } from "@/utils/slideDataMapper";

interface LicorneOperatingPresentationProps {
  onClose: () => void;
}

const LicorneOperatingPresentation = ({ onClose }: LicorneOperatingPresentationProps) => {
  const slides: SlideData[] = LICORNE_OPERATING_SLIDES.map(s => mapComplexSlide({
    id: s.id,
    title: s.title,
    subtitle: s.subtitle,
    module: s.category,
    type: "content",
    content: s.content,
    keyPoints: s.keyPoints,
    quote: s.quote,
  }));

  return <EnhancedSlidePresentation slides={slides} title="Licorne Operating Model" onBack={onClose} />;
};

export default LicorneOperatingPresentation;
