import { GetData } from "ReplicatedStorage/Data";
import { MobInfo } from "ReplicatedStorage/Mobs/MobMechanics";

//Mob Distributions
interface MobDistribution {
    default: number;
    tank: number;
    speed: number;
    special: number;
}

let distributions = new Array<Array<number>>()
distributions[0] = [0, 1, 0, 0],
distributions[1] = [0, 0, 1, 0],
distributions[2] = [0.6, 0.15, 0.15, 0.1]

export class WaveManager {
    readonly userId: number
    currentWave: number
    constructor(userId: number) {
        this.userId = userId
        this.currentWave = 1
    }
    //starts a wave, calculates weight and mob distribution and feeds it to MobManager
    startWave() {
        const data = GetData(this.userId)
        const mobManager = data!.mobManager
        const traitsManager = data!.traitsManager

        this.currentWave += 1
        //if (this.currentWave % 5) {
        //    traitsManager?.newTraits()
        //}
        const weight = 1.095^this.currentWave * 100
        const waveType = math.random(1, 10)
        let mobDis: Array<number>
        let totalMob: number
        if (waveType < 3) {
            totalMob = math.floor(weight / math.random(14, 16))
            mobDis = distributions[0]
        }
        else if (waveType < 5) {
            totalMob = math.floor(weight / math.random(15, 17))
            mobDis = distributions[1]
        }
        else {
            totalMob = math.floor(weight / math.random(13, 15))
            mobDis = distributions[2]
        }
        const mobWeight = math.floor(weight / 32)
        let toSpawn = new Array<MobInfo>()
        for (let mobType = 0; mobType < 4; mobType++) {
            const mobAmount = math.ceil(totalMob * mobDis[mobType])
            for (let i = 0; i < mobAmount; i++) {
                const mob = mobManager.generateMob(mobType, mobWeight, this.currentWave)
                if (mob) {
                    toSpawn.push(mob)
                }
            }
        }
        mobManager.spawnWave(toSpawn)
    }

    //initiate a new game, spawning waves infinitely
    startGame() {
        task.spawn(() => {
            while (true) {
                this.startWave()
                task.wait(10)
            }
        }) 
    }
}