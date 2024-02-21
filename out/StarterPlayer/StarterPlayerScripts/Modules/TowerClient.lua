-- Compiled with roblox-ts v2.2.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Roact = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "roact", "src")
local _services = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services")
local Players = _services.Players
local ReplicatedStorage = _services.ReplicatedStorage
local TweenService = _services.TweenService
local UserInputService = _services.UserInputService
local Workspace = _services.Workspace
local TowerList = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Towers", "Towers").TowerList
local GuiAssets = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Game", "GuiAssets").GuiAssets
local KnitClient = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "knit", "Knit").KnitClient
local t = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "t", "lib", "ts").t
local TowerModels = ReplicatedStorage.TowerModels
local ClientAssets = ReplicatedStorage.ClientAssets
local GameService = KnitClient.GetService("GameService")
local PlayerGui = Players.LocalPlayer:FindFirstChild("PlayerGui")
--[[
	
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
	
]]
local function cardsFrame(towerClient)
	local posMargin = 1 / 6
	local cards = towerClient.towerManager.cards
	local frames = {}
	do
		local _i = 0
		local _shouldIncrement = false
		while true do
			local i = _i
			if _shouldIncrement then
				i += 1
			else
				_shouldIncrement = true
			end
			if not (i < 5) then
				break
			end
			frames[i + 1] = Roact.createFragment({
				[tostring(i)] = Roact.createElement("ImageButton", {
					Image = "rbxassetid://14886195550",
					Size = UDim2.new(0.11, 0, 1, 0),
					Position = UDim2.new(posMargin * (i + 1), 0, 0, 0),
					AnchorPoint = Vector2.new(0.5, 0),
					BackgroundTransparency = 1,
					ScaleType = "Crop",
					[Roact.Event.MouseButton1Down] = function()
						towerClient:startPlacement(i)
					end,
				}, {
					Roact.createElement(GuiAssets.ImageFrame, {
						key = "TowerImage",
						image = cards[i + 1].tInfo.image,
						anchorPoint = Vector2.new(0.5, 1),
						size = UDim2.new(0.5, 0, 0.1, 0),
						position = UDim2.new(0.5, 0, 0.99, 0),
					}),
				}),
			})
			_i = i
		end
	end
	local _attributes = {
		Size = UDim2.new(0.5, 0, 0.1, 0),
		Position = UDim2.new(0.5, 0, 0.99, 0),
		AnchorPoint = Vector2.new(0.5, 0.99),
		BackgroundTransparency = 1,
	}
	local _children = {}
	local _length = #_children
	for _k, _v in frames do
		_children[_length + _k] = _v
	end
	return Roact.createFragment({
		Cards = Roact.createElement("Frame", _attributes, _children),
	})
end
local function towerUI(towerClient)
	local tower = nil
	if t.number(towerClient.selected) then
		tower = towerClient.towerManager.towers[towerClient.selected + 1]
	end
	local statStrings = {}
	if tower then
		local level = tower.level
		local stats = tower.stats[level + 1]
		local nextStats = tower.stats[level + 1 + 1]
		local i = 0
		for key in pairs(stats) do
			if key == "levelName" then
				continue
			end
			local _value = nextStats[key]
			if _value ~= 0 and (_value == _value and _value) then
				local _statStrings = statStrings
				local _arg0 = Roact.createFragment({
					NextLevel = Roact.createElement("TextLabel", {
						Size = UDim2.new(0.054, 0, 0.12, 0),
						Position = UDim2.new(0.9, 0, 0.02 + 0.14 * i, 0),
						BackgroundTransparency = 1,
						Font = "SpecialElite",
						Text = key .. ": " .. tostring(stats[key]) .. " -> " .. tostring(nextStats[key]),
						TextScaled = true,
						TextXAlignment = "Left",
						TextYAlignment = "Top",
						TextWrapped = true,
					}, {
						Roact.createElement("UIStroke", {
							Color = Color3.new(),
							Thickness = 0.3,
						}),
						Roact.createElement("UITextSizeConstraint", {
							MaxTextSize = 24,
							MinTextSize = 1,
						}),
					}),
				})
				table.insert(_statStrings, _arg0)
			end
			i += 1
		end
	end
	local _result
	if tower then
		local _attributes = {
			BackgroundTransparency = 1,
			AnchorPoint = Vector2.new(0.5, 0.5),
			Position = UDim2.new(0.5, 0, 0.5, 0),
			Size = UDim2.new(0.35, 0, 0.46, 0),
		}
		local _children = {
			Image = Roact.createElement("ImageLabel", {
				Image = "rbxassetid://14886212727",
				Size = UDim2.new(0.8, 0, 1.07, 0),
				Position = UDim2.new(0.5, 0, 0.5, 0),
				ZIndex = -1,
				AnchorPoint = Vector2.new(0.5, 0.5),
				ScaleType = "Crop",
				BackgroundTransparency = 1,
				Rotation = 90,
				SizeConstraint = "RelativeXX",
			}),
			Roact.createElement(GuiAssets.ImageFrame, {
				key = "Level",
				image = "rbxassetid://14886195550",
				size = UDim2.new(0.15, 0, 0.22, 0),
				position = UDim2.new(0, 0, 0, 0),
				anchorPoint = Vector2.new(0.4, 0.3),
			}, {
				Roact.createElement("TextLabel", {
					Size = UDim2.new(0.5, 0, 0.5, 0),
					Position = UDim2.new(0.5, 0, 0.5, 0),
					BackgroundTransparency = 1,
					Font = "SpecialElite",
					TextScaled = true,
					TextXAlignment = "Center",
					TextYAlignment = "Center",
					TextWrapped = true,
				}, {
					Roact.createElement("UIStroke", {
						Color = Color3.new(),
						Thickness = 1,
					}),
					Roact.createElement("UITextSizeConstraint", {
						MaxTextSize = 60,
						MinTextSize = 1,
					}),
				}),
			}),
			CardName = Roact.createElement("TextLabel", {
				Size = UDim2.new(0.4, 0, 0.07, 0),
				Position = UDim2.new(0.05, 0, 0.08, 0),
				BackgroundTransparency = 1,
				Font = "SpecialElite",
				Text = tower.name,
				TextScaled = true,
				TextXAlignment = "Center",
				TextYAlignment = "Center",
				TextWrapped = true,
			}, {
				Roact.createElement("UIStroke", {
					Color = Color3.new(),
					Thickness = 0.5,
				}),
				Roact.createElement("UITextSizeConstraint", {
					MaxTextSize = 40,
					MinTextSize = 1,
				}),
			}),
			Roact.createElement(GuiAssets.ImageButton, {
				key = "Priority",
				image = "rbxassetid://14886174309",
				size = UDim2.new(0.34, 0, 0.112, 0),
				position = UDim2.new(0.085, 0, 0.8, 0),
				anchorPoint = Vector2.new(0, 0),
				maxTextSize = 22,
				text1 = "Priority",
				text2 = tostring(tower.priority),
				event = function()
					GameService.manageTower:Fire("Priority", towerClient.selected)
				end,
			}),
			Roact.createElement(GuiAssets.ImageButton, {
				key = "Sell",
				image = "rbxassetid://14886174309",
				size = UDim2.new(0.34, 0, 0.112, 0),
				position = UDim2.new(0.085, 0, 0.67, 0),
				anchorPoint = Vector2.new(0, 0),
				maxTextSize = 22,
				text1 = "Sell",
				text2 = tostring(tower.stats[tower.level + 1].cost),
				event = function()
					if tower then
						GameService.manageTower:Fire("Sell", towerClient.selected)
						towerClient.selected = nil
					end
				end,
			}),
			Roact.createElement(GuiAssets.ImageFrame, {
				key = "CardImage",
				image = "rbxassetid://14886195550",
				size = UDim2.new(0.4, 0, 0.52, 0),
				position = UDim2.new(0.05, 0, 0.17, 0),
				anchorPoint = Vector2.new(0, 0),
			}, {
				Roact.createElement(GuiAssets.ImageFrame, {
					key = "Image",
					image = tower.image,
					size = UDim2.new(0.7, 0, 0.7, 0),
					position = UDim2.new(0.5, 0, 0.5, 0),
					anchorPoint = Vector2.new(0.5, 0.5),
				}),
			}),
			Roact.createElement(GuiAssets.ImageFrame, {
				key = "UpgradeImage",
				image = "rbxassetid://14886195550",
				size = UDim2.new(0.32, 0, 0.416, 0),
				position = UDim2.new(0.41, 0, 0.07, 0),
				anchorPoint = Vector2.new(0, 0),
			}, {
				Roact.createElement(GuiAssets.ImageFrame, {
					key = "Image",
					image = tower.image,
					size = UDim2.new(0.7, 0, 0.7, 0),
					position = UDim2.new(0.5, 0, 0.5, 0),
					anchorPoint = Vector2.new(0.5, 0.5),
				}),
			}),
			NextLevelNum = Roact.createElement("TextLabel", {
				Size = UDim2.new(0.25, 0, 0.04, 0),
				Position = UDim2.new(0.73, 0, 0.12, 0),
				BackgroundTransparency = 1,
				Font = "SpecialElite",
				Text = tostring(tower.level + 1),
				TextScaled = true,
				TextXAlignment = "Center",
				TextYAlignment = "Center",
				TextWrapped = true,
			}, {
				Roact.createElement("UIStroke", {
					Color = Color3.new(),
					Thickness = 0.3,
				}),
				Roact.createElement("UITextSizeConstraint", {
					MaxTextSize = 24,
					MinTextSize = 1,
				}),
			}),
			NextLevelName = Roact.createElement("TextLabel", {
				Size = UDim2.new(0.25, 0, 0.06, 0),
				Position = UDim2.new(0.73, 0, 0.2, 0),
				BackgroundTransparency = 1,
				Font = "SpecialElite",
				Text = tower.name,
				TextScaled = true,
				TextXAlignment = "Center",
				TextYAlignment = "Center",
				TextWrapped = true,
			}, {
				Roact.createElement("UIStroke", {
					Color = Color3.new(),
					Thickness = 0.3,
				}),
				Roact.createElement("UITextSizeConstraint", {
					MaxTextSize = 30,
					MinTextSize = 1,
				}),
			}),
		}
		local _length = #_children
		local _attributes_1 = {
			BackgroundTransparency = 1,
			Position = UDim2.new(0.44, 0, 0.46, 0),
			Size = UDim2.new(0.54, 0, 0.38, 0),
		}
		local _children_1 = {}
		local _length_1 = #_children_1
		for _k, _v in statStrings do
			_children_1[_length_1 + _k] = _v
		end
		_children.Stats = Roact.createElement("Frame", _attributes_1, _children_1)
		_children[_length + 1] = Roact.createElement(GuiAssets.ImageButton, {
			key = "Upgrade",
			image = "rbxassetid://14886174309",
			size = UDim2.new(0.34, 0, 0.112, 0),
			position = UDim2.new(0.65, 0, 0.86, 0),
			anchorPoint = Vector2.new(0, 0),
			maxTextSize = 22,
			text1 = "Upgrade",
			text2 = tostring(tower.stats[tower.level + 1 + 1].cost),
			event = function()
				if towerClient.coinManager.coin >= tower.stats[tower.level + 1 + 1].cost then
					GameService.manageTower:Fire("Upgrade", towerClient.selected)
				end
			end,
		})
		_result = Roact.createFragment({
			SelectFrame = Roact.createElement("Frame", _attributes, _children),
		})
	else
		_result = nil
	end
	local _children = {
		cardsFrame(towerClient),
	}
	local _length = #_children
	if _result then
		_children[_length + 1] = _result
	end
	return Roact.createElement(GuiAssets.BaseFrame, {}, _children)
end
local TowerClient
do
	TowerClient = setmetatable({}, {
		__tostring = function()
			return "TowerClient"
		end,
	})
	TowerClient.__index = TowerClient
	function TowerClient.new(...)
		local self = setmetatable({}, TowerClient)
		return self:constructor(...) or self
	end
	function TowerClient:constructor(towerManager, coinManager)
		self.towerManager = towerManager
		self.coinManager = coinManager
		self.map = Workspace.Map:GetChildren()[1]
		self.gui = Roact.mount(towerUI(self), PlayerGui, "TowerGui")
	end
	function TowerClient:updateSelection(towerIndex)
		local towerManager = self.towerManager
		local towers = towerManager.towers
		if self.selected ~= towerIndex and self.rangeDisplay then
			local toDestroy = self.rangeDisplay
			local tween = TweenService:Create(toDestroy, TweenInfo.new(0.5), {
				Size = Vector3.new(0.2, 0, 0),
			})
			tween:Play()
			tween.Completed:Once(function()
				toDestroy:Destroy()
			end)
		end
		local _result = self.selectFrame
		if _result ~= nil then
			_result:Destroy()
		end
		if t.number(towerIndex) then
			local tower = towers[towerIndex + 1]
			local towerInfo = TowerList[towerIndex + 1]
			local levelStat = towerInfo.tInfo.stats[tower.level + 1]
			local _value = self.selected ~= towerIndex and levelStat.range
			if _value ~= 0 and (_value == _value and _value) then
				self.rangeDisplay = ClientAssets.RangeDisplay:Clone()
				self.rangeDisplay.Parent = tower.model
				local towerPos = tower.position
				local displayPos = Vector3.new(towerPos.X, towerPos.Y - towerInfo.tInfo.placement.height + 0.1, towerPos.Z)
				self.rangeDisplay.Position = displayPos
				local tween = TweenService:Create(self.rangeDisplay, TweenInfo.new(0.5), {
					Size = Vector3.new(levelStat.range * 2, 0.001, levelStat.range * 2),
				})
				tween:Play()
			end
			self.selected = towerIndex
			return nil
		end
		self.selected = nil
	end
	function TowerClient:castRay(collisionGroup)
		local mousePosition = UserInputService:GetMouseLocation()
		local ray = Workspace.CurrentCamera:ViewportPointToRay(mousePosition.X, mousePosition.Y)
		local rayCastParam = RaycastParams.new()
		rayCastParam.CollisionGroup = collisionGroup
		local rayResult = Workspace:Raycast(ray.Origin, ray.Direction * 1000, rayCastParam)
		if rayResult then
			return rayResult
		end
		return nil
	end
	function TowerClient:checkPlacement(towerType, part)
		if part:GetAttribute("Placement") == towerType then
			return true
		end
		return false
	end
	function TowerClient:startPlacement(index)
		local tower = self.towerManager.cards[index + 1]
		local highLights = self.map.HighLights
		local _exp = highLights:GetChildren()
		local _arg0 = function(obj)
			if obj:IsA("Highlight") then
				obj.FillTransparency = 1
				obj.OutlineTransparency = 1
				obj.Enabled = true
				local fillT = 0.5
				if obj.Name == tower.tInfo.placement.type then
					obj.FillColor = Color3.fromRGB(0, 255, 0)
					fillT = 0.3
				else
					obj.FillColor = Color3.fromRGB(255, 0, 0)
				end
				local tween = TweenService:Create(obj, TweenInfo.new(0.5), {
					FillTransparency = fillT,
					OutlineTransparency = 0,
				})
				tween:Play()
			end
		end
		for _k, _v in _exp do
			_arg0(_v, _k - 1, _exp)
		end
		if self.placeModel then
			self.placeModel:Destroy()
			self.placeModel = nil
		end
		self.placing = index
	end
	function TowerClient:endPlacement()
		if self.placing ~= nil then
			local highlights = self.map.HighLights
			local _exp = highlights:GetChildren()
			local _arg0 = function(obj)
				if obj:IsA("Highlight") then
					task.spawn(function()
						local tween = TweenService:Create(obj, TweenInfo.new(0.5), {
							FillTransparency = 1,
							OutlineTransparency = 1,
						})
						tween:Play()
						tween.Completed:Wait()
						obj.Enabled = false
					end)
				end
			end
			for _k, _v in _exp do
				_arg0(_v, _k - 1, _exp)
			end
			if self.placeModel then
				self.placeModel:Destroy()
				self.placeModel = nil
			end
			self.placing = nil
			self.rayCast = nil
		end
	end
	function TowerClient:placeTower()
		local ray = self.rayCast
		if ray then
			local tower = self.towerManager.cards[self.placing + 1]
			if self:checkPlacement(tower.tInfo.placement.type, ray.Instance) then
				GameService.placeTower:Fire(self.placing, ray.Position)
				self:endPlacement()
			end
		end
	end
	function TowerClient:selectTower()
		local rayCast = self:castRay("EveryThing")
		local towers = self.towerManager.towers
		if rayCast then
			do
				local i = 0
				local _shouldIncrement = false
				while true do
					if _shouldIncrement then
						i += 1
					else
						_shouldIncrement = true
					end
					if not (i < #towers) then
						break
					end
					if rayCast.Instance:IsDescendantOf(towers[i + 1].model) then
						self:updateSelection(i)
						print("CurrentIndex", self.selected)
						Roact.update(self.gui, towerUI(self))
						return nil
					end
				end
			end
		end
		self:updateSelection(nil)
		Roact.update(self.gui, towerUI(self))
	end
	function TowerClient:mouseClick()
		if self.placing ~= nil then
			self:placeTower()
		else
			self:selectTower()
		end
	end
	function TowerClient:update(towerManager, coinManager)
		self.towerManager = towerManager
		self.coinManager = coinManager
		self:updateSelection(self.selected)
		self.gui = Roact.update(self.gui, towerUI(self))
	end
	function TowerClient:render()
		if self.placing ~= nil then
			local ray = self:castRay("Towers")
			self.rayCast = ray
			local tower = self.towerManager.cards[self.placing + 1]
			if ray then
				if not self.placeModel then
					print("ModelRespawn")
					local model = TowerModels:FindFirstChild(tower.tInfo.name):Clone()
					self.placeModel = model
					model.Parent = Workspace
					local _exp = model:GetDescendants()
					local _arg0 = function(part)
						if part:IsA("BasePart") then
							part.CollisionGroup = "Towers"
							part.Anchored = true
							part.CanCollide = true
							part.CanTouch = false
							part.CanQuery = false
							part.Material = Enum.Material.ForceField
							if part:IsA("MeshPart") then
								part.Transparency = 0.5
							end
						end
					end
					for _k, _v in _exp do
						_arg0(_v, _k - 1, _exp)
					end
				end
				local canPlace = self:checkPlacement(tower.tInfo.placement.type, ray.Instance)
				local pos = Vector3.new(ray.Position.X, ray.Position.Y + tower.tInfo.placement.height, ray.Position.Z)
				self.placeModel:PivotTo(CFrame.new(pos))
				local color = Color3.new(1, 0, 0)
				if canPlace then
					color = Color3.new(0, 1, 0)
				end
				local _exp = self.placeModel:GetDescendants()
				local _arg0 = function(part)
					if part:IsA("BasePart") then
						part.Color = color
					end
				end
				for _k, _v in _exp do
					_arg0(_v, _k - 1, _exp)
				end
			else
				if self.placeModel then
					self.placeModel:Destroy()
					self.placeModel = nil
				end
			end
		end
	end
end
return {
	TowerClient = TowerClient,
}
