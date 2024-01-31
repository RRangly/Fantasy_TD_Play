import type { Mob } from "ReplicatedStorage/Mobs/MobMechanics"
import { AttackInfo, AttackInstance, Tower, TowerInfo, TowerPriority, findTarget, towerLevel } from "./TowerMechanics"

export const MinigunInfo = {
    name: "Minigunner",
    cost: 500,
    stats : [
        {
            levelName: "basic",
            preAction: 1,
            actionInterval: 0.1,
            range: 24,
            damage: 5,
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
//The class itself
class Minigunner extends Tower {
    index = 1
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
    }
    actionUp(deltaTime: number, mobs: Array<Mob>): void | AttackInstance {
        const stat = MinigunInfo.stats[this.level]
        if (mobs) {
            if (this.preActionTime < stat.preAction) {
                this.preActionTime += deltaTime
                return
            }
            else {
                this.actionTime += deltaTime
                if (this.actionTime >= stat.actionInterval) {
                    this.actionTime -= stat.actionInterval
                    const target = findTarget(mobs, this.priority)
                    return {
                        attInf: {
                            mobIndex: target,
                            damage: stat.damage,
                        },
                        playSound: "MinigunShot",
                        energy: -2,
                    }
                }
            }
        }
        else {
            this.actionTime = 0
            this.preActionTime = 0
            return
        }
    }
}

//Factory function
export function newMinigunner(position: Vector3, model: Model) {
    return new Minigunner(position, model)
}