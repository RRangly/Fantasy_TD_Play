import Roact, { Ref } from "@rbxts/roact";
import { Players, TweenService } from "@rbxts/services";
import { GuiAssets } from "ReplicatedStorage/Game/GuiAssets";
import type { TDPlayer } from "ServerScriptService/Game.server";
import type { BaseManager } from "ServerScriptService/Modules/BaseManager";
import type { CoinManager } from "ServerScriptService/Modules/CoinManager";


const PlayerGui = Players.LocalPlayer.FindFirstChild("PlayerGui") as PlayerGui

function healthBar(baseManager: BaseManager) {

}

function hud(hudManager: HudManager): Roact.Element {
    const baseManager = hudManager.baseManager
    const maxHealth = baseManager.maxHealth
    const hpercent = hudManager.prevHealth / maxHealth
    hudManager.hBarRef = Roact.createRef<Frame>()
    return (<GuiAssets.BaseFrame>
        <frame Key="HealthBar" Size={new UDim2(0.35, 0, 0.03, 0)} Position={new UDim2(0.5, 0, 0.005, 0)} BackgroundColor3={Color3.fromRGB(43,43,43)} AnchorPoint={new Vector2(0.5, 0)}>
            <uicorner CornerRadius={new UDim(0, 8)}/>
            <frame Key= "Bar" Size={new UDim2(hpercent * 0.984, 0, 0.8, 0)} Position={new UDim2(0.008, 0, 0.5, 0)} BackgroundColor3={Color3.fromRGB(45,103,58)} AnchorPoint={new Vector2(0, 0.5)} Ref={hudManager.hBarRef}>
                <uicorner CornerRadius={new UDim(0, 8)}/>
            </frame>
        </frame>
    </GuiAssets.BaseFrame>)
}

export class HudManager {
    prevHealth: number
    baseManager: BaseManager
    coinManager: CoinManager
    hBarRef!: Ref<Frame>
    hud: Roact.Tree

    constructor(baseManager: BaseManager, coinManager: CoinManager) {
        this.baseManager = baseManager
        this.coinManager = coinManager
        this.prevHealth = baseManager.health
        this.hud = Roact.mount(hud(this), PlayerGui, "Hud")
    }

    update(baseManager: BaseManager, coinManager: CoinManager) {
        this.prevHealth = baseManager.health
        this.baseManager = baseManager
        this.coinManager = coinManager
        this.hud = Roact.update(this.hud, hud(this))
        const hpercent = this.baseManager.health / this.baseManager.maxHealth
        const tween = TweenService.Create(this.hBarRef.getValue()!, new TweenInfo(0.1), {Size: new UDim2(hpercent * 0.984, 0, 0.8, 0)})
        tween.Play()
    }
}