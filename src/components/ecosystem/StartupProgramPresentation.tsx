import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, BookOpen, Lightbulb, CheckCircle2,
  Target, Globe, Rocket, MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EnhancedSlidePresentation, { SlideData } from "@/components/formation/EnhancedSlidePresentation";
import { startupProgramSlidesData } from "@/data/startupProgramSlidesData";

const StartupProgramPresentation = () => {
  const slides: SlideData[] = startupProgramSlidesData.map(s => ({
    ...s,
    type: s.type,
  }));

  return <EnhancedSlidePresentation slides={slides} />;
};

export default StartupProgramPresentation;
