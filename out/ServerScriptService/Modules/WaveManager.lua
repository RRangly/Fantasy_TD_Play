-- Compiled with roblox-ts v2.1.1
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local GetData = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Data").GetData
-- Mob Distributions
local distributions = {}
distributions[1] = { 0, 1, 0, 0 }
local _exp = distributions[1]
distributions[2] = { 0, 0, 1, 0 }
local _exp_1 = distributions[2]
distributions[3] = { 0.6, 0.15, 0.15, 0.1 }
local _ = distributions[3]
local WaveManager
do
	WaveManager = setmetatable({}, {
		__tostring = function()
			return "WaveManager"
		end,
	})
	WaveManager.__index = WaveManager
	function WaveManager.new(...)
		local self = setmetatable({}, WaveManager)
		return self:constructor(...) or self
	end
	function WaveManager:constructor(userId)
		self.userId = userId
		self.currentWave = 1
	end
	function WaveManager:startWave()
		local data = GetData(self.userId)
		local mobManager = data.mobManager
		local traitsManager = data.traitsManager
		self.currentWave += 1
		-- if (this.currentWave % 5) {
		-- traitsManager?.newTraits()
		-- }
		local weight = bit32.bxor(1.095, self.currentWave * 100)
		local waveType = math.random(1, 10)
		local mobDis
		local totalMob
		if waveType < 3 then
			totalMob = math.floor(weight / math.random(14, 16))
			mobDis = distributions[1]
		elseif waveType < 5 then
			totalMob = math.floor(weight / math.random(15, 17))
			mobDis = distributions[2]
		else
			totalMob = math.floor(weight / math.random(13, 15))
			mobDis = distributions[3]
		end
		local mobWeight = math.floor(weight / 32)
		local toSpawn = {}
		do
			local mobType = 0
			local _shouldIncrement = false
			while true do
				if _shouldIncrement then
					mobType += 1
				else
					_shouldIncrement = true
				end
				if not (mobType < 4) then
					break
				end
				local mobAmount = math.ceil(totalMob * mobDis[mobType + 1])
				do
					local i = 0
					local _shouldIncrement_1 = false
					while true do
						if _shouldIncrement_1 then
							i += 1
						else
							_shouldIncrement_1 = true
						end
						if not (i < mobAmount) then
							break
						end
						local mob = mobManager:generateMob(mobType, mobWeight, self.currentWave)
						if mob then
							table.insert(toSpawn, mob)
						end
					end
				end
			end
		end
		mobManager:spawnWave(toSpawn)
	end
	function WaveManager:startGame()
		task.spawn(function()
			while true do
				self:startWave()
				task.wait(10)
			end
		end)
	end
end
return {
	WaveManager = WaveManager,
}
