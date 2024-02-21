-- Compiled with roblox-ts v2.2.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services")
local ReplicatedStorage = _services.ReplicatedStorage
local Workspace = _services.Workspace
local GetData = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Data").GetData
local TowerPriority = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Towers", "TowerMechanics").TowerPriority
local TowerList = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Towers", "Towers").TowerList
local TowerManager
do
	TowerManager = setmetatable({}, {
		__tostring = function()
			return "TowerManager"
		end,
	})
	TowerManager.__index = TowerManager
	function TowerManager.new(...)
		local self = setmetatable({}, TowerManager)
		return self:constructor(...) or self
	end
	function TowerManager:constructor(userId, saveData)
		self.userId = userId
		self.towerLimit = 20
		self.energy = 50
		self.towers = {}
		self.cards = {}
		local selected = saveData.selected
		do
			local i = 0
			local _shouldIncrement = false
			while true do
				if _shouldIncrement then
					i += 1
				else
					_shouldIncrement = true
				end
				if not (i < #selected) then
					break
				end
				local _cards = self.cards
				local _arg0 = TowerList[selected[i + 1] + 1]
				table.insert(_cards, _arg0)
			end
		end
		self.attList = {}
		self.attNumList = {}
	end
	function TowerManager:checkPlacement(towerType, position)
		local start = Vector3.new(position.X, position.Y + 1, position.Z)
		local rayCastParam = RaycastParams.new()
		rayCastParam.CollisionGroup = "Towers"
		local ray = Workspace:Raycast(start, Vector3.new(0, -10, 0), rayCastParam)
		if ray and ray.Instance:GetAttribute("Placement") == towerType then
			return true
		end
		return false
	end
	function TowerManager:place(cardIndex, position)
		local card = self.cards[cardIndex + 1]
		if self:checkPlacement(card.tInfo.placement.type, position) and #self.towers < self.towerLimit then
			local clone = ReplicatedStorage.TowerModels:FindFirstChild(card.tInfo.name):Clone()
			local _exp = clone:GetDescendants()
			local _arg0 = function(part)
				if part:IsA("BasePart") then
					part.Anchored = true
					part.CanCollide = true
					part.CanTouch = false
					part.CanQuery = false
					part.CollisionGroup = "Towers"
				end
			end
			for _k, _v in _exp do
				_arg0(_v, _k - 1, _exp)
			end
			clone.Parent = Workspace
			local place = Vector3.new(position.X, position.Y + card.tInfo.placement.height, position.Z)
			clone:PivotTo(CFrame.new(place))
			local _towers = self.towers
			local _arg0_1 = card.tClass(place, clone)
			table.insert(_towers, _arg0_1)
			--delete this.cards[cardIndex]
			return true
		end
		return false
	end
	function TowerManager:manage(manageType, towerIndex)
		local _coinManager = GetData(self.userId)
		if _coinManager ~= nil then
			_coinManager = _coinManager.coinManager
		end
		local coinManager = _coinManager
		local tower = self.towers[towerIndex + 1]
		if tower and coinManager then
			if manageType == "Sell" then
				tower.model:Destroy()
				coinManager:changeCoins(tower.stats[1].cost)
				self.towers[towerIndex + 1] = nil
				return true
			elseif manageType == "Upgrade" and coinManager.coin >= tower.stats[tower.level + 1 + 1].cost then
				coinManager:changeCoins(-tower.stats[tower.level + 1 + 1].cost)
				tower.level += 1
				return true
			elseif manageType == "Priority" then
				tower.priority += 1
				return true
			end
		end
		return false
	end
	function TowerManager:attackavailable(towerIndex, priority)
		local data = GetData(self.userId)
		local _mobs = data
		if _mobs ~= nil then
			_mobs = _mobs.mobManager.mobs
		end
		local mobs = _mobs
		local _waypoints = data
		if _waypoints ~= nil then
			_waypoints = _waypoints.mapManager.waypoints
		end
		local waypoints = _waypoints
		local tower = self.towers[towerIndex + 1]
		local towerVector = tower.position2D
		local range = tower.stats[tower.level + 1].range
		local _condition = mobs
		if _condition then
			_condition = range
			if _condition ~= 0 and (_condition == _condition and _condition) then
				_condition = waypoints
			end
		end
		if _condition ~= 0 and (_condition == _condition and _condition) then
			local target
			if priority == TowerPriority.First then
				local firstWayPoint = 0
				local firstDistance = 0
				local _arg0 = function(mob)
					local mobVector = mob.position2D
					local mobDistance = (mobVector - towerVector).Magnitude
					if mobDistance < range then
						if mob.waypoint >= firstWayPoint then
							local waypoint = waypoints[mob.waypoint + 1]
							local waypointVector = Vector2.new(waypoint.X, waypoint.Z)
							local waypointDistance = (waypointVector - mobVector).Magnitude
							if mob.waypoint > firstWayPoint and waypointDistance >= firstDistance then
								target = mob
								firstDistance = waypointDistance
								firstWayPoint = mob.waypoint
							end
						end
					end
				end
				for _k, _v in mobs do
					_arg0(_v, _k - 1, mobs)
				end
			elseif priority == TowerPriority.Strongest then
				local highestHealth = 0
				local _arg0 = function(mob)
					local mobVector = mob.position2D
					local mobDistance = (mobVector - towerVector).Magnitude
					if mobDistance < range then
						if mob.health > highestHealth then
							target = mob
						end
					end
				end
				for _k, _v in mobs do
					_arg0(_v, _k - 1, mobs)
				end
			elseif priority == TowerPriority.Weakest then
				local lowestHealth = math.huge
				local _arg0 = function(mob)
					local mobVector = mob.position2D
					local mobDistance = (mobVector - towerVector).Magnitude
					if mobDistance < range then
						if mob.health < lowestHealth then
							target = mob
						end
					end
				end
				for _k, _v in mobs do
					_arg0(_v, _k - 1, mobs)
				end
			end
			if target then
				return target
			end
		end
	end
end
return {
	TowerManager = TowerManager,
}
