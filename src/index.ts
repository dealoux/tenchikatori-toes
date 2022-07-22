import Phaser from 'phaser';
import { DefaultConfig } from './config';

import GameManager from './scenes/GameManager';
import { GameplayScene, HUDScene } from './scenes/Gameplay';
import { MainMenu, OverMenu, PauseScene } from './scenes/Menu';
import GameplayStage1 from './scenes/stages/GameplayStage1';

new Phaser.Game(
  Object.assign(DefaultConfig, {
    scene: [GameManager, MainMenu, OverMenu, GameplayStage1, HUDScene, PauseScene]
  })
);