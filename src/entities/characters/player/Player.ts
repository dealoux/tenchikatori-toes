import Phaser from 'phaser';
import { IVectorPoint, IFunctionDelegate, COLLISION_CATEGORIES, Entity, ITexture } from '../../Entity';
import { InputHandler, INPUT_EVENTS } from '../../../plugins/InputHandler';
import { PoolManager } from '../../../@types/Pool';
import eventsCenter from '../../../plugins/EventsCentre';
import { IShootPoints, DATA_PLAYER_P1, DATA_PLAYER_P2, DATA_PLAYER_PMOON, PLAYER_SHOOT_DELAY, SHOOTPOINTS_NORMAL, SHOOTPOINTS_FOCUSED, PLAYER_PROJECTILE_POOL, PlayerShot1, PlayerShot2, PlayerSpecialMoon } from '../../projectiles/Projectile_Player';
import { Character, ICharacter } from '../Character';
import { IScalePatternData, PPatternScale, Projectile } from '../../projectiles/Projectile';

interface IHandlingPCollisionDelegate{
    (p: Projectile) : void;
}

interface IPlayer extends ICharacter{
    speedFocused: number,
}

export const PLAYER_DATA : IPlayer = {
    texture: { key: 'enna', path: 'assets/sprites/touhouenna.png', },
    speed: 250,
    speedFocused: 250 *.5,
    hp: 4
}

const HITBOX_TEXTURE: ITexture = {
    key: 'hitbox', path: 'assets/sprites/hitbox.png',
};
const HITBOX_SIZE = 8;
const HITBOX_OFFSET = -HITBOX_SIZE/2;

const GRAZEHB_SIZE = 60;

const MODE_IDICATOR_SIZE = 20;
const MODE_IDICATOR_OFFSET = new Phaser.Math.Vector2(-MODE_IDICATOR_SIZE/2, GRAZEHB_SIZE -MODE_IDICATOR_SIZE/2);

const BLUE_MODE: ITexture = {
    key: 'bluemode', path: 'assets/sprites/bluemode.png',
};
const RED_MODE: ITexture = {
    key: 'redmode', path: 'assets/sprites/redmode.png',
};

const MAX_POWER = 4;

export enum PLAYER_EVENTS{
    special = 'special',
}

const SPECIAL_DATA : IScalePatternData = {
    pSpeed : DATA_PLAYER_PMOON.speed,
    fireRate : 30,
    scaleSpeed: 0.25,
}

export class Player extends Character{
    actionDelegate : IFunctionDelegate;
    inputHandlingDelegate: IFunctionDelegate;
    handlingPowerItemCollisionDelegate: IHandlingPCollisionDelegate;

    bodyOffset: Phaser.Math.Vector2;

    hitbox: Entity;
    modeIndicator: Entity;

    projectileManager: PoolManager;
    currShootPoints : IShootPoints;
    shots : Function[];
    
    specials: number;
    castingSpecial: boolean;
    specialPattern: PPatternScale;

    currPower: number;
    currScore: number;

    speed: number;

    constructor(scene: Phaser.Scene, pos: Phaser.Math.Vector2){
        // let shapes = scene.game.cache.json.get('shapes');
        PLAYER_DATA.pos = pos;
        super(scene, PLAYER_DATA);
        this.setCollideWorldBounds(true);
        
        this.actionDelegate = this.shoot;
        this.inputHandlingDelegate = this.inputHandling;
        this.handlingPowerItemCollisionDelegate = this.handlingPowerUp;

        this.bodyOffset = new Phaser.Math.Vector2(this.x - this.body.x, this.y - this.body.y);
        
        this.hitbox = new Entity(scene, { pos, texture: HITBOX_TEXTURE }, true);
        this.hitbox.setScale(HITBOX_SIZE/this.hitbox.width);
        this.hitbox.setVisible(false);
        
        this.modeIndicator = new Entity(scene, { pos: new Phaser.Math.Vector2(pos.x + MODE_IDICATOR_OFFSET.x, pos.y + MODE_IDICATOR_OFFSET.y), texture: BLUE_MODE } , true);
        this.modeIndicator.setScale(MODE_IDICATOR_SIZE/this.modeIndicator.width);

        this.setModeBlue();

        this.currShootPoints = SHOOTPOINTS_NORMAL;
        this.specials = 3;
        this.castingSpecial = false;
        this.projectileManager = new PoolManager(scene);
        this.projectileManager.addGroup(DATA_PLAYER_P1.texture.key, PlayerShot1, PLAYER_PROJECTILE_POOL);
        this.projectileManager.addGroup(DATA_PLAYER_P2.texture.key, PlayerShot2, PLAYER_PROJECTILE_POOL);
        this.projectileManager.addGroup(DATA_PLAYER_PMOON.texture.key, PlayerSpecialMoon, 4);
        this.specialPattern = new PPatternScale(this, {pos: new Phaser.Math.Vector2(0, 30), theta: -90,} as IVectorPoint, this.projectileManager.getGroup(DATA_PLAYER_PMOON.texture.key), SPECIAL_DATA);

        this.shots = [
            function(player: Player) { player.spawnProjectile(player.projectileManager, DATA_PLAYER_P1.texture.key, player.currShootPoints.point_1); },
            function(player: Player) { player.spawnProjectile(player.projectileManager, DATA_PLAYER_P1.texture.key, player.currShootPoints.point_2); },
            function(player: Player) { player.spawnProjectile(player.projectileManager, DATA_PLAYER_P2.texture.key, player.currShootPoints.point_3); },
            function(player: Player) { player.spawnProjectile(player.projectileManager, DATA_PLAYER_P2.texture.key, player.currShootPoints.point_4); },
        ]

        this.currPower = 3.5;
        this.currScore = 0;
        this.speed = PLAYER_DATA.speed || 0;
    }

    static preload(scene: Phaser.Scene) {
        scene.load.image(PLAYER_DATA.texture.key, PLAYER_DATA.texture.path);

        scene.load.image(HITBOX_TEXTURE.key, HITBOX_TEXTURE.path);
        scene.load.image(BLUE_MODE.key, BLUE_MODE.path);
        scene.load.image(RED_MODE.key, RED_MODE.path);

        scene.load.image(DATA_PLAYER_P1.texture.key, DATA_PLAYER_P1.texture.path);
        scene.load.image(DATA_PLAYER_P2.texture.key, DATA_PLAYER_P2.texture.path);
        scene.load.spritesheet(DATA_PLAYER_PMOON.texture.key, DATA_PLAYER_PMOON.texture.path, { frameWidth: 32, frameHeight: 16 });

        // scene.load.spritesheet(
        //     'cards', 
        //     'assets/sprites/touhou_test/pl_shot.png',
        //     { frameWidth: 16, frameHeight: 32 }
        // );
	}
    
    create(){
        super.create();

        eventsCenter.on(INPUT_EVENTS.Focus_down, () => {
            this.speed = PLAYER_DATA.speedFocused;
            this.currShootPoints = SHOOTPOINTS_FOCUSED;
            this.hitbox.setVisible(true);
		});

        eventsCenter.on(INPUT_EVENTS.Focus_up, () => {
            this.speed = PLAYER_DATA.speed!;
            this.currShootPoints = SHOOTPOINTS_NORMAL;
            this.hitbox.setVisible(false);
		});
    }

    protected preUpdateHere(time: number, delta: number){
        super.preUpdateHere(time, delta);
        // this.hitbox.setPosition(this.x, this.y);
        // this.modeIndicator.setPosition(this.x + MODE_IDICATOR_OFFSET.x, this.y + MODE_IDICATOR_OFFSET.y);
    }

    protected updateHere(){
        super.updateHere();
        this.inputHandlingDelegate();
    }

    handleCollision(entity: Entity) {
        console.dir(entity);
    }

    handlingInput(value: boolean = true){
        this.inputHandlingDelegate = value ? this.inputHandling : this.emptyFunction;
    }

    setMode(mode: number) {
        super.setMode(mode);
        this.hitbox.setMode(mode);
    }

    protected moveHorizontally(x: number){
        super.moveHorizontally(x);

        // this.hitbox.body.velocity.x = this.body.velocity.x;
        // this.modeIndicator.body.velocity.x = this.body.velocity.x;

        const baseX = this.body.x + this.bodyOffset.x;
        this.hitbox.body.x = baseX + HITBOX_OFFSET;
        this.modeIndicator.body.x = baseX + MODE_IDICATOR_OFFSET.x;
    }

    protected moveVertically(y: number){
        super.moveVertically(y);

        // this.hitbox.body.velocity.y = this.body.velocity.y;
        // this.modeIndicator.body.velocity.y = this.body.velocity.y;

        const baseY = this.body.y + this.bodyOffset.y;
        this.hitbox.body.y = baseY + HITBOX_OFFSET;
        this.modeIndicator.body.y = baseY + MODE_IDICATOR_OFFSET.y;
    }

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

    private setModeBlue(){
        this.setMode(COLLISION_CATEGORIES.blue);
        this.modeIndicator.setTexture(BLUE_MODE.key);
    }

    private setModeRed(){
        this.setMode(COLLISION_CATEGORIES.red);
        this.modeIndicator.setTexture(RED_MODE.key);
    }

    private switchMode(){
        if(this.collisionCategory == COLLISION_CATEGORIES.blue){
            this.setModeRed();
        }

        else if(this.collisionCategory == COLLISION_CATEGORIES.red){
            this.setModeBlue();
        }
    }

    private shoot(){
        for(let i = 0; i< Phaser.Math.FloorTo(this.currPower); i++){
            this.shots[i](this);
        }

        this.lastShotTime = this.time() + PLAYER_SHOOT_DELAY;
    }

    private special(){
        this.specialPattern.updatePattern();
        InputHandler.Instance().inputs.Special = false;
        this.specials--;

        // const shot = this.projectileManager.pList.get(PlayersProjectileType.special);

        // if(shot){
        //     this.castingSpecial = true;
        //     eventsCenter.emit(PlayerEvents.special);
        //     shot.getProjectile(this.getBody().x, this.getBody().y);
        //     this.specials--; 
        // }
    }

    private handlingPowerUp(p: Projectile){
        this.currPower += p.entData.value;

        if(this.currPower > MAX_POWER){
            this.currPower = MAX_POWER;
            this.handlingPowerItemCollisionDelegate = this.emptyFunction;
        }
        
        // console.log(this.currPower + ", " + (this.currPower > MAX_POWER));
    }

    handlingScoreItem(p: Projectile){
        this.currScore += p.entData.value;
        //console.log(this.currScore);
    }
}