import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/settings/mode-toggle";
import { useSettings } from "@/hooks/use-settings";
import { DialogTitle } from "@radix-ui/react-dialog";

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
        <div className="flex itesm-center justify-between">
          <div className="flex flex-col gap-y-1">
            <Label>Apperance</Label>
            <span className="text-[0.8rem] text-muted-foreground">Customize how MoonNote looks on your device</span>
          </div>
          <ModeToggle />
        </div>
      </DialogContent>
    </Dialog>
  )
}