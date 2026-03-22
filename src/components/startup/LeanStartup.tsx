import EnhancedSlidePresentation, { SlideData } from "@/components/formation/EnhancedSlidePresentation";
import { LEAN_STARTUP_SLIDES } from "@/data/leanStartupSlidesData";
import { mapComplexSlide } from "@/utils/slideDataMapper";

const LeanStartup = () => {
  const slides: SlideData[] = LEAN_STARTUP_SLIDES.map(s => mapComplexSlide(s));

  return <EnhancedSlidePresentation slides={slides} title="Lean Startup" />;
};

export default LeanStartup;
