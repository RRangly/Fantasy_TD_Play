import { KnitClient } from "@rbxts/knit";
import { Players, ReplicatedStorage, RunService, UserInputService } from "@rbxts/services";
import { GetData } from "ReplicatedStorage/Data";
import { TowerClient } from "./Modules/TowerClient";
import { Tower } from "ReplicatedStorage/Towers/TowerMechanics";
import Roact from "@rbxts/roact";
import type { TDPlayer } from "ServerScriptService/Game.server";
import type { MobManager } from "ServerScriptService/Modules/MobManager";
import { HealthDisplay } from "./Modules/HealthDisplay";

const Player = Players.LocalPlayer
const PlayerGui = Player.FindFirstChild("PlayerGui") as PlayerGui
const GameService = KnitClient.GetService("GameService")

interface Client {
    TowerClient: TowerClient
    HealthDisplay: HealthDisplay
}

let clientObj: Client
GameService.gameStart.Connect((data: TDPlayer) => {
    clientObj = {
        TowerClient: new TowerClient(data.towerManager, data.shopManager, data.coinManager),
        HealthDisplay: new HealthDisplay(data.mobManager)
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

RunService.RenderStepped.Connect(() => {
    if (clientObj) {
        clientObj.TowerClient.render()
    }
})

GameService.signalUpdate.Connect((data: TDPlayer) => {
    clientObj.TowerClient.update(data.towerManager, data.shopManager, data.coinManager)
})

GameService.mobUpdate.Connect((mobManager: MobManager) => {
    clientObj.HealthDisplay.update(mobManager)
})

if (Player.Character) {
    GameService.gameLoaded.Fire()
}
else {
    Player.CharacterAdded.Once(() => {
        GameService.gameLoaded.Fire()
    })
}