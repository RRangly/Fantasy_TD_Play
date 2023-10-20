import { KnitClient } from "@rbxts/knit";
import { Players, ReplicatedStorage } from "@rbxts/services";
import { GetData } from "ReplicatedStorage/Data";
import { TowerClient } from "./Modules/TowerClient";
import { Tower } from "ReplicatedStorage/Towers/Towers";
import Roact from "@rbxts/roact";
import type { TDPlayer } from "ServerScriptService/Game.server";

const Player = Players.LocalPlayer
const PlayerGui = Player.FindFirstChild("PlayerGui") as PlayerGui
const GameService = KnitClient.GetService("GameService")

interface Client {
    TowerClient: TowerClient
}

GameService.dataUpdate.Connect((data: TDPlayer) => {
    if (!data) {
        return
    }
    const clientObj: Client = {
        TowerClient: new TowerClient(data.towerManager, data.shopManager, data.coinManager)
    }
    print("Mounted")
})

if (Player.Character) {
    GameService.gameLoaded.Fire()
}
else {
    Player.CharacterAdded.Once(() => {
        GameService.gameLoaded.Fire()
    })
}