import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ZoomIn } from 'lucide-react';

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  title: string;
  caption?: string;
  category?: string;
}

export default function LightboxModal({
  isOpen,
  onClose,
  imageSrc,
  title,
  caption,
  category,
}: LightboxModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="lightbox-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-8 sm:right-8 z-30 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/10"
            aria-label="Close Lightbox"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center rounded-2xl overflow-hidden bg-[#07090e] border border-white/15 cursor-default shadow-2xl"
          >
            <div className="relative w-full h-[65vh] sm:h-[72vh] bg-black/40 flex items-center justify-center overflow-hidden">
              <img
                src={imageSrc}
                alt={title}
                className="w-full h-full object-contain select-none"
              />
            </div>

            {/* Caption & Metadata Footer */}
            <div className="w-full p-4 sm:p-6 bg-[#0a0d14] border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
              <div className="space-y-1">
                {category && (
                  <span className="text-[10px] uppercase tracking-widest text-[#89AACC] block">
                    {category}
                  </span>
                )}
                <h3 className="text-base sm:text-lg font-bold text-white font-display">
                  {title}
                </h3>
                {caption && (
                  <p className="text-slate-400 text-xs font-sans max-w-2xl leading-relaxed">
                    {caption}
                  </p>
                )}
              </div>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest shrink-0">
                SONICVAULT ARCHIVAL ARCHITECTURE
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
