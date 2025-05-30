// Mock HLS.js for testing
global.Hls = {
  isSupported: jest.fn(() => true),
  Events: {
    MANIFEST_PARSED: 'hlsManifestParsed',
    ERROR: 'hlsError'
  }
};

// Mock DOM APIs that might not be available in test environment
global.requestFullscreen = jest.fn();
global.exitFullscreen = jest.fn();

// Mock fetch for API calls
global.fetch = jest.fn();

// Setup DOM mocks
Object.defineProperty(window, 'HTMLMediaElement', {
  writable: true,
  value: class MockHTMLMediaElement {
    constructor() {
      this.play = jest.fn(() => Promise.resolve());
      this.pause = jest.fn();
      this.addEventListener = jest.fn();
      this.removeEventListener = jest.fn();
    }
  }
});