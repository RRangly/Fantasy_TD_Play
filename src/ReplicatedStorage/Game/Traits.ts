export interface TraitInfo {
    readonly name: string
    readonly event: string
    readonly description: string
    readonly update: (trait: Trait, info: object) => void
}

//Base class for Traits
export class Trait {
    readonly userId: number
    readonly name: string
    readonly event: string
    readonly description: string
    readonly _update: (trait: Trait, info: object) => void
    constructor(userId: number, traitInfo: TraitInfo) {
        this.userId = userId
        this.name = traitInfo.name
        this.event = traitInfo.event
        this.description = traitInfo.description
        this._update = traitInfo.update
    }
    update(info: object) {
        this._update(this, info)
    }
}
//Traits Table
export const Traits = new Array<TraitInfo>()
Traits[0] = {
    name: "SharpShooter",
    event: "MobDamage",
    description: "Deals 2X damage",
    update: (trait: Trait, info: object) => {
    }
}