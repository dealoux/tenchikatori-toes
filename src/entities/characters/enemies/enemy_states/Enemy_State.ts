import Phaser from "phaser";
import { IState, StateMachine } from "../../../../@types/StateMachine";
import { IEnemyBoss, EnemyBoss } from "../bosses/EnemyBoss";

export abstract class Enemy_State implements IState{
    char: EnemyBoss;
    // stateMachine: StateMachine;
    entData: IEnemyBoss;
    enterTime: number;

    // constructor(char: Enemy, stateMachine: StateMachine, entData: IEnemyBoss){
    //     this.char = char;
    //     this.stateMachine = stateMachine;
    //     this.entData = entData;
    //     this.enterTime = 0;
    // }

    constructor(char: EnemyBoss, entData: IEnemyBoss){
        this.char = char;
        this.entData = entData;
        this.enterTime = 0;
    }

    enter(): void {
        this.enterTime = this.char.time();
    }

    exit(): void {
        
    }

    update(): void {
        
    }
}