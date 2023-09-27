//Manages Mobs
import { ReplicatedStorage } from "@rbxts/services"
import { GetData } from "./Data"

//Data Types sent between functions
interface MobInfo {
    model: string
    maxHealth: number
    walkspeed: number
}
interface DamageInfo {
    dealt: number
    dead: boolean
}

//Mob Instance
class Mob {
    readonly model?: Model
    readonly walkSpeed: number
    readonly maxHealth: number
    health: number
    waypoint: number
    position?: Vector3
    frozen: boolean
    constructor(mobInfo: MobInfo) {
        const model = ReplicatedStorage.WaitForChild(mobInfo.model)
        if (model.IsA("Model")) {
            this.model = model
        }
        this.walkSpeed = mobInfo.walkspeed
        this.maxHealth = mobInfo.maxHealth
        this.health = mobInfo.maxHealth
        this.waypoint = 1
        this.frozen = false
    }
    takeDamage(damage: number) {
        const preHealth = this.health
        this.health -= damage
        if (this.health <= 0) {
            this.health = 0
            const attack = {dealt: preHealth, dead: true}
            return attack
        }
        else {
            const attack = {dealt: damage, dead: false}
            return attack
        }
    }
}

//Manages Mobs as a whole, helps access the Mob Instance
export class MobManager {
    readonly userId: number
    mobs: Array<Mob>
    constructor(userId: number) {
        this.userId = userId
        this.mobs = new Array<Mob>()
    }
    //Mob Stat Generation Functions
    generateDefaultMob(weight: number){
        const mob = {
            model: "Zombie",
            maxHealth: weight * 2,
            walkSpeed: math.floor((math.log(weight, 1.095) + 5)^(1/7)*6),
        }
        return mob
    }
    generateSpeedMob(weight: number) {
        const mob = {
            model: "Speedy",
            maxHealth: math.ceil(weight * 1.5),
            walkSpeed: math.floor((math.log(weight, 1.095) + 5)^(1/3)*8),
        }
        return mob
    }
    generateTankMob(weight: number) {
        const mob = {
            model: "Stone_Zombie",
            maxHealth: math.ceil(weight * 4.5),
            walkSpeed: math.floor((math.log(weight, 1.095) + 5)^(1/8)*4),
        }
        return mob
    } 
    generateSpecialMob(weight: number) {
        const mob = {
            model: "Zombie",
            maxHealth: math.ceil(weight * 2.5),
            walkSpeed: math.floor((math.log(weight, 1.095) + 5)^(1/7)*6),
        }
        return mob
    }
    //Spawns a Wave
    spawnWave(spawnList: Array<MobInfo>) {
        const waypoints = GetData(this.userId)?.mapManager.waypoints
        for (let i = 0; i < spawnList.size(); i++) {
            const mobInfo = spawnList[i]
            const mob = new Mob(mobInfo)
            mob.position = waypoints?.[0]
            this.mobs.push(mob)
            task.wait(0.2)
        }
    }
    takeDamage(mobIndex: number, damage: number) {
        const coinManager = GetData(this.userId)?.coinManager
        const info = (this.mobs[mobIndex].takeDamage(damage))
        coinManager?.changeCoins(info.dealt)
        if (info.dead) {
            this.mobs.remove(mobIndex)
        }
    }
}