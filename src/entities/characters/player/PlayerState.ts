import Phaser from "phaser";
import { eventsCenter } from '../../../plugins/EventsCentre';
import { IPlayer, Player } from "./Player";
import { InputHandler, INPUT_EVENTS } from "../../../plugins/InputHandler";
import { PLAYER_SHOOT_DELAY, SHOOTPOINTS_FOCUSED, SHOOTPOINTS_NORMAL } from "../../projectiles/Projectile_Player";
import { GAMEPLAY_SIZE } from "../../../constants";
import { emptyFunction } from "../../../plugins/Utilities";
import { playAudio, SFX } from "../../../plugins/Audio";
import { CharacterState, ICharacterStateData } from "../Character";

interface PlayerStateData extends ICharacterStateData{}
const PLAYER_STATE_DATA: PlayerStateData = {};

export class PlayerState extends CharacterState{
    char: Player;
    entData: IPlayer;

    constructor(char: Player, entData: IPlayer){
        super(char, entData, PLAYER_STATE_DATA);
        this.char = char;
        this.entData = entData;
    }
}

export class PlayerState_DisableInteractive extends PlayerState{
    constructor(char: Player, entData: IPlayer){
        super(char, entData);
    }
}

export class PlayerState_Spawn extends PlayerState{
    constructor(char: Player, entData: IPlayer){
        super(char, entData);
    }

    enter(){
        this.char.setCollideWorldBounds(false);
        this.char.modeIndicator.setVisible(false);
        this.char.enableEntity(new Phaser.Math.Vector2(GAMEPLAY_SIZE.WIDTH/2, GAMEPLAY_SIZE.HEIGHT* 1.25));
        this.char.handlingProjectileCollisionDelegate = emptyFunction;
        this.char.createInvulnerableEffect(100, 24, emptyFunction, ()=>{ this.char.handlingProjectileCollisionDelegate = this.char.handleProjectileCollision; });

        this.char.scene.tweens.add({
            targets: this.char,
            y: GAMEPLAY_SIZE.HEIGHT*.85,
            duration: 1600,
            onStart: () => { },
            onComplete: () => { this.char.setCollideWorldBounds(true); this.changeState(this.char.interactiveState); this.char.modeIndicator.setVisible(true); this.char.displayHUDData(); },
        });
    }
}

export class PlayerState_Interactive extends PlayerState{
    speed: number;
    lastShotTime: number;
    castingSpecial: boolean;

    constructor(char: Player, entData: IPlayer){
        super(char, entData);

        this.speed = entData.speed!;
        this.lastShotTime = 0;
        this.castingSpecial = false;
    }

    enter(): void {
        super.enter();

        eventsCenter.on(INPUT_EVENTS.Focus_down, this.focusedMode, this);
        eventsCenter.on(INPUT_EVENTS.Focus_up, this.normalMode, this);
    }

    exit(): void {
        super.exit();

        InputHandler.Instance().reset();
        eventsCenter.off(INPUT_EVENTS.Focus_down, this.focusedMode);
        eventsCenter.off(INPUT_EVENTS.Focus_up, this.normalMode);
        this.char.setVelocity(0, 0);
    }

    update(time: number, delta: number): void {
        super.update(time, delta);
        this.inputHandling();
    }

    protected focusedMode(){
        this.speed = this.entData.speedFocused;
        this.char.currShootPoints = SHOOTPOINTS_FOCUSED;
        this.char.hitbox.setVisible(true);
    }

    protected normalMode(){
        this.speed = this.entData.speed!;
        this.char.currShootPoints = SHOOTPOINTS_NORMAL;
        this.char.hitbox.setVisible(false);
    }

    protected inputHandling(){
        const {inputs} = InputHandler.Instance();

        // directional movements
        if (inputs.Up) {
            this.char.moveVertically(-this.speed);
        }
        else if (inputs.Down) {
            this.char.moveVertically(this.speed);
        }
        else{
            this.char.moveVertically(0);
        }

        if (inputs.Left) {
            this.char.moveHorizontally(-this.speed);
        }
        else if (inputs.Right) {
            this.char.moveHorizontally(this.speed);
        }
        else{
            this.char.moveHorizontally(0);
        }

        // switch mode
        if(inputs.Switch){
            this.char.switchMode();
            inputs.Switch = false;
        }

        // actions
        if(!this.castingSpecial){
            if(inputs.Shot && this.char.time() > this.lastShotTime){
                this.char.actionDelegate();
                this.lastShotTime = this.char.time() + PLAYER_SHOOT_DELAY;
            }
            if(inputs.Special && this.char.currSpecial > 0){
                playAudio(this.char.scene, SFX.powereffect);
                this.special();
            }
        }
    }

    protected special(){
        this.char.specialPattern.updatePattern();
        InputHandler.Instance().inputs.Special = false;
        this.char.currSpecial--;
        this.char.updateSpecialCount();
    }
}