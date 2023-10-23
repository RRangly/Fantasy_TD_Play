//Manages Mobs
import { ReplicatedStorage, Workspace } from "@rbxts/services"
import { GetData } from "../../ReplicatedStorage/Data"

//Data Types sent between functions
export interface MobInfo {
    model: string
    maxHealth: number
    walkSpeed: number
}

interface DamageInfo {
    damage: number
    dead: boolean
}

export interface AttackInfo {
    mobIndex: number
    damage: number
    dead: boolean
}

//Mob Instance
export class Mob {
    readonly model: Model
    readonly walkSpeed: number
    readonly maxHealth: number
    readonly humanoid: Humanoid
    readonly spawnTime: number
    health: number
    waypoint: number
    position: Vector3
    position2D: Vector2
    frozen: boolean
    travelled: number
    constructor(mobInfo: MobInfo, waypoints: Vector3[]) {
        this.spawnTime = os.clock()
        this.travelled = 0
        const model = ReplicatedStorage.MobModels.WaitForChild(mobInfo.model) as Model
        this.model = model.Clone()
        this.model.Parent = Workspace.Mobs
        this.model.GetDescendants().forEach(part => {
            if (part.IsA("BasePart")) {
                //part.Anchored = true
                part.CollisionGroup = "Mobs"
                part.CanCollide = true
                part.SetNetworkOwner(undefined)
            }
        });
        const hum = this.model.WaitForChild("Humanoid") as Humanoid
        this.humanoid = hum
        this.model.MoveTo(waypoints[0])
        this.walkSpeed = mobInfo.walkSpeed
        this.maxHealth = mobInfo.maxHealth
        this.health = mobInfo.maxHealth
        this.waypoint = 0
        this.frozen = false
        this.position = waypoints[0]
        this.position2D = new Vector2(waypoints[0].X, waypoints[0].Z)
        let i = 0;
        hum.WalkSpeed = this.walkSpeed
        waypoints.forEach(waypoint => {
            i++
            hum.MoveTo(waypoint)
            hum.MoveToFinished.Wait()
        });
    }
    takeDamage(damage: number) {
        const preHealth = this.health
        this.health -= damage
        if (this.health <= 0) {
            this.health = 0
            const attack = {damage: preHealth, dead: true}
            return attack
        }
        else {
            const attack = {damage: damage, dead: false}
            return attack
        }
    }
    freeze(length: number) {
        task.spawn(() => {
            if (this.frozen === false) {
                const ice = this.model?.FindFirstChild("Ice")
                if (ice?.IsA("BasePart")) {
                    this.frozen = true
                    ice.Transparency = 0.4
                    task.wait(length)
                    ice.Transparency = 1
                    this.frozen = false
                }
            }
        })
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
                task.spawn(() => {
                    const mob = new Mob(mobInfo, waypoints)
                    mob.position = waypoints[0]
                    this.mobs.push(mob)
                })
                task.wait(0.2)
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