import { KnitClient } from "@rbxts/knit";
import { Players, ReplicatedStorage } from "@rbxts/services";
import { GetData } from "ReplicatedStorage/Data";
import { TowerClient } from "./Modules/TowerClient";
import { Tower } from "ReplicatedStorage/Towers/Towers";

const Player = Players.LocalPlayer
const GameService = KnitClient.GetService("GameService")
const UserId = Player.UserId

interface Client {
    TowerClient: TowerClient
}

if (Player.Character) {
    GameService.GameLoaded.Fire()
}
else {
    Player.CharacterAdded.Once(() => {
        GameService.GameLoaded.Fire()
    })
}

Player.CharacterAdded.Connect(() => {
    const Data = GetData(UserId)
    if (!Data) {
        return
    }
    const clientObj: Client = {
        TowerClient: new TowerClient({
            towerManager: Data.towerManager,
            shopManager: Data.shopManager,
            coinManager: Data.coinManager,
        })
    }
    clientObj.TowerClient.update(Data.towerManager)
})