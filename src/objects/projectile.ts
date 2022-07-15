import Phaser from 'phaser';
import { PoolGroup } from '../@types/Pool';
import { Character } from '../entities/Character';
import { IEntity, IVectorPoint, COLLISION_CATEGORIES, Entity, IFunctionDelegate } from '../entities/Entity';

export interface IProjectileData extends IEntity{
    speed: number,
    value: number,
}

export interface IUpdateArgs{
    x: number,
    y: number,
    speed?: number,
    angle?: number,
    angularVelocity?: number,
    angularDrag?: number,
    gx?: number,
    gy?: number,
    tracking?: boolean,
    scaleSpeed?: number,
    target?: Entity, 
}

export class Projectile extends Entity{
    scene: Phaser.Scene;
    entData: IProjectileData;

    scaleSpeed: integer;
    tracking?: boolean;
    target?: Entity;
    tagertingSpeed?: number;

    constructor(scene: Phaser.Scene, data: IProjectileData){
        super(scene, { pos: data.pos, texture: data.texture, hitSize: data.hitSize, frame: data.frame });
        
        this.scene = scene;
        this.entData = data;
        this.scaleSpeed = 0;
    }

    create(){
        super.create();
    }

    handleCollision(ent: Entity){
        this.resetProperties();
        this.disableEntity();
    }

    updateProjectileE({x, y, speed, angle, angularVelocity, angularDrag, gx, gy, tracking, scaleSpeed, target} : IUpdateArgs) {
        //this.scene.shootSFX.play();
        this.enableEntity(new Phaser.Math.Vector2(x, y));
        return this.updateProjectile({x, y, speed, angle, angularVelocity, angularDrag, gx, gy, tracking, scaleSpeed, target});
    }

    updateProjectile({x = this.x, y = this.y, speed = this.entData.speed, angle = 0, angularVelocity = 0, angularDrag = 0, gx = 0, gy = 0, tracking = false, scaleSpeed = 0, target} : IUpdateArgs) {
        this.setScale(1);
        this.setAngle(this.angle);
        this.setAngularVelocity(angularVelocity);
        this.setAngularDrag(angularDrag);

        this.tracking = tracking;
        this.scaleSpeed = scaleSpeed;
        this.body.gravity.set(gx, gy); // apply gravity to the physics body

        if(target) {
            this.target = target;
            this.tagertingSpeed = speed;
        } 
        else {
            this.scene.physics.velocityFromAngle(angle, speed, this.body.velocity);    
        }

        return this;
    }

    protected resetProperties(){
        this.scaleSpeed = 0;
        this.tracking = false;
        this.target = undefined;
        this.tagertingSpeed = 0;
    }

    protected preUpdateHere(time: number, delta: number): void {
        super.preUpdateHere(time, delta);

        if (this.tracking) {      
            this.rotation = this.body.velocity.angle();
        }    
        if (this.scaleSpeed > 0) {
            this.scaleX += this.scaleSpeed;
            this.scaleY += this.scaleSpeed;
        }
      
        // out of view check
        if(!this.inCameraView()){
            this.disableEntity();
        }
    }

    protected updateHere() {
        super.updateHere();

        if(this.target) {
            this.scene.physics.moveToObject(this, this.target, this.tagertingSpeed);
        } 

    }
}

export interface IPPatternData{
    fireRate: number;
    pSpeed: number;
}

export interface IWavePatternData extends IPPatternData{
    wave: Array<number>;
    waveIndex: number;
}

export abstract class PPattern{
    nextFire: number;
    parent: Character;
    projectile: PoolGroup | undefined;
    pPoint: IVectorPoint;
    updatePattern: IFunctionDelegate;

    constructor(parent: Character, pPoint: IVectorPoint, p: PoolGroup | undefined){
        this.nextFire = 0;
        this.parent = parent;
        this.pPoint = pPoint;
        this.projectile = p;
        this.updatePattern = function() {};
    }
}

export class PPatternWave extends PPattern{
    patternData: IWavePatternData;

    constructor(parent: Character, pPoint: IVectorPoint, p: PoolGroup | undefined, pData: IWavePatternData){
        super(parent, pPoint, p);
        this.patternData = pData;
        
        this.updatePattern = Math.abs(pPoint.theta) == 90 ? this.waveVertical : this.waveHorizontal;
    }

    private waveBase(gx = 0, gy = 0){
        if(this.parent.time() < this.nextFire) { return; }

        const x = this.parent.x + this.pPoint.pos.x;
        const y = this.parent.y + this.pPoint.pos.y;
        this.projectile?.getFirstDead(false).updateProjectileE({ x: x, y: y, speed : this.patternData.pSpeed, angle: this.pPoint.theta, gx: gx, gy: gy });
        this.patternData.waveIndex++;
        if (this.patternData.waveIndex === this.patternData.wave.length) {
            this.patternData.waveIndex = 0;
        }

        this.nextFire = this.parent.time() + this.patternData.fireRate;
    }

    waveVertical() {
        this.waveBase(this.patternData.wave[this.patternData.waveIndex]);
    }

    waveHorizontal() {
        this.waveBase(0, this.patternData.wave[this.patternData.waveIndex]);
    }

    static generateWaveArray(value: number, step : number){
        const s = value/step*2;
        return Phaser.Utils.Array.NumberArrayStep(-value, value, s).concat(Phaser.Utils.Array.NumberArrayStep(value, -value, -s));
    }
}

export interface IScalePatternData extends IPPatternData{
    scaleSpeed: number;
}

export class PPatternScale extends PPattern{
    patternData: IScalePatternData;

    constructor(parent: Character, pPoint: IVectorPoint, p: PoolGroup | undefined, pData: IScalePatternData){
        super(parent, pPoint, p);
        this.patternData = pData;
        this.updatePattern = this.scaleBase;
    }

    scaleBase(){
        if(this.parent.time() < this.nextFire) { return; }
        const x = this.parent.x + this.pPoint.pos.x;
        const y = this.parent.y + this.pPoint.pos.y;
        this.projectile?.getFirstDead(false).updateProjectileE({ x: x, y: y, speed : this.patternData.pSpeed, angle: this.pPoint.theta, scaleSpeed: this.patternData.scaleSpeed });
        this.nextFire = this.parent.time() + this.patternData.fireRate;
    }
}