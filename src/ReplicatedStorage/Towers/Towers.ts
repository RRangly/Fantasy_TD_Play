import { TListItem } from "./TowerMechanics";
import { MinigunInfo, newMinigunner } from "./Minigunner";
import { WizardInfo, newWizard } from "./Wizard";


export const TowerList = new Array<TListItem>()
TowerList[0] = {tInfo: MinigunInfo, tClass: newMinigunner}
TowerList[1] = {tInfo: WizardInfo, tClass: newWizard}