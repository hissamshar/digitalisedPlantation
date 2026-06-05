import { useEffect, useRef, useState, type MutableRefObject } from 'react';

/**
 * Scroll-driven video scrubber.
 *
 * `progress` is a 0..1 ref updated by the parent's GSAP ScrollTrigger; while
 * `active` (section on screen) we run a rAF loop that seeks the video to match.
 *
 * Why the blob pre-fetch: scrubbing relies on `video.currentTime = t`, which
 * makes the browser fetch byte ranges of the file. Vercel's CDN frequently does
 * NOT honor HTTP range requests for static video, so seeks stall in production
 * even though they work against the dev server. Downloading the whole clip into
 * a Blob (in memory) makes every seek instant and independent of the server.
 *
 * Smoothness: we don't queue a new seek until the previous one fires `seeked`,
 * with a watchdog that force-unlocks if a seek never completes (so it can't
 * deadlock). Pair with an all-intra source (`-g 1`) for near-instant seeks.
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
  const [objUrl, setObjUrl] = useState('');
  const [loadPct, setLoadPct] = useState(0);
  const [ready, setReady] = useState(false);

  const rafRef = useRef<number | undefined>(undefined);
  const seekingRef = useRef(false);
  const lastSeekRef = useRef(-1);

  // 1) Pre-fetch the clip as a Blob (with progress) so seeking never depends on
  //    the CDN honoring range requests.
  useEffect(() => {
    let cancelled = false;
    let createdUrl: string | null = null;

    (async () => {
      try {
        const res = await fetch(src, { cache: 'force-cache' });
        if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
        const total = Number(res.headers.get('Content-Length')) || 0;
        const reader = res.body.getReader();
        const chunks: Uint8Array[] = [];
        let received = 0;
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            chunks.push(value);
            received += value.length;
            if (total) setLoadPct(Math.min(99, Math.round((received / total) * 100)));
          }
        }
        if (cancelled) return;
        createdUrl = URL.createObjectURL(new Blob(chunks as BlobPart[], { type: 'video/mp4' }));
        setObjUrl(createdUrl);
      } catch (err) {
        // Fall back to direct streaming (scrubbing may be limited if range
        // requests are unsupported, but at least the clip shows).
        console.warn('Video blob prefetch failed, falling back to direct src:', err);
        if (!cancelled) setObjUrl(src);
      }
    })();

    return () => {
      cancelled = true;
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [src]);

  // 2) Mark ready when the (blob-backed) video has a decodable frame; clear the
  //    seek lock on seeked/error.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !objUrl) return;

    const markReady = () => { v.pause(); if (v.duration && !Number.isNaN(v.duration)) setReady(true); };
    const unlock = () => { seekingRef.current = false; };

    if (v.readyState >= 2) markReady();
    v.addEventListener('loadeddata', markReady);
    v.addEventListener('seeked', unlock);
    v.addEventListener('error', unlock);
    return () => {
      v.removeEventListener('loadeddata', markReady);
      v.removeEventListener('seeked', unlock);
      v.removeEventListener('error', unlock);
    };
  }, [objUrl]);

  // 3) Drive seeks from scroll progress while visible, with a deadlock watchdog.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !ready || !active) return;

    let startedAt = 0;
    const tick = () => {
      const dur = v.duration || 0;
      if (dur) {
        const t = Math.min(dur - 0.001, Math.max(0, progress.current * dur));
        const now = performance.now();
        // Watchdog: if a seek hasn't reported back in 250ms, assume it's stuck.
        if (seekingRef.current && now - startedAt > 250) seekingRef.current = false;
        if (!seekingRef.current && Math.abs(t - lastSeekRef.current) > 0.008) {
          seekingRef.current = true;
          startedAt = now;
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
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          {loadPct > 0 && <span className="text-xs font-medium text-gray-400 tracking-wide">Loading {loadPct}%</span>}
        </div>
      )}
      {objUrl && (
        <video
          ref={videoRef}
          src={objUrl}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ pointerEvents: 'none' }}
        />
      )}
    </>
  );
}
