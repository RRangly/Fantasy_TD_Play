-- Compiled with roblox-ts v2.1.1
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _knit = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "knit", "Knit")
local KnitServer = _knit.KnitServer
local RemoteSignal = _knit.RemoteSignal
local _services = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services")
local DataStoreService = _services.DataStoreService
local RunService = _services.RunService
local BaseManager = TS.import(script, game:GetService("ServerScriptService"), "TS", "Modules", "BaseManager").BaseManager
local CoinManager = TS.import(script, game:GetService("ServerScriptService"), "TS", "Modules", "CoinManager").CoinManager
local MapManager = TS.import(script, game:GetService("ServerScriptService"), "TS", "Modules", "MapManager").MapManager
local MobManager = TS.import(script, game:GetService("ServerScriptService"), "TS", "Modules", "MobManager").MobManager
local TowerManager = TS.import(script, game:GetService("ServerScriptService"), "TS", "Modules", "TowerManager").TowerManager
local TraitsManager = TS.import(script, game:GetService("ServerScriptService"), "TS", "Modules", "TraitsManager").TraitsManager
local WaveManager = TS.import(script, game:GetService("ServerScriptService"), "TS", "Modules", "WaveManager").WaveManager
local _Data = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Data")
local GetData = _Data.GetData
local SetData = _Data.SetData
local t = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "t", "lib", "ts").t
local TDPlayer
do
	TDPlayer = setmetatable({}, {
		__tostring = function()
			return "TDPlayer"
		end,
	})
	TDPlayer.__index = TDPlayer
	function TDPlayer.new(...)
		local self = setmetatable({}, TDPlayer)
		return self:constructor(...) or self
	end
	function TDPlayer:constructor(player, data)
		self.userID = player.UserId
		self.mapManager = MapManager.new("Forest_Camp", Vector3.new(0, 0, 0))
		self.towerManager = TowerManager.new(self.userID, data.towerManager.selected)
		self.mobManager = MobManager.new(self.userID)
		self.baseManager = BaseManager.new(self.userID)
		self.coinManager = CoinManager.new(self.userID)
		self.traitsManager = TraitsManager.new(self.userID)
		self.waveManager = WaveManager.new(self.userID)
		self.sounds = {}
		SetData(self.userID, self)
	end
	function TDPlayer:update(deltaTime)
		local towerAtts = {}
		local towerAttNum = {}
		local towers = self.towerManager.towers
		local mobs = self.mobManager.mobs
		do
			local mobI = 0
			local _shouldIncrement = false
			while true do
				if _shouldIncrement then
					mobI += 1
				else
					_shouldIncrement = true
				end
				if not (mobI < #mobs) then
					break
				end
				local mob = mobs[mobI + 1]
				local pos = mob.humanoid.RootPart.Position
				local travelled = (os.clock() - mob.spawnTime) * mob.walkSpeed
				mob.position = pos
				mob.position2D = Vector2.new(pos.X, pos.Z)
				mob.travelled = travelled
				do
					local towerI = 0
					local _shouldIncrement_1 = false
					while true do
						if _shouldIncrement_1 then
							towerI += 1
						else
							_shouldIncrement_1 = true
						end
						if not (towerI < #towers) then
							break
						end
						local tower = towers[towerI + 1]
						local _condition = tower.offensive
						if _condition then
							local _position2D = mob.position2D
							local _position2D_1 = tower.position2D
							_condition = (_position2D - _position2D_1).Magnitude <= tower.stats[tower.level + 1].range
						end
						if _condition then
							if not towerAtts[towerI + 1] then
								towerAtts[towerI + 1] = {}
								towerAttNum[towerI + 1] = {}
							end
							table.insert(towerAtts[towerI + 1], mob)
							local _exp = towerAttNum[towerI + 1]
							local _mobI = mobI
							table.insert(_exp, _mobI)
						end
					end
				end
			end
		end
		local mobAtts = {}
		do
			local i = 0
			local _shouldIncrement = false
			while true do
				if _shouldIncrement then
					i += 1
				else
					_shouldIncrement = true
				end
				if not (i < #towers) then
					break
				end
				local tower = towers[i + 1]
				if tower.offensive then
					local att = towers[i + 1]:actionUp(deltaTime, towerAtts[i + 1])
					if att then
						local attInfo = att.attInf
						if attInfo then
							local _mobAtts = mobAtts
							local _arg0 = {
								mobIndex = towerAttNum[i + 1][attInfo.mobIndex + 1],
								damage = attInfo.damage,
							}
							table.insert(_mobAtts, _arg0)
						end
						local _value = att.playSound
						if _value ~= "" and _value then
							local _sounds = self.sounds
							local _playSound = att.playSound
							table.insert(_sounds, _playSound)
						end
						local _value_1 = att.energy
						if _value_1 ~= 0 and (_value_1 == _value_1 and _value_1) then
							self.towerManager.energy -= att.energy
						end
					end
				end
			end
		end
		local baseDmg = self.mobManager:processUpdate(mobAtts, self.coinManager)
		do
			local i = 0
			local _shouldIncrement = false
			while true do
				if _shouldIncrement then
					i += 1
				else
					_shouldIncrement = true
				end
				if not (i < #baseDmg) then
					break
				end
				self.baseManager.health -= baseDmg[i + 1]
			end
		end
	end
end
local GameService
GameService = KnitServer.CreateService({
	Name = "GameService",
	TdPlayers = {},
	Client = {
		gameLoaded = RemoteSignal.new(),
		placeTower = RemoteSignal.new(),
		manageTower = RemoteSignal.new(),
		manageShop = RemoteSignal.new(),
		gameStart = RemoteSignal.new(),
		towerUpdate = RemoteSignal.new(),
		baseUpdate = RemoteSignal.new(),
		coinUpdate = RemoteSignal.new(),
		waveUpdate = RemoteSignal.new(),
		mobUpdate = RemoteSignal.new(),
		playSound = RemoteSignal.new(),
	},
	KnitInit = function(self)
		self.Client.gameLoaded:Connect(function(player)
			local datas = DataStoreService:GetDataStore("PlayerDatas", "Players")
			local pData = (datas:GetAsync(tostring(player.UserId)))
			local tdPlayer = TDPlayer.new(player, pData)
			local _tdPlayers = self.TdPlayers
			local _userId = player.UserId
			_tdPlayers[_userId] = tdPlayer
			task.wait(5)
			tdPlayer.towerManager:place(0, Vector3.new(0, 2, -22.5))
			self.Client.gameStart:Fire(player, tdPlayer)
			local _result = player.Character
			if _result ~= nil then
				_result:MoveTo(tdPlayer.mapManager.playerSpawn)
			end
			local deltaTime = 0
			local deltaTime2 = 0
			local prevHealth = 0
			local prevCoin = 0
			RunService.Heartbeat:Connect(function(dt)
				deltaTime += dt
				deltaTime2 += dt
				if deltaTime > 0.1 then
					tdPlayer:update(0.1)
					deltaTime -= 0.1
					local _value = #tdPlayer.sounds
					if _value ~= 0 and (_value == _value and _value) then
						GameService.Client.playSound:Fire(player, tdPlayer.sounds)
					end
					table.clear(tdPlayer.sounds)
				end
				if deltaTime2 > 0.5 then
					deltaTime2 = 0
					if tdPlayer.baseManager.health ~= prevHealth then
						GameService.Client.baseUpdate:Fire(player, tdPlayer.baseManager.health)
						prevHealth = tdPlayer.baseManager.health
					end
					if tdPlayer.coinManager.coin ~= prevCoin then
						GameService.Client.coinUpdate:Fire(player, tdPlayer.coinManager.coin)
						prevCoin = tdPlayer.coinManager.coin
					end
				end
			end)
			task.spawn(function()
				while true do
					tdPlayer.waveManager:startWave()
					GameService.Client.waveUpdate:Fire(player, tdPlayer.waveManager.currentWave)
					task.wait(10)
				end
			end)
		end)
		self.Client.placeTower:Connect(function(player, index, position)
			local data = GetData(player.UserId)
			local _result = data
			if _result ~= nil then
				_result = _result.towerManager
			end
			local _condition = _result
			if _condition then
				_condition = t.number(index) and t.Vector3(position)
			end
			if _condition then
				if data.towerManager:place(index, position) then
					self.Client.towerUpdate:Fire(player, data)
				end
			end
		end)
		self.Client.manageTower:Connect(function(player, manageType, towerIndex)
			local data = GetData(player.UserId)
			local _result = data
			if _result ~= nil then
				_result = _result.towerManager
			end
			local _condition = _result
			if _condition then
				_condition = t.string(manageType) and t.number(towerIndex)
			end
			if _condition then
				if data.towerManager:manage(manageType, towerIndex) then
					self.Client.towerUpdate:Fire(player, data)
				end
			end
		end)
	end,
})
KnitServer.Start()
return {
	TDPlayer = TDPlayer,
	GameService = GameService,
}
