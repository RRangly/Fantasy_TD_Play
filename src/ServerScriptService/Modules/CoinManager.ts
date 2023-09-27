//Manages player coins, used to buy towers and items
export class CoinManager {
    readonly userId: number
    coin: number;

    constructor(userId: number) {
        this.userId = userId
        this.coin = 1000;
    }
    changeCoins(amount: number) {
        this.coin += amount
    }
}