import { ReplicatedStorage, RunService, Workspace } from "@rbxts/services";
import { Mob } from "ReplicatedStorage/Mobs/MobMechanics";
import type { MobManager } from "ServerScriptService/Modules/MobManager";

class display {
    mob: Mob
    gui: BasePart & {
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
    constructor(mob: Mob) {
        this.mob = mob
        const char = this.mob.model
        const head = char.FindFirstChild("Head") as BasePart
        this.gui = ReplicatedStorage.ClientAssets.HealthDisplay.Clone()
        this.gui.Parent = head
        const sides = [this.gui.FrontGui, this.gui.BackGui]
        const health = mob.health
        const maxHealth = mob.maxHealth
        for (let i = 0; i < 2; i++) {
            sides[i].HealthBar.Bar.Size = new UDim2(health / maxHealth, 0, 1, 0)
            sides[i].HealthText.Text = health + " / " + maxHealth
        }
        let updateGui = RunService.Heartbeat.Connect(() => {
            if (!(char)) {
                updateGui.Disconnect()
            }
            const headPos = head.Position
            const cam = Workspace.CurrentCamera as Camera
            this.gui.CFrame = new CFrame(new Vector3(headPos.X, headPos.Y + 2, headPos.Z), cam.CFrame.Position)
        })
    }

    update(mob: Mob) {
        const sides = [this.gui.FrontGui, this.gui.BackGui]
        const health = mob.health
        const maxHealth = mob.maxHealth
        for (let i = 0; i < 2; i++) {
            sides[i].HealthBar.Bar.Size = new UDim2(health / maxHealth, 0, 1, 0)
            sides[i].HealthText.Text = health + " / " + maxHealth
        }
    }
}

export class HealthDisplay {
    mobManager: MobManager
    displays: Array<display>
    constructor(mobManager: MobManager) {
        this.mobManager = mobManager
        this.displays = new Array<display>()
    }

    update(mobManager: MobManager) {
        this.mobManager = mobManager
        const mobs = mobManager.mobs
        let toremove = new Array<number>()
        for (let k = 0; k < this.displays.size(); k++) {
            let match = false
            for (let i = 0; i < mobs.size(); i++) {
                const mob = mobs[i]
                if (this.displays[k].mob.model === mob.model) {
                    match = true
                    this.displays[k].update(mob)
                }
            }
            if (!match) {
                toremove.push(k)
            }
        }
        for (let i = toremove.size() - 1; i >= 0; i--) this.displays.remove(toremove[i])
        for (let i = 0; i < mobs.size(); i++) {
            const mob = mobs[i]
            if (!mob.model.FindFirstChild("Head")?.FindFirstChild("HealthDisplayGui")) {
                this.displays.push(new display(mob))
            }
        }
    }
}