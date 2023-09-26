import { ReplicatedStorage } from "@rbxts/services"
import { GetData } from "./Data"
interface MobInfo {
    model: string
    maxHealth: number
    walkspeed: number
}

class Mob {
    readonly model?: Model
    readonly walkSpeed: number
    readonly maxHealth: number
    health: number
    waypoint: number
    position: Vector3
    frozen: boolean
    constructor(mobInfo: MobInfo, waypoints: Array<Vector3>) {
        const model = ReplicatedStorage.WaitForChild(mobInfo.model)
        if (model.IsA("Model")) {
            this.model = model
        }
        this.walkSpeed = mobInfo.walkspeed
        this.maxHealth = mobInfo.maxHealth
        this.health = mobInfo.maxHealth
        this.waypoint = 1
        this.position = waypoints[1]
        this.frozen = false
    }
}

export class MobManager {
    readonly userId: number
    constructor(userId: number) {
        this.userId = userId
    }
}