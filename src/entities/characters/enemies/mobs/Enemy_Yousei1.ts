import Phaser from 'phaser';
import { Enemy, IEnemy } from '../Enemy';
import { IVectorPoint } from '../../../Entity';
import { DATA_SHOTBLUE, DATA_SHOTRED } from '../../../projectiles/Projectile_Enemy' 
import { IWavePatternData, PPatternWave } from '../../../projectiles/patterns/Pattern_Wave';
import { IAnimation } from '../../Character';
import { IEnemyStateData_Idle } from '../enemy_states/EnemyState_Idle';
import { IEnemyStateData_Attack } from '../enemy_states/EnemyState_Attack';
import { IEnemyStateData_Spawn } from '../enemy_states/EnemyState_Spawn';
import { GAMEPLAY_SIZE, YOUSEI_SPRITES } from '../../../../constants';

export const DATA_YOUSEI1: IEnemy = {
    texture: YOUSEI_SPRITES,
    hp: 3,
    speed: 200,
    movementDuration: 1500,
    shootPoint: { pos: new Phaser.Math.Vector2(0, 30), theta: 90, }
}

export enum YOUSEI1_ANIMS{
    idle = 'yousei1_idle',
    run = 'yousei1_run',
}

const YOUSEI1_ANIMS_DATA: Array<IAnimation> = [
    { key: YOUSEI1_ANIMS.idle, end: 2, pad: 4 },
    { key: YOUSEI1_ANIMS.run, end: 3, pad: 4 },
]

const SDATA_IDLE_YOUSEI1: IEnemyStateData_Idle = {
    animKey: YOUSEI1_ANIMS.idle,
    maxIdleTime: 1800,
    attackRate: .85,
}

// const SDATA_MOVE_YOUSEI1: IEnemyStateData_Move = {
//     animKey: YOUSEI1_ANIMS.run,
//     duration: 2400,

//     locations: [
//         { pos: new Phaser.Math.Vector2(720, 300), theta: 0 },
//         { pos: new Phaser.Math.Vector2(1020, 200), theta: 0 },
//         { pos: new Phaser.Math.Vector2(420, 200), theta: 0 },
//     ],
// }

const SDATA_ATTACK_YOUSEI1: IEnemyStateData_Attack = {
    animKey: YOUSEI1_ANIMS.idle,
}

export const SDATA_SPAWN_YOUSEI1: IEnemyStateData_Spawn = {
    spawnPoint: { pos: new Phaser.Math.Vector2(700, -100) },
    targetPoint: { pos: new Phaser.Math.Vector2(700, 250) },
    duration: 2400,
}

const WAVEPATTERN_YOUSEI1 : IWavePatternData = {
    pSpeed : 250,
    fireRate : 30,
    wave: PPatternWave.generateWaveArray(400, 16),
    waveIndex: 0,
    duration: 1000,
}

export class Yousei1 extends Enemy{
    constructor(scene: Phaser.Scene){
        super(scene, DATA_YOUSEI1, SDATA_IDLE_YOUSEI1, SDATA_ATTACK_YOUSEI1);
        this.setScale(2);

        this.attacks.set('wave', new PPatternWave(this, DATA_YOUSEI1.shootPoint, this.getRedGroup(DATA_SHOTRED.texture.key), WAVEPATTERN_YOUSEI1));
    }

    static preload(scene: Phaser.Scene) {
	}

    create(){
        super.create();

        this.createAnimation(YOUSEI1_ANIMS_DATA, DATA_YOUSEI1.texture.key);
        // this.anims.create({ key: YOUSEI1_ANIMS.idle, frames: this.anims.generateFrameNames(DATA_YOUSEI1.texture.key, { prefix: YOUSEI1_ANIMS.idle, end: 2, zeroPad: 4}), repeat: -1});
        // this.anims.create({ key: YOUSEI1_ANIMS.run, frames: this.anims.generateFrameNames(DATA_YOUSEI1.texture.key, { prefix: YOUSEI1_ANIMS.run, end: 3, zeroPad: 4}), repeat: -1});
    }    
}