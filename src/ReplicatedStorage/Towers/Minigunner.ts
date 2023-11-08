import type { Mob } from "ReplicatedStorage/Mobs/MobMechanics"
import { AttackInfo, Tower, findTarget } from "./TowerMechanics"

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
    preActionTime: number
    actionTime: number
    constructor(position: Vector3, model: Model) {
        super(MinigunInfo, position, model)
        this.preActionTime = 0
        this.actionTime = 0
    }
    update(deltaTime: number, mobs: Array<Mob>): void | AttackInfo {
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