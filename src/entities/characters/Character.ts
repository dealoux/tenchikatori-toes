import Phaser from 'phaser';
import { eventsCenter } from '../../plugins/EventsCentre';
import { IEntity, Entity, IVectorPoint } from '../Entity';
import { ItemManager } from '../projectiles/items/Item';
import { StateMachine } from '../../plugins/StateMachine';
import { PoolManager } from '../../plugins/Pool';
import { ComponentService, IComponent } from '../../plugins/Component';

export interface ICharacter extends IEntity{
    hp: number,
    speed?: number,
}

export interface IAnimation{
    key: string,
    end: number,
    pad: number, 
}

export class Character extends Entity{
    static itemManager: ItemManager;
    stateMachine: StateMachine;
    hp: number;
    entData: ICharacter;
    components: ComponentService;

    constructor(scene: Phaser.Scene, data: ICharacter){
        super(scene, { pos: data.pos, texture: data.texture, hitSize: data.hitSize, frame: data.frame }, true);
        this.stateMachine = new StateMachine(this);
        this.hp = data.hp;
        this.entData = data;
        this.components = new ComponentService();

        this.scene.events.on(Phaser.Scenes.Events.POST_UPDATE, this.lateUpdate, this);
        this.scene.events.on(Phaser.Scenes.Events.SHUTDOWN, () => { this.components.destroy(); }, this);
    }

    time(){
        //return this.scene.time.now;
        return this.scene.game.getTime();
    }

    static initManager(scene: Phaser.Scene){
        Character.itemManager = new ItemManager(scene);
        Character.itemManager.init();
    }

    update(time: number, delta: number) {
        super.update(time, delta);
        this.stateMachine.currState().update(time, delta);
    }

    preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);
        this.stateMachine.currState().preUpdate(time, delta);
    }

    lateUpdate(time: number, delta: number): void {
        this.components.update(time, delta);
    }

    createInvulnerableEffect(duration = 50, repeat = 6, onStart = () => { }, onComplete =  () => { this.setAlpha(1); }) {
        this.scene.tweens.add({
            targets: this,
            duration: duration,
            repeat: repeat,
            yoyo: true,
            alpha: 0.5,
            onStart: onStart,
            onComplete: onComplete,
        });
    }

    enableEntity(pos: Phaser.Math.Vector2): void {
        super.enableEntity(pos);
        this.components.enable();
    }

    disableEntity(): void {
        super.disableEntity();
        this.components.disable();
    }

    protected moveVertically(speed: number){
        //this.y += speed;
        this.setVelocityY(speed);
    }

    protected moveHorizontally(speed: number){
        //this.x += speed;
        this.setVelocityX(speed);
    }

    protected spawnProjectile(manager: PoolManager, name: string, point: IVectorPoint){
        return manager.spawnInstance(name, { pos: new Phaser.Math.Vector2(this.x + point.pos.x, this.y + point.pos.y), theta: point.theta });
    }

    protected createAnimation(data: Array<IAnimation>, parent: string){
        data.forEach(a =>{
            this.anims.create({ key: a.key, frames: this.anims.generateFrameNames(parent, { prefix: a.key, end: a.end, zeroPad: a.pad }), repeat: -1 });
        });
    }
}

export abstract class CharacterComponent implements IComponent{
    protected char!: Character;

    init(go: Phaser.GameObjects.GameObject){
        this.char = go as Character;
    }
}

export interface IUIBar{
    size: Phaser.Types.Math.Vector2Like,
    offset: Phaser.Types.Math.Vector2Like,
    fillColour?: number,
}

export class UIBarComponent extends CharacterComponent{
    graphics?: Phaser.GameObjects.Graphics;
    barData: IUIBar;

    constructor(barData: IUIBar){
        super();
        this.barData = barData;
    }

    display(currValue = 0, maxValue = 1){
        if(!this.graphics) { return; }

        this.graphics.clear();

        this.graphics.fillStyle(0xcfcfcf);
        this.graphics.fillRect(0, 0, this.barData.size.x!, this.barData.size.y!);

        let currBarSize = (this.barData.size.x!-4) * (currValue/maxValue);
        this.graphics.fillStyle(this.barData.fillColour!);
        this.graphics.fillRect(2, 2, currBarSize, this.barData.size.y!-4);
    }

    start(){
        const {scene} = this.char;
        this.graphics = scene.add.graphics();
    }

    update(time: number, delta: number){
        if(!this.graphics){ return; }

        this.graphics.x = this.char.x + this.barData.offset.x!;
        this.graphics.y = this.char.y + this.barData.offset.y!;
    }

    enable(){
        if(!this.graphics){ return; }

        this.graphics.setActive(true);
        this.graphics.setVisible(true);
    }

    disable(){
        if(!this.graphics){ return; }

        this.graphics.setActive(false);
        this.graphics.setVisible(false);
    }
}