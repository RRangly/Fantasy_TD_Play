export class CoinManager {
    readonly userId: number
    coin: number;

    constructor(userId: number) {
        this.userId = userId
        this.coin = 1000;
    }
}