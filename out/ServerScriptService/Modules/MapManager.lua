-- Compiled with roblox-ts v2.2.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
--Manages Loading Maps
local _services = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services")
local ReplicatedStorage = _services.ReplicatedStorage
local Workspace = _services.Workspace
local TDMaps = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Maps", "TDMaps")
local MapModels = ReplicatedStorage.MapModels
local ActiveMap = Workspace.Map
local MapManager
do
	MapManager = setmetatable({}, {
		__tostring = function()
			return "MapManager"
		end,
	})
	MapManager.__index = MapManager
	function MapManager.new(...)
		local self = setmetatable({}, MapManager)
		return self:constructor(...) or self
	end
	function MapManager:constructor(mapName, origin)
		local _mapName = mapName
		local map = TDMaps[_mapName]
		local mapModel = MapModels:WaitForChild(mapName)
		local waypoints = {}
		local _result = map
		if _result ~= nil then
			local _waypoints = _result.waypoints
			local _arg0 = function(waypoint)
				local _waypoints_1 = waypoints
				local _vector3 = Vector3.new(waypoint.X + origin.X, waypoint.Y + origin.Y, waypoint.Z + origin.Z)
				table.insert(_waypoints_1, _vector3)
			end
			for _k, _v in _waypoints do
				_arg0(_v, _k - 1, _waypoints)
			end
		end
		local clone = mapModel:Clone()
		clone.Parent = ActiveMap
		local _exp = clone:GetDescendants()
		local _arg0 = function(part)
			if part:IsA("BasePart") then
				local pos = part.Position
				part.Position = Vector3.new(pos.X + origin.X, pos.Y + origin.Y, pos.Z + origin.Z)
			end
		end
		for _k, _v in _exp do
			_arg0(_v, _k - 1, _exp)
		end
		local _result_1 = map
		if _result_1 ~= nil then
			_result_1 = _result_1.playerSpawn
		end
		if _result_1 then
			local _result_2 = map
			if _result_2 ~= nil then
				_result_2 = _result_2.playerSpawn
			end
			self.playerSpawn = _result_2
		else
			self.playerSpawn = Vector3.new(0, 0, 0)
		end
		self.waypoints = waypoints
	end
end
return {
	MapManager = MapManager,
}
