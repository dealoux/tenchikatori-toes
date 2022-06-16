import Phaser from 'phaser';
import { PoolManager } from '../@types/Pool';
import { Enemy } from './Enemy';
import { IEntity } from './Entity';
import { Characters } from './Character';

export enum Yousei1Anims{
    idle = 'yousei1_idle',
    run = 'yousei1_run',
}

export class Yousei1 extends Enemy{
    constructor(scene: Phaser.Scene, { pos, texture, frame, offset }: IEntity){
        super(scene, { pos, texture, frame, offset }, 1, 3, new PoolManager(scene, Yousei1));
    }

    create(){
        super.create();

        this.anims.create({ key: Yousei1Anims.idle, frames: this.anims.generateFrameNames(Characters.YOUSEIS, { prefix: Yousei1Anims.idle, end: 2, zeroPad: 4}), repeat: -1});
        this.anims.create({ key: Yousei1Anims.run, frames: this.anims.generateFrameNames(Characters.YOUSEIS, { prefix: Yousei1Anims.run, end: 3, zeroPad: 4}), repeat: -1});
    }

    update() {
        super.update();

        this.anims.play('yousei1_idle');
    }
}