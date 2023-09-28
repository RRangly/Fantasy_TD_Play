interface TDSMap extends Instance {
    HighLights: Folder
}

interface ReplicatedStorage extends Instance {
    MapModels: Folder & {
        Forest_Camp: TDSMap
    },
    MobModels: Folder,
    TowerModels: Folder,
}

interface Workspace extends Instance {
    Map: Folder,
}