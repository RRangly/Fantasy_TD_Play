-- Compiled with roblox-ts v2.2.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local KnitClient = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "knit", "Knit").KnitClient
local _services = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services")
local Players = _services.Players
local ReplicatedStorage = _services.ReplicatedStorage
local RunService = _services.RunService
local UserInputService = _services.UserInputService
local TowerClient = TS.import(script, script.Parent, "Modules", "TowerClient").TowerClient
local HealthDisplay = TS.import(script, script.Parent, "Modules", "HealthDisplay").HealthDisplay
local HudManager = TS.import(script, script.Parent, "Modules", "Hud").HudManager
local Player = Players.LocalPlayer
local PlayerGui = Player:FindFirstChild("PlayerGui")
local GameService = KnitClient.GetService("GameService")
local clientObj
GameService.gameStart:Connect(function(data)
	clientObj = {
		TowerClient = TowerClient.new(data.towerManager, data.coinManager),
		Hud = HudManager.new(data.baseManager, data.coinManager, data.waveManager),
		HealthDisplay = HealthDisplay.new(data.mobManager),
	}
	RunService.RenderStepped:Connect(function()
		clientObj.TowerClient:render()
	end)
	UserInputService.InputBegan:Connect(function(inputObj)
		if inputObj.KeyCode == Enum.KeyCode.F then
			clientObj.TowerClient:endPlacement()
		end
		local mouseLocation = UserInputService:GetMouseLocation()
		local frames = PlayerGui:GetGuiObjectsAtPosition(mouseLocation.X, mouseLocation.Y - 36)
		local clickValid = true
		local _arg0 = function(frame)
			if not (frame.BackgroundTransparency == 1) then
				clickValid = false
			end
		end
		for _k, _v in frames do
			_arg0(_v, _k - 1, frames)
		end
		if clickValid then
			if inputObj.UserInputType == Enum.UserInputType.MouseButton1 then
				clientObj.TowerClient:mouseClick()
			end
		end
	end)
end)
RunService.RenderStepped:Connect(function()
	if clientObj then
		clientObj.TowerClient:render()
	end
end)
GameService.towerUpdate:Connect(function(data)
	clientObj.TowerClient:update(data.towerManager, data.coinManager)
end)
GameService.baseUpdate:Connect(function(health)
	clientObj.Hud:baseUpdate(health)
end)
GameService.coinUpdate:Connect(function(coin)
	clientObj.Hud:coinUpdate(coin)
end)
GameService.waveUpdate:Connect(function(wave)
	clientObj.Hud:waveUpdate(wave)
end)
GameService.playSound:Connect(function(sounds)
	do
		local i = 0
		local _shouldIncrement = false
		while true do
			if _shouldIncrement then
				i += 1
			else
				_shouldIncrement = true
			end
			if not (i < #sounds) then
				break
			end
			local sound = ReplicatedStorage.SoundFX:FindFirstChild(sounds[i + 1])
			sound:Play()
		end
	end
end)
if Player.Character then
	GameService.gameLoaded:Fire()
else
	Player.CharacterAdded:Once(function()
		GameService.gameLoaded:Fire()
	end)
end
