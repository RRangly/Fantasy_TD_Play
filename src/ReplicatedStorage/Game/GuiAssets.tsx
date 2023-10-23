import Roact, { Children } from "@rbxts/roact"
import type { ShopManager } from "ServerScriptService/Modules/ShopManager"

interface imageFrameProps extends Roact.PropsWithChildren {
    key: string,
    image: string,
    size: UDim2,
    position: UDim2,
    anchorPoint: Vector2
}

interface imageButtonProps extends imageFrameProps{
    text1: string
    text2: string
    maxTextSize: number
    event: () => void
}

interface buttonTextProps extends Roact.PropsWithChildren {
    maxTextSize: number
    size: UDim2
    position: UDim2
    text: string
}

function BaseFrame(props: Roact.PropsWithChildren) {
    return (<screengui>
        <frame Key="BaseFrame" Size={new UDim2(1,0,1,0)} BackgroundTransparency={1}>
            <uiaspectratioconstraint AspectType={"FitWithinMaxSize"} AspectRatio={1.783} DominantAxis={"Width"}/>
            {props[Roact.Children]}
        </frame>
    </screengui>)
}
function ButtonText(props: buttonTextProps) {
    return (<textlabel
        Size={props.size} 
        Position={props.position}
        BackgroundTransparency={1} 
        Font={"SpecialElite"}
        Text={props.text}
        TextScaled = {true}
        TextXAlignment={"Center"}
        TextYAlignment={"Top"}
        AnchorPoint={new Vector2(0.5, 0)}
        TextWrapped={true}>
            <uistroke Color={new Color3()} Thickness={0.3} />
            <uitextsizeconstraint MaxTextSize={props.maxTextSize} MinTextSize={1}/>
    </textlabel>)
}
function ImageFrame(props: imageFrameProps): Roact.Element {
    return (
    <imagelabel 
        Key={props.key}
        Image={props.image}
        Size={props.size}
        Position={props.position}
        AnchorPoint={props.anchorPoint}
        ScaleType= "Crop"
        BackgroundTransparency={1}
    >
        {props[Roact.Children]}
    </imagelabel>)
}
function ImageButton(props: imageButtonProps): Roact.Element {
    return (
    <imagebutton
        Key={props.key}
        Image={props.image}
        Size={props.size}
        Position={props.position}
        AnchorPoint={props.anchorPoint}
        ScaleType= "Crop"
        BackgroundTransparency={1}
        Event={{
            MouseButton1Down: props.event
        }}
    >
        <ButtonText maxTextSize={props.maxTextSize} size={new UDim2(0.89,0,0.3,0)} position={new UDim2(0.5,0,0.1,0)} text={props.text1}/>
        <ButtonText maxTextSize={props.maxTextSize} size={new UDim2(0.89,0,0.3,0)} position={new UDim2(0.5,0,0.4,0)} text={props.text2}/>
    </imagebutton>)
}
export const GuiAssets = {
    //base GUI Assets
    BaseFrame,
    ButtonText,
    ImageFrame,
    ImageButton,
}