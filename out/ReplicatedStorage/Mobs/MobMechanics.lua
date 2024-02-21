-- Compiled with roblox-ts v2.2.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services")
local ReplicatedStorage = _services.ReplicatedStorage
local Workspace = _services.Workspace
--Mob Instance
local Mob
do
	Mob = setmetatable({}, {
		__tostring = function()
			return "Mob"
		end,
	})
	Mob.__index = Mob
	function Mob.new(...)
		local self = setmetatable({}, Mob)
		return self:constructor(...) or self
	end
	function Mob:constructor(mobInfo, waypoints)
		self.spawnTime = os.clock()
		self.travelled = 0
		local model = ReplicatedStorage.MobModels:WaitForChild(mobInfo.model)
		self.model = model:Clone()
		self.model.Parent = Workspace.Mobs
		local _exp = self.model:GetDescendants()
		local _arg0 = function(part)
			if part:IsA("BasePart") then
				part.CollisionGroup = "Mobs"
				part.CanCollide = true
				part:SetNetworkOwner(nil)
			end
		end
		for _k, _v in _exp do
			_arg0(_v, _k - 1, _exp)
		end
		local hum = self.model:WaitForChild("Humanoid")
		self.humanoid = hum
		self.model:MoveTo(waypoints[1])
		self.walkSpeed = mobInfo.walkSpeed
		self.maxHealth = mobInfo.maxHealth
		self.health = mobInfo.maxHealth
		self.waypoint = 0
		self.frozen = false
		self.position = waypoints[1]
		self.position2D = Vector2.new(waypoints[1].X, waypoints[1].Z)
		local i = 0
		hum.WalkSpeed = self.walkSpeed
		self.reachedEnd = false
		task.spawn(function()
			local _waypoints = waypoints
			local _arg0_1 = function(waypoint)
				i += 1
				hum:MoveTo(waypoint)
				hum.MoveToFinished:Wait()
			end
			for _k, _v in _waypoints do
				_arg0_1(_v, _k - 1, _waypoints)
			end
			self.reachedEnd = true
		end)
	end
	function Mob:takeDamage(damage)
		local preHealth = self.health
		self.health -= damage
		if self.health <= 0 then
			self.health = 0
			local attack = {
				damage = preHealth,
				dead = true,
			}
			return attack
		else
			local attack = {
				damage = damage,
				dead = false,
			}
			return attack
		end
	end
	function Mob:freeze(length)
		task.spawn(function()
			if self.frozen == false then
				local _ice = self.model
				if _ice ~= nil then
					_ice = _ice:FindFirstChild("Ice")
				end
				local ice = _ice
				local _result = ice
				if _result ~= nil then
					_result = _result:IsA("BasePart")
				end
				if _result then
					self.frozen = true
					ice.Transparency = 0.4
					task.wait(length)
					ice.Transparency = 1
					self.frozen = false
				end
			end
		end)
	end
	function Mob:remove()
		self.model:Destroy()
	end
end
return {
	Mob = Mob,
}
