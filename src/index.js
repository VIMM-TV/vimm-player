import { VimmPlayer } from './VimmPlayer.js';

// Export for different module systems
export { VimmPlayer };
export default VimmPlayer;

// Global export for browser usage
if (typeof window !== 'undefined') {
  window.VimmPlayer = VimmPlayer;
}