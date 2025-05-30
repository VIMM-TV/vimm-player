import { VimmPlayer } from './VimmPlayer.js';

// React components (only export if React is available)
let VimmPlayerReact, useVimmPlayer;
try {
  if (typeof React !== 'undefined' || typeof window === 'undefined') {
    const reactComponents = require('./react/index.js');
    VimmPlayerReact = reactComponents.VimmPlayerReact;
    useVimmPlayer = reactComponents.useVimmPlayer;
  }
} catch (e) {
  // React not available, that's fine
}

// Export for different module systems
export { VimmPlayer, VimmPlayerReact, useVimmPlayer };
export default VimmPlayer;

// Global export for browser usage
if (typeof window !== 'undefined') {
  window.VimmPlayer = VimmPlayer;
  if (VimmPlayerReact) {
    window.VimmPlayerReact = VimmPlayerReact;
  }
}