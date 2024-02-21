-- Compiled with roblox-ts v2.2.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services")
local ReplicatedStorage = _services.ReplicatedStorage
local RunService = _services.RunService
local Workspace = _services.Workspace
local display
do
	display = setmetatable({}, {
		__tostring = function()
			return "display"
		end,
	})
	display.__index = display
	function display.new(...)
		local self = setmetatable({}, display)
		return self:constructor(...) or self
	end
	function display:constructor(mob)
		self.mob = mob
		local char = self.mob.model
		local head = char:FindFirstChild("Head")
		self.gui = ReplicatedStorage.ClientAssets.HealthDisplay:Clone()
		self.gui.Parent = head
		local sides = { self.gui.FrontGui, self.gui.BackGui }
		local health = mob.health
		local maxHealth = mob.maxHealth
		do
			local i = 0
			local _shouldIncrement = false
			while true do
				if _shouldIncrement then
					i += 1
				else
					_shouldIncrement = true
				end
				if not (i < 2) then
					break
				end
				sides[i + 1].HealthBar.Bar.Size = UDim2.new(health / maxHealth, 0, 1, 0)
				sides[i + 1].HealthText.Text = tostring(health) .. " / " .. tostring(maxHealth)
			end
		end
		local updateGui
		updateGui = RunService.Heartbeat:Connect(function()
			if not char then
				updateGui:Disconnect()
			end
			local headPos = head.Position
			local cam = Workspace.CurrentCamera
			self.gui.CFrame = CFrame.new(Vector3.new(headPos.X, headPos.Y + 2, headPos.Z), cam.CFrame.Position)
		end)
	end
	function display:update(mob)
		local sides = { self.gui.FrontGui, self.gui.BackGui }
		local health = mob.health
		local maxHealth = mob.maxHealth
		do
			local i = 0
			local _shouldIncrement = false
			while true do
				if _shouldIncrement then
					i += 1
				else
					_shouldIncrement = true
				end
				if not (i < 2) then
					break
				end
				sides[i + 1].HealthBar.Bar.Size = UDim2.new(health / maxHealth, 0, 1, 0)
				sides[i + 1].HealthText.Text = tostring(health) .. " / " .. tostring(maxHealth)
			end
		end
	end
end
local HealthDisplay
do
	HealthDisplay = setmetatable({}, {
		__tostring = function()
			return "HealthDisplay"
		end,
	})
	HealthDisplay.__index = HealthDisplay
	function HealthDisplay.new(...)
		local self = setmetatable({}, HealthDisplay)
		return self:constructor(...) or self
	end
	function HealthDisplay:constructor(mobManager)
		self.mobManager = mobManager
		self.displays = {}
	end
	function HealthDisplay:update(mobs)
		local toremove = {}
		do
			local k = 0
			local _shouldIncrement = false
			while true do
				if _shouldIncrement then
					k += 1
				else
					_shouldIncrement = true
				end
				if not (k < #self.displays) then
					break
				end
				local match = false
				do
					local i = 0
					local _shouldIncrement_1 = false
					while true do
						if _shouldIncrement_1 then
							i += 1
						else
							_shouldIncrement_1 = true
						end
						if not (i < #mobs) then
							break
						end
						local mob = mobs[i + 1]
						if self.displays[k + 1].mob.model == mob.model then
							match = true
							self.displays[k + 1]:update(mob)
						end
					end
				end
				if not match then
					local _toremove = toremove
					local _k = k
					table.insert(_toremove, _k)
				end
			end
		end
		do
			local i = #toremove - 1
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
				local _displays = self.displays
				local _arg0 = toremove[i + 1]
				table.remove(_displays, _arg0 + 1)
			end
		end
		do
			local i = 0
			local _shouldIncrement = false
			while true do
				if _shouldIncrement then
					i += 1
				else
					_shouldIncrement = true
				end
				if not (i < #mobs) then
					break
				end
				local mob = mobs[i + 1]
				local _result = mob.model:FindFirstChild("Head")
				if _result ~= nil then
					_result = _result:FindFirstChild("HealthDisplayGui")
				end
				if not _result then
					local _displays = self.displays
					local _display = display.new(mob)
					table.insert(_displays, _display)
				end
			end
		end
	end
end
return {
	HealthDisplay = HealthDisplay,
}
