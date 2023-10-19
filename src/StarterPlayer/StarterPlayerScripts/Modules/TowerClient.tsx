import Roact, { Element, Event } from "@rbxts/roact";
import { ReplicatedStorage, TweenService } from "@rbxts/services";
import type { TowerManager } from "ServerScriptService/Modules/TowerManager";
import type { ShopManager } from "ServerScriptService/Modules/ShopManager";
import type { CoinManager } from "ServerScriptService/Modules/CoinManager";
import { Tower, TowerInfo, TowerList } from "ReplicatedStorage/Towers/Towers";
import { GuiAssets } from "ReplicatedStorage/Game/GuiAssets";
import { KnitClient } from "@rbxts/knit";
import { t } from "@rbxts/t";

const TowerModels = ReplicatedStorage.TowerModels
const ClientAssets = ReplicatedStorage.ClientAssets
const GameService = KnitClient.GetService("GameService")

interface UIProps {
    shopManager: ShopManager
    towerManager: TowerManager
    coinManager: CoinManager
}

interface UIState {
    shopManager: ShopManager
    towerManager: TowerManager
    coinManager: CoinManager
    selected?: number
}

function shopFrames(shopManager: ShopManager): Roact.Element {
    const shopItems = shopManager.shopItems
    let frames = []
    for (let i = 0; i < 3; i++) {
        frames[i] = (<GuiAssets.shopSelFrame
        image="NotYet"
        text1={shopItems[i].name}
        text2={tostring(shopItems[i].cost)}
        index={i}
        event={() => {
            GameService.ManageShop.Fire("Pick", i)
        }}
        />)
    }
    return <>
    {frames}
    </>
}

function cardsFrame(towerManager:TowerManager): Roact.Element {
    const cards = towerManager.cards
    let frames = []
    for (let i = 0; i < cards.size(); i++) {
        frames[i] = <GuiAssets.imageFrame
        key={tostring(i)}
        image="rbxassetid://14886195550"
        size={new UDim2(0.1, 0, 1, 0)}
        position={new UDim2(0.1 * i, 0, 0, 0)}
        anchorPoint={new Vector2(0,0)}
        >
            <imagelabel
            Key={"TowerImage"}
            Image="NotReady"
            AnchorPoint={new Vector2(0.5, 0.5)}
            Size={new UDim2(0.8, 0, 0.8, 0)}
            Position={new UDim2(0.5, 0, 0.5, 0)}
            BackgroundTransparency={1}/>
        </GuiAssets.imageFrame>
    }
    return (
    <frame
    Key="Cards"
    Size={new UDim2(0.9, 0, 0.34, 0)}
    Position={new UDim2(0.04, 0, 0.05, 0)}
    BackgroundTransparency={1}>
        {...frames}
    </frame>)
}

export class TowerClient extends Roact.Component<UIProps, UIState> {
    selectFrame?: Frame
    placing?: number
    rangeDisplay?: BasePart
    state: Readonly<UIState> = {
        shopManager: this.props.shopManager,
        towerManager: this.props.towerManager,
        coinManager: this.props.coinManager,
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
            //const clone = GuiAssets.SelectFrame.Clone()
            //this.selectFrame = clone
            //clone.Parent = Player
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
        let tower: Tower | undefined = undefined
        if(this.state.selected) {
            tower = this.state.towerManager.towers[this.state.selected]
        }
        return (<GuiAssets.baseFrame>
            <GuiAssets.imageFrame key= "ShopFrame" image= "rbxassetid://14886161433" size={new UDim2(0.55,0,0.25,0)} position={new UDim2(0.5,0,1,0)} anchorPoint={new Vector2(0.5,1)}>
                <GuiAssets.imageButton
                key="ReRoll"
                image="rbxassetid://14886174309"
                size={new UDim2(0.715, 0, 0.45, 0)}
                position={new UDim2(0.245, 0, 0.22, 0)}
                anchorPoint={new Vector2(0, 0)}
                maxTextSize={22}
                text1="ReRoll"
                text2={tostring(math.floor(1.1 ^ this.state.shopManager.reRolled * 115))}
                event={function () {
                }}/>
                {shopFrames(this.state.shopManager)}
                {cardsFrame(this.state.towerManager)}
            </GuiAssets.imageFrame>
            {tower ? <GuiAssets.imageFrame key="SelectFrame" image="rbxassetid://14886212727" size={new UDim2(0.195,0,0.455,0)} position={new UDim2(1,0,1,0)} anchorPoint={new Vector2(1,1)}>
                <GuiAssets.imageFrame key="Level" image="rbxassetid://14886195550" size={new UDim2(0.3, 0, 0.23, 0)} position={new UDim2(0,0,0,0)} anchorPoint={new Vector2(0.2,0.3)}>
                    <textlabel
                        Size={new UDim2(0.5, 0, 0.5, 0)} 
                        Position={new UDim2(0.5, 0, 0.5, 0)}
                        BackgroundTransparency={1}
                        FontFace={new Font("SpecialElite", Enum.FontWeight.Regular, Enum.FontStyle.Normal)} 
                        TextScaled = {true}
                        TextXAlignment={"Center"}
                        TextYAlignment={"Center"}
                        TextWrapped={true}>
                            <uistroke Color={new Color3()} Thickness={1} />
                            <uitextsizeconstraint MaxTextSize={60} MinTextSize={1}/>
                    </textlabel>
                </GuiAssets.imageFrame>
                <textlabel
                    Key="CardName"
                    Size={new UDim2(0.72, 0, 0.07, 0)}
                    Position={new UDim2(0.22, 0, 0.06, 0)}
                    BackgroundTransparency={1}
                    FontFace={new Font("SpecialElite", Enum.FontWeight.Regular, Enum.FontStyle.Normal)}
                    Text={tower.name}
                    TextScaled = {true}
                    TextXAlignment={"Center"}
                    TextYAlignment={"Center"}
                    TextWrapped={true}>
                        <uistroke Color={new Color3()} Thickness={1}/>
                        <uitextsizeconstraint MaxTextSize={40} MinTextSize={1}/>
                </textlabel>
                <GuiAssets.imageFrame key="CardImage" image="rbxassetid://14886195550" size={new UDim2(0.5, 0, 0.4, 0)} position={new UDim2(0.38,0,0.15,0)} anchorPoint={new Vector2(0,0)}>
                    <GuiAssets.imageFrame key="Image" image="NotYet" size={new UDim2(0.7, 0, 0.7, 0)} position={new UDim2(0.5, 0, 0.5, 0)} anchorPoint={new Vector2(0.5, 0.5)}/>
                </GuiAssets.imageFrame>
                <GuiAssets.imageButton
                key="Upgrade"
                image="rbxassetid://14886174309"
                size={new UDim2(0.715, 0, 0.45, 0)}
                position={new UDim2(0.245, 0, 0.22, 0)}
                anchorPoint={new Vector2(0, 0)}
                maxTextSize={22}
                text1="Upgrade"
                text2={tostring(tower.stats[tower.level+1].cost)}
                event={() => {
                    if (tower && this.state.coinManager.coin >= tower.stats[tower.level+1].cost) {
                        GameService.ManageTower.Fire("Upgrade", this.state.selected)
                    }
                }}/>
                <GuiAssets.imageButton
                key="Priority"
                image="rbxassetid://14886174309"
                size={new UDim2(0.715, 0, 0.45, 0)}
                position={new UDim2(0.245, 0, 0.22, 0)}
                anchorPoint={new Vector2(0, 0)}
                maxTextSize={22}
                text1="Priority"
                text2={tostring(tower.priority)}
                event={() => {
                    if (tower) {
                        GameService.ManageTower.Fire("Priority", this.state.selected)
                    }
                }}/>
                <GuiAssets.imageButton
                key="Sell"
                image="rbxassetid://14886174309"
                size={new UDim2(0.715, 0, 0.45, 0)}
                position={new UDim2(0.245, 0, 0.22, 0)}
                anchorPoint={new Vector2(0, 0)}
                maxTextSize={22}
                text1="Sell"
                text2={tostring(tower.stats[tower.level].cost)}
                event={() => {
                    if (tower) {
                        GameService.ManageTower.Fire("Sell", this.state.selected)
                    }
                }}/>
            </GuiAssets.imageFrame>: undefined}
        </GuiAssets.baseFrame>)
    }
}