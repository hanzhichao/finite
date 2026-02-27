import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/common/mode-toggle";
import { useSettings } from "@/hooks/use-settings";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import {LanguageToggle} from "@/components/common/language-toggle";
import {useProperties} from "@/hooks/use-properties";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PRESENT_THEMES, TRANSITIONS } from "@/lib/present-themes";

export const SettingsDialog = () => {
  const settings = useSettings();
  const { t } = useTranslation();
  const setShowProperties = useProperties((store) => store.setShowProperties);
  return (
    <Dialog open={settings.isOpen} onOpenChange={settings.onClose}>
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="txt-lg font-medium">
            {t("My settings")}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-1">
              <Label>{t("Appearance")}</Label>
              <span className="text-[0.8rem] text-muted-foreground">{t("Customize how Finite looks on your device")}</span>
            </div>
            <ModeToggle />
          </div>
          <div className="flex items-center justify-between">
            <Label>{t("Default Wide mode")}</Label>
            <Switch checked={settings.wideMode} onCheckedChange={settings.setWideMode} />
          </div>
          <div className="flex items-center justify-between">
            <Label>{t("Show Properties")}</Label>
            <Switch
              checked={settings.showProperties}
              onCheckedChange={(v) => {
                settings.setShowProperties(v);
                setShowProperties(v);
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>{t("Default Title")}</Label>
            <Input value={settings.defaultTitle} onChange={e => { settings.setDefaultTitle(e.target.value); }} className="w-40" />
          </div>
          <div className="flex items-center justify-between">
            <Label>{t("Default Icon")}</Label>
            <Input value={settings.defaultIcon} onChange={e => { settings.setDefaultIcon(e.target.value); }} className="w-40" />
          </div>
          <div className="flex items-center justify-between">
            <Label>{t("Show Favorites")}</Label>
            <Switch checked={settings.showFavorites} onCheckedChange={settings.setShowFavorites} />
          </div>
          <div className="flex items-center justify-between">
            <Label>{t("Show Update Recently")}</Label>
            <Switch checked={settings.showRecent} onCheckedChange={settings.setShowRecent} />
          </div>
          <div className="flex items-center justify-between">
            <Label>{t("Presentation split by heading")}</Label>
            <Switch
              checked={settings.presentAutoSplitByHeading}
              onCheckedChange={settings.setPresentAutoSplitByHeading}
            />
          </div>
          {settings.presentAutoSplitByHeading && (
            <div className="flex items-center justify-between">
              <Label>{t("Presentation heading level")}</Label>
              <Select
                value={String(settings.presentSplitHeadingLevel)}
                onValueChange={(v) => {
                  settings.setPresentSplitHeadingLevel(Number(v));
                }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">H1 (#)</SelectItem>
                  <SelectItem value="2">H2 (##)</SelectItem>
                  <SelectItem value="3">H3 (###)</SelectItem>
                  <SelectItem value="4">H4 (####)</SelectItem>
                  <SelectItem value="5">H5 (#####)</SelectItem>
                  <SelectItem value="6">H6 (######)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="flex items-center justify-between">
            <Label>{t("Presentation theme")}</Label>
            <Select
              value={settings.presentTheme}
              onValueChange={settings.setPresentTheme}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRESENT_THEMES.map((theme) => (
                  <SelectItem key={theme.id} value={theme.id}>
                    <span className="flex items-center gap-2">
                      <span className="flex gap-0.5">
                        {theme.preview.map((c, i) => (
                          <span key={i} className="w-3 h-3 rounded-full border border-border/50 inline-block" style={{ background: c }} />
                        ))}
                      </span>
                      {t(theme.name)}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label>{t("Presentation transition")}</Label>
            <Select
              value={settings.presentTransition}
              onValueChange={settings.setPresentTransition}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TRANSITIONS.map((tr) => (
                  <SelectItem key={tr.id} value={tr.id}>
                    {t(tr.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label>{t("Language")}</Label>
            <LanguageToggle />
          </div>
        </div>

      </DialogContent>
    </Dialog>
  )
}