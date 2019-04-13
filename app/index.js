import 'phaser';

import { SimpleScene } from './scenes/SimpleScene';
// Load application styles
import 'styles/index.scss';

const gameConfig = {
  width: 680,
  height: 400,
  scene: SimpleScene
};

new Phaser.Game(gameConfig);