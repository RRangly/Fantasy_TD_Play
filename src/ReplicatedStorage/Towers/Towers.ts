import { TListItem } from "./TowerMechanics";
import { MinigunInfo, newMinigunner } from "./Minigunner";
import { WizardInfo, newWizard } from "./Wizard";
import { DwarfInfo, newDwarf } from "./Dwarf";
import { ClericInfo, newCleric } from "./Cleric";
import { PaladinInfo, newPaladin } from "./Paladin";


export const TowerList = new Array<TListItem>()
TowerList[0] = {tInfo: WizardInfo, tClass: newWizard}
TowerList[1] = {tInfo: MinigunInfo, tClass: newMinigunner}
TowerList[2] = {tInfo: PaladinInfo, tClass: newPaladin}
TowerList[3] = {tInfo: DwarfInfo, tClass: newDwarf}
TowerList[4] = {tInfo: ClericInfo, tClass: newCleric}