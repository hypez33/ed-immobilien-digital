import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/sonner';
import {
  SERVICE_INQUIRY_EMAIL,
  Service,
  ServiceId,
  ServiceInquiryFormData,
  ServiceQuestion,
  inquiryQuestions,
} from '@/data/services';
import { createInquiry } from '@/lib/inquiriesService';

interface ServiceInquiryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeService?: Service | null;
}

const stepTitles = ['Anliegen', 'Details', 'Kontakt'] as const;

const defaultValues: ServiceInquiryFormData = {
  serviceId: '',
  propertyType: '',
  location: '',
  timeframe: '',
  budget: '',
  livingArea: '',
  condition: '',
  yearBuilt: '',
  renovationScope: '',
  renovationStart: '',
  targetRent: '',
  availability: '',
  name: '',
  email: '',
  phone: '',
  message: '',
  consent: false,
};

export function ServiceInquiryForm({ open, onOpenChange, activeService }: ServiceInquiryFormProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submittedPayload, setSubmittedPayload] = useState<ServiceInquiryFormData | null>(null);

  const form = useForm<ServiceInquiryFormData>({
    defaultValues,
    mode: 'onTouched',
  });

  const selectedServiceId = form.watch('serviceId') as ServiceId | '';

  useEffect(() => {
    if (!open) return;
    setStep(1);
    setSubmittedPayload(null);
    form.reset({
      ...defaultValues,
      serviceId: activeService?.id ?? '',
    });
  }, [open, activeService, form]);

  const questionsForStep = useMemo(() => {
    return inquiryQuestions.filter((question) => {
      if (question.step !== step) return false;
      if (!question.services) return true;
      return selectedServiceId ? question.services.includes(selectedServiceId as ServiceId) : false;
    });
  }, [step, selectedServiceId]);

  const goNext = async () => {
    const fields = questionsForStep.map((question) => question.id);
    const valid = await form.trigger(fields);
    if (!valid) return;
    setStep((prev) => (prev === 3 ? prev : ((prev + 1) as 1 | 2 | 3)));
  };

  const goBack = () => {
    setStep((prev) => (prev === 1 ? prev : ((prev - 1) as 1 | 2 | 3)));
  };

  const onSubmit = async (values: ServiceInquiryFormData) => {
    try {
      const payload = {
        ...values,
        serviceTitle: activeService?.title,
        createdAt: new Date().toISOString(),
      };

      const endpoint = import.meta.env.VITE_SERVICE_ENDPOINT as string | undefined;
      if (endpoint) {
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        if (import.meta.env.DEV) {
          const stored = localStorage.getItem('serviceInquiries');
          const entries = stored ? (JSON.parse(stored) as ServiceInquiryFormData[]) : [];
          localStorage.setItem('serviceInquiries', JSON.stringify([payload, ...entries]));
        }
      }

      try {
        await createInquiry({
          name: values.name,
          email: values.email,
          phone: values.phone,
          serviceOrAnliegen: activeService?.title ?? values.serviceId,
          message: values.message || 'Service-Anfrage',
          source: 'services-form',
          status: 'new',
        });
      } catch (inquiryError) {
        console.warn('Inquiry service failed', inquiryError);
      }

      setSubmittedPayload(values);
      toast.success('Danke! Wir melden uns in 24h.');
    } catch (error) {
      console.error('Service inquiry failed', error);
      toast.error('Leider ist etwas schiefgelaufen. Bitte erneut versuchen.');
    }
  };

  const mailtoHref = useMemo(() => {
    if (!submittedPayload) return '';
    const subject = `Service-Anfrage: ${activeService?.title ?? submittedPayload.serviceId}`;
    const lines = Object.entries(submittedPayload)
      .filter(([key]) => key !== 'consent')
      .map(([key, value]) => `${key}: ${value || '-'}`);
    return `mailto:${SERVICE_INQUIRY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
  }, [submittedPayload, activeService]);

  const renderQuestion = (question: ServiceQuestion) => {
    if (question.type === 'checkbox') {
      return (
        <FormField
          key={question.id}
          control={form.control}
          name={question.id}
          rules={{
            validate: (value) => value === true || 'Bitte zustimmen',
          }}
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value === true} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="font-normal text-sm text-muted-foreground">
                  {question.label} *
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      );
    }

    return (
      <FormField
        key={question.id}
        control={form.control}
        name={question.id}
        rules={
          question.required
            ? {
                required: 'Pflichtfeld',
                ...(question.id === 'email'
                  ? { pattern: { value: /.+@.+\..+/, message: 'Bitte gültige E-Mail' } }
                  : {}),
              }
            : undefined
        }
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {question.label}
              {question.required && ' *'}
            </FormLabel>
            <FormControl>
              {question.type === 'textarea' ? (
                <Textarea placeholder={question.placeholder} {...field} value={String(field.value ?? '')} />
              ) : question.type === 'select' ? (
                <Select onValueChange={field.onChange} value={String(field.value ?? '')}>
                  <SelectTrigger>
                    <SelectValue placeholder={question.placeholder || 'Bitte wählen'} />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border shadow-lg">
                    {question.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  type={question.type === 'number' ? 'number' : 'text'}
                  placeholder={question.placeholder}
                  {...field}
                  value={String(field.value ?? '')}
                />
              )}
            </FormControl>
            {question.hint && <p className="text-xs text-muted-foreground">{question.hint}</p>}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Anfrage starten</DialogTitle>
          <DialogDescription>
            Beantworten Sie kurz die wichtigsten Fragen – wir melden uns in 24h zurück.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-4 border-b border-border/60 pb-4">
          {stepTitles.map((label, index) => {
            const currentStep = index + 1;
            const isActive = currentStep === step;
            const isDone = currentStep < step;
            return (
              <div key={label} className="flex items-center gap-3 text-sm">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full border ${
                    isActive ? 'border-gold text-gold' : isDone ? 'border-foreground text-foreground' : 'border-border text-muted-foreground'
                  }`}
                >
                  {currentStep}
                </span>
                <span className={isActive ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {submittedPayload ? (
          <div className="space-y-4 py-6">
            <p className="text-foreground font-medium">Danke! Wir melden uns in 24h.</p>
            <p className="text-sm text-muted-foreground">
              Falls Sie ergänzende Informationen haben, erreichen Sie uns jederzeit über die Kontaktseite.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild>
                <Link to="/kontakt">Kontaktseite öffnen</Link>
              </Button>
              {mailtoHref && (
                <Button variant="outline" asChild>
                  <a href={mailtoHref}>E-Mail vorbereiten</a>
                </Button>
              )}
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {questionsForStep.map(renderQuestion)}
              </div>

              <DialogFooter className="gap-3">
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={goBack}>
                    Zurück
                  </Button>
                )}
                {step < 3 ? (
                  <Button type="button" onClick={goNext}>
                    Weiter
                  </Button>
                ) : (
                  <Button type="submit">
                    Anfrage absenden
                  </Button>
                )}
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
