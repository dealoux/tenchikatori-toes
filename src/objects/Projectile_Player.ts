import Phaser from 'phaser';
import { COLLISION_GROUPS, COLLISION_CATEGORIES } from '../entities/Entity';
import { Player } from '../entities/Player';
import { Projectile, IProjectileData } from './Projectile';
import { IVectorPoint } from '../entities/Entity';

export interface IShootPoints{
    point_1: IVectorPoint,
    point_2: IVectorPoint,
    point_3: IVectorPoint,
    point_4: IVectorPoint,
}

export const SHOT_DELAY = 50;
export const SHOTPOOL_PLAYER = 40;

export const DATA_PLAYERSHOT1 : IProjectileData = {
    entData: {
        pos: new Phaser.Math.Vector2(0, 0),
        texture: 'card1',
        offset: new Phaser.Math.Vector2(0, 0),
        collisionGroup: COLLISION_GROUPS.PLAYER,
    },
    speed: 24,
}

export const DATA_PLAYERSHOT2 : IProjectileData = {
    entData: {
        pos: new Phaser.Math.Vector2(0, 0),
        texture: 'card2',
        offset: new Phaser.Math.Vector2(0, 0),
        collisionGroup: COLLISION_GROUPS.PLAYER,
    },
    speed: 22,
}

export const DATA_PLAYERSPECIAL : IProjectileData = {
    entData: {
        pos: new Phaser.Math.Vector2(0, 0),
        texture: 'moon',
        offset: new Phaser.Math.Vector2(0, 0),
        collisionGroup: COLLISION_GROUPS.PLAYER,
    },
    speed: 15,
}

export const SHOOTPOINTS_NORMAL : IShootPoints = {
    point_1: { pos: new Phaser.Math.Vector2(-20, -60), theta: Phaser.Math.DegToRad(0) },
    point_2: { pos: new Phaser.Math.Vector2(20, -60), theta: Phaser.Math.DegToRad(0) },
    point_3: { pos: new Phaser.Math.Vector2(60, -40), theta: Phaser.Math.DegToRad(35) },
    point_4: { pos: new Phaser.Math.Vector2(-60, -40), theta: Phaser.Math.DegToRad(-35) },
}

export const SHOOTPOINTS_FOCUSED : IShootPoints = {
    point_1: { pos: new Phaser.Math.Vector2(-12, -60), theta: Phaser.Math.DegToRad(0) },
    point_2: { pos: new Phaser.Math.Vector2(12, -60), theta: Phaser.Math.DegToRad(0) },
    point_3: { pos: new Phaser.Math.Vector2(36, -50), theta: Phaser.Math.DegToRad(15) },
    point_4: { pos: new Phaser.Math.Vector2(-36, -50), theta: Phaser.Math.DegToRad(-15) },
}

class PlayerPorjectile extends Projectile{
    constructor(scene: Phaser.Scene, data: IProjectileData){
        super(scene, data);

        this.setCollidesWith([COLLISION_CATEGORIES.blue, COLLISION_CATEGORIES.red]);
    }

    protected move(point: IVectorPoint, speed: number){
        let velocity = new Phaser.Math.Vector2(Math.sin(point.theta), -Math.cos(point.theta)).normalize().scale(speed);
        this.setVelocity(velocity.x, velocity.y);

        //this.y += speed;
        //this.scene.physics.velocityFromRotation(point.theta, speed, this.body.velocity);
    }
}

export class PlayerShot1 extends PlayerPorjectile{
    constructor(scene: Phaser.Scene){
        super(scene, DATA_PLAYERSHOT1);
    }

    updateTransform(point: IVectorPoint) {
        super.updateTransform(point);
        this.move(point, DATA_PLAYERSHOT1.speed);
    }
}

export class PlayerShot2 extends PlayerPorjectile{
    constructor(scene: Phaser.Scene){
        super(scene, DATA_PLAYERSHOT2);
    }

    updateTransform(point: IVectorPoint) {
        super.updateTransform(point);
        this.move(point, DATA_PLAYERSHOT2.speed);
    }
}