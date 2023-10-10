import Roact from "@rbxts/roact";

const GuiAssets = {
    HUD: <screengui ResetOnSpawn = {true}>
            <frame Key={"HudFrame"}>
                <uiaspectratioconstraint AspectType={"FitWithinMaxSize"} AspectRatio={1.783} DominantAxis={"Width"} />
                <frame Key={"ShopFrame"}>

                </frame>
                <frame Key={"HealthBar"}>

                </frame>
            </frame>
        </screengui>
}
export { GuiAssets }