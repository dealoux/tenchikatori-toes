import Phaser from 'phaser';
import { IProjectileData, Projectile } from '../../objects/Projectile';
import { IEntity, IVectorPoint, COLLISION_CATEGORIES, Entity, IFunctionDelegate } from '../Entity';

export const DATA_POWER_ITEM : IProjectileData = {
    pos: Phaser.Math.Vector2.ZERO,
    texture: { key: 'powerItem', path: 'assets/sprites/touhou_test/powerItem.png' },
    speed: 100,
}

export const DATA_SCORE_ITEM : IProjectileData = {
    pos: Phaser.Math.Vector2.ZERO,
    texture: { key: 'scoreItem', path: 'assets/sprites/touhou_test/scoreItem.png' },
    speed: 100,
}

export const ITEM_POOL = 40;

export class Consumable extends Projectile{
    constructor(scene: Phaser.Scene, data: IProjectileData){
        super(scene, data);
    }

    protected move(point: IVectorPoint, speed: number){
        //this.scene.physics.velocityFromRotation(point.theta, speed, this.body.velocity);
        let velocity = new Phaser.Math.Vector2(Math.sin(point.theta), -Math.cos(point.theta)).normalize().scale(speed);
        this.setVelocity(velocity.x, velocity.y);
        this.setRotation(point.theta);
    }
}

export class PowerItem extends Consumable{
    constructor(scene: Phaser.Scene){
        super(scene, DATA_POWER_ITEM);
    }
}

export class ScoreItem extends Consumable{
    constructor(scene: Phaser.Scene){
        super(scene, DATA_SCORE_ITEM);
    }
}