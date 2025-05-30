import { useRef, useEffect, useCallback, useState } from 'react';
import { VimmPlayer } from '../VimmPlayer.js';

export const useVimmPlayer = ({
  username,
  coreServer = 'https://vimmcore.webhop.me',
  options = {}
} = {}) => {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentQuality, setCurrentQuality] = useState(null);

  // Initialize player
  const initializePlayer = useCallback(async () => {
    if (!containerRef.current || !username) return;

    try {
      setHasError(false);
      
      playerRef.current = new VimmPlayer({
        container: containerRef.current,
        username,
        coreServer,
        options
      });

      // Set up event listeners
      playerRef.current.on('ready', () => {
        setIsReady(true);
      });

      playerRef.current.on('play', () => {
        setIsPlaying(true);
      });

      playerRef.current.on('pause', () => {
        setIsPlaying(false);
      });

      playerRef.current.on('error', (error) => {
        setHasError(true);
        console.error('VimmPlayer error:', error);
      });

      playerRef.current.on('qualityChange', ({ quality }) => {
        setCurrentQuality(quality);
      });

    } catch (error) {
      setHasError(true);
      console.error('Failed to initialize VimmPlayer:', error);
    }
  }, [username, coreServer, options]);

  // Player control methods
  const play = useCallback(() => {
    return playerRef.current?.play();
  }, []);

  const pause = useCallback(() => {
    playerRef.current?.pause();
  }, []);

  const setVolume = useCallback((volume) => {
    playerRef.current?.setVolume(volume);
  }, []);

  const setQuality = useCallback((level) => {
    playerRef.current?.setQuality(level);
  }, []);

  const toggleFullscreen = useCallback(() => {
    playerRef.current?.toggleFullscreen();
  }, []);

  const destroy = useCallback(() => {
    if (playerRef.current && !playerRef.current.isDestroyed) {
      playerRef.current.destroy();
      setIsReady(false);
      setIsPlaying(false);
      setHasError(false);
    }
  }, []);

  // Initialize player when dependencies change
  useEffect(() => {
    initializePlayer();

    return () => {
      destroy();
    };
  }, [initializePlayer, destroy]);

  return {
    containerRef,
    player: playerRef.current,
    isReady,
    isPlaying,
    hasError,
    currentQuality,
    controls: {
      play,
      pause,
      setVolume,
      setQuality,
      toggleFullscreen,
      destroy
    }
  };
};