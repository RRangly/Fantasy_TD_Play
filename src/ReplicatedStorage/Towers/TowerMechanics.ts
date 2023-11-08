import type { Mob } from "ReplicatedStorage/Mobs/MobMechanics"

//Interfaces for managing towers
interface towerLevel {
    readonly levelName: string
    readonly cost: number
    readonly energyUse?: number
    readonly damage?: number
    readonly preAction?: number
    readonly actionInterval?: number
    readonly range?: number
}

export interface AttackInfo {
    readonly mobIndex: number
    readonly damage: number
}

export interface TowerInfo {
    readonly name: string
    readonly image: string
    readonly offensive: boolean
    readonly cost: number
    readonly stats: Array<towerLevel>
    readonly placement: {
        area: number,
        type: string,
        height: number,
    }
}

export interface TListItem {
    tInfo: TowerInfo
    tClass: new (position: Vector3, model: Model) => Tower
}

export enum TowerPriority {
    First = 0,
    Strongest = 1,
    Weakest = 2,
}

//Base class for all towers
export abstract class Tower {
    name: string
    image: string
    stats: Array<towerLevel>
    offensive: boolean
    readonly towerInfo: TowerInfo
    readonly position: Vector3
    readonly position2D: Vector2
    readonly model: Model
    abstract update(deltaTime: number, mobs: Array<Mob>): AttackInfo | void
    priority: TowerPriority
    level: number
    constructor(info: TowerInfo, position: Vector3, model: Model) {
        this.name = info.name
        this.image = info.image
        this.stats = info.stats
        this.offensive = info.offensive
        this.towerInfo = info
        this.level = 0
        this.position = position
        this.position2D = new Vector2(position.X, position.Z)
        this.model = model
        this.priority = TowerPriority.First
    }
}

export function findTarget(mobs: Array<Mob>, priority: TowerPriority) {
    const mobsize = mobs.size()
    let target: number
    let targetNum: number
    if (priority === TowerPriority.First) {
        targetNum = 0
        for(let i = 0; i < mobsize; i++) {
            if(mobs[i].travelled > targetNum) {
                targetNum = mobs[i].travelled
                target = i
            }
        }
    }
    else if (priority === TowerPriority.Strongest) {
        targetNum = 0
        for(let i = 0; i < mobsize; i++) {
            if(mobs[i].maxHealth > targetNum) {
                targetNum = mobs[i].maxHealth
                target = i
            }
        }
    }
    else if (priority === TowerPriority.Weakest) {
        targetNum = mobs[0].maxHealth
        for(let i = 0; i < mobsize; i++) {
            if(mobs[i].maxHealth < targetNum) {
                targetNum = mobs[i].maxHealth
                target = i
            }
        }
    }
    return target!
}