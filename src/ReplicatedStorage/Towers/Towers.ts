import { MinigunInfo } from "./Minigunner";

//Interfaces for managing towers
interface towerLevel {
    readonly levelName: string
    readonly cost: number
    readonly damage?: number
    readonly preAction?: number
    readonly actionInterval?: number
    readonly range?: number
}

export interface AttackInfo {
    readonly mobIndex: number
    readonly dead: boolean
    readonly damage: number
}

export interface TowerInfo {
    readonly name: string
    readonly stats: Array<towerLevel>
    readonly placement: {
        area: number,
        type: string,
        height: number,
    }
    readonly update: (tower: Tower, deltaTime: number) => AttackInfo
}

export enum TowerPriority {
    First = 0,
    Strongest = 1,
    Weakest = 2,
}

//Base class for all towers
export class Tower {
    readonly userId: number
    readonly name: string
    readonly stats: Array<towerLevel>
    readonly placement: {
        area: number,
        type: string,
        height: number,
    }
    readonly _update: (tower: Tower, deltaTime: number) => AttackInfo
    level: number
    position: Vector3
    position2D: Vector2
    model: Model
    priority: TowerPriority
    constructor(userId: number, info: TowerInfo, position: Vector3, model: Model) {
        this.userId = userId
        this.name = info.name
        this.stats = info.stats
        this.placement = info.placement
        this._update = info.update
        this.level = 0
        this.position = position
        this.position2D = new Vector2(position.X, position.Z)
        this.model = model
        this.priority = TowerPriority.First
    }
    update(deltaTime: number) {
        return this._update(this, deltaTime)
    }
}

export const TowerList = new Array<TowerInfo>()
TowerList[0] = MinigunInfo