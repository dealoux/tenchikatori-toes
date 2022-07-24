import Phaser from 'phaser';
import { PoolGroup } from '../../../plugins/Pool';
import { Character } from '../../characters/Character';
import { Entity, IVectorPoint } from '../../Entity';
import { IPPatternData, PPattern } from '../Projectile';

export interface ISplitPatternData extends IPPatternData{
    splitDrag: number,
}

export class PPatternSplit extends PPattern{
    patternData: ISplitPatternData;

    constructor(parent: Character, pPoint: IVectorPoint, p: PoolGroup | undefined, pData: ISplitPatternData){
        super(parent, pPoint, p, pData);
        this.patternData = pData;
        this.updatePattern = this.splitBase;
    }

    splitBase(target?: Entity){
        if(this.parent.time() < this.nextFire) { return; }
        const x = this.parent.x + this.pPoint.pos.x;
        const y = this.parent.y + this.pPoint.pos.y;
        this.projectile?.getFirstDead(false).updateProjectileE({ x: x, y: y, speed : this.patternData.pSpeed, angle: this.pPoint.theta, gx: -this.patternData.splitDrag, target });
        this.projectile?.getFirstDead(false).updateProjectileE({ x: x, y: y, speed : this.patternData.pSpeed, angle: this.pPoint.theta, target });
        this.projectile?.getFirstDead(false).updateProjectileE({ x: x, y: y, speed : this.patternData.pSpeed, angle: this.pPoint.theta, gx: this.patternData.splitDrag, target });
        this.nextFire = this.parent.time() + this.patternData.fireRate;
    }
}