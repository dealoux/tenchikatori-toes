import Phaser from "phaser";
import eventsCenter from '../../../plugins/EventsCentre';
import { IStateData, State } from "../../../@types/StateMachine";
import { IPlayer, Player } from "./Player";
import { InputHandler, INPUT_EVENTS } from "../../../plugins/InputHandler";
import { IFunctionDelegate } from "../../Entity";
import { PLAYER_SHOOT_DELAY, SHOOTPOINTS_FOCUSED, SHOOTPOINTS_NORMAL } from "../../projectiles/Projectile_Player";

interface PlayerStateData extends IStateData{}
const PLAYER_STATE_DATA = {};

export class PlayerState extends State{
    char: Player;
    entData: IPlayer;

    constructor(char: Player, entData: IPlayer){
        super(char, entData, PLAYER_STATE_DATA);
        this.char = char;
        this.entData = entData;
    }

    enter(): void {
        super.enter();
    }

    exit(): void {
        super.exit();
    }

    update(): void {
        super.update();
    }
}

export class PlayerState_Idle extends PlayerState{
    constructor(char: Player, entData: IPlayer){
        super(char, entData);
    }

    enter(): void {
        super.enter();
    }

    exit(): void {
        super.exit();
    }

    update(): void {
        super.update();

        const {inputs} = InputHandler.Instance();

        if(inputs.Switch){
            this.char.switchMode();
            inputs.Switch = false;
            this.changeState(this.char.interactiveState);
        }
    }
}


export class PlayerState_Interactive extends PlayerState{
    actionDelegate : IFunctionDelegate;
    speed: number;

    lastShotTime: number;
    
    specials: number;
    castingSpecial: boolean;


    constructor(char: Player, entData: IPlayer){
        super(char, entData);

        this.actionDelegate = this.shoot;
        this.speed = entData.speed!;

        this.specials = 3;
        this.castingSpecial = false;

        this.speed = this.entData.speed!;
        this.lastShotTime = 0;
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

    update(): void {
        super.update();
        this.inputHandling();
    }

    private focusedMode(){
        this.speed = this.entData.speedFocused;
        this.char.currShootPoints = SHOOTPOINTS_FOCUSED;
        this.char.hitbox.setVisible(true);
    }

    private normalMode(){
        this.speed = this.entData.speed!;
        this.char.currShootPoints = SHOOTPOINTS_NORMAL;
        this.char.hitbox.setVisible(false);
    }

    private inputHandling(){
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
            this.changeState(this.char.idleState);
        }

        // actions
        if(!this.castingSpecial){
            if(inputs.Shot && this.char.time() > this.lastShotTime){
                this.shoot();
            }
            if(inputs.Special && this.specials > 0){
                this.special();
            }
        }
    }

    private shoot(){
        for(let i = 0; i< Phaser.Math.FloorTo(this.char.currPower); i++){
            this.char.shots[i](this.char);
        }

        this.lastShotTime = this.char.time() + PLAYER_SHOOT_DELAY;
    }

    private special(){
        this.char.specialPattern.updatePattern();
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
}