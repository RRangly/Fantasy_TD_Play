-- Compiled with roblox-ts v2.1.1
-- Manages and Saves Player Datas
local Data = {}
local function SetData(pIndex, data)
	local _pIndex = pIndex
	local _data = data
	Data[_pIndex] = _data
end
local function GetData(pIndex)
	local _pIndex = pIndex
	return Data[_pIndex]
end
return {
	SetData = SetData,
	GetData = GetData,
}
