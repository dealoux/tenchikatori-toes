import Phaser from 'phaser';
import { PoolManager } from '../../../@types/Pool';
import { IUpdateArgs, IProjectileData, PPatternWave, Projectile } from '../Projectile';
import { Entity } from '../../Entity';
import { PLAYER_SPEED_NORMAL } from '../../characters/player/Player';

export const DATA_POWER_ITEM : IProjectileData = {
    pos: Phaser.Math.Vector2.ZERO,
    texture: { key: 'powerItem', path: 'assets/sprites/touhou_test/powerItem.png' },
    speed: 140,
    value: .1,
}

export const DATA_SCORE_ITEM : IProjectileData = {
    pos: Phaser.Math.Vector2.ZERO,
    texture: { key: 'scoreItem', path: 'assets/sprites/touhou_test/scoreItem.png' },
    speed: 140,
    value: 1,
}

export const ITEM_POOL = 40;
const LAUNCH_ANGULAR_VELOCITY = 1200;
const LAUNCH_TIME = 8;
const LAUNCH_TIME_MS = LAUNCH_TIME*100;
const LAUNCH_ANGULAR_DRAG = LAUNCH_ANGULAR_VELOCITY/LAUNCH_TIME;

export class ItemManager extends PoolManager{
    constructor(scene: Phaser.Scene){
        super(scene);
    }

    protected spawnItem(textureKey: string, x:number, y: number, angle: number){
        return this.getGroup(textureKey)?.getFirstDead(false).launch({ x, y, angle });
    }

    protected spawnItem_Power(x: number, y: number, angle: number){
        return this.spawnItem(DATA_POWER_ITEM.texture.key, x, y, angle);
    }

    protected spawnItem_Score(x: number, y: number, angle: number){
        return this.spawnItem(DATA_SCORE_ITEM.texture.key, x, y, angle);
    }

    emitItems(x: number, y: number, size = 8, angle = 65){
        const OFFSET = angle/size;
        const DROP_ANGLES = PPatternWave.generateWaveArray(angle, size);

        for(let i=0; i < size; i++){
            const theta = -90 + OFFSET + DROP_ANGLES[i];
            if(i%2 == 0){
                this.spawnItem_Score(x, y, theta);
            }
            else{
                this.spawnItem_Power(x, y, theta);
            }
                
        }
    }
}

export class Item extends Projectile{
    constructor(scene: Phaser.Scene, data: IProjectileData){
        super(scene, data);
    }

    static preload(scene : Phaser.Scene){
        scene.load.image(DATA_POWER_ITEM.texture.key, DATA_POWER_ITEM.texture.path);
        scene.load.image(DATA_SCORE_ITEM.texture.key, DATA_SCORE_ITEM.texture.path);
    }

    launch({ x, y, speed, angle } : IUpdateArgs){
        this.updateProjectileE({ x, y, speed, angle, angularVelocity: LAUNCH_ANGULAR_VELOCITY, angularDrag: LAUNCH_ANGULAR_DRAG });
        this.scene.time.delayedCall(LAUNCH_TIME_MS, () => { this.updateProjectile({ x: this.x, y: this.y, angle: 90 }); this.setAngle(0); });
    }

    handlingGrazeHBCollision(hitbox: Entity){
        this.updateProjectile({ x: this.x, y: this.y, speed: PLAYER_SPEED_NORMAL, target: hitbox });
    }
}

export class PowerItem extends Item{
    constructor(scene: Phaser.Scene){
        super(scene, DATA_POWER_ITEM);
    }

    launch({ x, y, angle } : IUpdateArgs){
        super.launch({x, y, speed: DATA_POWER_ITEM.speed, angle });
    }
}

export class ScoreItem extends Item{
    constructor(scene: Phaser.Scene){
        super(scene, DATA_SCORE_ITEM);
    }

    launch({ x, y, angle } : IUpdateArgs){
        super.launch({x, y, speed: DATA_POWER_ITEM.speed, angle });
    }
}