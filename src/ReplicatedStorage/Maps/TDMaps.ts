import Forest_Camp from "./Forest_Camp"

interface TDMap {
    readonly waypoints: Array<Vector3>
    readonly playerSpawn: Vector3
}

const maps = new Map<string, TDMap>()
maps.set("Forest_Camp", Forest_Camp)
export = maps