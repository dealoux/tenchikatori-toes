import Phaser from 'phaser';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from './constants';

export const DefaultConfig = {
  title: "Tenchikatori ~ Testament of Empyrean Songbird",
  type: Phaser.AUTO,
  parent: 'Tenchikatori-ToES',
  //backgroundColor: '#33A5E7',

  scale: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    //mode: Phaser.Scale.FIT,
    //autoCenter: Phaser.Scale.CENTER_BOTH
  },

  physics: {
    default: 'matter',
    matter: {
      debug: true,
      setBounds: true,
      gravity: { x: 0, y: 0 },
    },
  },

  render: {
    antialiasGL: false,
    pixelArt: true,
  },
}