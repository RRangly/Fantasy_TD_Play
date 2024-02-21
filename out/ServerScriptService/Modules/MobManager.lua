-- Compiled with roblox-ts v2.2.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
--Manages Mobs
local Mob = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Mobs", "MobMechanics").Mob
local GetData = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Data").GetData
--Manages Mobs as a whole, helps access the Mob Instance
local MobManager
do
	MobManager = setmetatable({}, {
		__tostring = function()
			return "MobManager"
		end,
	})
	MobManager.__index = MobManager
	function MobManager.new(...)
		local self = setmetatable({}, MobManager)
		return self:constructor(...) or self
	end
	function MobManager:constructor(userId)
		self.userId = userId
		self.mobs = {}
	end
	function MobManager:generateMob(mobType, weight, round)
		local mob
		if mobType == 0 then
			mob = {
				model = "Zombie",
				maxHealth = math.ceil(weight * 2),
				walkSpeed = math.floor(math.pow(1.1, (round / 5)) * 12),
			}
		elseif mobType == 1 then
			mob = {
				model = "Speedy",
				maxHealth = math.ceil(weight * 1.5),
				walkSpeed = math.floor(math.pow(1.13, (round / 5)) * 18),
			}
		elseif mobType == 2 then
			mob = {
				model = "Stone_Zombie",
				maxHealth = math.ceil(weight * 4.5),
				walkSpeed = math.floor(math.pow(1.09, (round / 5)) * 8),
			}
		else
			mob = {
				model = "Zombie",
				maxHealth = math.ceil(weight * 2.5),
				walkSpeed = math.floor(math.pow(1.1, (round / 5)) * 12),
			}
		end
		return mob
	end
	function MobManager:spawnWave(spawnList)
		local _waypoints = GetData(self.userId)
		if _waypoints ~= nil then
			_waypoints = _waypoints.mapManager.waypoints
		end
		local waypoints = _waypoints
		if waypoints then
			do
				local i = 0
				local _shouldIncrement = false
				while true do
					if _shouldIncrement then
						i += 1
					else
						_shouldIncrement = true
					end
					if not (i < #spawnList) then
						break
					end
					local mobInfo = spawnList[i + 1]
					local mob = Mob.new(mobInfo, waypoints)
					table.insert(self.mobs, mob)
					task.wait(0.2)
				end
			end
		end
	end
	function MobManager:processUpdate(attacks, coinManager)
		local money = 0
		do
			local i = 0
			local _shouldIncrement = false
			while true do
				if _shouldIncrement then
					i += 1
				else
					_shouldIncrement = true
				end
				if not (i < #attacks) then
					break
				end
				self.mobs[attacks[i + 1].mobIndex + 1].health -= attacks[i + 1].damage
				if not (self.mobs[attacks[i + 1].mobIndex + 1].health < 0) then
					money += attacks[i + 1].damage
				end
			end
		end
		coinManager:changeCoins(money)
		local returnVal = {}
		do
			local i = #self.mobs - 1
			local _shouldIncrement = false
			while true do
				if _shouldIncrement then
					i -= 1
				else
					_shouldIncrement = true
				end
				if not (i >= 0) then
					break
				end
				local mob = self.mobs[i + 1]
				if mob.reachedEnd then
					local _returnVal = returnVal
					local _health = mob.health
					table.insert(_returnVal, _health)
					mob.health = 0
				end
				if mob.health <= 0 then
					mob:remove()
					local _mobs = self.mobs
					local _i = i
					table.remove(_mobs, _i + 1)
				end
			end
		end
		return returnVal
	end
	function MobManager:takeDamage(mobIndex, damage)
		local _coinManager = GetData(self.userId)
		if _coinManager ~= nil then
			_coinManager = _coinManager.coinManager
		end
		local coinManager = _coinManager
		local info = (self.mobs[mobIndex + 1]:takeDamage(damage))
		local _result = coinManager
		if _result ~= nil then
			_result:changeCoins(info.damage)
		end
		if info.dead then
			local _mobs = self.mobs
			local _mobIndex = mobIndex
			table.remove(_mobs, _mobIndex + 1)
		end
		return {
			mobIndex = mobIndex,
			damage = info.damage,
			dead = info.dead,
		}
	end
	function MobManager:freeze(mobIndex, length)
		self.mobs[mobIndex + 1]:freeze(length)
	end
	function MobManager:movement(mobIndex, deltaTime)
		local _waypoints = GetData(self.userId)
		if _waypoints ~= nil then
			_waypoints = _waypoints.mapManager.waypoints
		end
		local waypoints = _waypoints
		if waypoints then
			local mob = self.mobs[mobIndex + 1]
			local distance = (mob.walkSpeed * deltaTime)
			local position = mob.position
			local dest = mob.waypoint
			while distance > 0 do
				local waypoint = waypoints[dest + 1]
				local nextWp = waypoints[dest + 1 + 1]
				if not nextWp then
					position = waypoint
					distance = 0
					break
				end
				local _position = position
				local wpDistance = (nextWp - _position).Magnitude
				if wpDistance > distance then
					local _position_1 = position
					local _unit = (nextWp - _position_1).Unit
					local _distance = distance
					position = _unit * _distance
					distance = 0
				else
					dest += 1
					position = nextWp
					distance -= wpDistance
				end
			end
			local _result = mob.model
			if _result ~= nil then
				_result:MoveTo(position)
			end
			mob.position = position
			mob.position2D = Vector2.new(position.X, position.Z)
			mob.waypoint = dest
		end
	end
end
return {
	MobManager = MobManager,
}
