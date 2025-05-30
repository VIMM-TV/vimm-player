# VIMM Player

A modern, lightweight video player for VIMM streaming platform with HLS support and React integration.

## Features

- 🎥 **HLS Streaming Support** - Built with hls.js for reliable video streaming
- ⚛️ **React Integration** - Complete React components and hooks
- 🎨 **Customizable Themes** - Dark and light theme support
- 📱 **Responsive Design** - Works seamlessly across devices
- ⌨️ **Keyboard Shortcuts** - Space (play/pause), F (fullscreen), M (mute)
- 🔧 **Quality Selection** - Automatic and manual quality control
- 🔊 **Volume Control** - Interactive volume slider and mute functionality
- ⛶ **Fullscreen Support** - Native fullscreen API integration

## Installation

```bash
npm install @vimm-tv/vimm-player
```

## Quick Start

### Vanilla JavaScript

```html
<!DOCTYPE html>
<html>
<head>
    <title>VIMM Player Example</title>
</head>
<body>
    <div id="player-container"></div>
    
    <script src="node_modules/@vimm-tv/vimm-player/dist/vimm-player.js"></script>
    <script>
        const player = new VimmPlayer({
            container: '#player-container',
            username: 'your-username',
            coreServer: 'https://vimmcore.webhop.me',
            options: {
                autoplay: true,
                theme: 'dark'
            }
        });
    </script>
</body>
</html>
```

### React Hook

```jsx
import { useVimmPlayer } from '@vimm-tv/vimm-player/react';

function MyComponent() {
    const {
        containerRef,
        isReady,
        isPlaying,
        controls
    } = useVimmPlayer({
        username: 'your-username',
        coreServer: 'https://vimmcore.webhop.me',
        options: { autoplay: true }
    });

    return (
        <div>
            <div ref={containerRef} />
            <button onClick={controls.play} disabled={!isReady}>
                {isPlaying ? 'Pause' : 'Play'}
            </button>
        </div>
    );
}
```

### React Component

```jsx
import { VimmPlayerReact } from '@vimm-tv/vimm-player/react';

function MyComponent() {
    const playerRef = useRef();

    const handleReady = () => {
        console.log('Player is ready!');
    };

    const handleError = (error) => {
        console.error('Player error:', error);
    };

    return (
        <VimmPlayerReact
            ref={playerRef}
            username="your-username"
            coreServer="https://vimmcore.webhop.me"
            onReady={handleReady}
            onError={handleError}
            options={{
                autoplay: false,
                theme: 'dark'
            }}
        />
    );
}
```

## API Reference

### VimmPlayer Constructor

```javascript
const player = new VimmPlayer(options)
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `container` | `string\|Element` | **required** | CSS selector or DOM element |
| `username` | `string` | **required** | VIMM username to stream |
| `coreServer` | `string` | `'https://vimmcore.webhop.me'` | VIMM core server URL |
| `options.autoplay` | `boolean` | `true` | Auto-start playback |
| `options.muted` | `boolean` | `false` | Start muted |
| `options.controls` | `boolean` | `true` | Show player controls |
| `options.responsive` | `boolean` | `true` | Enable responsive design |
| `options.theme` | `string` | `'dark'` | Theme: `'dark'` or `'light'` |

### Methods

#### Playback Control

```javascript
player.play()                    // Start playback
player.pause()                   // Pause playback
player.setVolume(0.5)           // Set volume (0-1)
player.toggleFullscreen()       // Toggle fullscreen mode
```

#### Quality Control

```javascript
player.setQuality(-1)           // Auto quality
player.setQuality(0)            // Highest quality
player.setQuality(1)            // Second highest quality
```

#### Events

```javascript
player.on('ready', () => {
    console.log('Player ready');
});

player.on('play', () => {
    console.log('Playback started');
});

player.on('pause', () => {
    console.log('Playback paused');
});

player.on('error', (error) => {
    console.error('Player error:', error);
});

player.on('qualityChange', ({ level, quality }) => {
    console.log(`Quality changed to: ${quality}`);
});
```

### React Hook API

#### useVimmPlayer

```javascript
const {
    containerRef,     // Ref for player container
    player,          // VimmPlayer instance
    isReady,         // Boolean: player ready state
    isPlaying,       // Boolean: playback state
    hasError,        // Boolean: error state
    currentQuality,  // String: current quality level
    controls         // Object: control methods
} = useVimmPlayer(options);
```

#### Controls Object

```javascript
controls.play()              // Start playback
controls.pause()             // Pause playback
controls.setVolume(volume)   // Set volume (0-1)
controls.setQuality(level)   // Set quality level
controls.toggleFullscreen()  // Toggle fullscreen
controls.destroy()           // Destroy player instance
```

### React Component Props

#### VimmPlayerReact

| Prop | Type | Description |
|------|------|-------------|
| `username` | `string` | VIMM username (required) |
| `coreServer` | `string` | Core server URL |
| `options` | `object` | Player options |
| `onReady` | `function` | Ready event handler |
| `onPlay` | `function` | Play event handler |
| `onPause` | `function` | Pause event handler |
| `onError` | `function` | Error event handler |
| `onQualityChange` | `function` | Quality change handler |
| `className` | `string` | Additional CSS classes |
| `style` | `object` | Inline styles |

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play/Pause toggle |
| `F` | Toggle fullscreen |
| `M` | Toggle mute |

## Browser Support

- Chrome 63+
- Firefox 78+
- Safari 12+
- Edge 79+

HLS.js is required for video streaming support. The player will automatically check for HLS support and display an error if not available.

## Development

### Setup

```bash
git clone https://github.com/VIMM-TV/vimm-player.git
cd vimm-player
npm install
```

### Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run tests
npm run lint         # Lint code
npm start           # Start development server
```

### Project Structure

```
src/
├── index.js              # Main entry point
├── VimmPlayer.js         # Core player class
├── components/           # Player components
├── react/               # React integration
│   ├── index.js
│   ├── useVimmPlayer.js
│   └── VimmPlayerReact.js
├── services/            # API and HLS services
├── styles/              # CSS styles
└── utils/               # Helper utilities
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📖 [Documentation](https://github.com/VIMM-TV/vimm-player#readme)
- 🐛 [Issues](https://github.com/VIMM-TV/vimm-player/issues)
- 💬 [Discussions](https://github.com/VIMM-TV/vimm-player/discussions)