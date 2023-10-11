interface TDSMap extends Instance {
    HighLights: Folder
}

interface ReplicatedStorage extends Instance {
    MapModels: Folder & {
        Forest_Camp: TDSMap
    },
    MobModels: Folder,
    TowerModels: Folder,
    GuiAssets: Folder & {
        SelectFrame: Frame,
        TowerFrame: Frame,
        ShopMenu: Frame,
    }
    ClientAssets: Folder & {
        RangeDisplay: BasePart,
    }
}

interface Workspace extends Instance {
    Map: Folder,
}