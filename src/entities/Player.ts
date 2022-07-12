import Phaser, { Physics } from 'phaser';
import {IEntity, IVectorPoint, IFunctionDelegate, COLLISION_CATEGORIES } from './Entity';
import { InputHandler, INPUT_EVENTS } from '../plugins/InputHandler';
import { PoolManager } from '../@types/Pool';
import eventsCenter from '../plugins/EventsCentre';
import { IShootPoints, DATA_PLAYERSHOT1, DATA_PLAYERSHOT2, DATA_PLAYERSPECIAL, SHOT_DELAY, SHOOTPOINTS_NORMAL, SHOOTPOINTS_FOCUSED, SHOTPOOL_PLAYER, PlayerShot1, PlayerShot2 } from '../objects/Projectile_Player';
import { Character, Characters } from './Character';

const SPEED_NORMAL = 250;
const SPEED_FOCUSED = SPEED_NORMAL*.5;

export enum PlayerState{
    NORMAL,
    FOCUSED,
}

export enum PlayerEvents{
    special = 'special',
}

const HITBOX = 8;
const GRAZE_HITBOX = 40;

export class Player extends Character{
    actionDelegate : IFunctionDelegate;
    inputHandlingDelegate: IFunctionDelegate;

    hitbox: Phaser.GameObjects.Rectangle;
    projectileManager: PoolManager;
    currShootPoints : IShootPoints;
    shots : Function[];
    shotCounts : number;
    
    specials: number;
    castingSpecial: boolean;

    constructor(scene: Phaser.Scene, { pos, texture, frame, offset }: IEntity){
        let shapes = scene.game.cache.json.get('shapes');
        
        super(scene, { pos, texture, hitRadius: GRAZE_HITBOX, frame, offset }, 3, SPEED_NORMAL);
        
        this.actionDelegate = this.shoot;
        this.inputHandlingDelegate = this.inputHandling;
        
        //console.dir(this.getBody());

        this.hitbox = scene.add.rectangle(pos.x, pos.y, HITBOX, HITBOX, 0x202A44).setVisible(false);
        scene.physics.add.existing(this.hitbox);

        this.currShootPoints = SHOOTPOINTS_NORMAL;
        this.specials = 3;
        this.castingSpecial = false;
        this.projectileManager = new PoolManager(scene, Player);
        this.projectileManager.addGroup(DATA_PLAYERSHOT1.entData.texture, PlayerShot1, SHOTPOOL_PLAYER);
        this.projectileManager.addGroup(DATA_PLAYERSHOT2.entData.texture, PlayerShot2, SHOTPOOL_PLAYER);
        //this.projectileManager.pList.set(PlayersProjectileType.special, new ProjectileGroup(scene, PlayersProjectileType.special, 2));

        this.shots = [
            function(player: Player) { player.spawnProjectile(player.projectileManager, DATA_PLAYERSHOT1.entData.texture, player.currShootPoints.point_1); },
            function(player: Player) { player.spawnProjectile(player.projectileManager, DATA_PLAYERSHOT1.entData.texture, player.currShootPoints.point_2); },
            function(player: Player) { player.spawnProjectile(player.projectileManager, DATA_PLAYERSHOT2.entData.texture, player.currShootPoints.point_3); },
            function(player: Player) { player.spawnProjectile(player.projectileManager, DATA_PLAYERSHOT2.entData.texture, player.currShootPoints.point_4); },
        ]

        this.shotCounts = 4;

        this.setCollideWorldBounds(true);
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

        eventsCenter.on(INPUT_EVENTS.Focus_down, () => {
            this.speed = SPEED_FOCUSED;
            this.currShootPoints = SHOOTPOINTS_FOCUSED;
            this.hitbox.setVisible(true);
		});

        eventsCenter.on(INPUT_EVENTS.Focus_up, () => {
            this.speed = SPEED_NORMAL;
            this.currShootPoints = SHOOTPOINTS_NORMAL;
            this.hitbox.setVisible(false);
		});
    }

    update(){
        //super.update();
        this.inputHandlingDelegate();
        // this.hitbox.setPosition(this.x, this.y);
    }

    public handlingInput(value: boolean = true){
        this.inputHandlingDelegate = value ? this.inputHandling : this.emptyFunction;
    }

    protected moveVertically(y: number){
        super.moveVertically(y);
        this.hitbox.body.velocity.y = this.body.velocity.y;
    }

    protected moveHorizontally(x: number){
        super.moveHorizontally(x);
        this.hitbox.body.velocity.x = this.body.velocity.x;
    }

    private emptyFunction(){ }

    private inputHandling(){
        const {inputs} = InputHandler.Instance();

        // directional movements
        if (inputs.Up) {
            this.moveVertically(-this.speed);
        }
        else if (inputs.Down) {
            this.moveVertically(this.speed);
        }
        else{
            this.moveVertically(0);
        }

        if (inputs.Left) {
            this.moveHorizontally(-this.speed);
        }
        else if (inputs.Right) {
            this.moveHorizontally(this.speed);
        }
        else{
            this.moveHorizontally(0);
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