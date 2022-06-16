import Phaser from 'phaser';
import { collisionGroups, collisionCategories } from '../entities/Entity';
import { Player } from '../entities/Player';
import { Projectile, PPoint, ProjectileData } from './Projectile';

export const Data_ShotBlue : ProjectileData = {
    entData: {
        pos: new Phaser.Math.Vector2(0, 0),
        texture: 'shotBlue',
        offset: new Phaser.Math.Vector2(0, 0),
        collisionGroup: collisionGroups.ENEMY,
    },
    speed: 10,
}

export const Data_ShotRed : ProjectileData = {
    entData: {
        pos: new Phaser.Math.Vector2(0, 0),
        texture: 'shotRed',
        offset: new Phaser.Math.Vector2(0, 0),
        collisionGroup: collisionGroups.ENEMY,
    },
    speed: 10,
}

export const SHOTPOOL_ENEMY = 150;

class EnemyProjectile extends Projectile{
    constructor(scene: Phaser.Scene, data: ProjectileData){
        super(scene, data);
    }

    protected move(point: PPoint, speed: number){
        let velocity = new Phaser.Math.Vector2(Math.sin(point.theta), -Math.cos(point.theta)).normalize().scale(speed);
        this.setVelocity(velocity.x, velocity.y);

        //this.y += speed;
        //this.scene.physics.velocityFromRotation(point.theta, speed, this.body.velocity);
    }
}

export class EnemyShotBlue extends EnemyProjectile{
    constructor(scene: Phaser.Scene){
        super(scene, Data_ShotRed);
    }

    updateTransform(point: PPoint) {
        super.updateTransform(point);
        this.move(point, Data_ShotRed.speed);
    }
}

export class EnemyShotRed extends EnemyProjectile{
    constructor(scene: Phaser.Scene){
        super(scene, Data_ShotBlue);
    }

    updateTransform(point: PPoint) {
        super.updateTransform(point);
        this.move(point, Data_ShotBlue.speed);
    }
}