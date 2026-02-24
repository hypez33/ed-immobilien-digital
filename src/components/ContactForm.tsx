import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { createInquiry } from '@/lib/inquiriesService';
import { toast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const anliegenOptions = [
  { value: 'bewertung', label: 'Immobilienbewertung' },
  { value: 'verkauf', label: 'Immobilie verkaufen' },
  { value: 'vermietung', label: 'Vermietung' },
  { value: 'besichtigung', label: 'Besichtigung anfragen' },
  { value: 'suchauftrag', label: 'Suchauftrag' },
];

const contactSchema = z.object({
  anliegen: z.string().min(1, 'Bitte wählen Sie ein Anliegen'),
  name: z.string().min(2, 'Bitte geben Sie Ihren Namen ein').max(100),
  email: z.string().email('Bitte geben Sie eine gültige E-Mail-Adresse ein'),
  telefon: z.string().optional(),
  objektadresse: z.string().optional(),
  nachricht: z.string().min(10, 'Bitte geben Sie eine Nachricht ein').max(2000),
  datenschutz: z.boolean().refine((val) => val === true, {
    message: 'Bitte stimmen Sie der Datenschutzerklärung zu',
  }),
});

type ContactFormData = z.infer<typeof contactSchema>;

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export function ContactForm() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<FormStatus>('idle');
  const controlClassName =
    'h-12 focus-visible:border-gold/40 focus-visible:ring-gold/50';

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      anliegen: searchParams.get('anliegen') || '',
      name: '',
      email: '',
      telefon: '',
      objektadresse: '',
      nachricht: '',
      datenschutz: false,
    },
  });
  const hasConsent = form.watch('datenschutz');

  const onSubmit = async (data: ContactFormData) => {
    setStatus('loading');
    
    try {
      const details = [
        `Anliegen: ${data.anliegen}`,
        data.objektadresse ? `Objektadresse: ${data.objektadresse}` : null,
      ]
        .filter(Boolean)
        .join('\n');
      const message = details ? `${details}\n\n${data.nachricht}` : data.nachricht;
      
      await createInquiry({
        name: data.name,
        email: data.email,
        phone: data.telefon,
        serviceOrAnliegen: 'Kontakt',
        message: message || 'Kontaktanfrage',
        source: 'kontakt-form',
        status: 'new',
      });
      
      setStatus('success');
      form.reset();
      toast({
        title: 'Anfrage gesendet',
        description: 'Wir melden uns innerhalb von 24 Stunden bei Ihnen.',
      });
    } catch (inquiryError) {
      console.error('Inquiry failed', inquiryError);
      setStatus('error');
      toast({
        title: 'Fehler',
        description: 'Ihre Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut.',
        variant: 'destructive',
      });
    }
  };

  if (status === 'success') {
    return (
      <div className="card-premium p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Vielen Dank für Ihre Anfrage!</h3>
        <p className="text-muted-foreground mb-6">
          Wir haben Ihre Nachricht erhalten und melden uns innerhalb von 24 Stunden bei Ihnen.
        </p>
        <Button className="rounded-none" onClick={() => setStatus('idle')}>Neue Anfrage senden</Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {status === 'error' && (
          <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">
              Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.
            </p>
          </div>
        )}

        <FormField
          control={form.control}
          name="anliegen"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Anliegen *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className={controlClassName}>
                    <SelectValue placeholder="Wählen Sie Ihr Anliegen" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-background border-border">
                  {anliegenOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input className={controlClassName} placeholder="Max Mustermann" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-Mail *</FormLabel>
                <FormControl>
                  <Input className={controlClassName} type="email" placeholder="max@beispiel.de" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="telefon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefon (optional)</FormLabel>
                <FormControl>
                  <Input className={controlClassName} type="tel" placeholder="+49 123 456789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="objektadresse"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Objektadresse (optional)</FormLabel>
                <FormControl>
                  <Input className={controlClassName} placeholder="Straße, PLZ Ort" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="nachricht"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nachricht *</FormLabel>
              <FormControl>
                <Textarea
                  className="focus-visible:border-gold/40 focus-visible:ring-gold/50"
                  placeholder="Beschreiben Sie Ihr Anliegen..."
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="datenschutz"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="font-normal text-sm text-muted-foreground">
                  Ich habe die Datenschutzerklärung gelesen und stimme der Verarbeitung meiner Daten zu.{' '}
                  <a href="/datenschutz" className="text-accent hover:underline">
                    Datenschutzerklärung
                  </a>{' '}
                  zu. *
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" size="lg" className="w-full rounded-none" disabled={status === 'loading' || !hasConsent}>
          {status === 'loading' ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Wird gesendet...
            </>
          ) : (
            'Anfrage absenden'
          )}
        </Button>
      </form>
    </Form>
  );
}
