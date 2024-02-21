-- Compiled with roblox-ts v2.2.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _TowerMechanics = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Towers", "TowerMechanics")
local Tower = _TowerMechanics.Tower
local TowerPriority = _TowerMechanics.TowerPriority
local findTarget = _TowerMechanics.findTarget
local WizardInfo = {
	name = "Wizard",
	cost = 500,
	stats = { {
		levelName = "basic",
		preAction = 1,
		actionInterval = 0.1,
		range = 24,
		damage = 5,
		cost = 250,
	}, {
		levelName = "better bullets",
		preAction = 1,
		actionInterval = 0.2,
		range = 26,
		damage = 2,
		cost = 500,
	}, {
		levelName = "farther range",
		preAction = 2,
		actionInterval = 0.2,
		range = 30,
		damage = 1,
		cost = 800,
	}, {
		levelName = "faster shooting",
		preAction = 1,
		actionInterval = 0.12,
		range = 35,
		damage = 5,
		cost = 1000,
	}, {
		levelName = "superiority",
		preAction = 1,
		actionInterval = 0.1,
		range = 45,
		damage = 12,
		cost = 1500,
	} },
	placement = {
		area = 1,
		type = "Plain",
		height = 1.9,
	},
	offensive = true,
	image = "NotReady",
}
--The class itself
local Wizard
do
	local super = Tower
	Wizard = setmetatable({}, {
		__tostring = function()
			return "Wizard"
		end,
		__index = super,
	})
	Wizard.__index = Wizard
	function Wizard.new(...)
		local self = setmetatable({}, Wizard)
		return self:constructor(...) or self
	end
	function Wizard:constructor(position, model)
		super.constructor(self)
		self.index = 0
		local info = WizardInfo
		self.name = info.name
		self.image = info.image
		self.stats = info.stats
		self.offensive = info.offensive
		self.level = 0
		self.position = position
		self.position2D = Vector2.new(position.X, position.Z)
		self.model = model
		self.priority = TowerPriority.First
		self.preActionTime = 0
		self.actionTime = 0
	end
	function Wizard:actionUp(deltaTime, mobs)
		local stat = WizardInfo.stats[self.level + 1]
		if mobs then
			if self.preActionTime < stat.preAction then
				self.preActionTime += deltaTime
				return nil
			else
				self.actionTime += deltaTime
				if self.actionTime >= stat.actionInterval then
					self.actionTime -= stat.actionInterval
					local target = findTarget(mobs, self.priority)
					return {
						attInf = {
							mobIndex = target,
							damage = stat.damage,
						},
						playSound = "MinigunShot",
						energy = -2,
					}
				end
			end
		else
			self.actionTime = 0
			self.preActionTime = 0
			return nil
		end
	end
end
--Factory function
local function newWizard(position, model)
	return Wizard.new(position, model)
end
return {
	newWizard = newWizard,
	WizardInfo = WizardInfo,
}
