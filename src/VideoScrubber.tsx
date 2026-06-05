import { useEffect, useRef, useState, type MutableRefObject } from 'react';

/**
 * Scroll-driven video scrubber.
 *
 * `progress` is a 0..1 ref updated by the parent's GSAP ScrollTrigger; while
 * `active` (section on screen) we run a rAF loop that seeks the video to match.
 *
 * The key to smoothness: we never issue a new seek until the previous one has
 * fired its `seeked` event. That prevents the seek backlog that makes naive
 * scrubbers stutter. Pair this with an all-intra encoded source (`-g 1`) so
 * each seek is near-instant.
 */
export default function VideoScrubber({
  progress,
  active,
  src,
}: {
  progress: MutableRefObject<number>;
  active: boolean;
  src: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  const rafRef = useRef<number | undefined>(undefined);
  const seekingRef = useRef(false);
  const lastSeekRef = useRef(-1);

  // Mark ready once we have duration, and clear the seek lock on each `seeked`.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const markReady = () => {
      v.pause();
      if (v.duration && !Number.isNaN(v.duration)) setReady(true);
    };
    const onSeeked = () => { seekingRef.current = false; };

    if (v.readyState >= 1) markReady();
    v.addEventListener('loadedmetadata', markReady);
    v.addEventListener('seeked', onSeeked);
    return () => {
      v.removeEventListener('loadedmetadata', markReady);
      v.removeEventListener('seeked', onSeeked);
    };
  }, []);

  // Drive seeks from scroll progress while the section is visible.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !ready || !active) return;

    const tick = () => {
      const dur = v.duration || 0;
      if (dur) {
        const t = Math.min(dur - 0.001, Math.max(0, progress.current * dur));
        // Only queue a new seek if we're idle and the target moved meaningfully.
        if (!seekingRef.current && Math.abs(t - lastSeekRef.current) > 0.008) {
          seekingRef.current = true;
          lastSeekRef.current = t;
          try { v.currentTime = t; } catch { seekingRef.current = false; }
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [ready, active, progress]);

  return (
    <>
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ pointerEvents: 'none' }}
      />
    </>
  );
}
