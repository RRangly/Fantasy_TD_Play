//Manages and Saves Player Datas
import type { TDPlayer } from "ServerScriptService/Game.Server";

const Data = new Map<number, TDPlayer>()

export function SetData(pIndex: number, data: any){
    Data.set(pIndex, data)
}
export function GetData(pIndex: number) {
    return Data.get(pIndex)
}