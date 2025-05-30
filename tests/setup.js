// Mock fetch globally for tests
global.fetch = jest.fn();

// Mock HLS.js
jest.mock('hls.js', () => {
  return {
    __esModule: true,
    default: class MockHls {
      static isSupported() {
        return true;
      }
      
      constructor() {
        this.levels = [
          { height: 720 },
          { height: 480 },
          { height: 360 }
        ];
        this.currentLevel = -1;
      }
      
      loadSource() {}
      attachMedia() {}
      on() {}
      destroy() {}
    }
  };
});

// Mock DOM methods that might not be available in jsdom
Object.defineProperty(document, 'fullscreenElement', {
  value: null,
  writable: true
});

Element.prototype.requestFullscreen = jest.fn();
document.exitFullscreen = jest.fn();