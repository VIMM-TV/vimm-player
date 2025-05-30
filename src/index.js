// Quick prototype to test in vimm-frontend
import { VimmPlayer } from './VimmPlayer';

// Replace the iframe in MainContent.js
const PlayerComponent = useMemo(() => {
  if (!featuredStream) return null;
  
  const playerRef = useRef(null);
  
  useEffect(() => {
    if (playerRef.current) {
      const player = new VimmPlayer({
        container: playerRef.current,
        username: featuredStream.username,
        coreServer: config.core.server
      });
      
      return () => player.destroy();
    }
  }, [featuredStream.username]);
  
  return <div ref={playerRef} className="vimm-player-container" />;
}, [featuredStream?.username]);