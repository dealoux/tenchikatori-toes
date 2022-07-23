import Phaser from "phaser";
import { IStateData } from "../../../../plugins/StateMachine";
import { UIBarComponent } from "../../Character";
import { Enemy, IEnemy } from "../Enemy";
import { EnemyState } from "./EnemyState";

export interface IEnemyStateData_Idle extends IStateData{
    maxIdleTime: number;
    attackRate: number;
}

export class EnemyState_Idle extends EnemyState{
    sData: IEnemyStateData_Idle;
    idleTime: number;

    constructor(char: Enemy, data: IEnemy, sData: IEnemyStateData_Idle){
        super(char, data, sData);
        this.sData = sData;
        this.idleTime = 0;
    }

    enter(){
        super.enter();

        this.idleTime = Phaser.Math.Between(1, this.sData.maxIdleTime);

        if(this.char.active)
            (this.char.components.findComponents(this.char, UIBarComponent) as UIBarComponent).display(this.char.hp, this.entData.hp);
    }

    update(time: number, delta: number){
        super.update(time, delta)

        if(this.char.time() >= this.enterTime + this.idleTime){
            this.changeState(this.char.nextStage(Math.random() > this.sData.attackRate));
        }
    }
}