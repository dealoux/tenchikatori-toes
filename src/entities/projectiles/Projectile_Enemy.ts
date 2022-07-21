import Phaser from 'phaser';
import { COLLISION_CATEGORIES } from '../Entity';
import { Projectile, IProjectileData } from './Projectile';
import { IVectorPoint } from '../Entity';

export const ENEMY_PROJECTILE_HITBOX = new Phaser.Math.Vector2(6, 6);
export const ENEMY_PROJECTILE_POOL = 1000;

export const DATA_SHOTBLUE : IProjectileData = {
    pos: Phaser.Math.Vector2.ZERO,
    texture: { key: 'shotBlue', path: 'assets/sprites/touhou_test/shotBlue.png' },
    hitSize: ENEMY_PROJECTILE_HITBOX,
    speed: 300,
    value: 1,
}

export const DATA_SHOTRED : IProjectileData = {
    pos: Phaser.Math.Vector2.ZERO,
    texture: { key: 'shotRed', path: 'assets/sprites/touhou_test/shotRed.png' },
    offset: Phaser.Math.Vector2.ZERO,
    hitSize: ENEMY_PROJECTILE_HITBOX,
    speed: 300,
    value: 1,
}

export class EnemyProjectile extends Projectile{
    constructor(scene: Phaser.Scene, data: IProjectileData){
        super(scene, data);
    }

    protected move(point: IVectorPoint, speed: number){
        let velocity = new Phaser.Math.Vector2(Math.sin(point.theta!), -Math.cos(point.theta!)).normalize().scale(speed);
        this.setVelocity(velocity.x, velocity.y);
    }
}

export class EnemyPBlue extends EnemyProjectile{
    constructor(scene: Phaser.Scene){
        super(scene, DATA_SHOTBLUE);

        //this.setCollidesWith([COLLISION_CATEGORIES.blue]);
    }

    updateTransform(point: IVectorPoint) {
        super.updateTransform(point);
        this.move(point, DATA_SHOTBLUE.speed);
    }
}

export class EnemyPRed extends EnemyProjectile{
    constructor(scene: Phaser.Scene){
        super(scene, DATA_SHOTRED);

        //this.setCollidesWith([COLLISION_CATEGORIES.red]);
    }

    updateTransform(point: IVectorPoint) {
        super.updateTransform(point);
        this.move(point, DATA_SHOTRED.speed);
    }
}