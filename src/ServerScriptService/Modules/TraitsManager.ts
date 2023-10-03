import { t } from "@rbxts/t"
import { Trait, Traits, TraitInfo } from "ReplicatedStorage/Game/Traits"

export class TraitsManager {
    readonly userId: number
    traits: Map<string, Array<Trait>>
    available: Array<TraitInfo>
    traitSel: Array<TraitInfo>
    constructor(userId: number) {
        this.userId = userId
        this.traits = new Map<string, Array<Trait>>()
        this.traitSel = new Array<TraitInfo>()
        this.available = Traits
    }
    //Creates new Traits, and waits for player to choose
    newTraits() {
        this.traitSel = new Array<TraitInfo>()
        for (let i = 0; i < 3; i++) {
            const cardI = math.random(0, this.available.size() - 1)
            this.traitSel[i] = this.available[cardI]
            this.available.remove(i)
        }
    }
    chooseTraits(index: unknown) {
        if(t.number(index)) {
            for (let i = 0; i < 3; i++) {
                if (i === index) {
                    const event = this.traitSel[i].event
                    if (this.traits.get(event) === null) {
                        this.traits.set(event, new Array<Trait>)
                    }
                    this.traits.get(event)?.push(new Trait(this.userId, this.traitSel[i]))
                }
            }
        }
    }
    //Invokes Traits when a event occurs
    invoke(type: string, info: object) {
        const list = this.traits.get(type)
        if(list) {
            for (let i = 0; i < list.size() - 1; i++) {
                list[i].update(info)
            }
        }
    }
}