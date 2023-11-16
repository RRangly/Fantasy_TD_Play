import { KnitServer, RemoteSignal } from "@rbxts/knit";
import { RunService } from "@rbxts/services";
import { BaseManager } from "./Modules/BaseManager";
import { CoinManager } from "./Modules/CoinManager";
import { MapManager } from "./Modules/MapManager";
import { MobManager } from "./Modules/MobManager";
import { ShopManager } from "./Modules/ShopManager";
import { TowerManager } from "./Modules/TowerManager";
import { TraitsManager } from "./Modules/TraitsManager";
import { WaveManager } from "./Modules/WaveManager";
import { GetData, SetData } from "../ReplicatedStorage/Data";
import { Mob } from "ReplicatedStorage/Mobs/MobMechanics";
import { AttackInfo } from "ReplicatedStorage/Towers/TowerMechanics";
import { t } from "@rbxts/t";
import { TowerList } from "ReplicatedStorage/Towers/Towers";

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
    mobUpdate() {
        const towers = this.towerManager.towers
        const mobs = this.mobManager.mobs
        for (let mI = 0; mI < mobs.size(); mI++) {
            const mob = mobs[mI]
            const pos = mob.humanoid.RootPart!.Position
            const travelled = (os.clock() - mob.spawnTime) * mob.walkSpeed
            mob.position = pos
            mob.position2D = new Vector2(pos.X, pos.Z)
            mob.travelled = travelled
        }
    }
    update(deltaTime: number) {
        let towerAtts = new Array<Array<Mob>>()
        let towerAttNum = new Array<Array<number>>()
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
                    if (!towerAtts[towerI]) {
                        towerAtts[towerI] = new Array<Mob>()
                        towerAttNum[towerI] = new Array<number>()
                    }
                    towerAtts[towerI].push(mob)
                    towerAttNum[towerI].push(mobI)
                }
            }
        }
        let mobAtts = new Array<AttackInfo>()
        for(let i = 0; i < towers.size(); i++) {
            const tower = towers[i]
            if (tower.offensive) {
                const att = towers[i].actionUp(deltaTime, towerAtts[i])
                if (att) {
                    mobAtts.push({
                        mobIndex: towerAttNum[i][att.mobIndex],
                        damage: att.damage,
                    })
                }
            }
        }
        const baseDmg = this.mobManager.processUpdate(mobAtts)
        for (let i = 0; i < baseDmg.size(); i++) {
            this.baseManager.health -= baseDmg[i]
        }
    }
}

export const GameService = KnitServer.CreateService({
    Name: "GameService",
    TdPlayers: new Map<Number, TDPlayer>(),

    Client: {
        //Client -> Server
        gameLoaded: new RemoteSignal<() => void>(),
        placeTower: new RemoteSignal<(index: unknown, position: unknown) => void>(),
        manageTower: new RemoteSignal<(manageType: unknown, towerIndex: unknown) => void>(),
        manageShop: new RemoteSignal<(manageType: unknown, index?: unknown) => void>(),
        //Server -> Clinet
        gameStart: new RemoteSignal<(tdPlayer: TDPlayer) => void>(),
        towerUpdate: new RemoteSignal<(tdPlayer: TDPlayer) => void>(),
        baseUpdate: new RemoteSignal<(health: number) => void>(),
        coinUpdate: new RemoteSignal<(coin: number) => void>(),
        waveUpdate: new RemoteSignal<(wave: number)=> void>(),
        mobUpdate: new RemoteSignal<(mobs: Array<Mob>) => void>(),
    },
    
    KnitInit() {
        this.Client.gameLoaded.Connect((player: Player) => {
            const tdPlayer = new TDPlayer(player)
            this.TdPlayers.set(player.UserId, tdPlayer)
            task.wait(5)
            tdPlayer.towerManager.place(0, new Vector3(0, 2, -22.5))
            this.Client.gameStart.Fire(player, tdPlayer)
            player.Character?.MoveTo(tdPlayer.mapManager.playerSpawn)
            tdPlayer.waveManager.startGame()
            let deltaTime = 0
            let deltaTime2 = 0
            let prevHealth = 0
            RunService.Heartbeat.Connect(function(dt: number) {
                deltaTime += dt
                deltaTime2 += dt
                if (deltaTime > 0.1) {
                    task.spawn(() => {
                        tdPlayer.update(0.1)
                        deltaTime -= 0.1
                        if (tdPlayer.baseManager.health !== prevHealth) {
                        }
                    })
                }
                if (deltaTime2 > 0.5) {
                    deltaTime2 = 0
                    if (tdPlayer.baseManager.health !== prevHealth) {
                        GameService.Client.baseUpdate.Fire(player, tdPlayer.baseManager.health)
                        prevHealth = tdPlayer.baseManager.health
                    }
                }
            })
        })
        this.Client.placeTower.Connect((player: Player, index: unknown, position: unknown) => {
            const data = GetData(player.UserId)
            if (data?.towerManager && t.number(index) && t.Vector3(position)) {
                if (data.towerManager.place(index, position)) {
                    this.Client.towerUpdate.Fire(player, data)
                }
            }
        })
        this.Client.manageTower.Connect((player:Player, manageType: unknown, towerIndex: unknown) => {
            const data = GetData(player.UserId)
            if(data?.towerManager && t.string(manageType) && t.number(towerIndex)) {
                if (data.towerManager.manage(manageType, towerIndex)) {
                    this.Client.towerUpdate.Fire(player, data)
                }
            }
        })
        this.Client.manageShop.Connect((player: Player, manageType: unknown, index?: unknown) => {
            const data = GetData(player.UserId)
            if (data?.shopManager && t.string(manageType)) {
                if (data.shopManager.manage(manageType, index)) {
                    this.Client.towerUpdate.Fire(player, data)
                }
            }
        })
    },
})

KnitServer.Start()