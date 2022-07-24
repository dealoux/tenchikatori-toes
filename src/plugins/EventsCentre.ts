import Phaser from 'phaser';

export const eventsCenter = new Phaser.Events.EventEmitter();

export enum GAMEPLAY_EVENTS{
    gameplayStart = 'gameplayStart',
    gameplayPause = 'gameplayPause',
    gameplayResume = 'gameplayResume',
    gameplayEnd = 'gameplayEnd',

    requestPlayer = 'requestPlayer',
    retrievePlayer = 'retrievePlayyer',

    special = 'special',
    updateScore = 'updateScore',
    displayScore = 'displayScore',
    displayPowerCount = 'updatePowerCount',
    displaySpecialCount = 'updateSpecialCount',
    displayHPCount = 'updateHPCount',
    displayGrazeCount = 'updateGrazeCount',
    displayExtraScore = 'updateExtraScore',
}