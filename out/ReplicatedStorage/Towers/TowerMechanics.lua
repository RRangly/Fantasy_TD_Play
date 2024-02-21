-- Compiled with roblox-ts v2.2.0
--Interfaces for managing towers
local TowerPriority
do
	local _inverse = {}
	TowerPriority = setmetatable({}, {
		__index = _inverse,
	})
	TowerPriority.First = 0
	_inverse[0] = "First"
	TowerPriority.Strongest = 1
	_inverse[1] = "Strongest"
	TowerPriority.Weakest = 2
	_inverse[2] = "Weakest"
end
--Base class for all towers
local Tower
do
	Tower = {}
	function Tower:constructor()
	end
end
--finds the targets based on numerical information provided, within a set group of mobs
local function findTarget(mobs, priority)
	local mobsize = #mobs
	local target
	local targetNum
	if priority == TowerPriority.First then
		targetNum = 0
		do
			local i = 0
			local _shouldIncrement = false
			while true do
				if _shouldIncrement then
					i += 1
				else
					_shouldIncrement = true
				end
				if not (i < mobsize) then
					break
				end
				if mobs[i + 1].travelled > targetNum then
					targetNum = mobs[i + 1].travelled
					target = i
				end
			end
		end
	elseif priority == TowerPriority.Strongest then
		targetNum = 0
		do
			local i = 0
			local _shouldIncrement = false
			while true do
				if _shouldIncrement then
					i += 1
				else
					_shouldIncrement = true
				end
				if not (i < mobsize) then
					break
				end
				if mobs[i + 1].maxHealth > targetNum then
					targetNum = mobs[i + 1].maxHealth
					target = i
				end
			end
		end
	elseif priority == TowerPriority.Weakest then
		targetNum = mobs[1].maxHealth
		do
			local i = 0
			local _shouldIncrement = false
			while true do
				if _shouldIncrement then
					i += 1
				else
					_shouldIncrement = true
				end
				if not (i < mobsize) then
					break
				end
				if mobs[i + 1].maxHealth < targetNum then
					targetNum = mobs[i + 1].maxHealth
					target = i
				end
			end
		end
	end
	return target
end
return {
	findTarget = findTarget,
	TowerPriority = TowerPriority,
	Tower = Tower,
}
