//Manages Mobs
import { Mob, MobInfo } from "ReplicatedStorage/Mobs/MobMechanics"
import { GetData, SetData } from "../../ReplicatedStorage/Data"
import { AttackInfo } from "ReplicatedStorage/Towers/TowerMechanics"
import { Print } from "@rbxts/knit/Knit/Util/TableUtil"
import { CoinManager } from "./CoinManager"

//Manages Mobs as a whole, helps access the Mob Instance
export class MobManager {
    readonly userId: number
    mobs: Array<Mob>
    constructor(userId: number) {
        this.userId = userId
        this.mobs = new Array<Mob>()
    }
    //Mob Stat Generation Functions
    generateMob(mobType:number, weight: number, round: number) {
        let mob: MobInfo
        if (mobType === 0) {
            mob = {
                model: "Zombie",
                maxHealth: math.ceil(weight * 2),
                walkSpeed: math.floor(math.pow(1.1, (round/5))*12),
            }
        }
        else if (mobType === 1) {
            mob = {
                model: "Speedy",
                maxHealth: math.ceil(weight * 1.5),
                walkSpeed: math.floor(math.pow(1.13, (round/5))*18),
            }
        }
        else if (mobType === 2) {
            mob = {
                model: "Stone_Zombie",
                maxHealth: math.ceil(weight * 4.5),
                walkSpeed: math.floor(math.pow(1.09, (round/5))*8),
            }
        }
        else {
            mob = {
                model: "Zombie",
                maxHealth: math.ceil(weight * 2.5),
                walkSpeed: math.floor(math.pow(1.1, (round/5))*12),
            }
        }
        return mob
    }
    //Spawns a Wave
    spawnWave(spawnList: Array<MobInfo>) {
        const waypoints = GetData(this.userId)?.mapManager.waypoints
        if (waypoints) {
            for (let i = 0; i < spawnList.size(); i++) {
                const mobInfo = spawnList[i]
                const mob = new Mob(mobInfo, waypoints)
                this.mobs.push(mob)
                task.wait(0.2)
            }
        }
    }
    processUpdate(attacks: Array<AttackInfo>, coinManager: CoinManager) {
        let money = 0
        for (let i = 0; i < attacks.size(); i++) {
            this.mobs[attacks[i].mobIndex].health -= attacks[i].damage
            if (!(this.mobs[attacks[i].mobIndex].health < 0)) {
                money += attacks[i].damage
            }
        }
        coinManager.changeCoins(money)
        let returnVal = new Array<number>()
        for (let i = this.mobs.size() - 1; i >= 0; i--) {
            const mob = this.mobs[i]
            if (mob.reachedEnd) {
                returnVal.push(mob.health)
                mob.health = 0
            }
            if (mob.health <= 0) {
                mob.remove()
                this.mobs.remove(i)
            }
        }
        return returnVal
    }
    //Functions that access the Mob Instance
    takeDamage(mobIndex: number, damage: number) {
        const coinManager = GetData(this.userId)?.coinManager
        const info = (this.mobs[mobIndex].takeDamage(damage))
        coinManager?.changeCoins(info.damage)
        if (info.dead) {
            this.mobs.remove(mobIndex)
        }
        return {
            mobIndex: mobIndex,
            damage: info.damage,
            dead: info.dead
        }
    }
    freeze(mobIndex: number, length: number) {
        this.mobs[mobIndex].freeze(length)
    }
    //calculate Mob's movement
    movement(mobIndex: number, deltaTime: number) {
        const waypoints = GetData(this.userId)?.mapManager.waypoints
        if (waypoints) {
            const mob = this.mobs[mobIndex]
            let distance = (mob.walkSpeed * deltaTime)
            let position = mob.position
            let dest = mob.waypoint
            while (distance > 0) {
                const waypoint = waypoints[dest]
                const nextWp = waypoints[dest + 1]
                if (!nextWp) {
                    position = waypoint
                    distance = 0
                    break
                }
                const wpDistance = nextWp.sub(position).Magnitude
                if (wpDistance > distance) {
                    position = nextWp.sub(position).Unit.mul(distance)
                    distance = 0
                }
                else {
                    dest += 1
                    position = nextWp
                    distance -= wpDistance
                }
            }
            mob.model?.MoveTo(position)
            mob.position = position
            mob.position2D = new Vector2(position.X, position.Z)
            mob.waypoint = dest
        }
    }
}
