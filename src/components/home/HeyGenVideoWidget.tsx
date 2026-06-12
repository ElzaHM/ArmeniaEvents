import { useEffect, useRef, useState } from 'react';
import {
  AudioMutedOutlined,
  CloseOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  SoundOutlined,
} from '@ant-design/icons';

import aiAssistantVideo from '../../assets/AiAssistantVideo/Ai Assistant.webm';

import styles from './HeyGenVideoWidget.module.css';

const HOME_VIDEO_RETURN_CLOSED_KEY = 'armeniaEvents.homeVideoReturnClosed';
const MOBILE_MAX_WIDTH = 768;

function getInitialIsOpen() {
  if (typeof window === 'undefined') {
    return true;
  }

  return sessionStorage.getItem(HOME_VIDEO_RETURN_CLOSED_KEY) !== '1';
}

export default function HeyGenVideoWidget() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOpen, setIsOpen] = useState(getInitialIsOpen);
  const [isMuted, setIsMuted] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`).matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`);
    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (isMobile) {
      videoRef.current?.pause();
    }
  }, [isMobile]);

  useEffect(() => {
    return () => {
      sessionStorage.setItem(HOME_VIDEO_RETURN_CLOSED_KEY, '1');
      videoRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isOpen || isMobile) {
      return;
    }

    video.pause();
    setIsPlaying(false);

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.pause();
    };
  }, [isOpen, isMobile]);

  useEffect(() => {
    if (!controlsVisible) {
      return;
    }

    const timer = window.setTimeout(() => {
      setControlsVisible(false);
    }, 4500);

    return () => window.clearTimeout(timer);
  }, [controlsVisible]);

  if (isMobile) {
    return null;
  }

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (video.paused) {
      void video.play();
      return;
    }

    video.pause();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const nextMuted = !isMuted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleClose = () => {
    videoRef.current?.pause();
    setIsPlaying(false);
    setControlsVisible(false);
    setIsOpen(false);
  };

  const handleShowVideo = () => {
    setIsOpen(true);
    setControlsVisible(true);
  };

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          className={`${styles.showBtn} glassBlur`}
          aria-label="Show video"
          onClick={handleShowVideo}
        >
          Show video
        </button>
      )}

      {isOpen && (
        <aside
          className={`${styles.widget} ${styles.widgetVisible} ${controlsVisible ? styles.controlsVisible : ''}`}
          aria-label="AI assistant video"
        >
          <div className={styles.player}>
            <video
              ref={videoRef}
              className={styles.video}
              src={aiAssistantVideo}
              muted={isMuted}
              loop
              playsInline
              preload="metadata"
            />

            <button
              type="button"
              className={styles.muteBtn}
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              onClick={toggleMute}
            >
              {isMuted ? (
                <AudioMutedOutlined className={styles.muteIcon} />
              ) : (
                <SoundOutlined className={styles.muteIcon} />
              )}
            </button>

            <button
              type="button"
              className={styles.closeBtn}
              aria-label="Close video"
              onClick={handleClose}
            >
              <CloseOutlined className={styles.closeIcon} />
            </button>

            <button
              type="button"
              className={styles.playBtn}
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
              onClick={togglePlayback}
            >
              {isPlaying ? (
                <PauseCircleOutlined className={styles.playIcon} />
              ) : (
                <PlayCircleOutlined className={styles.playIcon} />
              )}
            </button>
          </div>
        </aside>
      )}
    </>
  );
}
