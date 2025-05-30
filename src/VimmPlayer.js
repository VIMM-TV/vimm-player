import Hls from 'hls.js';
import './styles/player.css';

export class VimmPlayer {
  constructor(options) {
    this.container = typeof options.container === 'string' 
      ? document.querySelector(options.container) 
      : options.container;
    
    if (!this.container) {
      throw new Error('Container element not found');
    }

    this.username = options.username;
    this.coreServer = options.coreServer || 'https://vimmcore.webhop.me';
    this.options = { ...this.defaultOptions, ...options.options };
    
    this.video = null;
    this.hls = null;
    this.controls = null;
    this.events = {};
    this.isDestroyed = false;
    
    this.init();
  }

  defaultOptions = {
    autoplay: true,
    muted: false,
    controls: true,
    responsive: true,
    theme: 'dark'
  };

  async init() {
    try {
      this.createPlayerStructure();
      await this.loadStream();
      this.setupControls();
      this.setupEventListeners();
      this.setupKeyboardShortcuts();
      this.emit('ready');
    } catch (error) {
      this.emit('error', error);
      console.error('VimmPlayer initialization failed:', error);
    }
  }

  createPlayerStructure() {
    this.container.className = `vimm-player ${this.options.theme}`;
    this.container.innerHTML = `
      <div class="vimm-player-wrapper">
        <video class="vimm-video" ${this.options.muted ? 'muted' : ''}></video>
        <div class="vimm-controls">
          <div class="vimm-progress-bar">
            <div class="vimm-progress-filled"></div>
          </div>
          <div class="vimm-control-buttons">
            <button class="vimm-btn vimm-play-pause">⏸️</button>
            <div class="vimm-volume-control">
              <button class="vimm-btn vimm-mute">🔊</button>
              <input type="range" class="vimm-volume-slider" min="0" max="100" value="100">
            </div>
            <div class="vimm-quality-control">
              <button class="vimm-btn vimm-quality">Auto</button>
              <div class="vimm-quality-menu"></div>
            </div>
            <button class="vimm-btn vimm-fullscreen">⛶</button>
          </div>
        </div>
        <div class="vimm-loading">
          <div class="vimm-spinner"></div>
        </div>
      </div>
    `;

    this.video = this.container.querySelector('.vimm-video');
    this.controls = {
      wrapper: this.container.querySelector('.vimm-controls'),
      playPause: this.container.querySelector('.vimm-play-pause'),
      mute: this.container.querySelector('.vimm-mute'),
      volume: this.container.querySelector('.vimm-volume-slider'),
      quality: this.container.querySelector('.vimm-quality'),
      qualityMenu: this.container.querySelector('.vimm-quality-menu'),
      fullscreen: this.container.querySelector('.vimm-fullscreen'),
      progress: this.container.querySelector('.vimm-progress-bar'),
      progressFilled: this.container.querySelector('.vimm-progress-filled')
    };
  }

  async getStreamPath() {
    const response = await fetch(
      `${this.coreServer}/api/streams/path/${this.username}?type=hiveAccount`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to get stream path: ${response.status}`);
    }
    
    const data = await response.json();
    return `${this.coreServer}/live/${data.streamId}/master.m3u8`;
  }

  async loadStream() {
    if (!Hls.isSupported()) {
      throw new Error('HLS is not supported in this browser');
    }

    try {
      const streamUrl = await this.getStreamPath();
      
      this.hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });

      this.hls.loadSource(streamUrl);
      this.hls.attachMedia(this.video);

      this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
        this.setupQualityLevels();
        if (this.options.autoplay) {
          this.play();
        }
      });

      this.hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS Error:', data);
        this.emit('error', data);
      });

    } catch (error) {
      throw new Error(`Failed to load stream: ${error.message}`);
    }
  }

  setupControls() {
    // Play/Pause
    this.controls.playPause.addEventListener('click', () => {
      this.video.paused ? this.play() : this.pause();
    });

    // Volume
    this.controls.mute.addEventListener('click', () => {
      this.video.muted = !this.video.muted;
      this.controls.mute.textContent = this.video.muted ? '🔇' : '🔊';
    });

    this.controls.volume.addEventListener('input', (e) => {
      this.video.volume = e.target.value / 100;
    });

    // Fullscreen
    this.controls.fullscreen.addEventListener('click', () => {
      this.toggleFullscreen();
    });

    // Progress bar (for live streams, this might be limited)
    this.controls.progress.addEventListener('click', (e) => {
      if (!this.video.duration) return;
      const rect = this.controls.progress.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      this.video.currentTime = pos * this.video.duration;
    });
  }

  setupQualityLevels() {
    if (!this.hls || !this.hls.levels) return;

    const qualityMenu = this.controls.qualityMenu;
    qualityMenu.innerHTML = '';

    // Add Auto option
    const autoOption = document.createElement('div');
    autoOption.className = 'vimm-quality-option active';
    autoOption.textContent = 'Auto';
    autoOption.addEventListener('click', () => this.setQuality(-1));
    qualityMenu.appendChild(autoOption);

    // Add manual quality options
    this.hls.levels.forEach((level, index) => {
      const option = document.createElement('div');
      option.className = 'vimm-quality-option';
      option.textContent = `${level.height}p`;
      option.addEventListener('click', () => this.setQuality(index));
      qualityMenu.appendChild(option);
    });

    // Toggle quality menu
    this.controls.quality.addEventListener('click', () => {
      qualityMenu.classList.toggle('show');
    });
  }

  setupEventListeners() {
    // Video events
    this.video.addEventListener('play', () => {
      this.controls.playPause.textContent = '⏸️';
      this.emit('play');
    });

    this.video.addEventListener('pause', () => {
      this.controls.playPause.textContent = '▶️';
      this.emit('pause');
    });

    this.video.addEventListener('timeupdate', () => {
      this.updateProgress();
    });

    this.video.addEventListener('waiting', () => {
      this.showLoading();
    });

    this.video.addEventListener('canplay', () => {
      this.hideLoading();
    });
  }

  setupKeyboardShortcuts() {
    this.container.addEventListener('keydown', (e) => {
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          this.video.paused ? this.play() : this.pause();
          break;
        case 'KeyF':
          e.preventDefault();
          this.toggleFullscreen();
          break;
        case 'KeyM':
          e.preventDefault();
          this.video.muted = !this.video.muted;
          break;
      }
    });
    
    // Make container focusable for keyboard events
    this.container.setAttribute('tabindex', '0');
  }

  // Public API methods
  play() {
    return this.video.play();
  }

  pause() {
    this.video.pause();
  }

  setVolume(volume) {
    this.video.volume = Math.max(0, Math.min(1, volume));
    this.controls.volume.value = this.video.volume * 100;
  }

  setQuality(levelIndex) {
    if (!this.hls) return;
    
    this.hls.currentLevel = levelIndex;
    
    // Update UI
    const options = this.controls.qualityMenu.querySelectorAll('.vimm-quality-option');
    options.forEach((option, index) => {
      option.classList.toggle('active', index === (levelIndex + 1));
    });
    
    const qualityText = levelIndex === -1 ? 'Auto' : `${this.hls.levels[levelIndex].height}p`;
    this.controls.quality.textContent = qualityText;
    
    this.emit('qualityChange', { level: levelIndex, quality: qualityText });
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      this.container.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  updateProgress() {
    if (!this.video.duration) return;
    
    const progress = (this.video.currentTime / this.video.duration) * 100;
    this.controls.progressFilled.style.width = `${progress}%`;
  }

  showLoading() {
    this.container.querySelector('.vimm-loading').style.display = 'flex';
  }

  hideLoading() {
    this.container.querySelector('.vimm-loading').style.display = 'none';
  }

  // Event system
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }

  destroy() {
    if (this.isDestroyed) return;
    
    if (this.hls) {
      this.hls.destroy();
    }
    
    this.container.innerHTML = '';
    this.events = {};
    this.isDestroyed = true;
    
    this.emit('destroyed');
  }
}

// Default export for ES modules
export default VimmPlayer;