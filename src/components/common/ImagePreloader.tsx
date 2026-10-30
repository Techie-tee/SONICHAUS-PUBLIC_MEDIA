import { useEffect, useRef, useState } from 'react';

// Key Hero Chamber Visual Assets
import entranceImg from '../../assets/images/studio_01_entrance_1792446831639.jpg';
import vocalBoothImg from '../../assets/images/studio_02_vocal_booth_1792446832131.jpg';
import controlRoomImg from '../../assets/images/studio_control_live_performance_1792447671011.jpg';
import productionLabImg from '../../assets/images/studio_04_production_lab_1792446833465.jpg';
import masterSuiteImg from '../../assets/images/mastering_suite_collaborating_1792679626184.jpg';

// Key Gallery & Architectural Visual Assets
import liveHallImg from '../../assets/images/hero_recording_room_v2_1792444696580.jpg';

// Curated Portfolio & Work Cover Artworks
import afrobeatsArt from '../../assets/images/afrobeats_art_1792664025566.jpg';
import amapianoArt from '../../assets/images/amapiano_art_1792664025996.jpg';
import funkGrooveArt from '../../assets/images/funk_groove_art_1792664043953.jpg';
import jazzBlueArt from '../../assets/images/jazz_blue_art_1792664042317.jpg';
import rnbNeosoulArt from '../../assets/images/rnb_neosoul_art_1792664081553.jpg';
import highlifeArt from '../../assets/images/highlife_art_1792664079837.jpg';

/**
 * High-priority Hero Chamber Images (Must be ready immediately on first paint)
 */
export const CRITICAL_HERO_IMAGES: string[] = [
  entranceImg,
  vocalBoothImg,
  controlRoomImg,
  productionLabImg,
  masterSuiteImg,
];

/**
 * Secondary Gallery, Studio Facility & Portfolio Artwork Images
 */
export const SECONDARY_GALLERY_IMAGES: string[] = [
  liveHallImg,
  afrobeatsArt,
  amapianoArt,
  funkGrooveArt,
  jazzBlueArt,
  rnbNeosoulArt,
  highlifeArt,
];

/**
 * Combined default cache manifest of all key visual media
 */
export const ALL_PRELOAD_IMAGES: string[] = [
  ...CRITICAL_HERO_IMAGES,
  ...SECONDARY_GALLERY_IMAGES,
];

// In-memory Set of already-cached URLs to avoid redundant network/decoding requests across mounts
const preloadedCache = new Set<string>();

// Global in-memory holding array to prevent garbage collection of pre-decoded HTMLImageElements
const imageHolders: HTMLImageElement[] = [];

/**
 * Preload a single image using the browser's native Image API
 */
export function preloadImage(src: string, priority: 'high' | 'auto' | 'low' = 'auto'): Promise<string> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !src) {
      resolve(src);
      return;
    }

    if (preloadedCache.has(src)) {
      resolve(src);
      return;
    }

    const img = new Image();
    img.decoding = 'async';
    // fetchPriority hint supported by modern Chromium / Safari / Firefox
    if ('fetchPriority' in img) {
      (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority = priority;
    }

    img.onload = () => {
      preloadedCache.add(src);
      imageHolders.push(img);
      resolve(src);
    };

    img.onerror = () => {
      // Resolve regardless so downstream loaders are never stuck
      preloadedCache.add(src);
      resolve(src);
    };

    img.src = src;

    // Fast-path: if already complete from browser disk cache
    if (img.complete) {
      preloadedCache.add(src);
      imageHolders.push(img);
      resolve(src);
    }
  });
}

export interface ImagePreloaderProps {
  /** Optional custom list of image URLs to preload. Defaults to all key hero & gallery images. */
  images?: string[];
  /** Number of images in the list to treat as high priority (default: CRITICAL_HERO_IMAGES.length) */
  priorityCount?: number;
  /** Callback fired whenever an image finishes caching */
  onProgress?: (loaded: number, total: number) => void;
  /** Callback fired once all specified images have finished caching */
  onComplete?: () => void;
}

/**
 * ImagePreloader Component
 *
 * Uses the browser's native Image API to cache key hero and gallery visual media
 * before they are rendered, ensuring instant, full-resolution display without
 * pop-in, pixelation, or layout shifting.
 */
export default function ImagePreloader({
  images = ALL_PRELOAD_IMAGES,
  priorityCount = CRITICAL_HERO_IMAGES.length,
  onProgress,
  onComplete,
}: ImagePreloaderProps) {
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const isStartedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || isStartedRef.current) return;
    isStartedRef.current = true;

    let activeCount = 0;
    const total = images.length;

    const handleLoaded = (src: string) => {
      activeCount += 1;
      setLoadedCount(activeCount);
      onProgress?.(activeCount, total);
      if (activeCount >= total) {
        onComplete?.();
      }
    };

    // Phase 1: Preload critical hero chamber images immediately with high priority
    const criticalBatch = images.slice(0, priorityCount);
    criticalBatch.forEach((src) => {
      preloadImage(src, 'high').then(handleLoaded);
    });

    // Phase 2: Preload secondary gallery images during idle time to preserve 60fps main thread responsiveness
    const secondaryBatch = images.slice(priorityCount);
    if (secondaryBatch.length > 0) {
      const scheduleIdle = typeof window.requestIdleCallback === 'function'
        ? window.requestIdleCallback
        : (cb: () => void) => setTimeout(cb, 120);

      scheduleIdle(() => {
        secondaryBatch.forEach((src) => {
          preloadImage(src, 'auto').then(handleLoaded);
        });
      });
    }
  }, [images, priorityCount, onProgress, onComplete]);

  // Invisibly mounts without disturbing DOM structure or layout
  return null;
}
