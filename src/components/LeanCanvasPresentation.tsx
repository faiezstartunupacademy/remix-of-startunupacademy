import EnhancedSlidePresentation, { SlideData } from "@/components/formation/EnhancedSlidePresentation";
import { LEAN_CANVAS_SLIDES } from "@/data/leanCanvasSlidesData";
import { mapComplexSlide } from "@/utils/slideDataMapper";

interface LeanCanvasPresentationProps {
  onClose: () => void;
}

const LeanCanvasPresentation = ({ onClose }: LeanCanvasPresentationProps) => {
  const slides: SlideData[] = LEAN_CANVAS_SLIDES.map(s => mapComplexSlide({
    ...s,
    module: s.module,
  }));

  return <EnhancedSlidePresentation slides={slides} title="Lean Canvas — Running Lean & Scaling Lean" onBack={onClose} />;
};

export default LeanCanvasPresentation;
