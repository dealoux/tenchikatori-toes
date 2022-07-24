import Phaser from 'phaser';
import { PoolGroup } from '../../plugins/Pool';
import { Character } from '../characters/Character';
import { IEntity, IVectorPoint, COLLISION_CATEGORIES, Entity } from '../Entity';

export interface IProjectileData extends IEntity{
    speed: number,
    value: number,
}

export interface IPPatternData{
    fireRate: number;
    pSpeed: number;
    duration?: number;
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
    directionTracking?: boolean,
    scaleSpeed?: number,
    target?: Entity, 
}

export class Projectile extends Entity{
    scene: Phaser.Scene;
    entData: IProjectileData;

    scaleSpeed: integer;
    directionTracking?: boolean;

    constructor(scene: Phaser.Scene, data: IProjectileData){
        super(scene, { pos: data.pos, texture: data.texture, hitSize: data.hitSize, frame: data.frame });
        
        this.scene = scene;
        this.entData = data;
        this.scaleSpeed = 0;
    }

    handleCollision(char?: Character){
        this.resetProperties();
        this.disableEntity();
    }

    updateProjectileE({x, y, speed, angle, angularVelocity, angularDrag, gx, gy, directionTracking, scaleSpeed, target} : IUpdateArgs) {
        this.enableEntity(new Phaser.Math.Vector2(x, y));
        return this.updateProjectile({x, y, speed, angle, angularVelocity, angularDrag, gx, gy, directionTracking, scaleSpeed, target});
    }

    updateProjectile({x = this.x, y = this.y, speed = this.entData.speed, angle = 0, angularVelocity = 0, angularDrag = 0, gx = 0, gy = 0, directionTracking = false, scaleSpeed = 0, target} : IUpdateArgs) {
        this.setScale(1);
        this.setAngle(this.angle);
        this.setAngularVelocity(angularVelocity);
        this.setAngularDrag(angularDrag);

        this.directionTracking = directionTracking;
        this.scaleSpeed = scaleSpeed;
        this.body.gravity.set(gx, gy); // apply gravity to the physics body

        this.getDirection({ x: this.x, y: this.y, angle, target, speed });

        return this;
    }

    getDirection({ angle = 0, target, speed }: IUpdateArgs){
        if(target) {
            this.scene.physics.moveToObject(this, target, speed);
        } 
        else {
            this.scene.physics.velocityFromAngle(angle, speed, this.body.velocity);    
        }
    }

    protected resetProperties(){
        this.scaleSpeed = 0;
        this.directionTracking = false;
    }

    preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);

        if (this.directionTracking) {      
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

    update(time: number, delta: number) {
        super.update(time, delta);
    }
}

export class HomeingProjectile extends Projectile{
    target?: Entity;
    tagertingSpeed?: number;

    getDirection({ angle = 0, target, speed }: IUpdateArgs){
        if(target) {
            this.target = target;
            this.tagertingSpeed = speed;
        } 
        else {
            this.scene.physics.velocityFromAngle(angle, speed, this.body.velocity);    
        }
    }

    update(time: number, delta: number): void {
        if(this.target) {
            this.scene.physics.moveToObject(this, this.target, this.tagertingSpeed);
        }
    }

    protected resetProperties(){
        super.resetProperties();
        this.target = undefined;
        this.tagertingSpeed = 0;
    }
}

interface IUpdatePatternDelegate{
    (target?: Entity): void;
}

export abstract class PPattern{
    nextFire: number;
    parent: Character;
    projectile: PoolGroup | undefined;
    pPoint: IVectorPoint;
    updatePattern: IUpdatePatternDelegate;
    patternData: IPPatternData;

    constructor(parent: Character, pPoint: IVectorPoint, p: PoolGroup | undefined, pData: IPPatternData){
        this.nextFire = 0;
        this.parent = parent;
        this.pPoint = pPoint;
        this.projectile = p;
        this.updatePattern = function() {};
        this.patternData = pData;
    }
}