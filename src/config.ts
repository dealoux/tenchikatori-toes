import Phaser from 'phaser';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from './constants';

export const DefaultConfig = {
  title: "Touhou Tenchikatori ~ Testament of Empyrean Songbird",
  type: Phaser.AUTO,
  parent: 'Touhou-ToES',
  //backgroundColor: '#33A5E7',

  scale: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    //mode: Phaser.Scale.FIT,
    //autoCenter: Phaser.Scale.CENTER_BOTH
  },

  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },

  render: {
    antialiasGL: false,
    pixelArt: true,
  },
}