import Phaser from 'phaser';
import { COLLISION_CATEGORIES, Entity } from '../Entity';
import { Projectile, IProjectileData } from './Projectile';
import { IVectorPoint } from '../Entity';
import { Character } from '../characters/Character';

export const ENEMY_PROJECTILE_HITBOX = new Phaser.Math.Vector2(6, 6);
export const ENEMY_PROJECTILE_POOL = 1000;

export const DATA_SHOTBLUE : IProjectileData = {
    pos: Phaser.Math.Vector2.ZERO,
    texture: { key: 'shotBlue', path: 'assets/sprites/touhou_test/shotBlue.png' },
    hitSize: ENEMY_PROJECTILE_HITBOX,
    speed: 300,
    value: 1,
    collisionCategory: COLLISION_CATEGORIES.blue,
}

export const DATA_SHOTRED : IProjectileData = {
    pos: Phaser.Math.Vector2.ZERO,
    texture: { key: 'shotRed', path: 'assets/sprites/touhou_test/shotRed.png' },
    offset: Phaser.Math.Vector2.ZERO,
    hitSize: ENEMY_PROJECTILE_HITBOX,
    speed: 300,
    value: 1,
    collisionCategory: COLLISION_CATEGORIES.red,
}

export class EnemyProjectile extends Projectile{
    constructor(scene: Phaser.Scene, data: IProjectileData){
        super(scene, data);
    }

    protected move(point: IVectorPoint, speed: number){
        let velocity = new Phaser.Math.Vector2(Math.sin(point.theta!), -Math.cos(point.theta!)).normalize().scale(speed);
        this.setVelocity(velocity.x, velocity.y);
    }

    handleCollision(char?: Character): void {
        if(this.collisionCategory == char?.collisionCategory){
            super.handleCollision(char);
        }
    }
}

export class EnemyPBlue extends EnemyProjectile{
    constructor(scene: Phaser.Scene){
        super(scene, DATA_SHOTBLUE);
        this.setCollisionCategory(DATA_SHOTBLUE.collisionCategory!);
        //this.setCollidesWith([COLLISION_CATEGORIES.blue]);
    }

    enableEntity(point: IVectorPoint) {
        super.enableEntity(point);
        this.move(point, DATA_SHOTBLUE.speed);
    }
}

export class EnemyPRed extends EnemyProjectile{
    constructor(scene: Phaser.Scene){
        super(scene, DATA_SHOTRED);
        this.setCollisionCategory(DATA_SHOTRED.collisionCategory!);
        //this.setCollidesWith([COLLISION_CATEGORIES.red]);
    }

    enableEntity(point: IVectorPoint) {
        super.enableEntity(point);
        this.move(point, DATA_SHOTRED.speed);
    }
}