import 'phaser';

import { SimpleScene } from './scenes/SimpleScene';
// Load application styles
import 'styles/index.scss';

const gameConfig = {
  type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [
        SimpleScene
    ]
};

new Phaser.Game(gameConfig);