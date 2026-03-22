import EnhancedSlidePresentation, { SlideData } from "@/components/formation/EnhancedSlidePresentation";
import { frugalInnovationSlidesData } from "@/data/frugalInnovationData";
import { mapComplexSlide } from "@/utils/slideDataMapper";

const InnovationFrugale = () => {
  const slides: SlideData[] = frugalInnovationSlidesData.map(s => mapComplexSlide({
    ...s,
    type: "content",
  }));

  return <EnhancedSlidePresentation slides={slides} title="Innovation Frugale" />;
};

export default InnovationFrugale;
