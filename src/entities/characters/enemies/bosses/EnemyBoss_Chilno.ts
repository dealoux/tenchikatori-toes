import Phaser from 'phaser';
import { GAMEPLAY_SIZE } from '../../../../constants';
import { IWavePatternData, PPatternWave } from '../../../projectiles/patterns/Pattern_Wave';
import { DATA_SHOTBLUE } from '../../../projectiles/Projectile_Enemy';
import { IAnimation } from '../../Character';
import { EnemyBoss, IEnemy } from '../Enemy';
import { IEnemyStateData_Attack } from '../enemy_states/EnemyState_Attack';
import { IEnemyStateData_Idle } from '../enemy_states/EnemyState_Idle';
import { IEnemyStateData_Move } from '../enemy_states/EnemyState_Move';
import { IEnemyStateData_Spawn } from '../enemy_states/EnemyState_Spawn';

const DATA_CHILNO: IEnemy = {
    texture: { key: 'chilno', path: 'assets/sprites/touhou_test/chilno.png', json: 'assets/sprites/touhou_test/chilno.json' },
    shootPoint: { pos: new Phaser.Math.Vector2(0, 30), theta: 90, },
    hp: 200,
    speed: 200,
    movementDuration: 1500,
}

export enum CHILNO_ANIMS{
    idle = 'chilno_idle_',
    idle2 = 'chilno_idle2_',
    hurt = 'chilno_hurt_',
    strafeLeft = 'chilno_strafeLeft_',
    strafeRight = 'chilno_strafeRight_',
    spell1 = 'chilno_spell1_',
    spell2 = 'chilno_spell2_',
    spell3 = 'chilno_spell3_',
}

const CHILNO_ANIMS_DATA: Array<IAnimation> = [
    { key: CHILNO_ANIMS.idle, end: 3, pad: 2 },
    { key: CHILNO_ANIMS.idle2, end: 1, pad: 2 },
    { key: CHILNO_ANIMS.hurt, end: 2, pad: 2 },
    { key: CHILNO_ANIMS.strafeLeft, end: 1, pad: 2 },
    { key: CHILNO_ANIMS.strafeRight, end: 1, pad: 2 },
    { key: CHILNO_ANIMS.spell1, end: 2, pad: 2 },
    { key: CHILNO_ANIMS.spell2, end: 2, pad: 2 },
    { key: CHILNO_ANIMS.spell3, end: 2, pad: 2 },
]

const SDATA_IDLE_CHILNO: IEnemyStateData_Idle = {
    maxIdleTime: 800,
    attackRate: .85,
    animKey: CHILNO_ANIMS.idle,
}

const SDATA_MOVE_CHILNO: IEnemyStateData_Move = {
    locations: [
        { pos: new Phaser.Math.Vector2(GAMEPLAY_SIZE.WIDTH *.25, GAMEPLAY_SIZE.HEIGHT *.35), theta: 0 },
        { pos: new Phaser.Math.Vector2(GAMEPLAY_SIZE.WIDTH *.4, GAMEPLAY_SIZE.HEIGHT *.25), theta: 0 },
        { pos: new Phaser.Math.Vector2(GAMEPLAY_SIZE.WIDTH *.5, GAMEPLAY_SIZE.HEIGHT *.15), theta: 0 },
        { pos: new Phaser.Math.Vector2(GAMEPLAY_SIZE.WIDTH *.6, GAMEPLAY_SIZE.HEIGHT *.15), theta: 0 },
        { pos: new Phaser.Math.Vector2(GAMEPLAY_SIZE.WIDTH *.75, GAMEPLAY_SIZE.HEIGHT *.35), theta: 0 },
    ],
    animKey: CHILNO_ANIMS.strafeLeft,
    duration: 2400,
}

const SDATA_ATTACK_CHILNO: IEnemyStateData_Attack = {
    animKey: CHILNO_ANIMS.spell1,
}

const SDATA_SPAWN_CHILNO: IEnemyStateData_Spawn = {
    spawnPoint: { pos: new Phaser.Math.Vector2(GAMEPLAY_SIZE.WIDTH *.5, -100) },
    targetPoint: { pos: new Phaser.Math.Vector2(GAMEPLAY_SIZE.WIDTH *.5, GAMEPLAY_SIZE.HEIGHT *.25) },
    duration: 1800,
}

const WAVEPATTERN_CHILNO : IWavePatternData = {
    pSpeed : 250,
    fireRate : 30,
    wave: PPatternWave.generateWaveArray(400, 16),
    waveIndex: 0,
    duration: 250,
}

export class Chilno extends EnemyBoss{
    constructor(scene: Phaser.Scene){
        super(scene, DATA_CHILNO, SDATA_IDLE_CHILNO, SDATA_ATTACK_CHILNO, SDATA_SPAWN_CHILNO, SDATA_MOVE_CHILNO);

        this.attacks.set('key', new PPatternWave(this, DATA_CHILNO.shootPoint, this.getBlueGroup(DATA_SHOTBLUE.texture.key), WAVEPATTERN_CHILNO));
    }

    static preload(scene: Phaser.Scene) {
        scene.load.atlas(DATA_CHILNO.texture.key, DATA_CHILNO.texture.path, DATA_CHILNO.texture.json);
	}

    create(){
        super.create();

        this.createAnimation(CHILNO_ANIMS_DATA, DATA_CHILNO.texture.key);
    }

    static initPManagers(scene: Phaser.Scene){
    }
    
    // handleCollision(p: Projectile) {
        
    // }
}