"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const VIDEO_SRC = "/videos/dracula-soil-hero-0f41b3a9.mp4";
const POSTER_SRC = "/images/hero-video-poster-7edc6c51.webp";
const REPLAY_DELAY_MS = 10_000;
const RESTART_FADE_MS = 700;

type NavigatorWithConnection = Navigator & {
  connection?: { saveData?: boolean };
};

export function HeroMedia() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const saveData = (navigator as NavigatorWithConnection).connection?.saveData === true;

    const syncPlaybackPreference = () => {
      const enabled = !reducedMotion.matches && !saveData;
      setVideoEnabled(enabled);
      if (!enabled) setVideoVisible(false);
    };

    syncPlaybackPreference();
    reducedMotion.addEventListener("change", syncPlaybackPreference);
    return () => reducedMotion.removeEventListener("change", syncPlaybackPreference);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!videoEnabled || !video) return;

    let isInView = true;
    let waitingForReplay = false;
    let replayTimer: number | undefined;
    let fadeTimer: number | undefined;

    const playWhenAllowed = () => {
      if (isInView && !document.hidden && !waitingForReplay) {
        void video.play().catch(() => undefined);
      }
    };

    const handlePlaying = () => setVideoVisible(true);
    const handleEnded = () => {
      waitingForReplay = true;
      replayTimer = window.setTimeout(() => {
        setVideoVisible(false);
        fadeTimer = window.setTimeout(() => {
          video.currentTime = 0;
          waitingForReplay = false;
          playWhenAllowed();
        }, RESTART_FADE_MS);
      }, REPLAY_DELAY_MS);
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

    video.addEventListener("playing", handlePlaying);
    video.addEventListener("ended", handleEnded);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    observer.observe(video);
    playWhenAllowed();

    return () => {
      video.pause();
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("ended", handleEnded);
      if (replayTimer !== undefined) window.clearTimeout(replayTimer);
      if (fadeTimer !== undefined) window.clearTimeout(fadeTimer);
    };
  }, [videoEnabled]);

  return (
    <div className="absolute inset-0 bg-black" aria-hidden="true">
      <Image
        src={POSTER_SRC}
        alt=""
        fill
        sizes="100vw"
        className="scale-[1.02] object-cover opacity-25"
      />
      <Image
        src={POSTER_SRC}
        alt=""
        fill
        preload
        sizes="100vw"
        className="object-cover object-[58%_center] sm:object-contain sm:object-right"
      />
      <video
        ref={videoRef}
        src={videoEnabled ? VIDEO_SRC : undefined}
        poster={POSTER_SRC}
        autoPlay
        muted
        playsInline
        preload={videoEnabled ? "auto" : "none"}
        tabIndex={-1}
        className={`absolute inset-0 h-full w-full object-cover object-[58%_center] transition-opacity duration-700 sm:object-contain sm:object-right ${
          videoVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        Your browser does not support background video.
      </video>
    </div>
  );
}
