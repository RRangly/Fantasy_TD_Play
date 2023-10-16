import Roact from "@rbxts/roact"
import type { ShopManager } from "ServerScriptService/Modules/ShopManager"

interface imageFrameProps {
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

interface SelectFrameProp {
    text1: string
    text2: string
    image: string
    index: number
    event: () => void
}

export const GuiAssets = {
    //base GUI Assets
    baseFrame() {
        return (<screengui>
            <frame Size={new UDim2(1,0,1,0)} BackgroundTransparency={1}>
                <uiaspectratioconstraint AspectType={"FitWithinMaxSize"} AspectRatio={1.783} DominantAxis={"Width"}/>
            </frame>
        </screengui>)
    },
    buttonText(props: {maxTextSize: number, size: UDim2, position: UDim2, text: string}) {
        return (<textlabel
            Size={props.size} 
            Position={props.position} 
            BackgroundTransparency={1} 
            FontFace={new Font("SpecialElite", Enum.FontWeight.Regular, Enum.FontStyle.Normal)} 
            TextScaled = {true}
            TextXAlignment={"Center"}
            TextYAlignment={"Top"}
            TextWrapped={true}>
                <uistroke Color={new Color3()} Thickness={0.3} />
                <uitextsizeconstraint MaxTextSize={props.maxTextSize} MinTextSize={1}/>
        </textlabel>)
    },
    imageFrame(props: imageFrameProps): Roact.Element {
        return (
        <imagelabel 
            Key={props.key}
            Image={props.image}
            Size={props.size}
            Position={props.position}
            AnchorPoint={props.anchorPoint}
            ScaleType= "Crop"
            BackgroundTransparency={1}
        />)
    },
    imageButton(props: imageButtonProps): Roact.Element {
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
            <this.buttonText maxTextSize={props.maxTextSize} size={new UDim2(0.89,0,0.3,0)} position={new UDim2(0.5,0,0.1,0)} text={props.text1}/>
            <this.buttonText maxTextSize={props.maxTextSize} size={new UDim2(0.89,0,0.3,0)} position={new UDim2(0.5,0,0.4,0)} text={props.text2}/>
        </imagebutton>)
    },
    //ShopManager Gui Assets
    selectFrame(props: SelectFrameProp): Roact.Element {
        return (
            <imagebutton
            Key={tostring(props.index)}
            Image="rbxassetid://14886184492"
            Size={new UDim2(0.255,0,0.5,0)}
            Position={new UDim2(0.025 + props.index * 0.225,0,0.4,0)}
            AnchorPoint={new Vector2(0,0)}
            ScaleType="Crop"
            BackgroundTransparency={1}
            Event={{
                MouseButton1Down: props.event
            }}
            >
                <textlabel
                    Key="Name"
                    Size={new UDim2(0.45,0,0.16,0)} 
                    Position={new UDim2(0.15,0,0.7,0)} 
                    BackgroundTransparency={1}
                    FontFace={new Font("SpecialElite", Enum.FontWeight.Regular, Enum.FontStyle.Normal)}
                    Text={props.text1}
                    TextScaled = {true}
                    TextColor3={Color3.fromRGB(98,98,98)}
                    TextXAlignment="Left"
                    TextYAlignment="Top"
                    TextWrapped={true}>
                        <uistroke Color={Color3.fromRGB(98,98,98)} Thickness={0.1} />
                        <uitextsizeconstraint MaxTextSize={22} MinTextSize={1}/>
                </textlabel>
                <textlabel
                    Key="Cost"
                    Size={new UDim2(0.25,0,0.16,0)} 
                    Position={new UDim2(0.625,0,0.7,0)} 
                    BackgroundTransparency={1}
                    FontFace={new Font("SpecialElite", Enum.FontWeight.Regular, Enum.FontStyle.Normal)}
                    Text={props.text2}
                    TextScaled = {true}
                    TextColor3={Color3.fromRGB(98,98,98)}
                    TextXAlignment="Left"
                    TextYAlignment="Top"
                    TextWrapped={true}>
                        <uistroke Color={Color3.fromRGB(98,98,98)} Thickness={0.1} />
                        <uitextsizeconstraint MaxTextSize={22} MinTextSize={1}/>
                </textlabel>
            </imagebutton>
        )
    },
    
    shopFrames(props: {shopManager: ShopManager, event: (index: number) => void}): Array<Roact.Element> {
        let frames = []
        const cards = props.shopManager.shopItems
        for (let i = 0; i < 3; i++) {
            frames[i] = (<this.selectFrame
            image="NotYet"
            text1={cards[i].name}
            text2={tostring(cards[i].cost)}
            index={i}
            event={() => {
                props.event(i)
            }}
            />)
        }
        return frames
    },
}