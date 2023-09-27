//Manages Base Health
export class BaseManager {
    readonly userId: number
    readonly maxHealth: number
    health: number
    constructor(userId: number) {
        this.userId = userId
        this.maxHealth = 100
        this.health = this.maxHealth
    }
}