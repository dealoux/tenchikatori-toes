import Phaser from 'phaser';
import { IEntity } from '../entities/Entity';
import { Player } from '../entities/Player';
import { Projectile } from './Projectile';

export enum PlayersProjectileType{
    shot_1 = 'card1',
    shot_2 = 'card2',
    special = 'moon',
}

export enum PlayersProjectileVelocity{
    shot_1 = -500,
    shot_2 = -300,
    special = -400,
}

export interface PPoint{
    pos: Phaser.Math.Vector2;
    theta: number;
}


export interface ShootPoints{
    point_1: PPoint,
    point_2: PPoint,
    point_3: PPoint,
    point_4: PPoint,
}

export class PlayersShot1 extends Projectile{
    constructor(scene: Phaser.Scene, pos: Phaser.Math.Vector2){
        super(scene, { pos, texture: PlayersProjectileType.shot_1 }, new Phaser.Math.Vector2(32, 0));
    }

    update(point: PPoint) {
        super.update(point);
        this.setVelocityY(PlayersProjectileVelocity.shot_1);
    }
}

export class PlayersShot2 extends Projectile{
    constructor(scene: Phaser.Scene, pos: Phaser.Math.Vector2){
        super(scene, { pos, texture: PlayersProjectileType.shot_2 }, new Phaser.Math.Vector2(32, 0));
    }

    update(point: PPoint) {
        super.update(point);
        this.setVelocityY(PlayersProjectileVelocity.shot_2);
    }
}