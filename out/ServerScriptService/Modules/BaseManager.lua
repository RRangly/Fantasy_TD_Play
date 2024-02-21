-- Compiled with roblox-ts v2.2.0
--Manages Base Health
local BaseManager
do
	BaseManager = setmetatable({}, {
		__tostring = function()
			return "BaseManager"
		end,
	})
	BaseManager.__index = BaseManager
	function BaseManager.new(...)
		local self = setmetatable({}, BaseManager)
		return self:constructor(...) or self
	end
	function BaseManager:constructor(userId)
		self.userId = userId
		self.maxHealth = 100
		self.health = self.maxHealth
	end
end
return {
	BaseManager = BaseManager,
}
