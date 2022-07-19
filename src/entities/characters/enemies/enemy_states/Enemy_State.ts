import Phaser from "phaser";
import { IState, StateMachine } from "../../../../@types/StateMachine";
import { Enemy, IEnemy } from "../Enemy";

export interface IStateData{
    animKey?: string,
}

export abstract class Enemy_State implements IState{
    char: Enemy;
    // stateMachine: StateMachine;
    entData: IEnemy;
    enterTime: number;
    sData: IStateData;

    // constructor(char: Enemy, stateMachine: StateMachine, entData: IEnemyBoss){
    //     this.char = char;
    //     this.stateMachine = stateMachine;
    //     this.entData = entData;
    //     this.enterTime = 0;
    // }

    constructor(char: Enemy, entData: IEnemy, sData: IStateData){
        this.char = char;
        this.entData = entData;
        this.enterTime = 0;
        this.sData = sData;
    }

    enter(): void {
        this.enterTime = this.char.time();
        this.char.anims.play(this.sData.animKey || '');
    }

    exit(): void {
        
    }

    update(): void {
        
    }

    protected changeState(nextState: IState, savePrevious = false){
        this.char.stateMachine.changeState(nextState, savePrevious);
    }
}