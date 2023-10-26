import { GetData } from "ReplicatedStorage/Data"
import { Tower } from "./TowerMechanics"

export const MinigunInfo = {
    name: "minigunner",
    cost: 10,
    stats : [
        {
            preAction: 2,
            actionInterval: 0.2,
            range: 24,
            damage: 1,
        },
        {
            preAction: 2,
            actionInterval: 0.16,
            range: 26,
            damage: 2,
        },
        {
            preAction: 1,
            actionInterval : 0.14,
            range : 30,
            damage : 3,
        },
        {
            preAction: 1,
            actionInterval: 0.12,
            range: 35,
            damage: 5,
            cost: 1000,
        },
    ],
    placement : {
        area: 1,
        type: "plain",
        height: 3.01,
    },
    update: (tower: Tower, deltaTime: number) => {
        return {
            mobIndex: 1,
            dead: false,
            damage: 1,
        }
    }
}