import 'phaser';

import { IntroScene } from './scenes/IntroScene';
import { SimpleScene } from './scenes/SimpleScene';
// Load application styles
import 'styles/index.scss';


const gameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-game',
    dom: {
        createContainer: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true
        }
    },
    scene: [
        IntroScene,
        SimpleScene
    ]
};

new Phaser.Game(gameConfig);