import Phaser, { Physics } from 'phaser';
import {Entity, IEntity, collisionGroups } from './Entity';
import { InputHandler } from '../plugins/InputHandler';
import { PPoint, Projectile, ProjectileGroup, ProjectileManager } from '../objects/Projectile';
import eventsCenter from '../plugins/EventsCentre';
import { ShootPoints, Data_PlayerShot1, Data_PlayerShot2, Data_PlayerSpecial, SHOT_DELAY, SHOOTPOINTS_NORMAL, SHOOTPOINTS_FOCUSED, PlayerShot1, PlayerShot2 } from '../objects/Projectile_Player';

interface functionDelegate{
    () : void;
}

const SPEED_NORMAL = 4;
const SPEED_FOCUSED = SPEED_NORMAL*.5;

export enum PlayerState{
    NORMAL,
    FOCUSED,
}

export enum PlayerEvents{
    special = 'special',
}

const HITBOX = 6;
const GRAZE_HITBOX = 40;

export class Player extends Entity{
    speed: number;
    //graze: Phaser.Physics.Arcade.Sprite; // graze hitbox

    projectileManager : ProjectileManager;
    currShootPoints : ShootPoints;
    shots : Function[];
    shotCounts : number;

    actionDelegate : functionDelegate;

    lastShotTime: number;
    specials: number;
    castingSpecial: boolean;

    constructor(scene: Phaser.Scene, { pos, texture, frame, offset }: IEntity){
        super(scene, { pos, texture, collisionGroup: collisionGroups.PLAYER, hitRadius: HITBOX, frame, offset });
        this.hp = 100;
        this.speed = SPEED_NORMAL;

        
        //this.graze = this.scene.physics.add.sprite(this.body.x + this.hitboxOffset.x, this.body.y + this.hitboxOffset.y, 'empty').setCircle(HITBOX);

        this.actionDelegate = this.shoot;
        
        this.currShootPoints = SHOOTPOINTS_NORMAL;

        this.lastShotTime = 0;
        this.specials = 3;
        this.castingSpecial = false;
        this.projectileManager = new ProjectileManager(scene, Player);
        this.projectileManager.addPGroup(Data_PlayerShot1.entData.texture, PlayerShot1, 40);
        this.projectileManager.addPGroup(Data_PlayerShot2.entData.texture, PlayerShot2, 40);
        //this.projectileManager.pList.set(PlayersProjectileType.special, new ProjectileGroup(scene, PlayersProjectileType.special, 2));

        this.shots = [
            function(player: Player) { player.getPShort(Data_PlayerShot1.entData.texture, player.currShootPoints.point_1); },
            function(player: Player) { player.getPShort(Data_PlayerShot1.entData.texture, player.currShootPoints.point_2); },
            function(player: Player) { player.getPShort(Data_PlayerShot2.entData.texture, player.currShootPoints.point_3); },
            function(player: Player) { player.getPShort(Data_PlayerShot2.entData.texture, player.currShootPoints.point_4); },
        ]

        this.shotCounts = 4;
    }

    static preload(scene: Phaser.Scene) {
        scene.load.image('enna', 'assets/sprites/touhouenna.png');
        scene.load.image(Data_PlayerShot1.entData.texture, 'assets/sprites/touhou_test/card1.png');
        scene.load.image(Data_PlayerShot2.entData.texture, 'assets/sprites/touhou_test/card3.png');
        scene.load.spritesheet(Data_PlayerSpecial.entData.texture, 'assets/sprites/touhou_test/moon.png', { frameWidth: 32, frameHeight: 16 });

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
        // positions
        //this.setVelocity(0, 0);
        //this.hitbox.setPosition(this.body.position.x + this.hitboxOffset.x, this.body.position.y + this.hitboxOffset.y);
        //this.getHitbox().setVelocity(this.body.velocity.x, this.body.velocity.y);

        this.inputHandling();
    }

    private inputHandling(){
        const {inputs} = InputHandler.Instance();

        // directional movements
        if (inputs.up) {
            this.moveVertically(-this.speed);
        }
        if (inputs.down) {
            this.moveVertically(this.speed)
        }
        if (inputs.left) {
            this.moveHorizontally(-this.speed);
        }
        if (inputs.right) {
            this.moveHorizontally(this.speed);
        }

        // focus mode
        if(inputs.focus){
            this.speed = SPEED_FOCUSED;
            this.currShootPoints = SHOOTPOINTS_FOCUSED;
        }
        else{
            this.speed = SPEED_NORMAL;
            this.currShootPoints = SHOOTPOINTS_NORMAL;
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

    private moveVertically(y: number){
        this.y += y;
    }

    private moveHorizontally(x: number){
        this.x += x;
    }

    // private getHitbox(){
    //     return this.hitbox.body as MatterJS.BodyType;
    // }

    private time(){
        return this.scene.game.getTime();
    }

    private getPShort(name: string, point: PPoint){
        this.projectileManager.getP(name, { pos: new Phaser.Math.Vector2(this.body.position.x + point.pos.x, this.body.position.y + point.pos.y), theta: point.theta });
    }

    private shoot(){
        for(let i = 0; i<this.shotCounts; i++){
            this.shots[i](this);
        }

        this.lastShotTime = this.time() + SHOT_DELAY;
    }

    private special(){
        // const shot = this.projectileManager.pList.get(PlayersProjectileType.special);

        // if(shot){
        //     this.castingSpecial = true;
        //     eventsCenter.emit(PlayerEvents.special);
        //     shot.getProjectile(this.getBody().x, this.getBody().y);
        //     this.specials--; 
        // }
    }
}