import Phaser from 'phaser';
import { Enemy, EnemyWithSpawn, IEnemy } from '../Enemy';
import { DATA_SHOTBLUE, DATA_SHOTRED } from '../../../projectiles/Projectile_Enemy' 
import { IAnimation } from '../../Character';
import { IEnemyStateData_Idle } from '../enemy_states/EnemyState_Idle';
import { IEnemyStateData_Attack } from '../enemy_states/EnemyState_Attack';
import { I8WayPatternData, PPattern8Way } from '../../../projectiles/patterns/Pattern_8Way';
import { GAMEPLAY_SIZE, YOUSEI_SPRITES } from '../../../../constants';
import { IEnemyStateData_Spawn } from '../enemy_states/EnemyState_Spawn';
import { IEnemyStateData_Retreat } from '../enemy_states/EnemyState_Retreat';
import { DEMO_EVENTS, eventsCenter } from '../../../../plugins/EventsCentre';

export const DATA_YOUSEI34: IEnemy = {
    texture: YOUSEI_SPRITES,
    hp: 18,
    speed: 200,
    movementDuration: 1500,
    shootPoint: { pos: new Phaser.Math.Vector2(0, 30), theta: 90, }
}

export enum YOUSEI3_ANIMS{
    idle = 'yousei3_idle',
    run = 'yousei3_run',
}

const YOUSEI3_ANIMS_DATA: Array<IAnimation> = [
    { key: YOUSEI3_ANIMS.idle, end: 2, pad: 4 },
    { key: YOUSEI3_ANIMS.run, end: 3, pad: 4 },
]

const SDATA_IDLE_YOUSEI34: IEnemyStateData_Idle = {
    animKey: YOUSEI3_ANIMS.idle,
    maxIdleTime: 1800,
    attackRate: .85,
}

const SDATA_ATTACK_YOUSEI34: IEnemyStateData_Attack = {
    animKey: YOUSEI3_ANIMS.idle,
    neutral: true,
}

export const SDATA_SPAWN_YOUSEI3: IEnemyStateData_Spawn = {
    spawnPoint: { pos: new Phaser.Math.Vector2(GAMEPLAY_SIZE.WIDTH*.2, -100) },
    targetPoint: { pos: new Phaser.Math.Vector2(GAMEPLAY_SIZE.WIDTH*.2, 250) },
    duration: 2400,
}

const SDATA_RETREAT_YOUSEI34: IEnemyStateData_Retreat = {
    activeDuration: 4000,
}

const PATTERN_8WAY_YOUSEI34: I8WayPatternData = {
    fireRate: 100,
    pSpeed: 250,
    duration: 1000,
}

export class Yousei3 extends EnemyWithSpawn{
    constructor(scene: Phaser.Scene){
        super(scene, DATA_YOUSEI34, SDATA_IDLE_YOUSEI34, SDATA_ATTACK_YOUSEI34, SDATA_SPAWN_YOUSEI3, SDATA_RETREAT_YOUSEI34);
        this.attacks.set('8way', new PPattern8Way(this, DATA_YOUSEI34.shootPoint, this.getRedGroup(DATA_SHOTRED.texture.key), PATTERN_8WAY_YOUSEI34));
    }

    create(){
        super.create();
        this.createAnimation(YOUSEI3_ANIMS_DATA, DATA_YOUSEI34.texture.key);
    }

    disableEntity(): void {
        super.disableEntity();
        eventsCenter.emit(DEMO_EVENTS.stage2_spawn);
    }
}

export enum YOUSEI4_ANIMS{
    idle = 'yousei4_idle',
    run = 'yousei4_run',
}

const YOUSEI4_ANIMS_DATA: Array<IAnimation> = [
    { key: YOUSEI4_ANIMS.idle, end: 2, pad: 4 },
    { key: YOUSEI4_ANIMS.run, end: 3, pad: 4 },
]

export const SDATA_SPAWN_YOUSEI4: IEnemyStateData_Spawn = {
    spawnPoint: { pos: new Phaser.Math.Vector2(GAMEPLAY_SIZE.WIDTH*.8, -100) },
    targetPoint: { pos: new Phaser.Math.Vector2(GAMEPLAY_SIZE.WIDTH*.8, 250) },
    duration: 2400,
}

export class Yousei4 extends EnemyWithSpawn{
    constructor(scene: Phaser.Scene){
        super(scene, DATA_YOUSEI34, SDATA_IDLE_YOUSEI34, SDATA_ATTACK_YOUSEI34, SDATA_SPAWN_YOUSEI4, SDATA_RETREAT_YOUSEI34);
        this.attacks.set('8way', new PPattern8Way(this, DATA_YOUSEI34.shootPoint, this.getBlueGroup(DATA_SHOTBLUE.texture.key), PATTERN_8WAY_YOUSEI34));
    }

    create(){
        super.create();
        this.createAnimation(YOUSEI4_ANIMS_DATA, DATA_YOUSEI34.texture.key);
    }

    disableEntity(): void {
        super.disableEntity();
        eventsCenter.emit(DEMO_EVENTS.stage2_spawn2);
    }
}