import Phaser from 'phaser';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from './constants';

export const DefaultConfig = {
  title: "Tenchikatori ~ Testament of Empyrean Songbird",
  type: Phaser.AUTO,
  parent: 'Tenchikatori-ToES',
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
      debug: false,
      gravity: 0,
    },
  },

  render: {
    antialiasGL: false,
    pixelArt: true,
  },
}