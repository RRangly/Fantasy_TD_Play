-- Compiled with roblox-ts v2.2.0
--Manages player coins, used to buy towers and items
local CoinManager
do
	CoinManager = setmetatable({}, {
		__tostring = function()
			return "CoinManager"
		end,
	})
	CoinManager.__index = CoinManager
	function CoinManager.new(...)
		local self = setmetatable({}, CoinManager)
		return self:constructor(...) or self
	end
	function CoinManager:constructor(userId)
		self.userId = userId
		self.coin = 1000
	end
	function CoinManager:changeCoins(amount)
		self.coin += amount
	end
end
return {
	CoinManager = CoinManager,
}
