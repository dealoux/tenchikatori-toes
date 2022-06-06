import Phaser, { Physics } from 'phaser';
import {Entity, IEntity, IEntHitbox} from './Entity';
import { InputHandler } from '../plugins/InputHandler';
import { PPoint, Projectile, ProjectileGroup, ProjectileManager } from '../objects/Projectile';
import eventsCenter from '../plugins/EventsCentre';
import { ShootPoints, PlayersProjectileType, shootPointsNormal, shootPointsFocused, PlayersShot1, PlayersShot2 } from '../objects/Projectile_Player';
import { Vector } from 'matter';

const SPEED_NORMAL = 250;
const SPEED_FOCUSED = SPEED_NORMAL*.5;
const SHOT_DELAY = 300;

export enum PlayerState{
    NORMAL,
    FOCUSED,
}

export enum PlayerEvents{
    special = 'special',
}

export class Player extends Entity{
    speed: number;
    grazeHitbox: IEntHitbox;
    projectileManager : ProjectileManager;
    currShootPoints : ShootPoints;

    lastShotTime: number;
    specials: number;
    castingSpecial: boolean;

    constructor(scene: Phaser.Scene, { pos , texture, frame }: IEntity){
        super(scene, { pos, texture, frame });
        this.getBody().setCollideWorldBounds(true);
        this.hp = 100;
        this.speed = SPEED_NORMAL;
        this.hitbox = { width: 10, height: 10 }
        this.grazeHitbox = { width: this.scaleX, height: this.scaleY };

        this.currShootPoints = shootPointsNormal;

        this.lastShotTime = 0;
        this.specials = 3;
        this.castingSpecial = false;
        this.projectileManager = new ProjectileManager(scene, Player);
        this.projectileManager.addPGroup(PlayersProjectileType.shot_1, PlayersShot1, 30);
        this.projectileManager.addPGroup(PlayersProjectileType.shot_2, PlayersShot2, 30);
        //this.projectileManager.pList.set(PlayersProjectileType.special, new ProjectileGroup(scene, PlayersProjectileType.special, 2));
    }

    static preload(scene: Phaser.Scene) {
        scene.load.image('enna', 'assets/sprites/touhouenna.png');
        scene.load.image(PlayersProjectileType.shot_1, 'assets/sprites/touhou_test/card1.png');
        scene.load.image(PlayersProjectileType.shot_2, 'assets/sprites/touhou_test/card3.png');
        scene.load.spritesheet(PlayersProjectileType.special, 'assets/sprites/touhou_test/moon.png', { frameWidth: 32, frameHeight: 16 });

        // scene.load.spritesheet(
        //     'cards', 
        //     'assets/sprites/touhou_test/pl_shot.png',
        //     { frameWidth: 16, frameHeight: 32 }
        // );
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
            this.currShootPoints = shootPointsFocused;
        }
        else{
            this.speed = SPEED_NORMAL;
            this.currShootPoints = shootPointsNormal;
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
        if(!this.castingSpecial){
            if(inputs.shot && this.time() > this.lastShotTime){
                this.shoot();
            }
            if(inputs.special && this.specials > 0){
                this.special();
            }
        }
    }

    private getBody(): Physics.Arcade.Body{
        return this.body as Physics.Arcade.Body
    }

    private time(){
        return this.scene.game.getTime();
    }

    private getPShort(name: string, point: PPoint){
        this.projectileManager.getP(name, { pos: new Phaser.Math.Vector2(this.body.position.x + point.pos.x, this.body.position.y + point.pos.y), theta: point.theta });
    }

    shoot(){
        this.getPShort(PlayersProjectileType.shot_1, this.currShootPoints.point_1);
        this.getPShort(PlayersProjectileType.shot_1, this.currShootPoints.point_2);
        this.getPShort(PlayersProjectileType.shot_2, this.currShootPoints.point_3);
        this.getPShort(PlayersProjectileType.shot_2, this.currShootPoints.point_4);
        this.lastShotTime = this.time() + SHOT_DELAY;
    }

    special(){
        // const shot = this.projectileManager.pList.get(PlayersProjectileType.special);

        // if(shot){
        //     this.castingSpecial = true;
        //     eventsCenter.emit(PlayerEvents.special);
        //     shot.getProjectile(this.getBody().x, this.getBody().y);
        //     this.specials--; 
        // }
    }
}