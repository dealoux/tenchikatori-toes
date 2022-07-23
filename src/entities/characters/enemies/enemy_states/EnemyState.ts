import Phaser from "phaser";
import { IStateData, CharacterState } from "../../../../plugins/StateMachine";
import { Enemy, IEnemy } from "../Enemy";

export class EnemyState extends CharacterState{
    char: Enemy;

    constructor(char: Enemy, entData: IEnemy, sData: IStateData){
        super(char, entData, sData);
        this.char = char;
    }
}