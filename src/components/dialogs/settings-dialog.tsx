import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/settings/mode-toggle";
import { useSettings } from "@/hooks/use-settings";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

export const SettingsDialog = () => {
  const settings = useSettings();
  return (
    <Dialog open={settings.isOpen} onOpenChange={settings.onClose}>
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="txt-lg font-medium">
            My settings
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-1">
              <Label>Appearance</Label>
              <span className="text-[0.8rem] text-muted-foreground">Customize how Finite looks on your device</span>
            </div>
            <ModeToggle />
          </div>
          <div className="flex items-center justify-between">
            <Label>Default Wide mode</Label>
            <Switch checked={settings.wideMode} onCheckedChange={settings.setWideMode} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Default Title</Label>
            <Input value={settings.defaultTitle} onChange={e => { settings.setDefaultTitle(e.target.value); }} className="w-40" />
          </div>
          <div className="flex items-center justify-between">
            <Label>Default Icon</Label>
            <Input value={settings.defaultIcon} onChange={e => { settings.setDefaultIcon(e.target.value); }} className="w-40" />
          </div>
          <div className="flex items-center justify-between">
            <Label>Show Favorites</Label>
            <Switch checked={settings.showFavorites} onCheckedChange={settings.setShowFavorites} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Show Update Recently</Label>
            <Switch checked={settings.showRecent} onCheckedChange={settings.setShowRecent} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}