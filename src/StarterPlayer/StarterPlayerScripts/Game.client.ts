import { KnitClient } from "@rbxts/knit";
import { Players, ReplicatedStorage, RunService, UserInputService } from "@rbxts/services";
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
    RunService.RenderStepped.Connect(() => {
        clientObj.TowerClient.render()
    })

    UserInputService.InputBegan.Connect((inputObj) => {
        if (inputObj.KeyCode === Enum.KeyCode.F) {
            clientObj.TowerClient.endPlacement()
        }
        const mouseLocation = UserInputService.GetMouseLocation()
        const frames = PlayerGui.GetGuiObjectsAtPosition(mouseLocation.X, mouseLocation.Y - 36)
        let clickValid = true
        frames.forEach((frame) => {
            if (!(frame.BackgroundTransparency === 1)) {
                clickValid = false
            }
        })
        if (clickValid) {
            if (inputObj.UserInputType === Enum.UserInputType.MouseButton1) {
                clientObj.TowerClient.mouseClick()
            }
        }
    })
})

if (Player.Character) {
    GameService.gameLoaded.Fire()
}
else {
    Player.CharacterAdded.Once(() => {
        GameService.gameLoaded.Fire()
    })
}