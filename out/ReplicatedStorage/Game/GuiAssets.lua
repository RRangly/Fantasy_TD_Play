-- Compiled with roblox-ts v2.2.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Roact = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "roact", "src")
local function BaseFrame(props)
	local _children = {}
	local _length = #_children
	local _attributes = {
		Size = UDim2.new(1, 0, 1, 0),
		BackgroundTransparency = 1,
		Position = UDim2.new(0.5, 0, 0.5, 0),
		AnchorPoint = Vector2.new(0.5, 0.5),
	}
	local _children_1 = {
		Roact.createElement("UIAspectRatioConstraint", {
			AspectType = "FitWithinMaxSize",
			AspectRatio = 1.783,
			DominantAxis = "Width",
		}),
	}
	local _length_1 = #_children_1
	local _child = props[Roact.Children]
	if _child then
		for _k, _v in _child do
			if type(_k) == "number" then
				_children_1[_length_1 + _k] = _v
			else
				_children_1[_k] = _v
			end
		end
	end
	_children.BaseFrame = Roact.createElement("Frame", _attributes, _children_1)
	return Roact.createElement("ScreenGui", {}, _children)
end
local function ButtonText(props)
	return Roact.createElement("TextLabel", {
		Size = props.size,
		Position = props.position,
		BackgroundTransparency = 1,
		Font = "SpecialElite",
		Text = props.text,
		TextScaled = true,
		TextXAlignment = "Center",
		TextYAlignment = "Top",
		AnchorPoint = Vector2.new(0.5, 0),
		TextWrapped = true,
	}, {
		Roact.createElement("UIStroke", {
			Color = Color3.new(),
			Thickness = 0.3,
		}),
		Roact.createElement("UITextSizeConstraint", {
			MaxTextSize = props.maxTextSize,
			MinTextSize = 1,
		}),
	})
end
local function ImageFrame(props)
	local _attributes = {
		Image = props.image,
		Size = props.size,
		Position = props.position,
		AnchorPoint = props.anchorPoint,
		ScaleType = "Crop",
		BackgroundTransparency = 1,
	}
	local _children = {}
	local _length = #_children
	local _child = props[Roact.Children]
	if _child then
		for _k, _v in _child do
			if type(_k) == "number" then
				_children[_length + _k] = _v
			else
				_children[_k] = _v
			end
		end
	end
	return Roact.createFragment({
		[props.key] = Roact.createElement("ImageLabel", _attributes, _children),
	})
end
local function ImageButton(props)
	return Roact.createFragment({
		[props.key] = Roact.createElement("ImageButton", {
			Image = props.image,
			Size = props.size,
			Position = props.position,
			AnchorPoint = props.anchorPoint,
			ScaleType = "Crop",
			BackgroundTransparency = 1,
			[Roact.Event.MouseButton1Down] = props.event,
		}, {
			Roact.createElement(ButtonText, {
				maxTextSize = props.maxTextSize,
				size = UDim2.new(0.89, 0, 0.3, 0),
				position = UDim2.new(0.5, 0, 0.1, 0),
				text = props.text1,
			}),
			Roact.createElement(ButtonText, {
				maxTextSize = props.maxTextSize,
				size = UDim2.new(0.89, 0, 0.3, 0),
				position = UDim2.new(0.5, 0, 0.4, 0),
				text = props.text2,
			}),
		}),
	})
end
local GuiAssets = {
	BaseFrame = BaseFrame,
	ButtonText = ButtonText,
	ImageFrame = ImageFrame,
	ImageButton = ImageButton,
}
return {
	GuiAssets = GuiAssets,
}
