import Phaser from 'phaser';
import { DefaultConfig } from './config';

import GameManager from './scenes/GameManager';
import { MainMenu } from './scenes/MainMenu';

new Phaser.Game(
  Object.assign(DefaultConfig, {
    scene: [GameManager, MainMenu]
  })
);