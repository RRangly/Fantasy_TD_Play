import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import type { TDPlayer } from "ServerScriptService/Game.server";
import type { BaseManager } from "ServerScriptService/Modules/BaseManager";
import type { CoinManager } from "ServerScriptService/Modules/CoinManager";


const PlayerGui = Players.LocalPlayer.FindFirstChild("PlayerGui") as PlayerGui

function healthBar(baseManager: BaseManager) {

}

function hud(hudManager: HudManager): Roact.Element {
    return (<></>)
}

export class HudManager {
    baseManager: BaseManager
    coinManager: CoinManager
    hud: Roact.Tree

    constructor(baseManager: BaseManager, coinManager: CoinManager) {
        this.baseManager = baseManager
        this.coinManager = coinManager
        this.hud = Roact.mount(hud(this), PlayerGui,)
    }
}