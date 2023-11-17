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
        HealthDisplay: BasePart & {
            BackGui: SurfaceGui & {
                HealthBar: Frame & {
                    Bar: Frame
                }
                HealthText: TextLabel
            }
            FrontGui: SurfaceGui & {
                HealthBar: Frame & {
                    Bar: Frame
                }
                HealthText: TextLabel
            }
        }
    }
    SoundFX: Folder
}

interface Workspace extends Instance {
    Map: Folder,
    Mobs: Folder,
}