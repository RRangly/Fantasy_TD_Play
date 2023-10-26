import { GetData } from "ReplicatedStorage/Data"
import { Mob } from "ReplicatedStorage/Mobs/MobMechanics"
import { Tower, findTarget } from "./TowerMechanics"

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
    update: (tower: Tower, deltaTime: number, mobs: Array<Mob>) => {
        const stat = MinigunInfo.stats[tower.level]
        if (mobs) {
            if (!(tower.preActionTime >= stat.preAction)) {
                tower.preActionTime += deltaTime
                return
            }
            else {
                tower.actionTime += deltaTime
                if (tower.actionTime >= stat.actionInterval) {
                    tower.actionTime = 0
                    const target = findTarget(mobs, tower.priority)
                    return {
                        mobIndex: target,
                        damage: stat.damage,
                    }
                }
            }
        }
        else {
            tower.actionTime = 0
            tower.preActionTime = 0
            return
        }
    },
}