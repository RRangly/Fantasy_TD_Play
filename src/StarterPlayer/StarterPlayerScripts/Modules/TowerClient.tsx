import Roact from "@rbxts/roact";
import { ReplicatedStorage, TweenService } from "@rbxts/services";
import type { TowerManager } from "ServerScriptService/Modules/TowerManager";
import type { ShopManager } from "ServerScriptService/Modules/ShopManager";
import { Tower, TowerList } from "ReplicatedStorage/Towers/Towers";
import { Player } from "@rbxts/knit/Knit/KnitClient";
const TowerModels = ReplicatedStorage.TowerModels
const GuiAssets = ReplicatedStorage.GuiAssets
const ClientAssets = ReplicatedStorage.ClientAssets

interface UIProps {
    shopManager: ShopManager
    towerManager: TowerManager
}

interface UIState {
    shopManager: ShopManager,
    towerManager: TowerManager,
    selected?: number,
}

interface FrameProp {
    tower: Tower
}

function SelectFrame(props: FrameProp) {
    return (
        <imagelabel>

        </imagelabel>
    )
}

export class TowerClient extends Roact.Component<UIProps, UIState> {
    selectFrame?: Frame
    placing?: number
    rangeDisplay?: BasePart
    state: Readonly<UIState> = {
        shopManager: this.props.shopManager,
        towerManager: this.props.towerManager,
    }
    
    constructor(props: UIProps) {
        super(props)
    }

    statChange(textLabel: TextLabel, index: number, statName: string, preStat: number, postStat: number) {
        textLabel.TextSize = 28
        textLabel.TextXAlignment = Enum.TextXAlignment.Left
        textLabel.Position = new UDim2(0, 10, index * 0.1, 10)
        textLabel.Font = Enum.Font.SourceSans
        textLabel.Text = statName + ": " + preStat + " -> " + postStat
    }
    updateSelection(towerIndex: number | undefined) {
        const towerManager = this.state.towerManager
        const towers = towerManager.towers
        if (this.state.selected !== towerIndex && this.rangeDisplay) {
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
            const tower = towers[towerIndex]
            const towerInfo = TowerList[towerIndex]
            const levelStat = towerInfo.stats[tower.level]

            if(this.state.selected !== towerIndex && levelStat.range) {
                this.rangeDisplay = ClientAssets.RangeDisplay.Clone()
                this.rangeDisplay.Parent = tower.model
                const towerPos = tower.position
                const displayPos = new Vector3(towerPos.X, towerPos.Y - towerInfo.placement.height + 0.1, towerPos.Z)
                this.rangeDisplay.Position = displayPos
                const tween = TweenService.Create(this.rangeDisplay, new TweenInfo(0.5), {Size: new Vector3(levelStat.range * 2, 0.001, levelStat.range * 2)})
                tween.Play()
            }
            this.setState({
                selected: towerIndex
            })

            return
        }
        this.setState({
            selected: Roact.None
        })
    }
    update(towerManager: TowerManager) {

    }
    render(): Roact.Element | undefined {
        return (<frame Key={"HudFrame"}>
            <uiaspectratioconstraint AspectType={"FitWithinMaxSize"} AspectRatio={1.783} DominantAxis={"Width"} />
            <imagelabel 
            Key= "ShopFrame"
            Image= "rbxassetid://14886161433"
            Size={new UDim2(0.55, 0, 0.25, 0)}
            Position={new UDim2(0.5, 0, 1, 0)}
            ScaleType= "Crop">

            </imagelabel>
            <imagelabel Key={"HealthBar"}>
                
            </imagelabel>
        </frame>)
    }

}