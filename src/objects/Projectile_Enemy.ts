import Phaser from 'phaser';
import { COLLISION_GROUPS, COLLISION_CATEGORIES } from '../entities/Entity';
import { Player } from '../entities/Player';
import { Projectile, ProjectileData } from './Projectile';
import { VPoint } from '../entities/Entity';

export const ENEMY_PROJECTILE_HITBOX = 4;
export const SHOTPOOL_ENEMY = 150;

export const DATA_SHOTBLUE : ProjectileData = {
    entData: {
        pos: new Phaser.Math.Vector2(0, 0),
        texture: 'shotBlue',
        offset: new Phaser.Math.Vector2(0, 0),
        collisionGroup: COLLISION_GROUPS.ENEMY,
        hitRadius: ENEMY_PROJECTILE_HITBOX,
    },
    speed: 10,
}

export const DATA_SHOTRED : ProjectileData = {
    entData: {
        pos: new Phaser.Math.Vector2(0, 0),
        texture: 'shotRed',
        offset: new Phaser.Math.Vector2(0, 0),
        collisionGroup: COLLISION_GROUPS.ENEMY,
        hitRadius: ENEMY_PROJECTILE_HITBOX,
    },
    speed: 10,
}

class EnemyProjectile extends Projectile{
    constructor(scene: Phaser.Scene, data: ProjectileData){
        super(scene, data);
    }

    protected move(point: VPoint, speed: number){
        let velocity = new Phaser.Math.Vector2(Math.sin(point.theta), -Math.cos(point.theta)).normalize().scale(speed);
        this.setVelocity(velocity.x, velocity.y);

        //this.y += speed;
        //this.scene.physics.velocityFromRotation(point.theta, speed, this.body.velocity);
    }
}

export class EnemyShotBlue extends EnemyProjectile{
    constructor(scene: Phaser.Scene){
        super(scene, DATA_SHOTBLUE);
        this.setCollidesWith([COLLISION_CATEGORIES.blue]);
    }

    updateTransform(point: VPoint) {
        super.updateTransform(point);
        this.move(point, DATA_SHOTBLUE.speed);
    }
}

export class EnemyShotRed extends EnemyProjectile{
    constructor(scene: Phaser.Scene){
        super(scene, DATA_SHOTRED);
        this.setCollidesWith([COLLISION_CATEGORIES.red]);
    }

    updateTransform(point: VPoint) {
        super.updateTransform(point);
        this.move(point, DATA_SHOTRED.speed);
    }
}