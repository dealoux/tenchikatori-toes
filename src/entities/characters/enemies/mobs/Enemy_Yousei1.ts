import Phaser from 'phaser';
import { Enemy, IEnemy } from '../Enemy';
import { DATA_SHOTBLUE, DATA_SHOTRED } from '../../../projectiles/Projectile_Enemy' 
import { IAnimation } from '../../Character';
import { IEnemyStateData_Idle } from '../enemy_states/EnemyState_Idle';
import { IEnemyStateData_Attack } from '../enemy_states/EnemyState_Attack';
import { IEnemyStateData_Spawn } from '../enemy_states/EnemyState_Spawn';
import { GAMEPLAY_SIZE, YOUSEI_SPRITES } from '../../../../constants';
import { IScatterPatternData, PPatternScatter } from '../../../projectiles/patterns/Pattern_Scatter';

export const DATA_YOUSEI1: IEnemy = {
    texture: YOUSEI_SPRITES,
    hp: 10,
    speed: 140,
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
    maxIdleTime: 4000,
    attackRate: .85,
}

const SDATA_ATTACK_YOUSEI1: IEnemyStateData_Attack = {
    animKey: YOUSEI1_ANIMS.idle,
}

export const SDATA_SPAWN_YOUSEI1: IEnemyStateData_Spawn = {
    spawnPoint: { pos: new Phaser.Math.Vector2(700, -100) },
    targetPoint: { pos: new Phaser.Math.Vector2(700, 250) },
    duration: 2400,
}

const PATTERN_SCATTER_YOUSEI1 : IScatterPatternData = {
    pSpeed : 80,
    fireRate : 30,
    scatterDistance: {x: 25, y: 0},
    duration: 250,
}

export class Yousei1 extends Enemy{
    constructor(scene: Phaser.Scene){
        super(scene, DATA_YOUSEI1, SDATA_IDLE_YOUSEI1, SDATA_ATTACK_YOUSEI1);
        this.setScale(2);

        this.attacks.set('wave', new PPatternScatter(this, DATA_YOUSEI1.shootPoint, this.getRedGroup(DATA_SHOTRED.texture.key), PATTERN_SCATTER_YOUSEI1));
    }

    static preload(scene: Phaser.Scene) {
	}

    create(){
        super.create();
        this.createAnimation(YOUSEI1_ANIMS_DATA, DATA_YOUSEI1.texture.key);
    }    
}