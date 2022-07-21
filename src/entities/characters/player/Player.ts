import Phaser from 'phaser';
import { eventsCenter, GAMEPLAY_EVENTS } from '../../../plugins/EventsCentre';
import { IVectorPoint, COLLISION_CATEGORIES, Entity, IFunctionDelegate } from '../../Entity';
import { PoolManager } from '../../../@types/Pool';
import { IShootPoints, DATA_PLAYER_P1, DATA_PLAYER_P2, DATA_PLAYER_PMOON, SHOOTPOINTS_NORMAL, PLAYER_PROJECTILE_POOL, PlayerShot1, PlayerShot2, PlayerSpecialMoon } from '../../projectiles/Projectile_Player';
import { Character, ICharacter } from '../Character';
import { IScalePatternData, PPatternScale, Projectile } from '../../projectiles/Projectile';
import { PlayerState_DisableInteractive, PlayerState_Interactive } from './PlayerState';
import { ITexture } from '../../../@types/UI';

interface IHandlingPCollisionDelegate{
    (p: Projectile) : void;
}

export interface IPlayer extends ICharacter{
    speedFocused: number,
    maxHP: number,
    maxPower: number,
    maxSpecial: number,
}

export const PLAYER_DATA : IPlayer = {
    texture: { key: 'enna', path: 'assets/sprites/touhouenna.png', },
    speed: 250,
    speedFocused: 250 *.5,
    hp: 4,
    maxHP: 10,
    maxPower: 4,
    maxSpecial: 10,
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

const SPECIAL_DATA : IScalePatternData = {
    pSpeed : DATA_PLAYER_PMOON.speed,
    fireRate : 30,
    scaleSpeed: 0.25,
}

export class Player extends Character{
    actionDelegate : IFunctionDelegate;
    handlingPowerItemCollisionDelegate: IHandlingPCollisionDelegate;
    handlingSpecialItemCollisionDelegate: IHandlingPCollisionDelegate;

    bodyOffset: Phaser.Math.Vector2;

    hitbox: Entity;
    modeIndicator: Entity;

    currPower: number;
    currSpecial: number;
    currExtraScore: number;
    currGraze: number;

    interactiveState: PlayerState_Interactive;
    disableInteractiveState: PlayerState_DisableInteractive;

    currShootPoints : IShootPoints;
    projectileManager: PoolManager;
    specialPattern: PPatternScale;

    constructor(scene: Phaser.Scene, pos: Phaser.Math.Vector2){
        PLAYER_DATA.pos = pos;
        super(scene, PLAYER_DATA);
        this.setCollideWorldBounds(true);
        
        this.actionDelegate = this.shoot1;
        this.handlingPowerItemCollisionDelegate = this.handlingPowerItem;
        this.handlingSpecialItemCollisionDelegate = this.handlingSpecialItem;
        

        this.bodyOffset = new Phaser.Math.Vector2(this.x - this.body.x, this.y - this.body.y);
        
        this.hitbox = new Entity(scene, { pos, texture: HITBOX_TEXTURE }, true);
        this.hitbox.setScale(HITBOX_SIZE/this.hitbox.width);
        this.hitbox.setVisible(false);
        
        this.modeIndicator = new Entity(scene, { pos: new Phaser.Math.Vector2(pos.x + MODE_IDICATOR_OFFSET.x, pos.y + MODE_IDICATOR_OFFSET.y), texture: BLUE_MODE } , true);
        this.modeIndicator.setScale(MODE_IDICATOR_SIZE/this.modeIndicator.width);
        this.setModeBlue();

        this.interactiveState = new PlayerState_Interactive(this, PLAYER_DATA);
        this.disableInteractiveState = new PlayerState_DisableInteractive(this, PLAYER_DATA);

        this.currPower = 1;
        this.currSpecial = 2;
        this.currExtraScore = 0;
        this.currGraze = 0;

        this.currShootPoints = SHOOTPOINTS_NORMAL;

        this.projectileManager = new PoolManager(scene);
        this.projectileManager.addGroup(DATA_PLAYER_P1.texture.key, PlayerShot1, PLAYER_PROJECTILE_POOL);
        this.projectileManager.addGroup(DATA_PLAYER_P2.texture.key, PlayerShot2, PLAYER_PROJECTILE_POOL);
        this.projectileManager.addGroup(DATA_PLAYER_PMOON.texture.key, PlayerSpecialMoon, 4);
        this.specialPattern = new PPatternScale(this, { pos: new Phaser.Math.Vector2(0, 30), theta: -90 }, this.projectileManager.getGroup(DATA_PLAYER_PMOON.texture.key), SPECIAL_DATA);

        this.stateMachine.initialize(this.interactiveState);

        eventsCenter.emit(GAMEPLAY_EVENTS.updateLivesCount, this.hp, PLAYER_DATA.maxHP);
        eventsCenter.emit(GAMEPLAY_EVENTS.updatePowerCount, this.currPower, PLAYER_DATA.maxPower);
        this.updateSpecialCount();
        eventsCenter.emit(GAMEPLAY_EVENTS.updateExtraScore, this.currExtraScore);
        eventsCenter.emit(GAMEPLAY_EVENTS.updateGrazeCount, this.currGraze);
    }

    static preload(scene: Phaser.Scene) {
        scene.load.image(PLAYER_DATA.texture.key, PLAYER_DATA.texture.path);

        scene.load.image(HITBOX_TEXTURE.key, HITBOX_TEXTURE.path);
        scene.load.image(BLUE_MODE.key, BLUE_MODE.path);
        scene.load.image(RED_MODE.key, RED_MODE.path);

        scene.load.image(DATA_PLAYER_P1.texture.key, DATA_PLAYER_P1.texture.path);
        scene.load.image(DATA_PLAYER_P2.texture.key, DATA_PLAYER_P2.texture.path);
        scene.load.spritesheet(DATA_PLAYER_PMOON.texture.key, DATA_PLAYER_PMOON.texture.path, { frameWidth: DATA_PLAYER_PMOON.texture.frameWidth!, frameHeight: DATA_PLAYER_PMOON.texture.frameHeight! });
	}
    
    create(){
        super.create();
    }

    preUpdate(time: number, delta: number){
        super.preUpdate(time, delta);
        // this.hitbox.setPosition(this.x, this.y);
        // this.modeIndicator.setPosition(this.x + MODE_IDICATOR_OFFSET.x, this.y + MODE_IDICATOR_OFFSET.y);
    }

    update(){
        super.update();
    }

    handleCollision(entity: Entity) {
        // console.dir(entity);

        if(this.currPower > 1.8){
            Character.itemManager.emitItems(this.x, this.y);
        }
        else if(this.currPower > 1){
            const delta = this.currPower - 1 * 10;
            this.currPower = 1;
            Character.itemManager.emitItems(this.x, this.y, delta);
        }
    }

    setMode(mode: number) {
        super.setMode(mode);
        this.hitbox.setMode(mode);
    }

    moveHorizontally(x: number){
        super.moveHorizontally(x);

        // this.hitbox.body.velocity.x = this.body.velocity.x;
        // this.modeIndicator.body.velocity.x = this.body.velocity.x;

        const baseX = this.body.x + this.bodyOffset.x;
        this.hitbox.body.x = baseX + HITBOX_OFFSET;
        this.modeIndicator.body.x = baseX + MODE_IDICATOR_OFFSET.x;
    }

    moveVertically(y: number){
        super.moveVertically(y);

        // this.hitbox.body.velocity.y = this.body.velocity.y;
        // this.modeIndicator.body.velocity.y = this.body.velocity.y;

        const baseY = this.body.y + this.bodyOffset.y;
        this.hitbox.body.y = baseY + HITBOX_OFFSET;
        this.modeIndicator.body.y = baseY + MODE_IDICATOR_OFFSET.y;
    }

    private setModeBlue(){
        this.setMode(COLLISION_CATEGORIES.blue);
        this.modeIndicator.setTexture(BLUE_MODE.key);
    }

    private setModeRed(){
        this.setMode(COLLISION_CATEGORIES.red);
        this.modeIndicator.setTexture(RED_MODE.key);
    }

    switchMode(){
        if(this.collisionCategory == COLLISION_CATEGORIES.blue){
            this.setModeRed();
        }

        else if(this.collisionCategory == COLLISION_CATEGORIES.red){
            this.setModeBlue();
        }
    }

    private shoot1(){
        this.spawnProjectile(this.projectileManager, DATA_PLAYER_P1.texture.key, this.currShootPoints.point_0);
    }

    private shoot2(){
        this.spawnProjectile(this.projectileManager, DATA_PLAYER_P1.texture.key, this.currShootPoints.point_1); 
        this.spawnProjectile(this.projectileManager, DATA_PLAYER_P1.texture.key, this.currShootPoints.point_2);
    }

    private shoot3(){
        this.shoot1();
        this.spawnProjectile(this.projectileManager, DATA_PLAYER_P2.texture.key, this.currShootPoints.point_3);
        this.spawnProjectile(this.projectileManager, DATA_PLAYER_P2.texture.key, this.currShootPoints.point_4); 
    }

    private shoot4(){
        this.shoot2();
        this.spawnProjectile(this.projectileManager, DATA_PLAYER_P2.texture.key, this.currShootPoints.point_3);
        this.spawnProjectile(this.projectileManager, DATA_PLAYER_P2.texture.key, this.currShootPoints.point_4); 
    }

    private handlingPowerItem(p: Projectile){
        this.currPower += p.entData.value;

        if(this.currPower < 2){
            this.actionDelegate = this.shoot1;
        }
        else{
            if(this.currPower < 3){
                this.actionDelegate = this.shoot2;
            }
            else{
                if(this.currPower < 4){
                    this.actionDelegate = this.shoot3;
                }
                else{
                    this.currPower = PLAYER_DATA.maxPower;
                    this.actionDelegate = this.shoot4;
                    this.handlingPowerItemCollisionDelegate = this.emptyFunction;        
                }
            }
        }
        
        eventsCenter.emit(GAMEPLAY_EVENTS.updatePowerCount, (Math.round(this.currPower * 10) / 10).toFixed(1), PLAYER_DATA.maxPower);
        // console.log(this.currPower + ", " + (this.currPower > MAX_POWER));
    }

    private handlingSpecialItem(p: Projectile){
        this.currSpecial += p.entData.value;

        if(this.currSpecial > PLAYER_DATA.maxSpecial){
            this.currSpecial = PLAYER_DATA.maxSpecial;
            // this.handlingSpecialItemCollisionDelegate = this.emptyFunction;
        }

        this.updateSpecialCount();
    }

    handlingScoreItem(p: Projectile){
        eventsCenter.emit(GAMEPLAY_EVENTS.updateExtraScore, ++this.currExtraScore);
    }

    private updateScore(p: Projectile){
        this.currExtraScore += p.entData.value;
        //console.log(this.currScore);
        eventsCenter.emit(GAMEPLAY_EVENTS.updateScore, this.currExtraScore);
    }

    updateSpecialCount(){
        eventsCenter.emit(GAMEPLAY_EVENTS.updateSpecialCount, this.currSpecial, PLAYER_DATA.maxSpecial);
    }

    updateGrazeCount(p: Projectile){
        this.currGraze++;
        this.updateScore(p);
        eventsCenter.emit(GAMEPLAY_EVENTS.updateGrazeCount, this.currGraze);
    }
}