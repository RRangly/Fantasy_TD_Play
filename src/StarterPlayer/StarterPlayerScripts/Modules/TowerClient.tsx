import Roact, { Element, Event } from "@rbxts/roact";
import { Players, ReplicatedStorage, TweenService, UserInputService, Workspace } from "@rbxts/services";
import type { TowerManager } from "ServerScriptService/Modules/TowerManager";
import type { CoinManager } from "ServerScriptService/Modules/CoinManager";
import { Tower, TowerInfo } from "ReplicatedStorage/Towers/TowerMechanics";
import { TowerList } from "ReplicatedStorage/Towers/Towers";
import { GuiAssets } from "ReplicatedStorage/Game/GuiAssets";
import { KnitClient } from "@rbxts/knit";
import { t } from "@rbxts/t";

const TowerModels = ReplicatedStorage.TowerModels
const ClientAssets = ReplicatedStorage.ClientAssets
const GameService = KnitClient.GetService("GameService")
const PlayerGui = Players.LocalPlayer.FindFirstChild("PlayerGui") as PlayerGui

interface UIProps {
    towerManager: TowerManager
    coinManager: CoinManager
}

interface SelectFrameProps extends Roact.PropsWithChildren{
    text1: string
    text2: string
    image: string
    index: number
    event: () => void
}
/*
Legacy code for towermanager UI
//shop purchase menu
function shopFrames(shopManager: ShopManager): Roact.Element {
    const shopItems = shopManager.shopItems
    let frames = []
    for (let i = 0; i < 3; i++) {
        if (shopItems[i]) {
            frames[i] = (<ShopSelFrame
                image={shopItems[i].tInfo.image}
                text1={shopItems[i].tInfo.name}
                text2={tostring(shopItems[i].tInfo.cost)}
                index={i}
                event={() => {
                    print("pick")
                    GameService.manageShop.Fire("Pick", i)
                }}
                />)
        }
    }
    return <>
    {frames}
    </>
}
//individual frame of the shop purchase menu
function ShopSelFrame(props: SelectFrameProps): Roact.Element {
    return (
        <imagebutton
        Key={tostring(props.index)}
        Image="rbxassetid://14886184492"
        Size={new UDim2(0.255,0,0.5,0)}
        Position={new UDim2(0.025 + props.index * 0.225,0,0.4,0)}
        AnchorPoint={new Vector2(0,0)}
        ScaleType="Crop"
        BackgroundTransparency={1}
        Event={{
            MouseButton1Down: props.event
        }}
        >
            <textlabel
                Key="Name"
                Size={new UDim2(0.45,0,0.16,0)} 
                Position={new UDim2(0.15,0,0.7,0)} 
                BackgroundTransparency={1}
                Font="SpecialElite"
                Text={props.text1}
                TextScaled = {true}
                TextColor3={Color3.fromRGB(98,98,98)}
                TextXAlignment="Left"
                TextYAlignment="Top"
                TextWrapped={true}>
                    <uistroke Color={Color3.fromRGB(98,98,98)} Thickness={0.1} />
                    <uitextsizeconstraint MaxTextSize={22} MinTextSize={1}/>
            </textlabel>
            <textlabel
                Key="Cost"
                Size={new UDim2(0.25,0,0.16,0)} 
                Position={new UDim2(0.625,0,0.7,0)} 
                BackgroundTransparency={1}
                Font="SpecialElite"
                Text={props.text2}
                TextScaled = {true}
                TextColor3={Color3.fromRGB(98,98,98)}
                TextXAlignment="Left"
                TextYAlignment="Top"
                TextWrapped={true}>
                    <uistroke Color={Color3.fromRGB(98,98,98)} Thickness={0.1} />
                    <uitextsizeconstraint MaxTextSize={22} MinTextSize={1}/>
            </textlabel>
        </imagebutton>
    )
}

//card placing frame
function cardsFrame(towerClient: TowerClient): Roact.Element {
    const cards = towerClient.towerManager.cards
    let frames = []
    for (let i = 0; i < cards.size(); i++) {
        frames[i] = <imagebutton
        Key={tostring(i)}
        Image="rbxassetid://14886195550"
        Size={new UDim2(0.1, 0, 1, 0)}
        Position={new UDim2(0.1 * i, 0, 0, 0)}
        AnchorPoint={new Vector2(0,0)}
        BackgroundTransparency={1}
        ScaleType={"Crop"}
        Event={{
            MouseButton1Down: () => {
                towerClient.startPlacement(i)
            }
        }}
        >
            <GuiAssets.ImageFrame
            key={"TowerImage"}
            image={cards[i].tInfo.image}
            anchorPoint={new Vector2(0.5, 0.5)}
            size={new UDim2(0.8, 0, 0.8, 0)}
            position={new UDim2(0.5, 0, 0.5, 0)}/>
        </imagebutton>
    }
    return (
    <frame
    Key="Cards"
    Size={new UDim2(0.9, 0, 0.34, 0)}
    Position={new UDim2(0.04, 0, 0.05, 0)}
    BackgroundTransparency={1}>
        {frames}
    </frame>)
}

function towerUI(towerClient: TowerClient) {
    let tower: Tower | undefined = undefined
    if(t.number(towerClient.selected)) {
        tower = towerClient.towerManager.towers[towerClient.selected]
    }
    let statStrings = []
    if (tower) {
        const level = tower.level
        const stats = tower.stats[level]
        const nextStats = tower.stats[level + 1]
        let i = 0
        for (let [key] of pairs(stats)) {
            if(key === "levelName") {
                continue
            }
            if (nextStats[key]) {
                statStrings.push(<textlabel
                    Key="NextLevel"
                    Size={new UDim2(0.054, 0, 0.12, 0)}
                    Position={new UDim2(0.9, 0, 0.02 + 0.14 * i, 0)}
                    BackgroundTransparency={1}
                    Font="SpecialElite"
                    Text={key + ": " + stats[key] + " -> " + nextStats[key]}
                    TextScaled = {true}
                    TextXAlignment={"Left"}
                    TextYAlignment={"Top"}
                    TextWrapped={true}>
                        <uistroke Color={new Color3()} Thickness={0.3}/>
                        <uitextsizeconstraint MaxTextSize={24} MinTextSize={1}/>
                </textlabel>)
            }
            i++
        }
    }
    return (<GuiAssets.BaseFrame>
        <GuiAssets.ImageFrame key= "ShopFrame" image= "rbxassetid://14886161433" size={new UDim2(0.55,0,0.25,0)} position={new UDim2(0.5,0,1,0)} anchorPoint={new Vector2(0.5,1)}>
            <GuiAssets.ImageButton
            key="ReRoll"
            image="rbxassetid://14886174309"
            size={new UDim2(0.245, 0, 0.23, 0)}
            position={new UDim2(0.715, 0, 0.45, 0)}
            anchorPoint={new Vector2(0, 0)}
            maxTextSize={22}
            text1="ReRoll"
            text2={tostring(math.floor(1.1 ^ towerClient.shopManager.reRolled * 115))}
            event={function () {
            }}/>
            {shopFrames(towerClient.shopManager)}
            {cardsFrame(towerClient)}
        </GuiAssets.ImageFrame>
        {tower ? <frame Key="SelectFrame" BackgroundTransparency={1} AnchorPoint={new Vector2(0.5,0.5)} Position={new UDim2(0.5,0,0.5,0)} Size={new UDim2(0.35, 0, 0.46, 0)}>
            <imagelabel 
            Key={"Image"}
            Image={"rbxassetid://14886212727"}
            Size={new UDim2(0.8, 0, 1.07, 0)}
            Position={new UDim2(0.5, 0, 0.5, 0)}
            ZIndex={-1}
            AnchorPoint={new Vector2(0.5, 0.5)}
            ScaleType= "Crop"
            BackgroundTransparency={1}
            Rotation={90}
            SizeConstraint={"RelativeXX"}
            /> 
            <GuiAssets.ImageFrame key="Level" image="rbxassetid://14886195550" size={new UDim2(0.15, 0, 0.22, 0)} position={new UDim2(0,0,0,0)} anchorPoint={new Vector2(0.4,0.3)}>
                <textlabel
                    Size={new UDim2(0.5, 0, 0.5, 0)} 
                    Position={new UDim2(0.5, 0, 0.5, 0)}
                    BackgroundTransparency={1}
                    Font="SpecialElite"
                    TextScaled = {true}
                    TextXAlignment={"Center"}
                    TextYAlignment={"Center"}
                    TextWrapped={true}>
                        <uistroke Color={new Color3()} Thickness={1} />
                        <uitextsizeconstraint MaxTextSize={60} MinTextSize={1}/>
                </textlabel>
            </GuiAssets.ImageFrame>
            <textlabel
                Key="CardName"
                Size={new UDim2(0.4, 0, 0.07, 0)}
                Position={new UDim2(0.05, 0, 0.08, 0)}
                BackgroundTransparency={1}
                Font="SpecialElite"
                Text={tower.name}
                TextScaled = {true}
                TextXAlignment={"Center"}
                TextYAlignment={"Center"}
                TextWrapped={true}>
                    <uistroke Color={new Color3()} Thickness={0.5}/>
                    <uitextsizeconstraint MaxTextSize={40} MinTextSize={1}/>
            </textlabel>
            <GuiAssets.ImageButton
            key="Priority"
            image="rbxassetid://14886174309"
            size={new UDim2(0.34, 0, 0.112, 0)}
            position={new UDim2(0.085, 0, 0.8, 0)}
            anchorPoint={new Vector2(0, 0)}
            maxTextSize={22}
            text1="Priority"
            text2={tostring(tower.priority)}
            event={() => {
                GameService.manageTower.Fire("Priority", towerClient.selected)
            }}/>
            <GuiAssets.ImageButton
            key="Sell"
            image="rbxassetid://14886174309"
            size={new UDim2(0.34, 0, 0.112, 0)}
            position={new UDim2(0.085, 0, 0.67, 0)}
            anchorPoint={new Vector2(0, 0)}
            maxTextSize={22}
            text1="Sell"
            text2={tostring(tower.stats[tower.level].cost)}
            event={() => {
                if (tower) {
                    GameService.manageTower.Fire("Sell", towerClient.selected)
                    towerClient.selected = undefined
                }
            }}/>
            <GuiAssets.ImageFrame key="CardImage" image="rbxassetid://14886195550" size={new UDim2(0.4, 0, 0.52, 0)} position={new UDim2(0.05, 0, 0.17, 0)} anchorPoint={new Vector2(0,0)}>
                <GuiAssets.ImageFrame key="Image" image={tower.image} size={new UDim2(0.7, 0, 0.7, 0)} position={new UDim2(0.5, 0, 0.5, 0)} anchorPoint={new Vector2(0.5, 0.5)}/>
            </GuiAssets.ImageFrame>

            <GuiAssets.ImageFrame key="UpgradeImage" image="rbxassetid://14886195550" size={new UDim2(0.32, 0, 0.416, 0)} position={new UDim2(0.41, 0, 0.07, 0)} anchorPoint={new Vector2(0,0)}>
                <GuiAssets.ImageFrame key="Image" image={tower.image} size={new UDim2(0.7, 0, 0.7, 0)} position={new UDim2(0.5, 0, 0.5, 0)} anchorPoint={new Vector2(0.5, 0.5)}/>
            </GuiAssets.ImageFrame>
            <textlabel
                Key="NextLevelNum"
                Size={new UDim2(0.25, 0, 0.04, 0)}
                Position={new UDim2(0.73, 0, 0.12, 0)}
                BackgroundTransparency={1}
                Font="SpecialElite"
                Text={tostring(tower.level + 1)}
                TextScaled = {true}
                TextXAlignment={"Center"}
                TextYAlignment={"Center"}
                TextWrapped={true}>
                    <uistroke Color={new Color3()} Thickness={0.3}/>
                    <uitextsizeconstraint MaxTextSize={24} MinTextSize={1}/>
            </textlabel>
            <textlabel
                Key="NextLevelName"
                Size={new UDim2(0.25, 0, 0.06, 0)}
                Position={new UDim2(0.73, 0, 0.2, 0)}
                BackgroundTransparency={1}
                Font="SpecialElite"
                Text={tower.name}
                TextScaled = {true}
                TextXAlignment={"Center"}
                TextYAlignment={"Center"}
                TextWrapped={true}>
                    <uistroke Color={new Color3()} Thickness={0.3}/>
                    <uitextsizeconstraint MaxTextSize={30} MinTextSize={1}/>
            </textlabel>
            <frame Key="Stats" BackgroundTransparency={1} Position={new UDim2(0.44,0,0.46,0)} Size={new UDim2(0.54, 0, 0.38, 0)}>
                {...statStrings}
            </frame>
            <GuiAssets.ImageButton
            key="Upgrade"
            image="rbxassetid://14886174309"
            size={new UDim2(0.34, 0, 0.112, 0)}
            position={new UDim2(0.65, 0, 0.86, 0)}
            anchorPoint={new Vector2(0, 0)}
            maxTextSize={22}
            text1="Upgrade"
            text2={tostring(tower.stats[tower.level+1].cost)}
            event={() => {
                if (towerClient.coinManager.coin >= tower!.stats[tower!.level+1].cost) {
                    GameService.manageTower.Fire("Upgrade", towerClient.selected)
                }
            }}/>
        </frame>: undefined}
    </GuiAssets.BaseFrame>)
}

export class TowerClient {
    towerUI: Roact.Tree
    towerManager: TowerManager
    shopManager: ShopManager
    coinManager: CoinManager
    map: TDSMap
    //selection Related
    selected?: number
    selectFrame?: Frame
    rangeDisplay?: BasePart
    //placement Related
    placing?: number
    rayCast?: RaycastResult
    placeModel?: Model

    constructor(towerManager: TowerManager, shopManager: ShopManager, coinManager: CoinManager) {
        this.towerManager = towerManager
        this.shopManager = shopManager
        this.coinManager = coinManager
        this.map = Workspace.Map.GetChildren()[0] as TDSMap
        this.towerUI = Roact.mount(towerUI(this), PlayerGui, "TowerGui")
    }

    updateSelection(towerIndex?: number) {
        const towerManager = this.towerManager
        const towers = towerManager.towers
        if (this.selected !== towerIndex && this.rangeDisplay) {
            const toDestroy = this.rangeDisplay
            const tween = TweenService.Create(toDestroy, new TweenInfo(0.5), {Size: new Vector3(0.2, 0, 0)})
            tween.Play()
            tween.Completed.Once(() => {
                toDestroy.Destroy()
            })
        }
        this.selectFrame?.Destroy()
        if (t.number(towerIndex)) {
            const tower = towers[towerIndex]
            const towerInfo = TowerList[towerIndex]
            const levelStat = towerInfo.tInfo.stats[tower.level]

            if(this.selected !== towerIndex && levelStat.range) {
                this.rangeDisplay = ClientAssets.RangeDisplay.Clone()
                this.rangeDisplay.Parent = tower.model
                const towerPos = tower.position
                const displayPos = new Vector3(towerPos.X, towerPos.Y - towerInfo.tInfo.placement.height + 0.1, towerPos.Z)
                this.rangeDisplay.Position = displayPos
                const tween = TweenService.Create(this.rangeDisplay, new TweenInfo(0.5), {Size: new Vector3(levelStat.range * 2, 0.001, levelStat.range * 2)})
                tween.Play()
            }
            this.selected = towerIndex
            return
        }
        this.selected = undefined
    }

    castRay(collisionGroup: string): RaycastResult | undefined{
        const mousePosition = UserInputService.GetMouseLocation()
        const ray = Workspace.CurrentCamera!.ViewportPointToRay(mousePosition.X, mousePosition.Y)
        const rayCastParam = new RaycastParams()
        rayCastParam.CollisionGroup = collisionGroup
        const rayResult = Workspace.Raycast(ray.Origin, ray.Direction.mul(1000), rayCastParam)
        if (rayResult) {
            return rayResult
        }
        return undefined
    }

    checkPlacement(towerType: string, part: BasePart) {
        if(part.GetAttribute("Placement") === towerType) {
            return true
        }
        return false
    }

    startPlacement(index: number) {
        const tower = this.towerManager.cards[index]
        const highLights = this.map.HighLights
        highLights.GetChildren().forEach((obj) => {
            if (obj.IsA("Highlight")) {
                obj.FillTransparency = 1
                obj.OutlineTransparency = 1
                obj.Enabled = true
                let fillT = 0.5
                if (obj.Name === tower.tInfo.placement.type) {
                    obj.FillColor = Color3.fromRGB(0, 255, 0)
                    fillT = 0.3
                }
                else {
                    obj.FillColor = Color3.fromRGB(255, 0, 0)
                }
                const tween = TweenService.Create(obj, new TweenInfo(0.5), {FillTransparency: fillT, OutlineTransparency: 0})
                tween.Play()
            }
        })
        if(this.placeModel) {
            this.placeModel.Destroy()
            this.placeModel = undefined
        }
        this.placing = index
    }

    endPlacement() {
        if (this.placing !== undefined) {
            const highlights = this.map.HighLights
            highlights.GetChildren().forEach((obj) => {
                if (obj.IsA("Highlight")) {
                    task.spawn(() => {
                        const tween = TweenService.Create(obj, new TweenInfo(0.5), {FillTransparency: 1, OutlineTransparency: 1})
                        tween.Play()
                        tween.Completed.Wait()
                        obj.Enabled = false
                    })
                }
            })
            if (this.placeModel) {
                this.placeModel.Destroy()
                this.placeModel = undefined
            }
            this.placing = undefined
            this.rayCast = undefined
        }
    }

    placeTower() {
        const ray = this.rayCast
        if (ray) {
            const tower = this.towerManager.cards[this.placing!]
            if (this.checkPlacement(tower.tInfo.placement.type, ray.Instance)) {
                GameService.placeTower.Fire(this.placing, ray.Position)
                this.endPlacement()
            }
        }
    }

    selectTower() {
        const rayCast = this.castRay("EveryThing")
        const towers = this.towerManager.towers
        if (rayCast) {
            for (let i = 0; i < towers.size(); i++) {
                if (rayCast.Instance.IsDescendantOf(towers[i].model)) {
                    this.updateSelection(i)
                    print("CurrentIndex", this.selected)
                    Roact.update(this.towerUI, towerUI(this))
                    return
                }
            }
        }
        this.updateSelection(undefined)
        Roact.update(this.towerUI, towerUI(this))
    }

    mouseClick() {
        if (this.placing !== undefined) {
            this.placeTower()
        }
        else {
            this.selectTower()
        }
    }


    update(towerManager: TowerManager, shopManager: ShopManager, coinManager: CoinManager) {
        this.towerManager = towerManager
        this.shopManager = shopManager
        this.coinManager = coinManager
        this.updateSelection(this.selected)
        this.towerUI = Roact.update(this.towerUI, towerUI(this))
    }

    render() {
        if (this.placing !== undefined) {
            const ray = this.castRay("Towers")
            this.rayCast = ray
            const tower = this.towerManager.cards[this.placing]
            if (ray) {
                if (!this.placeModel) {
                    print("ModelRespawn")
                    const model = TowerModels.FindFirstChild(tower.tInfo.name)!.Clone() as Model
                    this.placeModel = model
                    model.Parent = Workspace
                    model.GetDescendants().forEach((part) => {
                        if (part.IsA("BasePart")) {
                            part.CollisionGroup = "Towers"
                            part.Anchored = true
                            part.CanCollide = true
                            part.CanTouch = false
                            part.CanQuery = false
                            part.Material = Enum.Material.ForceField
                            if (part.IsA("MeshPart")) {
                                part.Transparency = 0.5
                            }
                        }
                    })
                }
                const canPlace = this.checkPlacement(tower.tInfo.placement.type, ray.Instance)
                const pos = new Vector3(ray.Position.X, ray.Position.Y + tower.tInfo.placement.height, ray.Position.Z)
                this.placeModel.PivotTo(new CFrame(pos))
                let color = new Color3(1, 0, 0)
                if (canPlace) {
                    color = new Color3(0, 1, 0)
                }
                this.placeModel.GetDescendants().forEach((part) => {
                    if (part.IsA("BasePart")) {
                        part.Color = color
                    }
                })
            }
            else {
                if (this.placeModel) {
                    this.placeModel.Destroy()
                    this.placeModel = undefined
                }
            }
        }
    }
}
*/

function cardsFrame(towerClient: TowerClient): Roact.Element {
    const posMargin = 1/6
    const cards = towerClient.towerManager.cards
    let frames = []
    for (let i = 0; i < 5; i++) {
        frames[i] = <imagebutton
        Key={tostring(i)}
        Image="rbxassetid://14886195550"
        Size={new UDim2(0.11, 0, 1, 0)}
        Position={new UDim2(posMargin * (i+1), 0, 0, 0)}
        AnchorPoint={new Vector2(0.5,0)}
        BackgroundTransparency={1}
        ScaleType={"Crop"}
        Event={{
            MouseButton1Down: () => {
                towerClient.startPlacement(i)
            }
        }}
        >
            <GuiAssets.ImageFrame
            key={"TowerImage"}
            image={cards[i].tInfo.image}
            anchorPoint={new Vector2(0.5, 1)}
            size={new UDim2(0.5, 0, 0.1, 0)}
            position={new UDim2(0.5, 0, 0.99, 0)}/>
        </imagebutton>
    }
    return (
    <frame
    Key="Cards"
    Size={new UDim2(0.5, 0, 0.1, 0)}
    Position={new UDim2(0.5, 0, 0.99, 0)}
    AnchorPoint={new Vector2(0.5, 0.99)}
    BackgroundTransparency={1}>
        {frames}
    </frame>)
}

function towerUI(towerClient: TowerClient): Roact.Element {
    let tower: Tower | undefined = undefined
    if(t.number(towerClient.selected)) {
        tower = towerClient.towerManager.towers[towerClient.selected]
    }
    let statStrings = []
    if (tower) {
        const level = tower.level
        const stats = tower.stats[level]
        const nextStats = tower.stats[level + 1]
        let i = 0
        for (let [key] of pairs(stats)) {
            if(key === "levelName") {
                continue
            }
            if (nextStats[key]) {
                statStrings.push(<textlabel
                    Key="NextLevel"
                    Size={new UDim2(0.054, 0, 0.12, 0)}
                    Position={new UDim2(0.9, 0, 0.02 + 0.14 * i, 0)}
                    BackgroundTransparency={1}
                    Font="SpecialElite"
                    Text={key + ": " + stats[key] + " -> " + nextStats[key]}
                    TextScaled = {true}
                    TextXAlignment={"Left"}
                    TextYAlignment={"Top"}
                    TextWrapped={true}>
                        <uistroke Color={new Color3()} Thickness={0.3}/>
                        <uitextsizeconstraint MaxTextSize={24} MinTextSize={1}/>
                </textlabel>)
            }
            i++
        }
    }
    return (<GuiAssets.BaseFrame>
        {cardsFrame(towerClient)}
        {tower ? <frame Key="SelectFrame" BackgroundTransparency={1} AnchorPoint={new Vector2(0.5,0.5)} Position={new UDim2(0.5,0,0.5,0)} Size={new UDim2(0.35, 0, 0.46, 0)}>
            <imagelabel 
            Key={"Image"}
            Image={"rbxassetid://14886212727"}
            Size={new UDim2(0.8, 0, 1.07, 0)}
            Position={new UDim2(0.5, 0, 0.5, 0)}
            ZIndex={-1}
            AnchorPoint={new Vector2(0.5, 0.5)}
            ScaleType= "Crop"
            BackgroundTransparency={1}
            Rotation={90}
            SizeConstraint={"RelativeXX"}
            />
            <GuiAssets.ImageFrame key="Level" image="rbxassetid://14886195550" size={new UDim2(0.15, 0, 0.22, 0)} position={new UDim2(0,0,0,0)} anchorPoint={new Vector2(0.4,0.3)}>
                <textlabel
                    Size={new UDim2(0.5, 0, 0.5, 0)} 
                    Position={new UDim2(0.5, 0, 0.5, 0)}
                    BackgroundTransparency={1}
                    Font="SpecialElite"
                    TextScaled = {true}
                    TextXAlignment={"Center"}
                    TextYAlignment={"Center"}
                    TextWrapped={true}>
                        <uistroke Color={new Color3()} Thickness={1} />
                        <uitextsizeconstraint MaxTextSize={60} MinTextSize={1}/>
                </textlabel>
            </GuiAssets.ImageFrame>
            <textlabel
                Key="CardName"
                Size={new UDim2(0.4, 0, 0.07, 0)}
                Position={new UDim2(0.05, 0, 0.08, 0)}
                BackgroundTransparency={1}
                Font="SpecialElite"
                Text={tower.name}
                TextScaled = {true}
                TextXAlignment={"Center"}
                TextYAlignment={"Center"}
                TextWrapped={true}>
                    <uistroke Color={new Color3()} Thickness={0.5}/>
                    <uitextsizeconstraint MaxTextSize={40} MinTextSize={1}/>
            </textlabel>
            <GuiAssets.ImageButton
            key="Priority"
            image="rbxassetid://14886174309"
            size={new UDim2(0.34, 0, 0.112, 0)}
            position={new UDim2(0.085, 0, 0.8, 0)}
            anchorPoint={new Vector2(0, 0)}
            maxTextSize={22}
            text1="Priority"
            text2={tostring(tower.priority)}
            event={() => {
                GameService.manageTower.Fire("Priority", towerClient.selected)
            }}/>
            <GuiAssets.ImageButton
            key="Sell"
            image="rbxassetid://14886174309"
            size={new UDim2(0.34, 0, 0.112, 0)}
            position={new UDim2(0.085, 0, 0.67, 0)}
            anchorPoint={new Vector2(0, 0)}
            maxTextSize={22}
            text1="Sell"
            text2={tostring(tower.stats[tower.level].cost)}
            event={() => {
                if (tower) {
                    GameService.manageTower.Fire("Sell", towerClient.selected)
                    towerClient.selected = undefined
                }
            }}/>
            <GuiAssets.ImageFrame key="CardImage" image="rbxassetid://14886195550" size={new UDim2(0.4, 0, 0.52, 0)} position={new UDim2(0.05, 0, 0.17, 0)} anchorPoint={new Vector2(0,0)}>
                <GuiAssets.ImageFrame key="Image" image={tower.image} size={new UDim2(0.7, 0, 0.7, 0)} position={new UDim2(0.5, 0, 0.5, 0)} anchorPoint={new Vector2(0.5, 0.5)}/>
            </GuiAssets.ImageFrame>

            <GuiAssets.ImageFrame key="UpgradeImage" image="rbxassetid://14886195550" size={new UDim2(0.32, 0, 0.416, 0)} position={new UDim2(0.41, 0, 0.07, 0)} anchorPoint={new Vector2(0,0)}>
                <GuiAssets.ImageFrame key="Image" image={tower.image} size={new UDim2(0.7, 0, 0.7, 0)} position={new UDim2(0.5, 0, 0.5, 0)} anchorPoint={new Vector2(0.5, 0.5)}/>
            </GuiAssets.ImageFrame>
            <textlabel
                Key="NextLevelNum"
                Size={new UDim2(0.25, 0, 0.04, 0)}
                Position={new UDim2(0.73, 0, 0.12, 0)}
                BackgroundTransparency={1}
                Font="SpecialElite"
                Text={tostring(tower.level + 1)}
                TextScaled = {true}
                TextXAlignment={"Center"}
                TextYAlignment={"Center"}
                TextWrapped={true}>
                    <uistroke Color={new Color3()} Thickness={0.3}/>
                    <uitextsizeconstraint MaxTextSize={24} MinTextSize={1}/>
            </textlabel>
            <textlabel
                Key="NextLevelName"
                Size={new UDim2(0.25, 0, 0.06, 0)}
                Position={new UDim2(0.73, 0, 0.2, 0)}
                BackgroundTransparency={1}
                Font="SpecialElite"
                Text={tower.name}
                TextScaled = {true}
                TextXAlignment={"Center"}
                TextYAlignment={"Center"}
                TextWrapped={true}>
                    <uistroke Color={new Color3()} Thickness={0.3}/>
                    <uitextsizeconstraint MaxTextSize={30} MinTextSize={1}/>
            </textlabel>
            <frame Key="Stats" BackgroundTransparency={1} Position={new UDim2(0.44,0,0.46,0)} Size={new UDim2(0.54, 0, 0.38, 0)}>
                {...statStrings}
            </frame>
            <GuiAssets.ImageButton
            key="Upgrade"
            image="rbxassetid://14886174309"
            size={new UDim2(0.34, 0, 0.112, 0)}
            position={new UDim2(0.65, 0, 0.86, 0)}
            anchorPoint={new Vector2(0, 0)}
            maxTextSize={22}
            text1="Upgrade"
            text2={tostring(tower.stats[tower.level+1].cost)}
            event={() => {
                if (towerClient.coinManager.coin >= tower!.stats[tower!.level+1].cost) {
                    GameService.manageTower.Fire("Upgrade", towerClient.selected)
                }
            }}/>
        </frame>: undefined}
    </GuiAssets.BaseFrame>)
}

export class TowerClient {
    gui: Roact.Tree
    towerManager: TowerManager
    coinManager: CoinManager
    map: TDSMap
    //selection Related
    selected?: number
    selectFrame?: Frame
    rangeDisplay?: BasePart
    //placement Related
    placing?: number
    rayCast?: RaycastResult
    placeModel?: Model

    constructor(towerManager: TowerManager, coinManager: CoinManager) {
        this.towerManager = towerManager
        this.coinManager = coinManager
        this.map = Workspace.Map.GetChildren()[0] as TDSMap
        this.gui = Roact.mount(towerUI(this), PlayerGui, "TowerGui")
    }

    updateSelection(towerIndex?: number) {
        const towerManager = this.towerManager
        const towers = towerManager.towers
        if (this.selected !== towerIndex && this.rangeDisplay) {
            const toDestroy = this.rangeDisplay
            const tween = TweenService.Create(toDestroy, new TweenInfo(0.5), {Size: new Vector3(0.2, 0, 0)})
            tween.Play()
            tween.Completed.Once(() => {
                toDestroy.Destroy()
            })
        }
        this.selectFrame?.Destroy()
        if (t.number(towerIndex)) {
            const tower = towers[towerIndex]
            const towerInfo = TowerList[towerIndex]
            const levelStat = towerInfo.tInfo.stats[tower.level]

            if(this.selected !== towerIndex && levelStat.range) {
                this.rangeDisplay = ClientAssets.RangeDisplay.Clone()
                this.rangeDisplay.Parent = tower.model
                const towerPos = tower.position
                const displayPos = new Vector3(towerPos.X, towerPos.Y - towerInfo.tInfo.placement.height + 0.1, towerPos.Z)
                this.rangeDisplay.Position = displayPos
                const tween = TweenService.Create(this.rangeDisplay, new TweenInfo(0.5), {Size: new Vector3(levelStat.range * 2, 0.001, levelStat.range * 2)})
                tween.Play()
            }
            this.selected = towerIndex
            return
        }
        this.selected = undefined
    }

    castRay(collisionGroup: string): RaycastResult | undefined{
        const mousePosition = UserInputService.GetMouseLocation()
        const ray = Workspace.CurrentCamera!.ViewportPointToRay(mousePosition.X, mousePosition.Y)
        const rayCastParam = new RaycastParams()
        rayCastParam.CollisionGroup = collisionGroup
        const rayResult = Workspace.Raycast(ray.Origin, ray.Direction.mul(1000), rayCastParam)
        if (rayResult) {
            return rayResult
        }
        return undefined
    }

    checkPlacement(towerType: string, part: BasePart) {
        if(part.GetAttribute("Placement") === towerType) {
            return true
        }
        return false
    }

    startPlacement(index: number) {
        const tower = this.towerManager.cards[index]
        const highLights = this.map.HighLights
        highLights.GetChildren().forEach((obj) => {
            if (obj.IsA("Highlight")) {
                obj.FillTransparency = 1
                obj.OutlineTransparency = 1
                obj.Enabled = true
                let fillT = 0.5
                if (obj.Name === tower.tInfo.placement.type) {
                    obj.FillColor = Color3.fromRGB(0, 255, 0)
                    fillT = 0.3
                }
                else {
                    obj.FillColor = Color3.fromRGB(255, 0, 0)
                }
                const tween = TweenService.Create(obj, new TweenInfo(0.5), {FillTransparency: fillT, OutlineTransparency: 0})
                tween.Play()
            }
        })
        if(this.placeModel) {
            this.placeModel.Destroy()
            this.placeModel = undefined
        }
        this.placing = index
    }

    endPlacement() {
        if (this.placing !== undefined) {
            const highlights = this.map.HighLights
            highlights.GetChildren().forEach((obj) => {
                if (obj.IsA("Highlight")) {
                    task.spawn(() => {
                        const tween = TweenService.Create(obj, new TweenInfo(0.5), {FillTransparency: 1, OutlineTransparency: 1})
                        tween.Play()
                        tween.Completed.Wait()
                        obj.Enabled = false
                    })
                }
            })
            if (this.placeModel) {
                this.placeModel.Destroy()
                this.placeModel = undefined
            }
            this.placing = undefined
            this.rayCast = undefined
        }
    }

    placeTower() {
        const ray = this.rayCast
        if (ray) {
            const tower = this.towerManager.cards[this.placing!]
            if (this.checkPlacement(tower.tInfo.placement.type, ray.Instance)) {
                GameService.placeTower.Fire(this.placing, ray.Position)
                this.endPlacement()
            }
        }
    }

    selectTower() {
        const rayCast = this.castRay("EveryThing")
        const towers = this.towerManager.towers
        if (rayCast) {
            for (let i = 0; i < towers.size(); i++) {
                if (rayCast.Instance.IsDescendantOf(towers[i].model)) {
                    this.updateSelection(i)
                    print("CurrentIndex", this.selected)
                    Roact.update(this.gui, towerUI(this))
                    return
                }
            }
        }
        this.updateSelection(undefined)
        Roact.update(this.gui, towerUI(this))
    }

    mouseClick() {
        if (this.placing !== undefined) {
            this.placeTower()
        }
        else {
            this.selectTower()
        }
    }


    update(towerManager: TowerManager, coinManager: CoinManager) {
        this.towerManager = towerManager
        this.coinManager = coinManager
        this.updateSelection(this.selected)
        this.gui = Roact.update(this.gui, towerUI(this))
    }

    render() {
        if (this.placing !== undefined) {
            const ray = this.castRay("Towers")
            this.rayCast = ray
            const tower = this.towerManager.cards[this.placing]
            if (ray) {
                if (!this.placeModel) {
                    print("ModelRespawn")
                    const model = TowerModels.FindFirstChild(tower.tInfo.name)!.Clone() as Model
                    this.placeModel = model
                    model.Parent = Workspace
                    model.GetDescendants().forEach((part) => {
                        if (part.IsA("BasePart")) {
                            part.CollisionGroup = "Towers"
                            part.Anchored = true
                            part.CanCollide = true
                            part.CanTouch = false
                            part.CanQuery = false
                            part.Material = Enum.Material.ForceField
                            if (part.IsA("MeshPart")) {
                                part.Transparency = 0.5
                            }
                        }
                    })
                }
                const canPlace = this.checkPlacement(tower.tInfo.placement.type, ray.Instance)
                const pos = new Vector3(ray.Position.X, ray.Position.Y + tower.tInfo.placement.height, ray.Position.Z)
                this.placeModel.PivotTo(new CFrame(pos))
                let color = new Color3(1, 0, 0)
                if (canPlace) {
                    color = new Color3(0, 1, 0)
                }
                this.placeModel.GetDescendants().forEach((part) => {
                    if (part.IsA("BasePart")) {
                        part.Color = color
                    }
                })
            }
            else {
                if (this.placeModel) {
                    this.placeModel.Destroy()
                    this.placeModel = undefined
                }
            }
        }
    }
}