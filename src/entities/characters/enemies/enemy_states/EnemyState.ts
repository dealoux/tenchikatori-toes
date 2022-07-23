import Phaser from "phaser";
import { IStateData, State } from "../../../../plugins/StateMachine";
import { Enemy, IEnemy } from "../Enemy";

export class EnemyState extends State{
    char: Enemy;

    constructor(char: Enemy, entData: IEnemy, sData: IStateData){
        super(char, entData, sData);
        this.char = char;
    }
}