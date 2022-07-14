import Phaser from 'phaser';
import { IFireArgs, IProjectileData, Projectile } from '../../objects/Projectile';

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
const DROP_SIZE = 4;
const DROP_ANGULAR_VELOCITY = 240;
const DROP_TIME = 6;
const DROP_ANGULAR_DRAG = DROP_ANGULAR_VELOCITY/DROP_TIME;

export class Consumable extends Projectile{
    constructor(scene: Phaser.Scene, data: IProjectileData){
        super(scene, data);
    }

    drop({ x, y, speed} : IFireArgs){
        this.fire({ x, y, speed, angularVelocity: DROP_ANGULAR_VELOCITY, angularDrag: DROP_ANGULAR_DRAG });
    }
}

export class PowerItem extends Consumable{
    constructor(scene: Phaser.Scene){
        super(scene, DATA_POWER_ITEM);
    }

    drop({ x, y } : IFireArgs){
        super.drop({x, y, speed: DATA_POWER_ITEM.speed });
    }
}

export class ScoreItem extends Consumable{
    constructor(scene: Phaser.Scene){
        super(scene, DATA_SCORE_ITEM);
    }

    drop({ x, y } : IFireArgs){
        super.drop({x, y, speed: DATA_POWER_ITEM.speed });
    }
}