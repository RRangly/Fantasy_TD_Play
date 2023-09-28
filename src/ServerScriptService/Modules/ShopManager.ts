import TowerList from "ReplicatedStorage/Towers/Towers"
import { GetData } from "../../ReplicatedStorage/Data"
import { Tower, TowerCard } from "ReplicatedStorage/Towers/Tower"

export class ShopManager {
    readonly userId: number
    reRolled: number
    shopItems: Array<TowerCard>
    constructor(userId: number) {
        this.userId = userId
        this.reRolled = 0
        this.shopItems = new Array<TowerCard>
    }
    //ReRolls the cards
    reRoll() {
        const coinManager = GetData(this.userId)?.coinManager
        const cost = math.floor(1.1 ^ this.reRolled * 115)
        if (coinManager && coinManager.coin > cost) {
            coinManager.changeCoins(-cost)
            this.shopItems.clear()
            for (let i = 0; i < 3; i++) {
                this.shopItems.push(TowerList[math.random(0, TowerList.size() - 1)])
            }
        }
    }
    reRollFree() {
        this.shopItems.clear()
        for (let i = 0; i < 3; i++) {
            this.shopItems.push(TowerList[math.random(0, TowerList.size() - 1)])
        }
    }
    //Picks the Card, and adds it to towerManager Cards
    pick(pick: number) {
        const data = GetData(this.userId)
        const coinManager = data?.coinManager
        const towerManager = data?.towerManager
        const tower = this.shopItems[pick]
        const cost = tower.info.stats[0].cost
        if (coinManager && coinManager.coin >= cost) {
            coinManager.changeCoins(-cost)
            towerManager?.cards.push(tower)
            delete this.shopItems[pick]
        }
    }
}