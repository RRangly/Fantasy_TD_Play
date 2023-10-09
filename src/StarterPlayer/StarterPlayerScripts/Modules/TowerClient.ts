import { ReplicatedStorage, TweenService } from "@rbxts/services";
import type { TowerManager } from "ServerScriptService/Modules/TowerManager";
import { TowerList } from "ReplicatedStorage/Towers/Towers";
import { Player } from "@rbxts/knit/Knit/KnitClient";
const TowerModels = ReplicatedStorage.TowerModels
const GuiAssets = ReplicatedStorage.GuiAssets
const ClientAssets = ReplicatedStorage.ClientAssets

export class TowerClient {
    towerManager: TowerManager
    selectFrame?: Frame
    placing?: number
    selected?: number
    rangeDisplay?: BasePart
    constructor(towerManager: TowerManager) {
        this.towerManager = towerManager
    }

    statChange(textLabel: TextLabel, index: number, statName: string, preStat: number, postStat: number) {
        textLabel.TextSize = 28
        textLabel.TextXAlignment = Enum.TextXAlignment.Left
        textLabel.Position = new UDim2(0, 10, index * 0.1, 10)
        textLabel.Font = Enum.Font.SourceSans
        textLabel.Text = statName + ": " + preStat + " -> " + postStat
    }
    updateSelection(towerIndex: number | undefined) {
        const towers = this.towerManager.towers
        if (this.selected !== towerIndex && this.rangeDisplay) {
            const tween = TweenService.Create(this.rangeDisplay, new TweenInfo(0.5), {Size: new Vector3(0.2, 0, 0)})
            tween.Play()
            tween.Completed.Once(() => {
                this.rangeDisplay?.Destroy()
            })
        }
        this.selectFrame?.Destroy()
        if (towerIndex) {
            const clone = GuiAssets.SelectFrame.Clone()
            this.selectFrame = clone
            clone.Parent = Player
        }
        this.selected = undefined
    }
    update(towerManager: TowerManager) {

    }
}