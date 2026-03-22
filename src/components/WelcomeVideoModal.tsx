import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, VolumeX, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

const WELCOME_VIDEO_KEY = "startunup_welcome_video_seen";

interface WelcomeVideoModalProps {
  onClose?: () => void;
}

const WelcomeVideoModal = ({ onClose }: WelcomeVideoModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const location = useLocation();

  useEffect(() => {
    // Show only on homepage
    if (location.pathname !== "/") {
      setIsOpen(false);
      return;
    }

    const hasSeenVideo = localStorage.getItem(WELCOME_VIDEO_KEY);
    if (!hasSeenVideo) {
      setIsOpen(true);
    }
  }, [location.pathname]);

  const handleClose = () => {
    localStorage.setItem(WELCOME_VIDEO_KEY, "true");
    setIsOpen(false);
    onClose?.();
  };

  const handleSkip = () => {
    handleClose();
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoEnd = () => {
    // Auto close after video ends with a small delay
    setTimeout(() => {
      handleClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-4xl mx-4"
          >
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSkip}
              className="absolute -top-12 right-0 text-white hover:bg-white/20 z-10"
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Video container */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black">
              {/* Gradient overlay at top */}
              <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/50 to-transparent z-10 pointer-events-none" />
              
              {/* Logo/Title */}
              <div className="absolute top-4 left-4 z-20">
                <h2 className="text-white text-lg font-bold flex items-center gap-2">
                  <span className="text-2xl">🚀</span>
                  Bienvenue sur StartUnUp
                </h2>
              </div>

              {/* Video */}
              <video
                ref={videoRef}
                src="/videos/welcome-video.mp4"
                autoPlay
                muted={isMuted}
                playsInline
                onEnded={handleVideoEnd}
                className="w-full aspect-video object-cover"
              />

              {/* Controls overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={togglePlay}
                      className="text-white hover:bg-white/20"
                    >
                      {isPlaying ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleMute}
                      className="text-white hover:bg-white/20"
                    >
                      {isMuted ? (
                        <VolumeX className="h-5 w-5" />
                      ) : (
                        <Volume2 className="h-5 w-5" />
                      )}
                    </Button>
                    <span className="text-white/70 text-sm ml-2">
                      {isMuted ? "Cliquez pour activer le son" : "Son activé"}
                    </span>
                  </div>
                  
                  <Button
                    onClick={handleSkip}
                    variant="secondary"
                    className="bg-white/20 hover:bg-white/30 text-white border-0"
                  >
                    Passer l'intro
                  </Button>
                </div>
              </div>
            </div>

            {/* Welcome message below video */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mt-6"
            >
              <p className="text-white/80 text-sm">
                Votre plateforme d'apprentissage entrepreneurial
              </p>
              <p className="text-white/60 text-xs mt-1">
                © 2026 Faiez GHORBEL - Tous droits réservés
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeVideoModal;
