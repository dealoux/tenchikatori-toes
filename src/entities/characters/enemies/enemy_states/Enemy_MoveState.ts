import Phaser from "phaser";
import { IState, StateMachine } from "../../../../@types/StateMachine";
import { IEnemyBoss, EnemyBoss } from "../bosses/EnemyBoss";
import { Enemy_State } from "./Enemy_State";

export interface IEnemyMoveStateData{

}

export class Enemy_MoveState extends Enemy_State{
    sData: IEnemyMoveStateData;

    // constructor(char: Enemy, stateMachine: StateMachine, entData: IEnemyBoss, sData: IEnemyMoveStateData){
    //     super(char, stateMachine, entData);
    //     this.sData = sData;
    // }

    constructor(char: EnemyBoss, entData: IEnemyBoss, sData: IEnemyMoveStateData){
        super(char, entData);
        this.sData = sData;
    }

    enter(){
        super.enter();

    }

    update(){
        super.update()
    }
}