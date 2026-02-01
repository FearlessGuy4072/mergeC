import IntroScene from "./IntroScene.js";
import GameScene from './GameScene.js';
import BankScene from './BankScene.js';
import MiniGameScene from './MiniGameScene.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#0b0f1a',

  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },

  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },

  scene: [GameScene, BankScene, MiniGameScene, IntroScene]
};

new Phaser.Game(config);
