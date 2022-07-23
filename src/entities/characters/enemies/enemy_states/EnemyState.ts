import Phaser from "phaser";
import { CharacterState, ICharacterStateData } from "../../Character";
import { Enemy, IEnemy } from "../Enemy";

export class EnemyState extends CharacterState{
    char: Enemy;

    constructor(char: Enemy, entData: IEnemy, sData: ICharacterStateData){
        super(char, entData, sData);
        this.char = char;
    }
}