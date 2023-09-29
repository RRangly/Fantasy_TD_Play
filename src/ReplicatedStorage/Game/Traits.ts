interface TraitInfo {
    name: string, 
    event: string, 
    description: string,
}

export class Trait {
    readonly userId: number
    readonly name: string
    readonly event: string
    readonly description: string
    constructor(userId: number, traitInfo: TraitInfo) {
        this.userId = userId
        this.name = traitInfo.name
        this.event = traitInfo.event
        this.description = traitInfo.description
    }
}

const Traits = new Array<typeof Trait>()
Traits[0] = class SharpShooter extends Trait {
    constructor(userId: number) {
        super(userId, {
            name: "Sharp_Shooter",
            event: "MobDamage",
            description: "Deals 2x damage",
        })
    }
}