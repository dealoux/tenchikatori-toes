import Phaser from 'phaser';
import { Enemy, IEnemy } from './Enemy';
import { IEntity, IVectorPoint } from '../../Entity';
import { DATA_SHOTBLUE, DATA_SHOTRED } from '../../projectiles/Projectile_Enemy' 
import { IWavePatternData, PPatternWave } from '../../projectiles/Projectile';

export enum YOUSEI1_ANIMS{
    idle = 'yousei1_idle',
    run = 'yousei1_run',
}

export const DATA_YOUSEI1: IEnemy = {
    texture: { key: 'yousei1', path: 'assets/sprites/touhou_test/youseis.png', json: 'assets/sprites/touhou_test/youseis.json' },
    hp: 3
}

const TEST_SHOT_DELAY = 500;

const Yousei1WaveData : IWavePatternData = {
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

        this.wavePattern = new PPatternWave(this, this.shootPoint, Enemy.redPManager.getGroup(DATA_SHOTRED.texture.key), Yousei1WaveData);
    }

    static preload(scene: Phaser.Scene) {
        scene.load.atlas(DATA_YOUSEI1.texture.key, DATA_YOUSEI1.texture.path, DATA_YOUSEI1.texture.json);
    }

    create(){
        super.create();

        this.anims.create({ key: YOUSEI1_ANIMS.idle, frames: this.anims.generateFrameNames(DATA_YOUSEI1.texture.key, { prefix: YOUSEI1_ANIMS.idle, end: 2, zeroPad: 4}), repeat: -1});
        this.anims.create({ key: YOUSEI1_ANIMS.run, frames: this.anims.generateFrameNames(DATA_YOUSEI1.texture.key, { prefix: YOUSEI1_ANIMS.run, end: 3, zeroPad: 4}), repeat: -1});
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
}