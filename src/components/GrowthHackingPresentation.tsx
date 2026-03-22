import EnhancedSlidePresentation, { SlideData } from "@/components/formation/EnhancedSlidePresentation";
import { growthHackingSlides } from "@/data/growthHackingSlidesData";
import { mapComplexSlide } from "@/utils/slideDataMapper";

interface GrowthHackingPresentationProps {
  onClose: () => void;
}

export default function GrowthHackingPresentation({ onClose }: GrowthHackingPresentationProps) {
  const slides: SlideData[] = growthHackingSlides.map(s => mapComplexSlide(s));

  return <EnhancedSlidePresentation slides={slides} title="Growth Hacking" onBack={onClose} />;
}
