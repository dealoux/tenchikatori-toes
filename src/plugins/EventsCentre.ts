import Phaser from 'phaser';

export const eventsCenter = new Phaser.Events.EventEmitter();

export enum GAMEPLAY_EVENTS{
    special = 'special',
    updateScore = 'updateScore',
    updatePowerCount = 'updatePowerCount',
    updateSpecialCount = 'updateSpecialCount',
    updateLivesCount = 'updateLivesCount',
    updateGrazeCount = 'updateGrazeCount',
    updateExtraScore = 'updateExtraScore',
}