import Phaser from 'phaser';

export interface IEntity{
    pos: Phaser.Math.Vector2;
    texture: string;
    frame?: string | number;
}

export interface IEntHitbox{
    width: number;
    height: number;
}

export enum EntityState{
    ALIVE,
    DEAD
}

export class Entity extends Phaser.Physics.Arcade.Sprite{
    state: EntityState;
    hp: number;
    bulletPoints: Map<string, Phaser.Math.Vector2>;

    constructor(scene: Phaser.Scene, { pos, texture, frame }: IEntity){
        super(scene, pos.x, pos.y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.hp = 0;
        this.state = EntityState.ALIVE;
        this.bulletPoints = new Map;
    }
}