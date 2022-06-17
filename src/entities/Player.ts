import Phaser from 'phaser';
import {IEntity, VPoint, COLLISION_GROUPS, COLLISION_CATEGORIES } from './Entity';
import { InputHandler } from '../plugins/InputHandler';
import { PoolManager } from '../@types/Pool';
import eventsCenter from '../plugins/EventsCentre';
import { ShootPoints, DATA_PLAYERSHOT1, DATA_PLAYERSHOT2, DATA_PLAYERSPECIAL, SHOT_DELAY, SHOOTPOINTS_NORMAL, SHOOTPOINTS_FOCUSED, SHOTPOOL_PLAYER, PlayerShot1, PlayerShot2 } from '../objects/Projectile_Player';
import { Character, Characters } from './Character';

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

export class Player extends Character{
    actionDelegate : functionDelegate;

    graze: MatterJS.BodyType; // graze hitbox
    currShootPoints : ShootPoints;
    shots : Function[];
    shotCounts : number;
    
    specials: number;
    castingSpecial: boolean;

    constructor(scene: Phaser.Scene, { pos, texture, frame, offset }: IEntity){
        super(scene, { pos, texture, collisionGroup: COLLISION_GROUPS.PLAYER, hitRadius: HITBOX, frame, offset }, 3, SPEED_NORMAL, new PoolManager(scene, Player));
        
        this.actionDelegate = this.shoot;
        
        this.graze = scene.matter.add.circle(pos.x, pos.y, GRAZE_HITBOX,{
            label: 'graze',
            isStatic: true,
            isSensor: true,
            friction: 0,
            frictionAir: 0,
            collisionFilter: { group: COLLISION_GROUPS.PLAYER }
        });
        this.getBody().parts.splice(0, 0, this.graze);
        
        this.setMode(COLLISION_CATEGORIES.red);
        //console.log(this.getBody().parts);

        this.currShootPoints = SHOOTPOINTS_NORMAL;
        this.specials = 3;
        this.castingSpecial = false;
        this.projectileManager?.addPGroup(DATA_PLAYERSHOT1.entData.texture, PlayerShot1, SHOTPOOL_PLAYER);
        this.projectileManager?.addPGroup(DATA_PLAYERSHOT2.entData.texture, PlayerShot2, SHOTPOOL_PLAYER);
        //this.projectileManager.pList.set(PlayersProjectileType.special, new ProjectileGroup(scene, PlayersProjectileType.special, 2));

        this.shots = [
            function(player: Player) { player.spawnProjectile(DATA_PLAYERSHOT1.entData.texture, player.currShootPoints.point_1); },
            function(player: Player) { player.spawnProjectile(DATA_PLAYERSHOT1.entData.texture, player.currShootPoints.point_2); },
            function(player: Player) { player.spawnProjectile(DATA_PLAYERSHOT2.entData.texture, player.currShootPoints.point_3); },
            function(player: Player) { player.spawnProjectile(DATA_PLAYERSHOT2.entData.texture, player.currShootPoints.point_4); },
        ]

        this.shotCounts = 4;
    }

    static preload(scene: Phaser.Scene) {
        scene.load.image(Characters.PLAYER, 'assets/sprites/touhouenna.png');
        scene.load.image(DATA_PLAYERSHOT1.entData.texture, 'assets/sprites/touhou_test/card1.png');
        scene.load.image(DATA_PLAYERSHOT2.entData.texture, 'assets/sprites/touhou_test/card3.png');
        scene.load.spritesheet(DATA_PLAYERSPECIAL.entData.texture, 'assets/sprites/touhou_test/moon.png', { frameWidth: 32, frameHeight: 16 });

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

    create(){
        super.create();
    }

    update(){
        //super.update();
        this.inputHandling();
    }

    private inputHandling(){
        const {inputs} = InputHandler.Instance();

        // directional movements
        if (inputs.Up) {
            this.moveVertically(-this.speed);
        }
        if (inputs.Down) {
            this.moveVertically(this.speed)
        }
        if (inputs.Left) {
            this.moveHorizontally(-this.speed);
        }
        if (inputs.Right) {
            this.moveHorizontally(this.speed);
        }

        // focus mode
        if(inputs.Focus){
            this.speed = SPEED_FOCUSED;
            this.currShootPoints = SHOOTPOINTS_FOCUSED;
        }
        else{
            this.speed = SPEED_NORMAL;
            this.currShootPoints = SHOOTPOINTS_NORMAL;
        }

        // switch mode
        if(inputs.Switch){
            this.switchMode();
            inputs.Switch = false;
        }

        // actions
        if(!this.castingSpecial){
            if(inputs.Shot && this.time() > this.lastShotTime){
                this.shoot();
            }
            if(inputs.Special && this.specials > 0){
                this.special();
            }
        }
    }

    private switchMode(){
        if(this.collisionCategory == COLLISION_CATEGORIES.blue){
            this.setMode(COLLISION_CATEGORIES.red);
            console.log('switched to red');
        }

        else if(this.collisionCategory == COLLISION_CATEGORIES.red){
            this.setMode(COLLISION_CATEGORIES.blue);
            console.log('switched to blue');
        }
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