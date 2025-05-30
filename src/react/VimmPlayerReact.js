import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { VimmPlayer } from '../VimmPlayer.js';

const VimmPlayerReact = forwardRef(({
  username,
  coreServer = 'https://vimmcore.webhop.me',
  options = {},
  onReady,
  onPlay,
  onPause,
  onError,
  onQualityChange,
  className = '',
  style = {},
  ...props
}, ref) => {
  const containerRef = useRef(null);
  const playerRef = useRef(null);

  // Expose player methods to parent component
  useImperativeHandle(ref, () => ({
    play: () => playerRef.current?.play(),
    pause: () => playerRef.current?.pause(),
    setVolume: (volume) => playerRef.current?.setVolume(volume),
    setQuality: (level) => playerRef.current?.setQuality(level),
    toggleFullscreen: () => playerRef.current?.toggleFullscreen(),
    destroy: () => playerRef.current?.destroy(),
    getPlayer: () => playerRef.current
  }), []);

  useEffect(() => {
    if (!containerRef.current || !username) return;

    // Create player instance
    try {
      playerRef.current = new VimmPlayer({
        container: containerRef.current,
        username,
        coreServer,
        options
      });

      // Set up event listeners
      if (onReady) playerRef.current.on('ready', onReady);
      if (onPlay) playerRef.current.on('play', onPlay);
      if (onPause) playerRef.current.on('pause', onPause);
      if (onError) playerRef.current.on('error', onError);
      if (onQualityChange) playerRef.current.on('qualityChange', onQualityChange);

    } catch (error) {
      console.error('Failed to initialize VimmPlayer:', error);
      if (onError) onError(error);
    }

    // Cleanup function
    return () => {
      if (playerRef.current && !playerRef.current.isDestroyed) {
        playerRef.current.destroy();
      }
    };
  }, [username, coreServer, onReady, onPlay, onPause, onError, onQualityChange]);

  // Update options when they change
  useEffect(() => {
    if (playerRef.current && options) {
      // Update player options if needed
      Object.assign(playerRef.current.options, options);
    }
  }, [options]);

  return (
    <div 
      ref={containerRef}
      className={`vimm-player-react ${className}`}
      style={style}
      {...props}
    />
  );
});

VimmPlayerReact.displayName = 'VimmPlayerReact';

export default VimmPlayerReact;