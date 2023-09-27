//Manages Loading Maps
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import TDMaps from "ReplicatedStorage/Maps/TDMaps";

const MapModels = ReplicatedStorage.MapModels
const ActiveMap = Workspace.Map

export class MapManager {
    readonly waypoints?: Array<Vector3>
    readonly playerSpawn?: Vector3
    constructor(mapName: string, origin: Vector3) {
        const map = TDMaps.get(mapName)
        const mapModel = MapModels.WaitForChild(mapName)
        if (map) {
            let waypoints = new Array<Vector3>
            map?.waypoints.forEach(waypoint => {
                waypoints.push(new Vector3(waypoint.X + origin.X, waypoint.Y + origin.Y, waypoint.Z + origin.Z))
            });
            const clone = mapModel.Clone()
            clone.Parent = ActiveMap
            clone.GetDescendants().forEach(part => {
                if (part.IsA("BasePart")) {
                    const pos = part.Position
                    part.Position = new Vector3(pos.X + origin.X, pos.Y + origin.Y, pos.Z + origin.Z)
                }
            });
            this.playerSpawn = map.playerSpawn
            this.waypoints = map.waypoints
        }
    }
}