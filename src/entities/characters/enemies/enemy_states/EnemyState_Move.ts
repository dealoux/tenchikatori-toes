import Phaser from "phaser";
import { IStateData } from "../../../../plugins/StateMachine";
import { IVectorPoint } from "../../../Entity";
import { Enemy, IEnemy } from "../Enemy";
import { EnemyState } from "./EnemyState";

export interface IEnemyStateData_Move extends IStateData{
    locations: Array<IVectorPoint>,
    duration: number,
}

export class EnemyState_Move extends EnemyState{
    sData: IEnemyStateData_Move;
    currIndex: number

    constructor(char: Enemy, entData: IEnemy, sData: IEnemyStateData_Move){
        super(char, entData, sData);
        this.sData = sData;
        this.currIndex = 0;
    }

    enter(){
        super.enter();
        this.moveTo(this.getNextPos(), this.nextState.bind(this));
    }

    update(time: number, delta: number){
        super.update(time, delta);
    }

    protected getNextPos() : IVectorPoint{
        let index = Phaser.Math.Between(0, this.sData.locations.length-1);
        while(index == this.currIndex){
            index = Phaser.Math.Between(0, this.sData.locations.length-1);
        }

        this.currIndex = index;
        return this.sData.locations[this.currIndex];
    }

    protected nextState(){
        this.changeState(this.char.idleState);
    }
    
    protected async moveTo(point: IVectorPoint, completeFunc: Function){
        // let distance = point.pos.distance(new Phaser.Math.Vector2(this.char.x, this.char.y));
        // const duration = (distance / this.entData.speed!) * 1000;
        const { duration } = this.sData;

        // console.log(duration);

        return this.char.scene.tweens.add({
            targets: this.char,
            x: point.pos.x,
            y: point.pos.y,
            duration: duration,
            ease: 'Sine.easeInOut',
            onComplete: completeFunc(),
        });

        // this.char.scene.physics.moveTo(this.char, point.pos.x, point.pos.y, this.entData.speed, duration);
        // completeFunc();
    }
}