import { TListItem } from "./TowerMechanics";
import { MinigunInfo, newMinigunner } from "./Minigunner";
import { WizardInfo, newWizard } from "./Wizard";
import { DwarfInfo, newDwarf } from "./Dwarf";
import { ClericInfo, newCleric } from "./Cleric";
import { PaladinInfo, newPaladin } from "./Paladin";


export const TowerList = new Array<TListItem>()
TowerList[0] = {tInfo: MinigunInfo, tClass: newMinigunner}
TowerList[1] = {tInfo: WizardInfo, tClass: newWizard}
TowerList[2] = {tInfo: DwarfInfo, tClass: newDwarf}
TowerList[3] = {tInfo: ClericInfo, tClass: newCleric}
TowerList[4] = {tInfo: PaladinInfo, tClass: newPaladin}

export const StringList = new Map<string, number>()
StringList.set("Minigunner", 0)
StringList.set("Wizard", 1)
StringList.set("Dwarf", 2)
StringList.set("Cleric", 3)
StringList.set("Paladin", 4)