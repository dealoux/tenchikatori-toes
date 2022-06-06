import Phaser from 'phaser';
import { IEntity } from '../entities/Entity';
import { Player } from '../entities/Player';
import { Projectile, PPoint } from './Projectile';

export interface ShootPoints{
    point_1: PPoint,
    point_2: PPoint,
    point_3: PPoint,
    point_4: PPoint,
}

export enum PlayersProjectileType{
    shot_1 = 'card1',
    shot_2 = 'card2',
    special = 'moon',
}

export enum PlayersProjectileVelocity{
    shot_1 = -800,
    shot_2 = -700,
    special = -400,
}

export const shootPointsNormal : ShootPoints = {
    // point_1: { pos: new Phaser.Math.Vector2(20, -10), theta: Phaser.Math.DegToRad(90) },
    // point_2: { pos: new Phaser.Math.Vector2(-20, -10), theta: Phaser.Math.DegToRad(90) },
    // point_3: { pos: new Phaser.Math.Vector2(35, 0), theta: Phaser.Math.DegToRad(125) },
    // point_4: { pos: new Phaser.Math.Vector2(-35, 0), theta: Phaser.Math.DegToRad(55) },
    point_1: { pos: new Phaser.Math.Vector2(20, -10), theta: 90 },
    point_2: { pos: new Phaser.Math.Vector2(-20, -10), theta: 90 },
    point_3: { pos: new Phaser.Math.Vector2(35, 0), theta: 125 },
    point_4: { pos: new Phaser.Math.Vector2(-35, 0), theta: 55 },
}

export const shootPointsFocused : ShootPoints = {
    point_1: { pos: new Phaser.Math.Vector2(12, -10), theta: 90 },
    point_2: { pos: new Phaser.Math.Vector2(-12, -10), theta: 90 },
    point_3: { pos: new Phaser.Math.Vector2(20, -5), theta: 105 },
    point_4: { pos: new Phaser.Math.Vector2(-20, -5), theta: 75 },
}

export class PlayersShot1 extends Projectile{
    constructor(scene: Phaser.Scene, pos: Phaser.Math.Vector2){
        super(scene, { pos, texture: PlayersProjectileType.shot_1 }, new Phaser.Math.Vector2(32, 0));
    }

    update(point: PPoint) {
        super.update(point);
        this.scene.physics.velocityFromAngle(point.theta, PlayersProjectileVelocity.shot_1, this.body.velocity);
        //this.scene.physics.velocityFromRotation(point.theta, PlayersProjectileVelocity.shot_1, this.body.velocity);
    }
}

export class PlayersShot2 extends Projectile{
    constructor(scene: Phaser.Scene, pos: Phaser.Math.Vector2){
        super(scene, { pos, texture: PlayersProjectileType.shot_2 }, new Phaser.Math.Vector2(32, 0));
    }

    update(point: PPoint) {
        super.update(point);
        this.scene.physics.velocityFromAngle(point.theta, PlayersProjectileVelocity.shot_2, this.body.velocity);
    }
}