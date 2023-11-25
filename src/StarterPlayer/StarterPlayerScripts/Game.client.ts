import { KnitClient } from "@rbxts/knit";
import Roact from "@rbxts/roact";
import { Players, ReplicatedStorage, RunService, UserInputService } from "@rbxts/services";
import type { BaseManager } from "ServerScriptService/Modules/BaseManager";
import type { TDPlayer } from "ServerScriptService/Game.server";
import type { MobManager } from "ServerScriptService/Modules/MobManager";
import { GetData } from "ReplicatedStorage/Data";
import { TowerClient } from "./Modules/TowerClient";
import { Tower } from "ReplicatedStorage/Towers/TowerMechanics";
import { HealthDisplay } from "./Modules/HealthDisplay";
import { HudManager } from "./Modules/Hud";
import { Mob } from "ReplicatedStorage/Mobs/MobMechanics";


const Player = Players.LocalPlayer
const PlayerGui = Player.FindFirstChild("PlayerGui") as PlayerGui
const GameService = KnitClient.GetService("GameService")

interface Client {
    TowerClient: TowerClient
    Hud: HudManager
    HealthDisplay: HealthDisplay
}

let clientObj: Client
GameService.gameStart.Connect((data: TDPlayer) => {
    clientObj = {
        TowerClient: new TowerClient(data.towerManager, data.coinManager),
        Hud: new HudManager(data.baseManager, data.coinManager, data.waveManager),
        HealthDisplay: new HealthDisplay(data.mobManager),
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

GameService.towerUpdate.Connect((data: TDPlayer) => {
    clientObj.TowerClient.update(data.towerManager, data.coinManager)
})

GameService.baseUpdate.Connect((health: number) => {
    clientObj.Hud.baseUpdate(health)
})

GameService.coinUpdate.Connect((coin: number) => {
    clientObj.Hud.coinUpdate(coin)
})

GameService.waveUpdate.Connect((wave: number) => {
    clientObj.Hud.waveUpdate(wave)
})

GameService.playSound.Connect((sounds: Array<string>) => {
    for (let i = 0; i < sounds.size(); i++) {
        const sound = ReplicatedStorage.SoundFX.FindFirstChild(sounds[i]) as Sound
        sound.Play()
    }
})

if (Player.Character) {
    GameService.gameLoaded.Fire()
}
else {
    Player.CharacterAdded.Once(() => {
        GameService.gameLoaded.Fire()
    })
}