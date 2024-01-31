-- Compiled with roblox-ts v2.1.1
--[[
	*
	* Legacy shopmanager code
	export class ShopManager {
	readonly userId: number
	reRolled: number
	shopItems: Array<TListItem>
	constructor(userId: number) {
	this.userId = userId
	this.reRolled = 0
	this.shopItems = new Array<TListItem>()
	}
	//ReRolls the cards
	reRoll() {
	const coinManager = GetData(this.userId)!.coinManager
	const cost = math.floor(1.1 ^ this.reRolled * 115)
	if (coinManager.coin > cost) {
	coinManager.changeCoins(-cost)
	this.shopItems.clear()
	for (let i = 0; i < 3; i++) {
	this.shopItems.push(table.clone(TowerList[math.random(0, TowerList.size() - 1)]))
	}
	return true
	}
	return false
	}
	reRollFree() {
	this.shopItems.clear()
	print("TSize", TowerList.size())
	for (let i = 0; i < 3; i++) {
	this.shopItems.push(table.clone(TowerList[math.random(0, TowerList.size() - 1)]))
	}
	}
	//Picks the Card, and adds it to towerManager Cards
	pick(pick: number) {
	const data = GetData(this.userId)
	const coinManager = data!.coinManager
	const towerManager = data!.towerManager
	const tower = this.shopItems[pick]
	print("Picking", pick)
	const cost = tower.tInfo.stats[0].cost
	if (coinManager && coinManager.coin >= cost) {
	coinManager.changeCoins(-cost)
	towerManager?.cards.push(tower)
	delete this.shopItems[pick]
	return true
	}
	return false
	}
	manage(manageType: string, index?: unknown) {
	if (manageType === "Pick" && t.number(index)) {
	return this.pick(index)
	}
	else if (manageType === "ReRoll") {
	return this.reRoll()
	}
	return false
	}
	}
]]
return nil
