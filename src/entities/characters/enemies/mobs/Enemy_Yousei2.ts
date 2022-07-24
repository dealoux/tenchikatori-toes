import Phaser from 'phaser';
import { EnemyWithSpawn, IEnemy } from '../Enemy';
import { DATA_SHOTBLUE, DATA_SHOTRED } from '../../../projectiles/Projectile_Enemy' 
import { IWavePatternData, PPatternWave } from '../../../projectiles/patterns/Pattern_Wave';
import { IAnimation } from '../../Character';
import { IEnemyStateData_Idle } from '../enemy_states/EnemyState_Idle';
import { IEnemyStateData_Attack } from '../enemy_states/EnemyState_Attack';
import { IEnemyStateData_Spawn } from '../enemy_states/EnemyState_Spawn';
import { IEnemyStateData_Retreat } from '../enemy_states/EnemyState_Retreat';
import { GAMEPLAY_SIZE } from '../../../../constants';

export const DATA_YOUSEI2: IEnemy = {
    texture: { key: 'youseis', path: 'assets/sprites/touhou_test/youseis.png', json: 'assets/sprites/touhou_test/youseis.json' },
    hp: 3,
    speed: 200,
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

    maxIdleTime: 800,
    attackRate: .85,
}

const SDATA_ATTACK_YOUSEI2: IEnemyStateData_Attack = {
    animKey: YOUSEI2_ANIMS.idle,
}

export const SDATA_SPAWN_YOUSEI2: IEnemyStateData_Spawn = {
    spawnPoint: { pos: new Phaser.Math.Vector2(400, -100) },
    targetPoint: { pos: new Phaser.Math.Vector2(400, 250) },
    duration: 2400,
}

const SDATA_RETREAT_YOUSEI2: IEnemyStateData_Retreat = {
    activeDuration: 4000,
}

const WAVEPATTERN_YOUSEI2 : IWavePatternData = {
    pSpeed : 250,
    fireRate : 30,
    wave: PPatternWave.generateWaveArray(400, 16),
    waveIndex: 0,
    duration: 250,
}

export class Yousei2 extends EnemyWithSpawn{
    constructor(scene: Phaser.Scene){
        super(scene, DATA_YOUSEI2, SDATA_IDLE_YOUSEI2, SDATA_ATTACK_YOUSEI2, SDATA_SPAWN_YOUSEI2, SDATA_RETREAT_YOUSEI2);
        this.setScale(2);

        this.attacks.set('wave', new PPatternWave(this, DATA_YOUSEI2.shootPoint, this.getRedGroup(DATA_SHOTRED.texture.key), WAVEPATTERN_YOUSEI2));
    }

    static preload(scene: Phaser.Scene) {
	}

    create(){
        super.create();
        this.createAnimation(YOUSEI2_ANIMS_DATA, DATA_YOUSEI2.texture.key);
    }
}