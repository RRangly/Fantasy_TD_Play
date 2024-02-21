-- Compiled with roblox-ts v2.2.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local t = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "t", "lib", "ts").t
local _Traits = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Game", "Traits")
local Trait = _Traits.Trait
local Traits = _Traits.Traits
local TraitsManager
do
	TraitsManager = setmetatable({}, {
		__tostring = function()
			return "TraitsManager"
		end,
	})
	TraitsManager.__index = TraitsManager
	function TraitsManager.new(...)
		local self = setmetatable({}, TraitsManager)
		return self:constructor(...) or self
	end
	function TraitsManager:constructor(userId)
		self.userId = userId
		self.traits = {}
		self.traitSel = {}
		self.available = Traits
	end
	function TraitsManager:newTraits()
		self.traitSel = {}
		do
			local i = 0
			local _shouldIncrement = false
			while true do
				if _shouldIncrement then
					i += 1
				else
					_shouldIncrement = true
				end
				if not (i < 3) then
					break
				end
				local cardI = math.random(0, #self.available - 1)
				self.traitSel[i + 1] = self.available[cardI + 1]
				local _available = self.available
				local _i = i
				table.remove(_available, _i + 1)
			end
		end
	end
	function TraitsManager:chooseTraits(index)
		if t.number(index) then
			do
				local i = 0
				local _shouldIncrement = false
				while true do
					if _shouldIncrement then
						i += 1
					else
						_shouldIncrement = true
					end
					if not (i < 3) then
						break
					end
					if i == index then
						local event = self.traitSel[i + 1].event
						if not self.traits[event] then
							self.traits[event] = {}
						end
						local _exp = self.traits[event]
						local _trait = Trait.new(self.userId, self.traitSel[i + 1])
						table.insert(_exp, _trait)
					end
				end
			end
		end
	end
	function TraitsManager:invoke(eventType, info)
		local _traits = self.traits
		local _eventType = eventType
		local list = _traits[_eventType]
		if list then
			do
				local i = 0
				local _shouldIncrement = false
				while true do
					if _shouldIncrement then
						i += 1
					else
						_shouldIncrement = true
					end
					if not (i < #list - 1) then
						break
					end
					list[i + 1]:update(info)
				end
			end
		end
	end
end
return {
	TraitsManager = TraitsManager,
}
