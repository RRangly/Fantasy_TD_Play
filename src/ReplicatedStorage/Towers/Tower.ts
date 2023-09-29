import { Minigunner } from "./Minigunner"

//Interfaces for managing towers
interface towerLevel {
    readonly levelName: string
    readonly cost: number
    readonly damage?: number
    readonly preAction?: number
    readonly actionInterval?: number
    readonly range?: number
}

export interface TowerInfo {
    readonly name: string
    readonly stats: Array<towerLevel>
    readonly placement: {
        area: number,
        type: string,
        height: number,
    }
}

export interface TowerCard {
    class: typeof Tower
    info: TowerInfo
}

export enum TowerPriority {
    First = 0,
    Strongest = 1,
    Weakest = 2,
}

//Base class for all towers
export class Tower {
    readonly name: string
    readonly stats: Array<towerLevel>
    readonly placement: {
        area: number,
        type: string,
        height: number,
    }
    level: number
    position: Vector3
    model: Model
    priority: TowerPriority
    constructor(info: TowerInfo, position: Vector3, model: Model) {
        this.name = info.name
        this.stats = info.stats
        this.placement = info.placement
        this.level = 0
        this.position = position
        this.model = model
        this.priority = TowerPriority.First
    }
}