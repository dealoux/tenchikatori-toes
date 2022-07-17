import Phaser from "phaser";
import { IState, StateMachine } from "../../../../@types/StateMachine";
import { IEnemyBoss, EnemyBoss } from "../bosses/EnemyBoss";
import { Enemy_State } from "./Enemy_State";

export interface IEnemyIdleStateData{
    maxRestTime: number;
}

export class Enemy_IdleState extends Enemy_State{
    sData: IEnemyIdleStateData;
    restTime: number;

    // constructor(char: Enemy, stateMachine: StateMachine, data: IEnemyBoss, sData: IEnemyIdleStateData){
    //     super(char, stateMachine, data);
    //     this.sData = sData;
    //     this.restTime = 0;
    // }

    constructor(char: EnemyBoss, data: IEnemyBoss, sData: IEnemyIdleStateData){
        super(char, data);
        this.sData = sData;
        this.restTime = 0;
    }


    enter(){
        super.enter();

        this.restTime = Phaser.Math.RND.between(1, this.sData.maxRestTime);

        if(this.char.stateSequence.length == 0){

        }
    }

    update(){
        super.update()

        if(this.char.time() >= this.enterTime + this.restTime){
            // this.char.stateMachine.changeState(char)
        }
    }
}