import type { Mob } from "ReplicatedStorage/Mobs/MobMechanics"
import { AttackInfo, Tower, TowerInfo, TowerPriority, findTarget, towerLevel } from "./TowerMechanics"

export const MinigunInfo = {
    name: "Minigunner",
    cost: 500,
    stats : [
        {
            levelName: "basic",
            preAction: 1,
            actionInterval: 0.2,
            range: 24,
            damage: 1,
            cost: 250,
        },
        {
            levelName: "better bullets",
            preAction: 1,
            actionInterval: 0.2,
            range: 26,
            damage: 2,
            cost: 500,
        },
        {
            levelName: "farther range",
            preAction: 2,
            actionInterval : 0.2,
            range : 30,
            damage : 1,
            cost : 800,
        },
        {
            levelName: "faster shooting",
            preAction: 1,
            actionInterval: 0.12,
            range: 35,
            damage: 5,
            cost: 1000,
        },
        {
            levelName: "superiority",
            preAction: 1,
            actionInterval: 0.1,
            range: 45,
            damage: 12,
            cost: 1500,
        },
    ],
    placement : {
        area: 1,
        type: "Plain",
        height: 3.01,
    },
    offensive: true,
    image: "NotReady",
}

export class Minigunner extends Tower {
    name: string
    image: string
    stats: Array<towerLevel>
    offensive: boolean
    level: number
    position: Vector3
    position2D: Vector2
    model: Model
    priority: TowerPriority
    preActionTime: number
    actionTime: number
    constructor(position: Vector3, model: Model) {
        super()
        const info = MinigunInfo
        this.name = info.name
        this.image = info.image
        this.stats = info.stats
        this.offensive = info.offensive
        this.level = 0
        this.position = position
        this.position2D = new Vector2(position.X, position.Z)
        this.model = model
        this.priority = TowerPriority.First
        this.preActionTime = 0
        this.actionTime = 0
        print("new")
    }
    actionUp(deltaTime: number, mobs: Array<Mob>): void | AttackInfo {
        const stat = MinigunInfo.stats[this.level]
        if (mobs) {
            if (this.preActionTime < stat.preAction) {
                this.preActionTime += deltaTime
                print("NotEnoughTime", this.preActionTime)
                return
            }
            else {
                print("DoingAttack")
                this.actionTime += deltaTime
                if (this.actionTime >= stat.actionInterval) {
                    this.actionTime = 0
                    const target = findTarget(mobs, this.priority)
                    return {
                        mobIndex: target,
                        damage: stat.damage,
                    }
                }
            }
        }
        else {
            print("NoMobs")
            this.actionTime = 0
            this.preActionTime = 0
            return
        }
    }
}