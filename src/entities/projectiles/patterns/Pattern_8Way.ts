import Phaser from 'phaser';
import { PoolGroup } from '../../../plugins/Pool';
import { Character } from '../../characters/Character';
import { Entity, IVectorPoint } from '../../Entity';
import { IPPatternData, PPattern } from '../Projectile';

export interface I8WayPatternData extends IPPatternData{
    
}

export class PPattern8Way extends PPattern{
    patternData: I8WayPatternData;

    constructor(parent: Character, pPoint: IVectorPoint, p: PoolGroup | undefined, pData: I8WayPatternData){
        super(parent, pPoint, p, pData);
        this.patternData = pData;
        this.updatePattern = this.scaleBase;
    }

    scaleBase(target?: Entity){
        if(this.parent.time() < this.nextFire) { return; }
        const x = this.parent.x + this.pPoint.pos.x;
        const y = this.parent.y + this.pPoint.pos.y;

        let angle = 0;
        for(let i=0; i < 8; i++){
            this.projectile?.getFirstDead(false).updateProjectileE({ x: x, y: y, speed : this.patternData.pSpeed, angle: angle, target });
            angle += 45;
        }

        this.nextFire = this.parent.time() + this.patternData.fireRate;
    }
}