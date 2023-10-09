import { KnitClient } from "@rbxts/knit";
import { Players, ReplicatedStorage } from "@rbxts/services";
import { GetData } from "ReplicatedStorage/Data";
import type { TDPlayer } from "ServerScriptService/Game.Server";
import { TowerClient } from "./Modules/TowerClient";
import { Tower } from "ReplicatedStorage/Towers/Towers";

const Player = Players.LocalPlayer
const GameService = KnitClient.GetService("GameService")

interface Client {
    TowerClient: TowerClient
}

Player.CharacterAdded.Connect(() => {
    GameService.GameLoaded.Fire()
    const data: Client = {
        TowerClient: new TowerClient()
    }
    GameService.TowerUpdate.Connect(data.TowerClient.update)
})