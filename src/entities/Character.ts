import Phaser from 'phaser';
import { IEntity, Entity } from './Entity';

export enum CharacterState{
    ALIVE,
    DEAD
}

export class Character extends Entity{
    state: CharacterState;
    hp: number;
    bulletPoints: Map<string, Phaser.Math.Vector2>;

    constructor(scene: Phaser.Scene, { pos, texture, collisionGroup, hitRadius, frame }: IEntity){
        super(scene, { pos, texture, collisionGroup, hitRadius, frame });

        this.hp = 0;
        this.state = CharacterState.ALIVE;
        this.bulletPoints = new Map;
    }

    // protected preUpdate(time: number, delta: number){
    //    super.preUpdate(time, delta);
    // }

    // create(){
    //     super.create();
    // }

    // update() {
    //     super.update();
    // }

    // protected handleCollision(data: Phaser.Types.Physics.Matter.MatterCollisionData){
    //     super.handleCollision(data);
    // }
}