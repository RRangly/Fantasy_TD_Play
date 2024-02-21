-- Compiled with roblox-ts v2.2.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _Minigunner = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Towers", "Minigunner")
local MinigunInfo = _Minigunner.MinigunInfo
local newMinigunner = _Minigunner.newMinigunner
local _Wizard = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Towers", "Wizard")
local WizardInfo = _Wizard.WizardInfo
local newWizard = _Wizard.newWizard
local _Dwarf = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Towers", "Dwarf")
local DwarfInfo = _Dwarf.DwarfInfo
local newDwarf = _Dwarf.newDwarf
local _Cleric = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Towers", "Cleric")
local ClericInfo = _Cleric.ClericInfo
local newCleric = _Cleric.newCleric
local _Paladin = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Towers", "Paladin")
local PaladinInfo = _Paladin.PaladinInfo
local newPaladin = _Paladin.newPaladin
local TowerList = {}
TowerList[1] = {
	tInfo = WizardInfo,
	tClass = newWizard,
}
TowerList[2] = {
	tInfo = MinigunInfo,
	tClass = newMinigunner,
}
TowerList[3] = {
	tInfo = PaladinInfo,
	tClass = newPaladin,
}
TowerList[4] = {
	tInfo = DwarfInfo,
	tClass = newDwarf,
}
TowerList[5] = {
	tInfo = ClericInfo,
	tClass = newCleric,
}
return {
	TowerList = TowerList,
}
