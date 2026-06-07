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

export default function HeyGenVideoWidget() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isOpen) {
      return;
    }

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!controlsVisible) {
      return;
    }

    const timer = window.setTimeout(() => {
      setControlsVisible(false);
    }, 4500);

    return () => window.clearTimeout(timer);
  }, [controlsVisible]);

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

    if (!nextMuted && video.paused) {
      void video.play();
    }
  };

  const handleClose = () => {
    videoRef.current?.pause();
    setControlsVisible(false);
    setIsOpen(false);
  };

  const handleShowVideo = () => {
    setIsOpen(true);
    setControlsVisible(true);
    requestAnimationFrame(() => {
      void videoRef.current?.play();
    });
  };

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          className={styles.showBtn}
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
              autoPlay
              muted={isMuted}
              loop
              playsInline
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
