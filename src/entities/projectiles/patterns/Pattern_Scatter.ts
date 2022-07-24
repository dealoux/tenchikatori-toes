import Phaser from 'phaser';
import { PoolGroup } from '../../../plugins/Pool';
import { Character } from '../../characters/Character';
import { Entity, IVectorPoint } from '../../Entity';
import { IPPatternData, PPattern } from '../Projectile';

export interface IScatterPatternData extends IPPatternData{
    scatterDistance: Phaser.Types.Math.Vector2Like,
}

export class PPatternScatter extends PPattern{
    patternData: IScatterPatternData;

    constructor(parent: Character, pPoint: IVectorPoint, p: PoolGroup | undefined, pData: IScatterPatternData){
        super(parent, pPoint, p, pData);
        this.patternData = pData;
        this.updatePattern = this.scatterBase;
    }

    scatterBase(target?: Entity){
        if(this.parent.time() < this.nextFire) { return; }
        const x = this.parent.x + this.pPoint.pos.x + Phaser.Math.Between(-this.patternData.scatterDistance.x!, this.patternData.scatterDistance.x!);
        const y = this.parent.y + this.pPoint.pos.y + Phaser.Math.Between(-this.patternData.scatterDistance.y!, this.patternData.scatterDistance.y!);
        this.projectile?.getFirstDead(false).updateProjectileE({ x: x, y: y, speed : this.patternData.pSpeed, angle: this.pPoint.theta, target });
        this.nextFire = this.parent.time() + this.patternData.fireRate;
    }
}