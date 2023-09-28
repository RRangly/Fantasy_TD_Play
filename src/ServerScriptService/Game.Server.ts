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

declare global {
    interface KnitServices {
        GameService: typeof GameService
    }
}

export class TDPlayer {
    towerManager: TowerManager;
    mobManager: MobManager;
    baseManager: BaseManager;
    coinManager: CoinManager;
    mapManager: MapManager;
    shopManager: ShopManager;
    traitsManager: TraitsManager;
    waveManager: WaveManager;
    constructor(player: Player) {
        const userId = player.UserId
        this.mapManager = new MapManager("Forest_Camp", new Vector3(0, 0, 0))
        this.towerManager = new TowerManager(userId)
        this.mobManager = new MobManager(userId)
        this.baseManager = new BaseManager(userId)
        this.coinManager = new CoinManager(userId)
        this.shopManager = new ShopManager(userId)
        this.traitsManager = new TraitsManager(userId)
        this.waveManager = new WaveManager(userId)
        SetData(userId, this)
    }
    runUpdate() {
        
    }
}

const GameService = KnitServer.CreateService({
    Name: "GameService",

    Client: {
        GameLoaded: new RemoteSignal<() => void>(),
    },
    
    KnitInit() {
        this.Client.GameLoaded.Connect((player: Player) => {
            new TDPlayer(player)
        })
    },
})
KnitServer.Start()