import Phaser, { Physics } from 'phaser';
import {Entity, IEntity} from './Entity';

const SPEED_NORMAL = 250;
const SPEED_FOCUSED = SPEED_NORMAL*.5;

export enum EnemyStaste{
    NORMAL,
    FOCUSED,
}

export class Enemy extends Entity{
    speed: number;

    constructor(scene: Phaser.Scene, {pos, texture, frame}: IEntity){
        super(scene, {pos, texture, frame});
        this.getBody().setCollideWorldBounds(true);
        this.hp = 100;
        this.speed = SPEED_NORMAL;     
    }

    static preload(scene: Phaser.Scene) {
	}
    
    getDamage(value?: number): void {
        this.scene.tweens.add({
            targets: this,
            duration: 100,
            repeat: 3,
            yoyo: true,
            alpha: 0.5,
            onStart: () => {
                if (value) {
                    this.hp = this.hp - value;
                }
            },
            onComplete: () => {
                this.setAlpha(1);
            },
        });
    }

    update(): void{
        this.getBody().setVelocity(0);
    }

    private getBody(): Physics.Arcade.Body{
        return this.body as Physics.Arcade.Body
    }

    shoot(){
        console.log("shot");
    }

    special(){
        console.log("special");
    }
}