import Phaser from 'phaser';
import { Enemy, IEnemy } from './Enemy';
import { IEntity, IVectorPoint } from '../../Entity';
import { DATA_SHOTBLUE, DATA_SHOTRED } from '../../projectiles/Projectile_Enemy' 
import { IWavePatternData, PPatternWave } from '../../projectiles/Projectile';
import { IAnimation } from '../Character';
import { EnemyBoss, IEnemyBoss } from './bosses/EnemyBoss';
import { IEnemyIdleStateData } from './enemy_states/Enemy_IdleState';
import { IEnemyMoveStateData } from './enemy_states/Enemy_MoveState';
import { IEnemyAttackStateData } from './enemy_states/Enemy_AttackState';

export const DATA_YOUSEI1: IEnemyBoss = {
    texture: { key: 'yousei1', path: 'assets/sprites/touhou_test/youseis.png', json: 'assets/sprites/touhou_test/youseis.json' },
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

const SDATA_IDLE_YOUSEI1: IEnemyIdleStateData = {
    animKey: YOUSEI1_ANIMS.idle,

    maxIdleTime: 800,
    attackRate: .85,
}

const SDATA_MOVE_YOUSEI1: IEnemyMoveStateData = {
    animKey: YOUSEI1_ANIMS.run,

    locations: [
        { pos: new Phaser.Math.Vector2(720, 300), theta: 0 },
        { pos: new Phaser.Math.Vector2(1020, 200), theta: 0 },
        { pos: new Phaser.Math.Vector2(420, 200), theta: 0 },
    ],
}

const SDATA_ATTACK_YOUSEI1: IEnemyAttackStateData = {
    animKey: YOUSEI1_ANIMS.idle,
}

const WAVEPATTERN_YOUSEI1 : IWavePatternData = {
    pSpeed : 250,
    fireRate : 30,
    wave: PPatternWave.generateWaveArray(400, 16),
    waveIndex: 0,
}

export class Yousei1 extends EnemyBoss{
    constructor(scene: Phaser.Scene){
        super(scene, DATA_YOUSEI1, SDATA_IDLE_YOUSEI1, SDATA_MOVE_YOUSEI1, SDATA_ATTACK_YOUSEI1);
        // this.setScale(2);

        this.attacks.set('key', new PPatternWave(this, DATA_YOUSEI1.shootPoint, this.getBlueGroup(DATA_SHOTBLUE.texture.key), WAVEPATTERN_YOUSEI1));
    }

    static preload(scene: Phaser.Scene) {
        scene.load.atlas(DATA_YOUSEI1.texture.key, DATA_YOUSEI1.texture.path, DATA_YOUSEI1.texture.json);
	}

    create(){
        super.create();

        this.createAnimation(YOUSEI1_ANIMS_DATA, DATA_YOUSEI1.texture.key);
        this.anims.create({ key: YOUSEI1_ANIMS.idle, frames: this.anims.generateFrameNames(DATA_YOUSEI1.texture.key, { prefix: YOUSEI1_ANIMS.idle, end: 2, zeroPad: 4}), repeat: -1});
        this.anims.create({ key: YOUSEI1_ANIMS.run, frames: this.anims.generateFrameNames(DATA_YOUSEI1.texture.key, { prefix: YOUSEI1_ANIMS.run, end: 3, zeroPad: 4}), repeat: -1});

    }
    
    protected updateHere (){
        super.updateHere();
    }
}

const TEST_SHOT_DELAY = 500;

// export class Yousei1 extends Enemy{
//     wavePattern: PPatternWave;

//     constructor(scene: Phaser.Scene){
//         super(scene, DATA_YOUSEI1);
//         this.setScale(2);

//         this.wavePattern = new PPatternWave(this, DATA_YOUSEI1.shootPoint, this.getRedGroup(DATA_SHOTRED.texture.key), WAVEPATTERN_YOUSEI1);
//     }

//     static preload(scene: Phaser.Scene) {
//         scene.load.atlas(DATA_YOUSEI1.texture.key, DATA_YOUSEI1.texture.path, DATA_YOUSEI1.texture.json);
//     }

//     create(){
//         super.create();

//         this.createAnimation(YOUSEI1_ANIMS_DATA, DATA_YOUSEI1.texture.key);
//         // this.anims.create({ key: YOUSEI1_ANIMS.idle, frames: this.anims.generateFrameNames(DATA_YOUSEI1.texture.key, { prefix: YOUSEI1_ANIMS.idle, end: 2, zeroPad: 4}), repeat: -1});
//         // this.anims.create({ key: YOUSEI1_ANIMS.run, frames: this.anims.generateFrameNames(DATA_YOUSEI1.texture.key, { prefix: YOUSEI1_ANIMS.run, end: 3, zeroPad: 4}), repeat: -1});
//     }

//     protected updateHere() {
//         super.updateHere();

//         this.anims.play(YOUSEI1_ANIMS.idle);

//         // if(this.time() > this.lastShotTime){
//         //     this.shoot();
//         // }
//         this.shoot();
//     }

//     protected shoot() {
//         // this.spawnProjectile(Enemy.redPManager, DATA_SHOTRED.texture.key, this.shootPoint);
//         this.wavePattern.updatePattern();
//         this.lastShotTime = this.time() + TEST_SHOT_DELAY;
//     }

//     protected moveTo(){

//     }
// }