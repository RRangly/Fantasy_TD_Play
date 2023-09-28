import { GetData } from "ReplicatedStorage/Data"
import { Tower, TowerInfo } from "./Tower"

export const MinigunInfo = {
    name: "minigunner",
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
        type: "plain",
        height: 3.01,
    },
}

export class Minigunner extends Tower {
    constructor(info: TowerInfo, position: Vector3, model: Model) {
        super(info, position, model)
    }
    update() {

    }
}