import Phaser from 'phaser';
import { COLLISION_GROUPS, COLLISION_CATEGORIES } from '../entities/Entity';
import { Player } from '../entities/Player';
import { Projectile, IProjectileData } from './Projectile';
import { IVectorPoint } from '../entities/Entity';

export const ENEMY_PROJECTILE_HITBOX = 4;
export const SHOTPOOL_ENEMY = 150;

export const DATA_SHOTBLUE : IProjectileData = {
    entData: {
        pos: new Phaser.Math.Vector2(0, 0),
        texture: 'shotBlue',
        offset: new Phaser.Math.Vector2(0, 0),
        hitRadius: ENEMY_PROJECTILE_HITBOX,
    },
    speed: 300,
}

export const DATA_SHOTRED : IProjectileData = {
    entData: {
        pos: new Phaser.Math.Vector2(0, 0),
        texture: 'shotRed',
        offset: new Phaser.Math.Vector2(0, 0),
        hitRadius: ENEMY_PROJECTILE_HITBOX,
    },
    speed: 300,
}

class EnemyProjectile extends Projectile{
    constructor(scene: Phaser.Scene, data: IProjectileData){
        super(scene, data);
    }

    protected move(point: IVectorPoint, speed: number){
        let velocity = new Phaser.Math.Vector2(Math.sin(point.theta), -Math.cos(point.theta)).normalize().scale(speed);
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