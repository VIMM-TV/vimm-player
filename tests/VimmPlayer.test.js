import { VimmPlayer } from '../src/VimmPlayer.js';

describe('VimmPlayer', () => {
  let container;

  beforeEach(() => {
    // Create a container element for each test
    container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);

    // Mock fetch response
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ streamId: 'test-stream-id' })
    });
  });

  afterEach(() => {
    // Clean up
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
    jest.clearAllMocks();
  });

  test('should create player instance', () => {
    const player = new VimmPlayer({
      container: container,
      username: 'testuser',
      coreServer: 'https://test-server.com'
    });

    expect(player).toBeInstanceOf(VimmPlayer);
    expect(player.username).toBe('testuser');
    expect(player.coreServer).toBe('https://test-server.com');
  });

  test('should throw error if container not found', () => {
    expect(() => {
      new VimmPlayer({
        container: '#non-existent',
        username: 'testuser'
      });
    }).toThrow('Container element not found');
  });

  test('should create video element and controls', () => {
    new VimmPlayer({
      container: container,
      username: 'testuser'
    });

    expect(container.querySelector('.vimm-video')).toBeTruthy();
    expect(container.querySelector('.vimm-controls')).toBeTruthy();
    expect(container.querySelector('.vimm-play-pause')).toBeTruthy();
  });
});