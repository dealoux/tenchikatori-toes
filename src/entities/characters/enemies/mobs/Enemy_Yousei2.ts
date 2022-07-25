import Phaser from 'phaser';
import { EnemyWithSpawn, IEnemy } from '../Enemy';
import { DATA_SHOTBLUE, DATA_SHOTRED } from '../../../projectiles/Projectile_Enemy' 
import { IAnimation } from '../../Character';
import { IEnemyStateData_Idle } from '../enemy_states/EnemyState_Idle';
import { IEnemyStateData_Attack } from '../enemy_states/EnemyState_Attack';
import { IEnemyStateData_Spawn } from '../enemy_states/EnemyState_Spawn';
import { IEnemyStateData_Retreat } from '../enemy_states/EnemyState_Retreat';
import { GAMEPLAY_SIZE, YOUSEI_SPRITES } from '../../../../constants';
import { I8WayPatternData, PPattern8Way } from '../../../projectiles/patterns/Pattern_8Way';
import { YOUSEI3_ANIMS, YOUSEI3_ANIMS_DATA } from './Enemy_YouseiTest';

export const DATA_YOUSEI2: IEnemy = {
    texture: YOUSEI_SPRITES,
    hp: 18,
    speed: 250,
    movementDuration: 1500,
    shootPoint: { pos: new Phaser.Math.Vector2(0, 30), theta: 90, }
}

export enum YOUSEI2_ANIMS{
    idle = 'yousei2_idle',
    run = 'yousei2_run',
}

const YOUSEI2_ANIMS_DATA: Array<IAnimation> = [
    { key: YOUSEI2_ANIMS.idle, end: 2, pad: 4 },
    { key: YOUSEI2_ANIMS.run, end: 3, pad: 4 },
]

const SDATA_IDLE_YOUSEI2: IEnemyStateData_Idle = {
    animKey: YOUSEI2_ANIMS.idle,
    maxIdleTime: 1800,
    attackRate: .85,
}

const SDATA_ATTACK_YOUSEI2: IEnemyStateData_Attack = {
    animKey: YOUSEI2_ANIMS.idle,
    neutral: true,
}

export const SDATA_SPAWN_YOUSEI2: IEnemyStateData_Spawn = {
    spawnPoint: { pos: new Phaser.Math.Vector2(GAMEPLAY_SIZE.WIDTH*.2, -100) },
    targetPoint: { pos: new Phaser.Math.Vector2(GAMEPLAY_SIZE.WIDTH*.2, 250) },
    duration: 2400,
}

const SDATA_RETREAT_YOUSEI2: IEnemyStateData_Retreat = {
    activeDuration: 4000,
}

const PATTERN_8WAY_YOUSEI: I8WayPatternData = {
    fireRate: 100,
    pSpeed: 250,
    duration: 1000,
}

export class Yousei2 extends EnemyWithSpawn{
    constructor(scene: Phaser.Scene){
        super(scene, DATA_YOUSEI2, SDATA_IDLE_YOUSEI2, SDATA_ATTACK_YOUSEI2, SDATA_SPAWN_YOUSEI2, SDATA_RETREAT_YOUSEI2);
        this.attacks.set('8way', new PPattern8Way(this, DATA_YOUSEI2.shootPoint, this.getRedGroup(DATA_SHOTRED.texture.key), PATTERN_8WAY_YOUSEI));
    }

    static preload(scene: Phaser.Scene) {
	}

    create(){
        super.create();
        this.createAnimation(YOUSEI2_ANIMS_DATA, DATA_YOUSEI2.texture.key);
    }
}

export const SDATA_SPAWN_YOUSEI3: IEnemyStateData_Spawn = {
    spawnPoint: { pos: new Phaser.Math.Vector2(GAMEPLAY_SIZE.WIDTH*.8, -100) },
    targetPoint: { pos: new Phaser.Math.Vector2(GAMEPLAY_SIZE.WIDTH*.8, 250) },
    duration: 2400,
}

export class Yousei31 extends EnemyWithSpawn{
    constructor(scene: Phaser.Scene){
        super(scene, DATA_YOUSEI2, {...SDATA_IDLE_YOUSEI2, animKey: YOUSEI3_ANIMS.idle }, {...SDATA_ATTACK_YOUSEI2, animKey: YOUSEI3_ANIMS.idle}, SDATA_SPAWN_YOUSEI3, SDATA_RETREAT_YOUSEI2);
        this.attacks.set('8way', new PPattern8Way(this, DATA_YOUSEI2.shootPoint, this.getBlueGroup(DATA_SHOTBLUE.texture.key), PATTERN_8WAY_YOUSEI));
    }

    create(){
        super.create();
        this.createAnimation(YOUSEI3_ANIMS_DATA, DATA_YOUSEI2.texture.key);
    }
}