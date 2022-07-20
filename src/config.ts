import Phaser from 'phaser';
import { TITLE, ALIAS, WINDOW_WIDTH, WINDOW_HEIGHT } from './constants';

export const DefaultConfig: Phaser.Types.Core.GameConfig = {
  title: TITLE,
  type: Phaser.AUTO,
  parent: ALIAS,
  //backgroundColor: '#33A5E7',
  pixelArt: true,

  scale: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    //mode: Phaser.Scale.FIT,
    //autoCenter: Phaser.Scale.CENTER_BOTH
  },

  physics: {
    default: 'Arcade',
    arcade: {
      debug: true,
      gravity: {x: 0, y: 0},
    },
  },

  render: {
    antialiasGL: false,
    pixelArt: true,
  },
}