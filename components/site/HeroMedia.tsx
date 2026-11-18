"use client";

import { useEffect, useRef } from "react";

const VIDEO_SRC = "/videos/dracula-soil-hero-pingpong-95e638da.mp4";

export function HeroMedia() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isInView = true;

    const playWhenAllowed = () => {
      if (reducedMotion.matches) {
        video.pause();
      } else if (isInView && !document.hidden) {
        void video.play().catch(() => undefined);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInView = entry.isIntersecting;
        if (isInView) playWhenAllowed();
        else video.pause();
      },
      { threshold: 0.05 }
    );

    const handleVisibilityChange = () => {
      if (document.hidden) video.pause();
      else playWhenAllowed();
    };

    reducedMotion.addEventListener("change", playWhenAllowed);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    observer.observe(video);
    playWhenAllowed();

    return () => {
      video.pause();
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      reducedMotion.removeEventListener("change", playWhenAllowed);
    };
  }, []);

  return (
    <div className="absolute inset-0 bg-black" aria-hidden="true">
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        tabIndex={-1}
        className="absolute inset-0 h-full w-full object-cover object-[58%_center] sm:object-contain sm:object-right"
      >
        Your browser does not support background video.
      </video>
    </div>
  );
}
