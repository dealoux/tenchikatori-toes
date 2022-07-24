import Phaser from 'phaser';
import { eventsCenter } from '../../plugins/EventsCentre';
import { IEntity, Entity, IVectorPoint } from '../Entity';
import { ItemManager } from '../projectiles/items/Item';
import { IState, StateMachine } from '../../plugins/StateMachine';
import { PoolManager } from '../../plugins/Pool';
import { ComponentService, IComponent } from '../../plugins/Component';
import { ITexture } from '../../scenes/UI';
import { emptyFunction } from '../../plugins/Utilities';

export interface ICharacter extends IEntity{
    hp: number,
    speed?: number,
    standTexture?: ITexture
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
        this.stateMachine = new StateMachine();
        this.hp = data.hp;
        this.entData = data;
        this.components = new ComponentService();

        this.scene.events.on(Phaser.Scenes.Events.POST_UPDATE, this.lateUpdate, this);
        this.scene.events.on(Phaser.Scenes.Events.SHUTDOWN, () => { this.components.destroy(); }, this);
    }

    time(){
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

    createInvulnerableEffect(duration = 50, repeat = 6, onComplete = () => { this.setAlpha(1); }, onStart = emptyFunction) {
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

export interface ICharacterStateData{
    animKey?: string,
}

export abstract class CharacterState implements IState{
    char: Character;
    entData: ICharacter;
    sData: ICharacterStateData;
    enterTime: number;

    constructor(char: Character, entData: ICharacter, sData: ICharacterStateData){
        this.char = char;
        this.entData = entData;
        this.sData = sData;
        this.enterTime = 0;
    }

    enter(): void {
        this.enterTime = this.char.time();
        this.char.anims.play(this.sData.animKey || '');
    }

    exit(): void { }

    update(time: number, delta: number): void { }

    preUpdate(time: number, delta: number): void { }

    protected changeState(nextState: IState, savePrevious = false){
        this.char.stateMachine.changeState(nextState, savePrevious);
    }
}