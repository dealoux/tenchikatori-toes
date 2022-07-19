import Phaser from "phaser";
import { IStateData, State } from "../../../../@types/StateMachine";
import { Enemy, IEnemy } from "../Enemy";

export abstract class EnemyState extends State{
    char: Enemy;

    constructor(char: Enemy, entData: IEnemy, sData: IStateData){
        super(char, entData, sData);
        this.char = char;
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