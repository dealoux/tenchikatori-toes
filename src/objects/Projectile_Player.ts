import Phaser from 'phaser';
import { IEntity } from '../entities/Entity';
import { Player } from '../entities/Player';
import { Projectile, PPoint, ProjectileData } from './Projectile';

export interface ShootPoints{
    point_1: PPoint,
    point_2: PPoint,
    point_3: PPoint,
    point_4: PPoint,
}

export const Data_PlayerShot1 : ProjectileData = {
    key: 'card1',
    velocity: -18,
    hitRadius: 6,
    offset: new Phaser.Math.Vector2(0, 6),
}

export const Data_PlayerShot2 : ProjectileData = {
    key: 'card2',
    velocity: -15,
    hitRadius: 6,
    offset: new Phaser.Math.Vector2(0, 6),
}

export const Data_PlayerSpecial : ProjectileData = {
    key: 'moon',
    velocity: -1500,
    hitRadius: 6,
    offset: new Phaser.Math.Vector2(0, 0),
}

export const SHOT_DELAY = 50;

export const SHOOTPOINTS_NORMAL : ShootPoints = {
    // point_1: { pos: new Phaser.Math.Vector2(20, -10), theta: Phaser.Math.DegToRad(90) },
    // point_2: { pos: new Phaser.Math.Vector2(-20, -10), theta: Phaser.Math.DegToRad(90) },
    // point_3: { pos: new Phaser.Math.Vector2(35, 0), theta: Phaser.Math.DegToRad(125) },
    // point_4: { pos: new Phaser.Math.Vector2(-35, 0), theta: Phaser.Math.DegToRad(55) },
    point_1: { pos: new Phaser.Math.Vector2(-20, -10), theta: 90 },
    point_2: { pos: new Phaser.Math.Vector2(20, -10), theta: 90 },
    point_3: { pos: new Phaser.Math.Vector2(35, 0), theta: 125 },
    point_4: { pos: new Phaser.Math.Vector2(-35, 0), theta: 55 },
}

export const SHOOTPOINTS_FOCUSED : ShootPoints = {
    point_1: { pos: new Phaser.Math.Vector2(-12, -10), theta: 90 },
    point_2: { pos: new Phaser.Math.Vector2(12, -10), theta: 90 },
    point_3: { pos: new Phaser.Math.Vector2(20, -5), theta: 105 },
    point_4: { pos: new Phaser.Math.Vector2(-20, -5), theta: 75 },
}

export class PlayerShot1 extends Projectile{
    constructor(scene: Phaser.Scene, pos: Phaser.Math.Vector2){
        super(scene, { pos, texture: Data_PlayerShot1.key }, Data_PlayerShot1);
        this.body.setCircle(Data_PlayerShot1.hitRadius);
    }

    update(point: PPoint) {
        super.update(point);
        this.scene.physics.velocityFromAngle(point.theta, Data_PlayerShot1.velocity, this.body.velocity);
        //this.scene.physics.velocityFromRotation(point.theta, PlayerShot1Data.velocity, this.body.velocity);
    }
}

export class PlayerShot2 extends Projectile{
    constructor(scene: Phaser.Scene, pos: Phaser.Math.Vector2){
        super(scene, { pos, texture: Data_PlayerShot2.key }, Data_PlayerShot2);
        this.body.setCircle(Data_PlayerShot2.hitRadius);
    }

    update(point: PPoint) {
        super.update(point);
        this.scene.physics.velocityFromAngle(point.theta, Data_PlayerShot2.velocity, this.body.velocity);
    }
}