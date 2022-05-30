import Phaser from 'phaser';

export interface IEntity{
    x: number;
    y: number;
    texture: string;
    frame?: string | number;
}

export enum EntityState{
    ALIVE,
    DEAD
}

export class Entity extends Phaser.Physics.Arcade.Sprite{
    state: EntityState;
    protected hp: number;

    constructor(scene: Phaser.Scene, {x, y, texture, frame}: IEntity){
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.hp = 0;
        this.state = EntityState.ALIVE;
    }
}