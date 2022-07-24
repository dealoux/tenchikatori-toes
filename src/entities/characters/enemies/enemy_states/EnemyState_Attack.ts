import Phaser from "phaser";
import { ICharacterStateData } from "../../Character";
import { IVectorPoint } from "../../../Entity";
import { PPattern } from "../../../projectiles/Projectile";
import { Enemy, IEnemy } from "../Enemy";
import { EnemyState } from "./EnemyState";
import { eventsCenter, GAMEPLAY_EVENTS } from "../../../../plugins/EventsCentre";
import { Player } from "../../player/Player";

export interface IEnemyStateData_Attack extends ICharacterStateData{
    neutral?: boolean,
}

export class EnemyState_Attack extends EnemyState{
    sData: IEnemyStateData_Attack;
    shootPoint: IVectorPoint;
    currAttack?: PPattern;
    player!: Player;

    constructor(char: Enemy, entData: IEnemy, sData: IEnemyStateData_Attack){
        super(char, entData, sData);
        this.sData = sData;

        this.shootPoint = { pos: new Phaser.Math.Vector2(0, 30), theta: 90 };

        if(!sData.neutral){
            eventsCenter.on(GAMEPLAY_EVENTS.retrievePlayer, (player: Player) => this.player = player);
            eventsCenter.emit(GAMEPLAY_EVENTS.requestPlayer);
        }   
    }

    enter(){
        super.enter();
        this.currAttack = this.randomAttack(this.char.attacks);
    }

    update(time: number, delta: number){
        super.update(time, delta);

        this.currAttack?.updatePattern(this.player);

        if(this.char.time() >= this.enterTime + this.currAttack?.patternData.duration!){
            this.changeState(this.char.idleState)
        }
    }

    protected randomAttack(map: Map<string, PPattern>){
        return map.get([...map.keys()][Math.floor(Math.random() * map.size)]);
    }
}