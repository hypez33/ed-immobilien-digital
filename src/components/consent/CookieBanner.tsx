import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { useConsent } from '@/context/ConsentContext';

export function CookieBanner() {
  const {
    consent,
    hasDecision,
    isSettingsOpen,
    openSettings,
    closeSettings,
    acceptAll,
    rejectAll,
    saveSettings,
  } = useConsent();
  const [analyticsEnabled, setAnalyticsEnabled] = useState(consent?.analytics ?? false);
  const [marketingEnabled, setMarketingEnabled] = useState(consent?.marketing ?? false);

  useEffect(() => {
    if (!isSettingsOpen) return;
    setAnalyticsEnabled(consent?.analytics ?? false);
    setMarketingEnabled(consent?.marketing ?? false);
  }, [isSettingsOpen, consent]);

  const handleSave = () => {
    saveSettings({ analytics: analyticsEnabled, marketing: marketingEnabled });
    toast({ title: 'Einstellungen gespeichert', description: 'Ihre Cookie-Auswahl wurde aktualisiert.' });
  };

  const showBanner = !hasDecision && !isSettingsOpen;

  return (
    <>
      {showBanner ? (
        <div
          className="fixed inset-x-4 z-[70] md:right-6 md:left-auto md:max-w-xl motion-safe:animate-fade-in"
          style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
        >
          <Card className="border-border/80 bg-card/95 p-4 shadow-card backdrop-blur-sm sm:p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">Wir verwenden Cookies</p>
                <p className="text-sm text-muted-foreground">
                  Notwendige Cookies sind für den Betrieb erforderlich. Statistik und Marketing setzen wir nur mit
                  Ihrer Zustimmung ein. Mehr Infos in unserer{' '}
                  <Link className="font-medium text-foreground underline underline-offset-4" to="/datenschutz">
                    Datenschutzerklärung
                  </Link>
                  .
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" onClick={acceptAll}>
                  Alle akzeptieren
                </Button>
                <Button size="sm" variant="outline" onClick={rejectAll}>
                  Nur notwendige
                </Button>
                <Button size="sm" variant="ghost" onClick={openSettings}>
                  Einstellungen
                </Button>
              </div>
            </div>
          </Card>
        </div>
      ) : null}

      <Dialog open={isSettingsOpen} onOpenChange={(open) => (open ? openSettings() : closeSettings())}>
        <DialogContent className="motion-reduce:animate-none motion-reduce:transition-none">
          <DialogHeader>
            <DialogTitle>Cookie-Einstellungen</DialogTitle>
            <DialogDescription>
              Wählen Sie aus, welche Cookies wir verwenden dürfen. Notwendige Cookies sind immer aktiv.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 rounded-md border border-border/70 px-4 py-3">
              <div className="space-y-1">
                <Label>Notwendig</Label>
                <p className="text-xs text-muted-foreground">Erforderlich für den Betrieb der Website.</p>
              </div>
              <Switch checked disabled aria-readonly="true" />
            </div>
            <div className="flex items-center justify-between gap-4 rounded-md border border-border/70 px-4 py-3">
              <div className="space-y-1">
                <Label htmlFor="consent-analytics">Statistik</Label>
                <p className="text-xs text-muted-foreground">
                  Hilft uns zu verstehen, wie die Seite genutzt wird.
                </p>
              </div>
              <Switch
                id="consent-analytics"
                checked={analyticsEnabled}
                onCheckedChange={(value) => setAnalyticsEnabled(Boolean(value))}
              />
            </div>
            <div className="flex items-center justify-between gap-4 rounded-md border border-border/70 px-4 py-3">
              <div className="space-y-1">
                <Label htmlFor="consent-marketing">Marketing</Label>
                <p className="text-xs text-muted-foreground">
                  Ermöglicht personalisierte Inhalte und Marketing.
                </p>
              </div>
              <Switch
                id="consent-marketing"
                checked={marketingEnabled}
                onCheckedChange={(value) => setMarketingEnabled(Boolean(value))}
              />
            </div>
          </div>
          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={rejectAll}>
              Nur notwendige
            </Button>
            <Button onClick={handleSave}>Speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
