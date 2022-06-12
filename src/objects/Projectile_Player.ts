import Phaser from 'phaser';
import { collisionGroups } from '../entities/Entity';
import { Player } from '../entities/Player';
import { Projectile, PPoint, ProjectileData } from './Projectile';

export interface ShootPoints{
    point_1: PPoint,
    point_2: PPoint,
    point_3: PPoint,
    point_4: PPoint,
}

export const SHOT_DELAY = 50;

export const Data_PlayerShot1 : ProjectileData = {
    entData: {
        pos: new Phaser.Math.Vector2(0, 0),
        texture: 'card1',
        offset: new Phaser.Math.Vector2(0, 0),
        collisionGroup: collisionGroups.PLAYER,
    },
    speed: 24,
}

export const Data_PlayerShot2 : ProjectileData = {
    entData: {
        pos: new Phaser.Math.Vector2(0, 0),
        texture: 'card2',
        offset: new Phaser.Math.Vector2(0, 0),
        collisionGroup: collisionGroups.PLAYER,
    },
    speed: 22,
}

export const Data_PlayerSpecial : ProjectileData = {
    entData: {
        pos: new Phaser.Math.Vector2(0, 0),
        texture: 'moon',
        offset: new Phaser.Math.Vector2(0, 0),
        collisionGroup: collisionGroups.PLAYER,
    },
    speed: 15,
}

export const SHOOTPOINTS_NORMAL : ShootPoints = {
    point_1: { pos: new Phaser.Math.Vector2(-20, -60), theta: Phaser.Math.DegToRad(0) },
    point_2: { pos: new Phaser.Math.Vector2(20, -60), theta: Phaser.Math.DegToRad(0) },
    point_3: { pos: new Phaser.Math.Vector2(60, -40), theta: Phaser.Math.DegToRad(35) },
    point_4: { pos: new Phaser.Math.Vector2(-60, -40), theta: Phaser.Math.DegToRad(-35) },
}

export const SHOOTPOINTS_FOCUSED : ShootPoints = {
    point_1: { pos: new Phaser.Math.Vector2(-12, -60), theta: Phaser.Math.DegToRad(0) },
    point_2: { pos: new Phaser.Math.Vector2(12, -60), theta: Phaser.Math.DegToRad(0) },
    point_3: { pos: new Phaser.Math.Vector2(36, -50), theta: Phaser.Math.DegToRad(15) },
    point_4: { pos: new Phaser.Math.Vector2(-36, -50), theta: Phaser.Math.DegToRad(-15) },
}

export class PlayerShot1 extends Projectile{
    constructor(scene: Phaser.Scene, pos: Phaser.Math.Vector2){
        super(scene, Data_PlayerShot1);
        //this.body.setCircle(Data_PlayerShot1.hitRadius);
    }

    update(point: PPoint) {
        super.update(point);
        
        let velocity = new Phaser.Math.Vector2(Math.sin(point.theta), -Math.cos(point.theta)).normalize().scale(Data_PlayerShot1.speed);
        this.setVelocity(velocity.x, velocity.y);

        //this.y += Data_PlayerShot1.velocity;
        //this.scene.physics.velocityFromRotation(point.theta, PlayerShot1Data.velocity, this.body.velocity);
    }
}

export class PlayerShot2 extends Projectile{
    constructor(scene: Phaser.Scene, pos: Phaser.Math.Vector2){
        super(scene, Data_PlayerShot2);
        //this.body.setCircle(Data_PlayerShot2.hitRadius);
    }

    update(point: PPoint) {
        super.update(point);

        let velocity = new Phaser.Math.Vector2(Math.sin(point.theta), -Math.cos(point.theta)).normalize().scale(Data_PlayerShot2.speed);
        this.setVelocity(velocity.x, velocity.y);
    }
}