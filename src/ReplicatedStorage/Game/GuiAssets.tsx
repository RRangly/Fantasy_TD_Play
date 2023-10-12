import Roact from "@rbxts/roact"

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

export const GuiAssets = {
    baseFrame() {
        return (<screengui>
            <frame Size={new UDim2(1,0,1,0)} BackgroundTransparency={1}>
                <uiaspectratioconstraint AspectType={"FitWithinMaxSize"} AspectRatio={1.783} DominantAxis={"Width"}/>
            </frame>
        </screengui>)
    },
    buttonText(props: {maxTextSize: number, position: UDim2, text: string}) {
        return (<textlabel
            Size={new UDim2(0.89,0,0.3,0)} 
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
            <this.buttonText maxTextSize={props.maxTextSize} position={new UDim2(0.5,0,0.1,0)} text={props.text1}/>
            <this.buttonText maxTextSize={props.maxTextSize} position={new UDim2(0.5,0,0.4,0)} text={props.text2}/>
        </imagebutton>)
    },
}