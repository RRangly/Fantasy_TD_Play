import Roact, { Ref } from "@rbxts/roact";
import { Players, TweenService } from "@rbxts/services";
import { GuiAssets } from "ReplicatedStorage/Game/GuiAssets";
import type { TDPlayer } from "ServerScriptService/Game.server";
import type { BaseManager } from "ServerScriptService/Modules/BaseManager";
import type { CoinManager } from "ServerScriptService/Modules/CoinManager";
import type { WaveManager } from "ServerScriptService/Modules/WaveManager";


const PlayerGui = Players.LocalPlayer.FindFirstChild("PlayerGui") as PlayerGui

function hud(hudManager: HudManager): Roact.Element {
    const maxHealth = hudManager.maxHealth
    const hpercent = hudManager.prevHealth / maxHealth
    hudManager.hBarRef = Roact.createRef<Frame>()
    return (<GuiAssets.BaseFrame>
        <frame Key="HealthBar" Size={new UDim2(0.35, 0, 0.03, 0)} Position={new UDim2(0.5, 0, 0.005, 0)} BackgroundColor3={Color3.fromRGB(43,43,43)} AnchorPoint={new Vector2(0.5, 0)}>
            <uicorner CornerRadius={new UDim(0, 8)}/>
            <frame Key= "Bar" Size={new UDim2(hpercent * 0.984, 0, 0.8, 0)} Position={new UDim2(0.008, 0, 0.5, 0)} BackgroundColor3={Color3.fromRGB(45,103,58)} AnchorPoint={new Vector2(0, 0.5)} Ref={hudManager.hBarRef}>
                <uicorner CornerRadius={new UDim(0, 8)}/>
            </frame>
            <textlabel
            Key="CoinText"
            Size={new UDim2(0.4, 0, 0.7, 0)} 
            Position={new UDim2(0.1, 0, 1.3, 0)}
            Text={"Coins:" + hudManager.coin}
            BackgroundTransparency={1} 
            Font={"SpecialElite"}
            TextScaled = {true}
            TextXAlignment={"Left"}
            TextYAlignment={"Top"}
            TextWrapped={true}>
                <uistroke Color={new Color3()} Thickness={0.3} />
                <uitextsizeconstraint MaxTextSize={20} MinTextSize={1}/>
            </textlabel>
            <textlabel
            Key="WaveText"
            Size={new UDim2(0.4, 0, 0.7, 0)} 
            Position={new UDim2(0.5, 0, 1.3, 0)}
            Text={"Wave:" + hudManager.wave}
            BackgroundTransparency={1}
            Font={"SpecialElite"}
            TextScaled = {true}
            TextXAlignment={"Right"}
            TextYAlignment={"Top"}
            TextWrapped={true}>
                <uistroke Color={new Color3()} Thickness={0.3} />
                <uitextsizeconstraint MaxTextSize={20} MinTextSize={1}/>
            </textlabel>
        </frame>
    </GuiAssets.BaseFrame>)
}

export class HudManager {
    prevHealth: number
    readonly maxHealth: number
    health: number
    coin: number
    wave: number
    notiFrame!: Ref<Frame>
    hBarRef!: Ref<Frame>
    hud: Roact.Tree

    constructor(baseManager: BaseManager, coinManager: CoinManager, waveManager: WaveManager) {
        this.maxHealth = baseManager.maxHealth
        this.health = baseManager.health
        this.coin = coinManager.coin
        this.wave = waveManager.currentWave
        this.prevHealth = baseManager.health
        this.hud = Roact.mount(hud(this), PlayerGui, "Hud")
    }

    baseUpdate(health: number) {
        this.health = health
        this.hud = Roact.update(this.hud, hud(this))
        const hpercent = this.health / this.maxHealth
        const tween = TweenService.Create(this.hBarRef.getValue()!, new TweenInfo(0.1), {Size: new UDim2(hpercent * 0.984, 0, 0.8, 0)})
        tween.Play()
        this.prevHealth = health
    }

    coinUpdate(coin: number) {
        this.coin = coin
        this.hud = Roact.update(this.hud, hud(this))
    }

    waveUpdate(wave: number) {
        this.wave = wave
        this.hud = Roact.update(this.hud, hud(this))
    }

    notification(text: string) {

    }
}