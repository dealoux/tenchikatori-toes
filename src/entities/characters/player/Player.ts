import Phaser from 'phaser';
import { eventsCenter, GAMEPLAY_EVENTS } from '../../../plugins/EventsCentre';
import { COLLISION_CATEGORIES, Entity } from '../../Entity';
import { IShootPoints, DATA_PLAYER_P1, DATA_PLAYER_P2, DATA_PLAYER_PMOON, SHOOTPOINTS_NORMAL, PLAYER_PROJECTILE_POOL, PlayerShot1, PlayerShot2, PlayerSpecialMoon, PLAYER_SPECIAL_POOL } from '../../projectiles/Projectile_Player';
import { Character, UIBarComponent, ICharacter, IUIBar } from '../Character';
import { IScalePatternData, PPatternScale, Projectile } from '../../projectiles/Projectile';
import { PlayerState_DisableInteractive, PlayerState_Interactive, PlayerState_Spawn } from './PlayerState';
import { ITexture } from '../../../scenes/UI';
import { SCENE_NAMES } from '../../../constants';
import { emptyFunction, IFunctionDelegate } from '../../../plugins/Utilities';
import { playAudio, SFX } from '../../../plugins/Audio';
import { PoolManager } from '../../../plugins/Pool';

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
    hp: 3,
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

const PLAYER_UI_BAR : IUIBar = {
    size: { x: 50, y: 6 },
    offset: { x: -25, y: 35 },
    fillColour: 0x0000ff,
}

export class Player extends Character{
    actionDelegate : IFunctionDelegate;
    handlingPowerItemCollisionDelegate: IHandlingPCollisionDelegate;
    handlingHPItemCollisionDelegate: IHandlingPCollisionDelegate;
    handlingSpecialItemCollisionDelegate: IHandlingPCollisionDelegate;
    handlingProjectileCollisionDelegate: IHandlingPCollisionDelegate;

    bodyOffset: Phaser.Math.Vector2;

    hitbox: Entity;
    modeIndicator: Entity;

    currPower: number;
    currSpecial: number;
    currExtraScore: number;
    currGraze: number;

    interactiveState: PlayerState_Interactive;
    spawnState: PlayerState_Spawn;
    disableInteractiveState: PlayerState_DisableInteractive;

    currShootPoints : IShootPoints;
    projectileManager: PoolManager;
    specialPattern: PPatternScale;

    constructor(scene: Phaser.Scene){
        super(scene, PLAYER_DATA);
        this.setCollideWorldBounds(true);
        
        this.actionDelegate = this.shoot1;
        this.handlingPowerItemCollisionDelegate = this.handlingPowerItem;
        this.handlingHPItemCollisionDelegate = this.handlingHPItem;
        this.handlingSpecialItemCollisionDelegate = this.handlingSpecialItem;
        this.handlingProjectileCollisionDelegate = this.handleProjectileCollision;

        this.components.addComponents(this, new UIBarComponent(PLAYER_UI_BAR));

        this.bodyOffset = new Phaser.Math.Vector2(this.x - this.body.x, this.y - this.body.y);
        
        this.hitbox = new Entity(scene, { pos: new Phaser.Math.Vector2(this.x, this.y), texture: HITBOX_TEXTURE }, true);
        this.hitbox.setScale(HITBOX_SIZE/this.hitbox.width);
        this.hitbox.setVisible(false);
        
        this.modeIndicator = new Entity(scene, { pos: new Phaser.Math.Vector2(this.x + MODE_IDICATOR_OFFSET.x, this.y + MODE_IDICATOR_OFFSET.y), texture: BLUE_MODE } , true);
        this.modeIndicator.setScale(MODE_IDICATOR_SIZE/this.modeIndicator.width);
        this.setModeBlue();

        this.interactiveState = new PlayerState_Interactive(this, PLAYER_DATA);
        this.spawnState = new PlayerState_Spawn(this, PLAYER_DATA);
        this.disableInteractiveState = new PlayerState_DisableInteractive(this, PLAYER_DATA);

        this.currPower = 1.5;
        this.currSpecial = 8;
        this.currExtraScore = 0;
        this.currGraze = 0;

        this.currShootPoints = SHOOTPOINTS_NORMAL;

        this.projectileManager = new PoolManager(scene);
        this.projectileManager.addGroup(DATA_PLAYER_P1.texture.key, PlayerShot1, PLAYER_PROJECTILE_POOL);
        this.projectileManager.addGroup(DATA_PLAYER_P2.texture.key, PlayerShot2, PLAYER_PROJECTILE_POOL);
        this.projectileManager.addGroup(DATA_PLAYER_PMOON.texture.key, PlayerSpecialMoon, PLAYER_SPECIAL_POOL);
        this.specialPattern = new PPatternScale(this, { pos: new Phaser.Math.Vector2(0, 30), theta: -90 }, this.projectileManager.getGroup(DATA_PLAYER_PMOON.texture.key), SPECIAL_DATA);

        this.stateMachine.initialize(this.spawnState);
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
    
    preUpdate(time: number, delta: number){
        super.preUpdate(time, delta);
        // this.hitbox.setPosition(this.x, this.y);
        // this.modeIndicator.setPosition(this.x + MODE_IDICATOR_OFFSET.x, this.y + MODE_IDICATOR_OFFSET.y);
    }

    displayHUDData(){
        this.updateHPCount();
        this.updateSpecialCount();
        this.updatePowerCount();
        eventsCenter.emit(GAMEPLAY_EVENTS.displayExtraScore, this.currExtraScore);
        eventsCenter.emit(GAMEPLAY_EVENTS.displayGrazeCount, this.currGraze);
    }

    setCollisionCategory(mode: number) {
        super.setCollisionCategory(mode);
        this.hitbox.setCollisionCategory(mode);
    }

    private setModeRed(){
        this.setCollisionCategory(COLLISION_CATEGORIES.blue);
        this.modeIndicator.setTexture(RED_MODE.key);
    }

    switchMode(){
        if(this.collisionCategory == COLLISION_CATEGORIES.blue){
            this.setModeBlue();
        }

        else if(this.collisionCategory == COLLISION_CATEGORIES.red){
            this.setModeRed();
        }
    }
    
    disableEntity(){
        super.disableEntity();
        this.hitbox.disableEntity();
        this.modeIndicator.disableEntity();
    }

    enableEntity(pos: Phaser.Math.Vector2): void {
        super.enableEntity(pos);
        this.hitbox.enableEntity(pos);
        this.modeIndicator.enableEntity(pos);
        this.hitbox.setVisible(false);
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
        this.setCollisionCategory(COLLISION_CATEGORIES.red);
        this.modeIndicator.setTexture(BLUE_MODE.key);
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

    handleProjectileCollision(p: Projectile) {
        if(p.collisionCategory == this.collisionCategory){
            this.hp--;

            this.updateHPCount();

            playAudio(this.scene, SFX.player_vanish);

            if(this.hp > 0){
                this.disableEntity();

                const delta = (this.currPower>1.8) ? .8 : (this.currPower-1);
                this.currPower -= delta;
                Character.itemManager.emitItemsPlayer(this.x, this.y, delta*10);
                this.updatePowerCount();
                
                this.stateMachine.changeState(this.spawnState);
            }
            else{
                this.scene.scene.start(SCENE_NAMES.OverMenu);
            }
        }
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
                    playAudio(this.scene, SFX.powerup);
                    this.currPower = PLAYER_DATA.maxPower;
                    this.actionDelegate = this.shoot4;
                    this.handlingPowerItemCollisionDelegate = emptyFunction;        
                }
            }
        }
        
        this.updatePowerCount();
    }

    private updatePowerCount(){
        (this.components.findComponents(this, UIBarComponent) as UIBarComponent).display(this.currSpecial, PLAYER_DATA.maxSpecial);
        eventsCenter.emit(GAMEPLAY_EVENTS.displayPowerCount, (Math.round(this.currPower * 10) / 10).toFixed(1), PLAYER_DATA.maxPower);
    }

    private handlingHPItem(p: Projectile){
        this.hp += p.entData.value;

        if(this.hp > PLAYER_DATA.maxHP){
            this.hp = PLAYER_DATA.maxHP;
            // this.handlingHPItemCollisionDelegate = emptyFunction;
        }

        this.updateHPCount();
    }


    private handlingSpecialItem(p: Projectile){
        this.currSpecial += p.entData.value;

        if(this.currSpecial > PLAYER_DATA.maxSpecial){
            this.currSpecial = PLAYER_DATA.maxSpecial;
            // this.handlingSpecialItemCollisionDelegate = emptyFunction;
        }

        this.updateSpecialCount();
    }

    handlingScoreItem(p: Projectile){
        this.updateScore(p);
        eventsCenter.emit(GAMEPLAY_EVENTS.displayExtraScore, ++this.currExtraScore);
    }

    private updateScore(p: Projectile){
        eventsCenter.emit(GAMEPLAY_EVENTS.updateScore, p.entData.value);
    }

    updateSpecialCount(){
        eventsCenter.emit(GAMEPLAY_EVENTS.displaySpecialCount, this.currSpecial, PLAYER_DATA.maxSpecial);
    }

    private updateHPCount(){
        eventsCenter.emit(GAMEPLAY_EVENTS.displayHPCount, this.hp, PLAYER_DATA.maxHP);
    }

    handlingGrazeCount(p: Projectile){
        this.updateScore(p);
        eventsCenter.emit(GAMEPLAY_EVENTS.displayGrazeCount, ++this.currGraze);
    }
}