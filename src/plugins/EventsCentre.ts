import Phaser from 'phaser';

export const eventsCenter = new Phaser.Events.EventEmitter();

export enum GAMEPLAY_EVENTS{
    gameplayStart = 'gameplayStart',
    gameplayPause = 'gameplayPause',
    gameplayResume = 'gameplayResume',
    gameplayEnd = 'gameplayEnd',

    requestPlayer = 'requestPlayer',
    retrievePlayer = 'retrievePlayyer',

    playerDamaged = 'playerDamaged',
    stageBossVanished = 'stageBossVanished',

    special = 'special',
    updateScore = 'updateScore',
    displayScore = 'displayScore',
    displayPowerCount = 'updatePowerCount',
    displaySpecialCount = 'updateSpecialCount',
    displayHPCount = 'updateHPCount',
    displayGrazeCount = 'updateGrazeCount',
    displayExtraScore = 'updateExtraScore',
}

export enum CUTSCENE_EVENTS{
    changeSpeaker = 'changeSpeaker',
    dialogEnds = 'dialogEnds',
}

export enum DEMO_EVENTS{
    stage2_spawn = 'stage2_spawn',
    stage2_spawn2 = 'stage2_spawn2',
}