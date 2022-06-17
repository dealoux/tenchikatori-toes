import Phaser from 'phaser';
import { PoolManager } from '../@types/Pool';
import { Enemy } from './Enemy';
import { IEntity, IVectorPoint } from './Entity';
import { Characters } from './Character';
import { DATA_SHOTBLUE, DATA_SHOTRED } from '../objects/Projectile_Enemy' 

export enum Yousei1Anims{
    idle = 'yousei1_idle',
    run = 'yousei1_run',
}

const TEST_SHOT_DELAY = 500;

export class Yousei1 extends Enemy{
    shootPoint: IVectorPoint;

    constructor(scene: Phaser.Scene, { pos, texture, frame, offset }: IEntity){
        super(scene, { pos, texture, frame, offset }, 1, 3, new PoolManager(scene, Yousei1));
        this.setScale(2);

        this.shootPoint = {
            pos: new Phaser.Math.Vector2(0, 30), theta: Phaser.Math.DegToRad(180)
        }
    }

    create(){
        super.create();

        this.anims.create({ key: Yousei1Anims.idle, frames: this.anims.generateFrameNames(Characters.YOUSEIS, { prefix: Yousei1Anims.idle, end: 2, zeroPad: 4}), repeat: -1});
        this.anims.create({ key: Yousei1Anims.run, frames: this.anims.generateFrameNames(Characters.YOUSEIS, { prefix: Yousei1Anims.run, end: 3, zeroPad: 4}), repeat: -1});
    }

    update() {
        super.update();

        this.anims.play(Yousei1Anims.idle);

        if(this.time() > this.lastShotTime){
            this.shoot();
        }
    }

    protected shoot() {
        this.spawnProjectile(DATA_SHOTRED.entData.texture, this.shootPoint);
        this.lastShotTime = this.time() + TEST_SHOT_DELAY;
    }
}