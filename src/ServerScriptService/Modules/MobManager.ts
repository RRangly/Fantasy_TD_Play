//Manages Mobs
import { Mob, MobInfo } from "ReplicatedStorage/Mobs/MobMechanics"
import { GetData, SetData } from "../../ReplicatedStorage/Data"
import { AttackInfo } from "ReplicatedStorage/Towers/TowerMechanics"

//Manages Mobs as a whole, helps access the Mob Instance
export class MobManager {
    readonly userId: number
    mobs: Array<Mob>
    constructor(userId: number) {
        this.userId = userId
        this.mobs = new Array<Mob>()
    }
    readonly generationFunctions = [ (weight: number) => this.generateDefaultMob(weight), (weight: number) => this.generateSpeedMob(weight), (weight: number) => this.generateTankMob(weight), (weight: number) => this.generateSpecialMob(weight), ]
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
        if (waypoints) {
            for (let i = 0; i < spawnList.size(); i++) {
                const mobInfo = spawnList[i]
                const mob = new Mob(mobInfo, waypoints)
                this.mobs.push(mob)
                task.wait(0.2)
            }
        }
    }
    processUpdate(attacks: Array<AttackInfo>) {
        for (let i = 0; i < attacks.size(); i++) {
            this.mobs[attacks[i].mobIndex].health -= attacks[i].damage
            //print("MobAttacked", this.mobs[attacks[i].mobIndex], attacks[i].damage)
        }
        for (let i = this.mobs.size() - 1; i >= 0; i--) {
            if (this.mobs[i].health <= 0) {
                this.mobs[i].remove()
                this.mobs.remove(i)
            }
        }
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
