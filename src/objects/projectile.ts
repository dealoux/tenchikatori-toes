import Phaser, { Physics } from 'phaser';
import { PoolGroup } from '../@types/Pool';
import { Character } from '../entities/Character';
import { IEntity, IVectorPoint, COLLISION_CATEGORIES, Entity, IFunctionDelegate } from '../entities/Entity';

export interface IProjectileData{
    entData: IEntity,
    speed: number,
}

export interface IFireArgs{
    x: number,
    y: number,
    angle?: number | 0,
    speed: number,
    gx?: number | 0,
    gy: number | 0,
    tracking: boolean | false,
    scaleSpeed: number | 0,
    target: Entity | undefined, 
}

export class Projectile extends Entity{
    scene: Phaser.Scene;
    tracking: boolean;
    scaleSpeed: integer;

    constructor(scene: Phaser.Scene, data: IProjectileData, tracking = false, scaleSpeed = 0){
        super(scene, { pos: data.entData.pos, texture: data.entData.texture, hitRadius: data.entData.hitRadius, frame: data.entData.frame });
        
        this.scene = scene;
        this.tracking = tracking;
        this.scaleSpeed = scaleSpeed;

        //this.setCollidesWith([COLLISION_CATEGORIES.blue, COLLISION_CATEGORIES.red]);
    }

    create(){
        super.create();
    }

    public handleCollision(entity: Entity){
        this.disableEntity();
    }

    fire({x, y, angle = 0, speed, gx = 0, gy = 0, tracking = false, scaleSpeed = 0, target = undefined} : IFireArgs) {
        //this.scene.shootSFX.play();
        this.enableEntity(new Phaser.Math.Vector2(x, y));
        this.setScale(1);
        this.tracking = tracking;
        this.scaleSpeed = scaleSpeed;
        this.setRotation(this.angle);
        if (target) {
          this.scene.physics.moveToObject(this, target, speed)
        } else {
          this.scene.physics.velocityFromRotation(angle, speed, this.body.velocity);    
        }
        this.body.gravity.set(gx, gy); // apply gravity to the physics body
    }

    preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);

        // out of view check
        if(!this.inCameraView()){
            this.disableEntity();
        }
    }
}

export interface IPPatternData{
    nextFire: number;
    fireRate: number;
    pSpeed: number;
}

export interface IWavePatternData extends IPPatternData{
    wave: Array<number>;
    waveIndex: number;
}

export abstract class PPattern{
    parent: Character;
    projectile: PoolGroup | undefined;
    pPoint: IVectorPoint;
    updatePattern: IFunctionDelegate;

    constructor(parent: Character, pPoint: IVectorPoint, p: PoolGroup | undefined){
        this.parent = parent;
        this.pPoint = pPoint;
        this.projectile = p;
        this.updatePattern = function() {};
    }
}

export class PPatternWave extends PPattern{
    pData: IWavePatternData;

    constructor(parent: Character, pPoint: IVectorPoint, p: PoolGroup | undefined, pData: IWavePatternData){
        super(parent, pPoint, p);
        this.pData = pData;
        
        this.updatePattern = Math.abs(pPoint.theta) == 90 ? this.waveVertical : this.waveHorizontal;
    }

    private waveBase(gx = 0, gy = 0){
        if(this.parent.time() < this.pData.nextFire) { return; }

        const x = this.parent.x + this.pPoint.pos.x;
        const y = this.parent.y + this.pPoint.pos.y;
        this.projectile?.getFirstDead(false).fire({x: x, y: y, angle: this.pPoint.theta, speed : this.pData.pSpeed, gx: gx, gy: gy});
        this.pData.waveIndex++;
        if (this.pData.waveIndex === this.pData.wave.length) {
            this.pData.waveIndex = 0;
        }

        this.pData.nextFire = this.parent.time() + this.pData.fireRate;
    }

    waveVertical() {
        this.waveBase(0, this.pData.wave[this.pData.waveIndex]);
    }

    waveHorizontal() {
        this.waveBase(this.pData.wave[this.pData.waveIndex]);
    }
}