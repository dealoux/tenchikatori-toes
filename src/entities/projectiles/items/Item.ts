import Phaser from 'phaser';
import { PoolManager } from '../../../@types/Pool';
import { IUpdateArgs, IProjectileData, PPatternWave, Projectile } from '../Projectile';
import { Entity } from '../../Entity';
import { PLAYER_DATA } from '../../characters/player/Player';

export const DATA_POWER_ITEM : IProjectileData = {
    texture: { key: 'powerItem', path: 'assets/sprites/touhou_test/powerItem.png' },
    speed: 70,
    value: .5,
}

export const DATA_SCORE_ITEM : IProjectileData = {
    texture: { key: 'scoreItem', path: 'assets/sprites/touhou_test/scoreItem.png' },
    speed: 140,
    value: 1,
}

export const DATA_SPECIAL_ITEM : IProjectileData = {
    texture: { key: 'specialItem', path: 'assets/sprites/touhou_test/specialItem.png' },
    speed: 100,
    value: 1,
}

export const ITEM_POOL = 40;
export const SPECIAL_POOL = 10;
const SPECIAL_ITEM_DROP_RATE = .5;
const LAUNCH_ANGULAR_VELOCITY = 1200;
const LAUNCH_TIME = 8;
const LAUNCH_TIME_MS = LAUNCH_TIME*100;
const LAUNCH_ANGULAR_DRAG = LAUNCH_ANGULAR_VELOCITY/LAUNCH_TIME;

export class ItemManager extends PoolManager{
    constructor(scene: Phaser.Scene){
        super(scene);
    }

    init(){
        this.addGroup(DATA_POWER_ITEM.texture.key, PowerItem, ITEM_POOL);
        this.addGroup(DATA_SCORE_ITEM.texture.key, ScoreItem, ITEM_POOL);
        this.addGroup(DATA_SPECIAL_ITEM.texture.key, SpecialItem, SPECIAL_POOL);
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

    protected spawnItem_Special(x: number, y: number, angle: number){
        return this.spawnItem(DATA_SPECIAL_ITEM.texture.key, x, y, angle);
    }

    emitItems(x: number, y: number, size = 8, angle = 65){
        const offset = angle/size;
        const baseTheta = -90;
        const dropAngles = PPatternWave.generateWaveArray(angle, size);

        for(let i=0; i < size; i++){
            const theta = baseTheta + offset + dropAngles[i];
            if(i%2 == 0){
                this.spawnItem_Score(x, y, theta);
            }
            else{
                this.spawnItem_Power(x, y, theta);
            }
        }

        if(Math.random() <= SPECIAL_ITEM_DROP_RATE){
            this.spawnItem_Special(x, y, baseTheta);
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
        scene.load.image(DATA_SPECIAL_ITEM.texture.key, DATA_SPECIAL_ITEM.texture.path);
    }

    launch({ x, y, speed, angle } : IUpdateArgs){
        this.updateProjectileE({ x, y, speed, angle, angularVelocity: LAUNCH_ANGULAR_VELOCITY, angularDrag: LAUNCH_ANGULAR_DRAG });
        this.scene.time.delayedCall(LAUNCH_TIME_MS, () => { this.updateProjectile({ x: this.x, y: this.y, angle: 90 }); this.setAngle(0); });
    }

    handlingGrazeHBCollision(hitbox: Entity){
        this.updateProjectile({ x: this.x, y: this.y, speed: PLAYER_DATA.speed, target: hitbox });
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
        super.launch({ x, y, speed: DATA_SCORE_ITEM.speed, angle });
    }
}

export class SpecialItem extends Item{
    constructor(scene: Phaser.Scene){
        super(scene, DATA_SPECIAL_ITEM);
    }

    launch({ x, y, angle } : IUpdateArgs){
        super.launch({x, y, speed: DATA_SPECIAL_ITEM.speed, angle });
    }
}