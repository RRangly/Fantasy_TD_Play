import { ReplicatedStorage, Workspace } from "@rbxts/services"
import { GetData } from "ReplicatedStorage/Data"
import { Minigunner } from "ReplicatedStorage/Towers/Minigunner"
import { Tower, TowerCard } from "ReplicatedStorage/Towers/Tower"
import TowerList from "ReplicatedStorage/Towers/Towers"

export class TowerManager {
    readonly userId: number
    readonly towerLimit: number
    towers: Array<Tower>
    cards: Array<TowerCard>
    constructor(userId: number) {
        this.userId = userId
        this.towerLimit = 20
        this.towers = new Array<Tower>
        this.cards = new Array<TowerCard>
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
    //places
    place(cardIndex: number, position: Vector3) {
        const card = this.cards[cardIndex]
        if (this.checkPlacement(card.info.placement.type, position) && this.towers.size() < this.towerLimit) {
            const clone = ReplicatedStorage.TowerModels.FindFirstChild(card.info.name)
            if (clone?.IsA("Model")) {
                clone.GetChildren().forEach(part => {
                    if (part.IsA("BasePart")) {
                        part.Anchored = true
                        part.CanCollide = true
                        part.CanTouch = false
                        part.CanQuery = false
                        part.CollisionGroup = "Towers"
                    }
                });
                clone.Parent = Workspace
                const place = new Vector3(position.X, position.Y + card.info.placement.height, position.Z)
                clone.PivotTo(new CFrame(place))
                this.towers.push(new card.class(card.info, place, clone))
                delete this.cards[cardIndex]
                return true
            }
        }
        return false
    }
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
            else if (manageType === "SwitchTarget") {
                if (tower.target === "Closest") {
                    tower.target = "Lowest Health"
                }
                else if (tower.target === "Lowest Health") {
                    tower.target = "First"
                }
                else if (tower.target === "First") {
                    tower.target = "Closest"
                }
                return true
            }
        }
    }
}