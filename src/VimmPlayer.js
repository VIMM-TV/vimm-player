// src/VimmPlayer.js
import Hls from 'hls.js';

export class VimmPlayer {
  constructor(options) {
    this.container = typeof options.container === 'string' 
      ? document.querySelector(options.container) 
      : options.container;
    this.username = options.username;
    this.coreServer = options.coreServer;
    this.options = { ...this.defaultOptions, ...options.options };
    
    this.video = null;
    this.hls = null;
    this.events = {};
    
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
    await this.createVideoElement();
    await this.loadStream();
    this.setupControls();
    this.setupEventListeners();
    this.emit('ready');
  }
  
  async getStreamPath() {
    const response = await fetch(
      `${this.coreServer}/api/streams/path/${this.username}?type=hiveAccount`
    );
    const data = await response.json();
    return `${this.coreServer}/live/${data.streamId}/master.m3u8`;
  }
  
  // ... rest of implementation
}