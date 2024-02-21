-- Compiled with roblox-ts v2.2.0
--Base class for Traits
local Trait
do
	Trait = setmetatable({}, {
		__tostring = function()
			return "Trait"
		end,
	})
	Trait.__index = Trait
	function Trait.new(...)
		local self = setmetatable({}, Trait)
		return self:constructor(...) or self
	end
	function Trait:constructor(userId, traitInfo)
		self.userId = userId
		self.name = traitInfo.name
		self.event = traitInfo.event
		self.description = traitInfo.description
		self._update = traitInfo.update
	end
	function Trait:update(info)
		self._update(self, info)
	end
end
--Traits Table
local Traits = {}
Traits[1] = {
	name = "SharpShooter",
	event = "MobDamage",
	description = "Deals 2X damage",
	update = function(trait, info) end,
}
return {
	Trait = Trait,
	Traits = Traits,
}
