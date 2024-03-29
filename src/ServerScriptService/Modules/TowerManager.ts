import { ReplicatedStorage, Workspace } from "@rbxts/services"
import { GetData } from "ReplicatedStorage/Data"
import { Mob } from "ReplicatedStorage/Mobs/MobMechanics"
import { TListItem, Tower, TowerPriority } from "ReplicatedStorage/Towers/TowerMechanics"
import { TowerList } from "ReplicatedStorage/Towers/Towers"
import { saveTowerManager } from "ServerScriptService/DataSaveStructure"

export class TowerManager {
    readonly userId: number
    readonly towerLimit: number
    energy: number
    towers: Array<Tower>
    cards: Array<TListItem>
    attList: Array<Array<Mob>>
    attNumList: Array<Array<number>>
    constructor(userId: number, saveData: saveTowerManager) {
        this.userId = userId
        this.towerLimit = 20
        this.energy = 50
        this.towers = new Array<Tower>
        this.cards = new Array<TListItem>
        const selected = saveData.selected
        for (let i = 0; i < selected.size(); i++) {
            this.cards.push(TowerList[selected[i]])
        }
        this.attList = new Array<Array<Mob>>()
        this.attNumList = new Array<Array<number>>()
    }
    //checks if Placement is valid
    checkPlacement(towerType: string, position: Vector3) {
        const start = new Vector3(position.X, position.Y + 1, position.Z)
        let rayCastParam = new RaycastParams()
        rayCastParam.CollisionGroup = "Towers"
        const ray = Workspace.Raycast(start, new Vector3(0, -10, 0), rayCastParam)
        if (ray && ray.Instance.GetAttribute("Placement") === towerType) {
            return true
        }
        return false
    }
    //Places Tower
    place(cardIndex: number, position: Vector3) {
        const card = this.cards[cardIndex]
        if (this.checkPlacement(card.tInfo.placement.type, position) && this.towers.size() < this.towerLimit) {
            const clone = ReplicatedStorage.TowerModels.FindFirstChild(card.tInfo.name)!.Clone() as Model
            clone.GetDescendants().forEach(part => {
                if (part.IsA("BasePart")) {
                    part.Anchored = true
                    part.CanCollide = true
                    part.CanTouch = false
                    part.CanQuery = false
                    part.CollisionGroup = "Towers"
                }
            });
            clone.Parent = Workspace
            const place = new Vector3(position.X, position.Y + card.tInfo.placement.height, position.Z)
            clone.PivotTo(new CFrame(place))
            this.towers.push(card.tClass(place, clone))
            //delete this.cards[cardIndex]
            return true
        }
        return false
    }
    //manages different types of actions
    manage(manageType: string, towerIndex: number) {
        const coinManager = GetData(this.userId)?.coinManager
        const tower = this.towers[towerIndex]

        if (tower && coinManager) {
            if (manageType === "Sell") {
                tower.model.Destroy()
                coinManager.changeCoins(tower.stats[0].cost)
                delete this.towers[towerIndex]
                return true
            }
            else if (manageType === "Upgrade" && coinManager.coin >= tower.stats[tower.level + 1].cost) {
                coinManager.changeCoins(-tower.stats[tower.level + 1].cost)
                tower.level += 1
                return true
            }
            else if (manageType === "Priority") {
                tower.priority += 1
                return true
            }
        }
        return false
    }
    //checks if attack is available, and if so returns target
    attackavailable(towerIndex: number, priority: TowerPriority) {
        const data = GetData(this.userId)
        const mobs = data?.mobManager.mobs
        const waypoints = data?.mapManager.waypoints
        const tower = this.towers[towerIndex]
        const towerVector = tower.position2D
        const range = tower.stats[tower.level].range
        if (mobs && range && waypoints) {
            let target: Mob | undefined
            if (priority === TowerPriority.First) {
                let firstWayPoint = 0
                let firstDistance = 0
                mobs.forEach((mob: Mob) => {
                    const mobVector = mob.position2D
                    const mobDistance = mobVector.sub(towerVector).Magnitude
                    if (mobDistance < range) {
                        if (mob.waypoint >= firstWayPoint) {
                            const waypoint = waypoints[mob.waypoint]
                            const waypointVector = new Vector2(waypoint.X, waypoint.Z)
                            const waypointDistance = waypointVector.sub(mobVector).Magnitude
                            if (mob.waypoint > firstWayPoint && waypointDistance >= firstDistance) {
                                target = mob
                                firstDistance = waypointDistance
                                firstWayPoint = mob.waypoint
                            }
                        }
                    }
                })
            }
            else if (priority === TowerPriority.Strongest) {
                let highestHealth = 0
                mobs.forEach((mob: Mob) => {
                    const mobVector = mob.position2D
                    const mobDistance = mobVector.sub(towerVector).Magnitude
                    if (mobDistance < range) {
                        if (mob.health > highestHealth) {
                            target = mob
                        }
                    }
                })
            }
            else if (priority === TowerPriority.Weakest) {
                let lowestHealth = math.huge
                mobs.forEach((mob: Mob) => {
                    const mobVector = mob.position2D
                    const mobDistance = mobVector.sub(towerVector).Magnitude
                    if (mobDistance < range) {
                        if (mob.health < lowestHealth) {
                            target = mob
                        }
                    }
                })
            }
            if (target) {
                return target
            }
        }
    }
}