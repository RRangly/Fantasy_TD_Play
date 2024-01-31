-- Compiled with roblox-ts v2.1.1
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Roact = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "roact", "src")
local _services = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services")
local Players = _services.Players
local TweenService = _services.TweenService
local GuiAssets = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Game", "GuiAssets").GuiAssets
local PlayerGui = Players.LocalPlayer:FindFirstChild("PlayerGui")
local function hud(hudManager)
	local maxHealth = hudManager.maxHealth
	local hpercent = hudManager.prevHealth / maxHealth
	hudManager.hBarRef = Roact.createRef()
	return Roact.createElement(GuiAssets.BaseFrame, {}, {
		HealthBar = Roact.createElement("Frame", {
			Size = UDim2.new(0.35, 0, 0.03, 0),
			Position = UDim2.new(0.5, 0, 0.005, 0),
			BackgroundColor3 = Color3.fromRGB(43, 43, 43),
			AnchorPoint = Vector2.new(0.5, 0),
		}, {
			Roact.createElement("UICorner", {
				CornerRadius = UDim.new(0, 8),
			}),
			Bar = Roact.createElement("Frame", {
				Size = UDim2.new(hpercent * 0.984, 0, 0.8, 0),
				Position = UDim2.new(0.008, 0, 0.5, 0),
				BackgroundColor3 = Color3.fromRGB(45, 103, 58),
				AnchorPoint = Vector2.new(0, 0.5),
				[Roact.Ref] = hudManager.hBarRef,
			}, {
				Roact.createElement("UICorner", {
					CornerRadius = UDim.new(0, 8),
				}),
			}),
			CoinText = Roact.createElement("TextLabel", {
				Size = UDim2.new(0.4, 0, 0.7, 0),
				Position = UDim2.new(0.1, 0, 1.3, 0),
				Text = "Coins:" .. tostring(hudManager.coin),
				BackgroundTransparency = 1,
				Font = "SpecialElite",
				TextScaled = true,
				TextXAlignment = "Left",
				TextYAlignment = "Top",
				TextWrapped = true,
			}, {
				Roact.createElement("UIStroke", {
					Color = Color3.new(),
					Thickness = 0.3,
				}),
				Roact.createElement("UITextSizeConstraint", {
					MaxTextSize = 20,
					MinTextSize = 1,
				}),
			}),
			WaveText = Roact.createElement("TextLabel", {
				Size = UDim2.new(0.4, 0, 0.7, 0),
				Position = UDim2.new(0.5, 0, 1.3, 0),
				Text = "Wave:" .. tostring(hudManager.wave),
				BackgroundTransparency = 1,
				Font = "SpecialElite",
				TextScaled = true,
				TextXAlignment = "Right",
				TextYAlignment = "Top",
				TextWrapped = true,
			}, {
				Roact.createElement("UIStroke", {
					Color = Color3.new(),
					Thickness = 0.3,
				}),
				Roact.createElement("UITextSizeConstraint", {
					MaxTextSize = 20,
					MinTextSize = 1,
				}),
			}),
		}),
	})
end
local HudManager
do
	HudManager = setmetatable({}, {
		__tostring = function()
			return "HudManager"
		end,
	})
	HudManager.__index = HudManager
	function HudManager.new(...)
		local self = setmetatable({}, HudManager)
		return self:constructor(...) or self
	end
	function HudManager:constructor(baseManager, coinManager, waveManager)
		self.maxHealth = baseManager.maxHealth
		self.health = baseManager.health
		self.coin = coinManager.coin
		self.wave = waveManager.currentWave
		self.prevHealth = baseManager.health
		self.hud = Roact.mount(hud(self), PlayerGui, "Hud")
	end
	function HudManager:baseUpdate(health)
		self.health = health
		self.hud = Roact.update(self.hud, hud(self))
		local hpercent = self.health / self.maxHealth
		local tween = TweenService:Create(self.hBarRef:getValue(), TweenInfo.new(0.1), {
			Size = UDim2.new(hpercent * 0.984, 0, 0.8, 0),
		})
		tween:Play()
		self.prevHealth = health
	end
	function HudManager:coinUpdate(coin)
		self.coin = coin
		self.hud = Roact.update(self.hud, hud(self))
	end
	function HudManager:waveUpdate(wave)
		self.wave = wave
		self.hud = Roact.update(self.hud, hud(self))
	end
	function HudManager:notification(text)
	end
end
return {
	HudManager = HudManager,
}
