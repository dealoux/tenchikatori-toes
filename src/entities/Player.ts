import Phaser, { Physics } from 'phaser';
import {Entity, IEntity} from './Entity';
import { InputHandler } from '../plugins/InputHandler';

const SPEED_NORMAL = 250;
const SPEED_FOCUSED = SPEED_NORMAL*.5;

export enum PlayerState{
    NORMAL,
    FOCUSED,
}

export class Player extends Entity{
    speed: number;

    constructor(scene: Phaser.Scene, {x, y, texture, frame}: IEntity){
        super(scene, {x, y, texture, frame});
        this.getBody().setCollideWorldBounds(true);
        this.hp = 100;
        this.speed = SPEED_NORMAL;     
    }

    static preload(scene: Phaser.Scene) {
        scene.load.image('enna', 'assets/sprites/touhouenna.png');
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

    update(){
        this.getBody().setVelocity(0);
        this.inputHandling();
    }

    private inputHandling(){
        const {inputs} = InputHandler.Instance();

        // focus mode
        if(inputs.focus){
            this.speed = SPEED_FOCUSED;
        }
        else{
            this.speed = SPEED_NORMAL;
        }

        // directional movements
        if (inputs.up) {
            this.body.velocity.y = -this.speed;
        }
        if (inputs.down) {
            this.body.velocity.y = this.speed;
        }
        if (inputs.left) {
            this.body.velocity.x = -this.speed;
        }
        if (inputs.right) {
            this.body.velocity.x = this.speed;
        }

        // actions
        if(inputs.shot){
            this.shoot();
        }
        if(inputs.special){
            this.special();
        }
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