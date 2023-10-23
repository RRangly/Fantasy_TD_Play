import { KnitServer, RemoteSignal } from "@rbxts/knit";
import { BaseManager } from "./Modules/BaseManager";
import { CoinManager } from "./Modules/CoinManager";
import { MapManager } from "./Modules/MapManager";
import { Mob, MobManager } from "./Modules/MobManager";
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
        let towerAtts = new Array<Array<Mob>>()
        const towers = this.towerManager.towers
        const mobs = this.mobManager.mobs
        for(let mobI = 0; mobI < mobs.size(); mobI++) {
            const mob = mobs[mobI]
            const pos = mob.humanoid.RootPart!.Position
            const travelled = (os.clock() - mob.spawnTime) * mob.walkSpeed
            mob.position = pos
            mob.position2D = new Vector2(pos.X, pos.Z)
            mob.travelled = travelled
            for(let towerI = 0; towerI < towers.size(); towerI++) {
                const tower = towers[towerI]
                if(tower.offensive && mob.position2D.sub(tower.position2D).Magnitude <= tower.stats[tower.level].range!) {
                    towerAtts[towerI].push(mob)
                }
            }
        }
        for(let i = 0; i < towers.size(); i++) {
            const tower = towers[i]
            if (tower.offensive) {
                const att = towers[i].update(deltaTime, towerAtts[i])
                this.traitsManager.invoke("MobDamage", att)
            }
        }
    }
}

export const GameService = KnitServer.CreateService({
    Name: "GameService",
    TdPlayers: new Map<Number, TDPlayer>(),

    Client: {
        dataUpdate: new RemoteSignal<(tdPlayer: TDPlayer) => void>(),
        gameLoaded: new RemoteSignal<() => void>(),
        placeTower: new RemoteSignal<(index: unknown, position: unknown) => void>(),
        manageTower: new RemoteSignal<(manageType: unknown, towerIndex: unknown) => void>(),
        manageShop: new RemoteSignal<(manageType: unknown, index?: unknown) => void>(),
        towerUpdate: new RemoteSignal<() => void>(),
        shopUpdate: new RemoteSignal<() => void>(),
    },
    
    KnitInit() {
        this.Client.gameLoaded.Connect((player: Player) => {
            print("GameLoaded")
            const tdPlayer = new TDPlayer(player)
            this.TdPlayers.set(player.UserId, tdPlayer)
            this.Client.dataUpdate.Fire(player, tdPlayer)
            task.wait(5)
            tdPlayer.towerManager.place(0, new Vector3(0, 2, -22.5))
            player.Character?.MoveTo(tdPlayer.mapManager.playerSpawn)
            let count = 0
            let passed = 0
            task.spawn(() => {
                tdPlayer.waveManager.startWave()
            })
            /*
            RunService.Heartbeat.Connect(function(deltaTime: number) {
                count += 1
                passed += deltaTime
                if (count >= 60) {
                    tdPlayer.update(passed)
                }
            })
            */
        })
        this.Client.placeTower.Connect((player: Player, index: unknown, position: unknown) => {
            const data = GetData(player.UserId)
            if (data?.towerManager && t.number(index) && t.Vector3(position)) {
                if (data.towerManager.place(index, position)) {
                    this.Client.towerUpdate.Fire(player)
                }
            }
        })
        this.Client.manageTower.Connect((player:Player, manageType: unknown, towerIndex: unknown) => {
            const data = GetData(player.UserId)
            if(data?.towerManager && t.string(manageType) && t.number(towerIndex)) {
                if (data.towerManager.manage(manageType, towerIndex)) {
                    this.Client.towerUpdate.Fire(player)
                }
            }
        })
        this.Client.manageShop.Connect((player: Player, manageType: unknown, index?: unknown) => {
            const data = GetData(player.UserId)
            if (data?.shopManager && t.string(manageType)) {
                if (data.shopManager.manage(manageType, index)) {
                    this.Client.shopUpdate.Fire(player)
                }
            }
        })
    },
})

KnitServer.Start()