import { KnitServer, RemoteSignal } from "@rbxts/knit";
import { BaseManager } from "./Modules/BaseManager";
import { CoinManager } from "./Modules/CoinManager";
import { MapManager } from "./Modules/MapManager";
import { MobManager } from "./Modules/MobManager";
import { ShopManager } from "./Modules/ShopManager";
import { TowerManager } from "./Modules/TowerManager";
import { TraitsManager } from "./Modules/TraitsManager";
import { WaveManager } from "./Modules/WaveManager";
import { GetData, SetData } from "../ReplicatedStorage/Data";
import { Player } from "@rbxts/knit/Knit/KnitClient";
import { t } from "@rbxts/t";
import { RunService } from "@rbxts/services";

declare global {
    interface KnitServices {
        GameService: typeof GameService
    }
}

export class TDPlayer {
    userID: number;
    towerManager: TowerManager;
    mobManager: MobManager;
    baseManager: BaseManager;
    coinManager: CoinManager;
    mapManager: MapManager;
    shopManager: ShopManager;
    traitsManager: TraitsManager;
    waveManager: WaveManager;
    constructor(player: Player) {
        this.userID = player.UserId
        this.mapManager = new MapManager("Forest_Camp", new Vector3(0, 0, 0))
        this.towerManager = new TowerManager(this.userID)
        this.mobManager = new MobManager(this.userID)
        this.baseManager = new BaseManager(this.userID)
        this.coinManager = new CoinManager(this.userID)
        this.shopManager = new ShopManager(this.userID)
        this.traitsManager = new TraitsManager(this.userID)
        this.waveManager = new WaveManager(this.userID)

        this.shopManager.reRollFree()
        SetData(this.userID, this)
    }
    update(deltaTime: number) {
        const towers = this.towerManager.towers
        for(let i = 0; i < towers.size(); i++) {
            const att = towers[i].update(deltaTime)
            this.traitsManager.invoke("MobDamage", att)
        }
        /*
        for(let i = 0; i < this.mobManager.mobs.size(); i++) {
            this.mobManager.movement(i, deltaTime)
        }
        */
    }
}

export const GameService = KnitServer.CreateService({
    Name: "GameService",

    Client: {
        GameLoaded: new RemoteSignal<() => void>(),
        PlaceTower: new RemoteSignal<(index: unknown, position: unknown) => void>(),
        ManageTower: new RemoteSignal<(manageType: unknown, towerIndex: unknown) => void>(),
        ManageShop: new RemoteSignal<(manageType: unknown, index?: unknown) => void>(),
        TowerUpdate: new RemoteSignal<() => void>(),
        ShopUpdate: new RemoteSignal<() => void>(),
    },
    
    KnitInit() {
        this.Client.GameLoaded.Connect((player: Player) => {
            const tdPlayer = new TDPlayer(player)
            task.wait(5)
            player.Character?.MoveTo(tdPlayer.mapManager.playerSpawn)
            let count = 0
            let passed = 0
            tdPlayer.waveManager.startWave()
            RunService.Heartbeat.Connect(function(deltaTime: number) {
                count += 1
                passed += deltaTime
                if (count >= 60) {
                    tdPlayer.update(passed)
                }
            })
        })
        this.Client.PlaceTower.Connect((player: Player, index: unknown, position: unknown) => {
            const data = GetData(player.UserId)
            if (data?.towerManager && t.number(index) && t.Vector3(position)) {
                if (data.towerManager.place(index, position)) {
                    this.Client.TowerUpdate.Fire(player)
                }
            }
        })
        this.Client.ManageTower.Connect((player:Player, manageType: unknown, towerIndex: unknown) => {
            const data = GetData(player.UserId)
            if(data?.towerManager && t.string(manageType) && t.number(towerIndex)) {
                if (data.towerManager.manage(manageType, towerIndex)) {
                    this.Client.TowerUpdate.Fire(player)
                }
            }
        })
        this.Client.ManageShop.Connect((player: Player, manageType: unknown, index?: unknown) => {
            const data = GetData(player.UserId)
            if (data?.shopManager && t.string(manageType)) {
                if (data.shopManager.manage(manageType, index)) {
                    this.Client.ShopUpdate.Fire(player)
                }
            }
        })
    },
})

KnitServer.Start()