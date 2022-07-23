import Phaser from 'phaser';
import { Projectile, IProjectileData } from './Projectile';
import { IVectorPoint } from '../Entity';
import { Character } from '../characters/Character';

export interface IShootPoints{
    point_0: IVectorPoint,
    point_1: IVectorPoint,
    point_2: IVectorPoint,
    point_3: IVectorPoint,
    point_4: IVectorPoint,
}

export const PLAYER_SHOOT_DELAY = 60;
export const PLAYER_PROJECTILE_POOL = 60;
export const PLAYER_SPECIAL_POOL = 10;

export const DATA_PLAYER_P1 : IProjectileData = {
    texture: { key: 'card1', path: 'assets/sprites/touhou_test/card1.png' },
    speed: 600,
    value: 1,
}

export const DATA_PLAYER_P2 : IProjectileData = {
    texture: { key: 'card2', path: 'assets/sprites/touhou_test/card2.png' },
    speed: 600,
    value: 1,
}

export const DATA_PLAYER_PMOON : IProjectileData = {
    hitSize: new Phaser.Math.Vector2(24, 10),
    texture: { key: 'moon', path: 'assets/sprites/touhou_test/moon.png', frameWidth: 32, frameHeight: 16 },
    speed: 400,
    value: 3,
}

export const SHOOTPOINTS_NORMAL : IShootPoints = {
    point_0: { pos: new Phaser.Math.Vector2(0, -40), theta: 0 },
    point_1: { pos: new Phaser.Math.Vector2(-20, -60), theta: 0 },
    point_2: { pos: new Phaser.Math.Vector2(20, -60), theta: 0 },
    point_3: { pos: new Phaser.Math.Vector2(60, -40), theta: 15 },
    point_4: { pos: new Phaser.Math.Vector2(-60, -40), theta: -15 },
}

export const SHOOTPOINTS_FOCUSED : IShootPoints = {
    point_0: { pos: new Phaser.Math.Vector2(0, -40), theta: 0 },
    point_1: { pos: new Phaser.Math.Vector2(-12, -60), theta: 0 },
    point_2: { pos: new Phaser.Math.Vector2(12, -60), theta: 0 },
    point_3: { pos: new Phaser.Math.Vector2(36, -50), theta: 0 },
    point_4: { pos: new Phaser.Math.Vector2(-36, -50), theta: 0 },
}

export class PlayerPorjectile extends Projectile{
    constructor(scene: Phaser.Scene, data: IProjectileData){
        super(scene, data);
    }

    protected move(point: IVectorPoint, speed: number){
        //this.scene.physics.velocityFromRotation(point.theta, speed, this.body.velocity);
        let thetaRad = Phaser.Math.DegToRad(point.theta!);
        let velocity = new Phaser.Math.Vector2(Math.sin(thetaRad), -Math.cos(thetaRad)).normalize().scale(speed);
        this.setVelocity(velocity.x, velocity.y);
        this.setAngle(point.theta);
    }
}

export class PlayerShot1 extends PlayerPorjectile{
    constructor(scene: Phaser.Scene){
        super(scene, DATA_PLAYER_P1);
    }

    updateTransform(point: IVectorPoint) {
        super.updateTransform(point);
        this.move(point, DATA_PLAYER_P1.speed);
    }
}

export class PlayerShot2 extends PlayerPorjectile{
    constructor(scene: Phaser.Scene){
        super(scene, DATA_PLAYER_P2);
    }

    updateTransform(point: IVectorPoint) {
        super.updateTransform(point);
        this.move(point, DATA_PLAYER_P2.speed);
    }
}

export class PlayerSpecialMoon extends PlayerPorjectile{
    constructor(scene: Phaser.Scene){
        super(scene, DATA_PLAYER_PMOON);
    }

    handleCollision(char?: Character){ }
}