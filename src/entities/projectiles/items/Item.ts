import Phaser from 'phaser';
import { IUpdateArgs, IProjectileData, HomeingProjectile } from '../Projectile';
import { Entity } from '../../Entity';
import { PLAYER_DATA } from '../../characters/player/Player';
import { PoolManager } from '../../../plugins/Pool';
import { PPatternWave } from '../patterns/Pattern_Wave';

export const DATA_POWER_ITEM : IProjectileData = {
    texture: { key: 'powerItem', path: 'assets/sprites/touhou_test/powerItem.png' },
    speed: 140,
    value: .2,
}

export const DATA_SCORE_ITEM : IProjectileData = {
    texture: { key: 'scoreItem', path: 'assets/sprites/touhou_test/scoreItem.png' },
    speed: 140,
    value: 1,
}

export const DATA_HP_ITEM : IProjectileData = {
    texture: { key: 'hpItem', path: 'assets/sprites/touhou_test/hpItem.png' },
    speed: 120,
    value: 1,
}

export const DATA_SPECIAL_ITEM : IProjectileData = {
    texture: { key: 'specialItem', path: 'assets/sprites/touhou_test/specialItem.png' },
    speed: 120,
    value: 1,
}

export const ITEM_POOL = 80;
export const SPECIAL_POOL = 14;
const SPECIAL_ITEM_DROP_RATE = .2;
const HP_ITEM_DROP_RATE = .2;
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
        this.addGroup(DATA_HP_ITEM.texture.key, HPItem, SPECIAL_POOL);
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

    protected spawnItem_HP(x: number, y: number, angle: number){
        return this.spawnItem(DATA_HP_ITEM.texture.key, x, y, angle);
    }

    protected spawnItem_Special(x: number, y: number, angle: number){
        return this.spawnItem(DATA_SPECIAL_ITEM.texture.key, x, y, angle);
    }

    emitItemsEnemy(x: number, y: number, size = 8, angle = 65){
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

        if(Math.random() <= HP_ITEM_DROP_RATE){
            this.spawnItem_HP(x, y, baseTheta);
        }
    }

    emitItemsPlayer(x: number, y: number, size = 8, angle = 65){
        const offset = angle/size;
        const baseTheta = -90;
        const dropAngles = PPatternWave.generateWaveArray(angle, size);

        for(let i=0; i < size; i++){
            const theta = baseTheta + offset + dropAngles[i];
            this.spawnItem_Power(x, y, theta);
        }
    }
}

export class Item extends HomeingProjectile{
    pData: IProjectileData;

    constructor(scene: Phaser.Scene, pData: IProjectileData){
        super(scene, pData);
        this.pData = pData;
    }

    static preload(scene : Phaser.Scene){
        scene.load.image(DATA_POWER_ITEM.texture.key, DATA_POWER_ITEM.texture.path);
        scene.load.image(DATA_SCORE_ITEM.texture.key, DATA_SCORE_ITEM.texture.path);
        scene.load.image(DATA_HP_ITEM.texture.key, DATA_HP_ITEM.texture.path);
        scene.load.image(DATA_SPECIAL_ITEM.texture.key, DATA_SPECIAL_ITEM.texture.path);
    }

    launch({ x, y, angle } : IUpdateArgs){
        this.updateProjectileE({ x, y, speed: this.pData.speed, angle, angularVelocity: LAUNCH_ANGULAR_VELOCITY, angularDrag: LAUNCH_ANGULAR_DRAG });
        this.scene.time.delayedCall(LAUNCH_TIME_MS, () => { this.updateProjectile({ x: this.x, y: this.y, angle: 90 }); this.setAngle(0); });
    }

    handlingGrazeHBCollision(hitbox: Entity, speed = PLAYER_DATA.speed){
        this.updateProjectile({ x: this.x, y: this.y, speed: speed, target: hitbox });
    }
}

export class PowerItem extends Item{
    constructor(scene: Phaser.Scene){
        super(scene, DATA_POWER_ITEM);
    }
}

export class ScoreItem extends Item{
    constructor(scene: Phaser.Scene){
        super(scene, DATA_SCORE_ITEM);
    }
}

export class HPItem extends Item{
    constructor(scene: Phaser.Scene){
        super(scene, DATA_HP_ITEM);
    }
}

export class SpecialItem extends Item{
    constructor(scene: Phaser.Scene){
        super(scene, DATA_SPECIAL_ITEM);
    }
}