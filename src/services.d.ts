interface TDSMap extends Instance {
    HighLights: Folder
}

interface ReplicatedStorage extends Instance {
    MapModels: Folder & {
        Forest_Camp: TDSMap
    },
    MobModels: Folder
}

interface Workspace extends Instance {
    Map: Folder
}