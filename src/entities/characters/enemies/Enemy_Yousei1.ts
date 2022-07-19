import Phaser from 'phaser';
import { Enemy, IEnemy } from './Enemy';
import { IEntity, IVectorPoint } from '../../Entity';
import { DATA_SHOTBLUE, DATA_SHOTRED } from '../../projectiles/Projectile_Enemy' 
import { IWavePatternData, PPatternWave } from '../../projectiles/Projectile';
import { IAnimation } from '../Character';

export enum YOUSEI1_ANIMS{
    idle = 'yousei1_idle',
    run = 'yousei1_run',
}

const YOUSEI1_ANIMS_DATA: Array<IAnimation> = [
    { key: YOUSEI1_ANIMS.idle, end: 2, pad: 4 },
    { key: YOUSEI1_ANIMS.run, end: 3, pad: 4 },
]

export const DATA_YOUSEI1: IEnemy = {
    texture: { key: 'yousei1', path: 'assets/sprites/touhou_test/youseis.png', json: 'assets/sprites/touhou_test/youseis.json' },
    hp: 3
}

const TEST_SHOT_DELAY = 500;

const WAVEPATTERN_YOUSEI1 : IWavePatternData = {
    pSpeed : 250,
    fireRate : 30,
    wave: PPatternWave.generateWaveArray(400, 16),
    waveIndex: 0,
}

export class Yousei1 extends Enemy{
    shootPoint: IVectorPoint;
    wavePattern: PPatternWave;

    constructor(scene: Phaser.Scene){
        super(scene, DATA_YOUSEI1);
        this.setScale(2);

        this.shootPoint = {
            pos: new Phaser.Math.Vector2(0, 30), theta: 90,
        }

        this.wavePattern = new PPatternWave(this, this.shootPoint, this.getRedGroup(DATA_SHOTRED.texture.key), WAVEPATTERN_YOUSEI1);
    }

    static preload(scene: Phaser.Scene) {
        scene.load.atlas(DATA_YOUSEI1.texture.key, DATA_YOUSEI1.texture.path, DATA_YOUSEI1.texture.json);
    }

    create(){
        super.create();

        this.createAnimation(YOUSEI1_ANIMS_DATA, DATA_YOUSEI1.texture.key);
        // this.anims.create({ key: YOUSEI1_ANIMS.idle, frames: this.anims.generateFrameNames(DATA_YOUSEI1.texture.key, { prefix: YOUSEI1_ANIMS.idle, end: 2, zeroPad: 4}), repeat: -1});
        // this.anims.create({ key: YOUSEI1_ANIMS.run, frames: this.anims.generateFrameNames(DATA_YOUSEI1.texture.key, { prefix: YOUSEI1_ANIMS.run, end: 3, zeroPad: 4}), repeat: -1});
    }

    protected updateHere() {
        super.updateHere();

        this.anims.play(YOUSEI1_ANIMS.idle);

        // if(this.time() > this.lastShotTime){
        //     this.shoot();
        // }
        this.shoot();
    }

    protected shoot() {
        // this.spawnProjectile(Enemy.redPManager, DATA_SHOTRED.texture.key, this.shootPoint);
        this.wavePattern.updatePattern();
        this.lastShotTime = this.time() + TEST_SHOT_DELAY;
    }

    protected moveTo(){

    }
}