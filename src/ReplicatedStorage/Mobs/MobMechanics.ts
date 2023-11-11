import { ReplicatedStorage, Workspace } from "@rbxts/services"

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
    reachedEnd: boolean
    travelled: number
    constructor(mobInfo: MobInfo, waypoints: Vector3[]) {
        this.spawnTime = os.clock()
        this.travelled = 0
        const model = ReplicatedStorage.MobModels.WaitForChild(mobInfo.model) as Model
        this.model = model.Clone()
        this.model.Parent = Workspace.Mobs
        this.model.GetDescendants().forEach(part => {
            if (part.IsA("BasePart")) {
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
        this.reachedEnd = false
        task.spawn(() => {
            waypoints.forEach(waypoint => {
                i++
                hum.MoveTo(waypoint)
                hum.MoveToFinished.Wait()
            });
            this.reachedEnd = true
        })
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
    remove() {
        this.model.Destroy()
    }
}

export interface MobInfo {
    model: string
    maxHealth: number
    walkSpeed: number
}