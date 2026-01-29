import { supabase } from '@/lib/supabase';

export type InquiryStatus = 'new' | 'in_progress' | 'done' | 'archived';

export interface InquiryNote {
  id: string;
  createdAt: string;
  text: string;
}

export interface Inquiry {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  service_or_anliegen: string;
  message: string;
  status: InquiryStatus;
  source: string | null;
  notes: InquiryNote[] | null;
}

export interface CreateInquiryPayload {
  name: string;
  email: string;
  phone?: string;
  serviceOrAnliegen: string;
  message: string;
  source?: string;
  status?: InquiryStatus;
}

// Create inquiry (public - no auth required)
export async function createInquiry(payload: CreateInquiryPayload): Promise<Inquiry> {
  const { data, error } = await supabase
    .from('inquiries')
    .insert({
      name: payload.name,
      email: payload.email,
      phone: payload.phone || null,
      service_or_anliegen: payload.serviceOrAnliegen,
      message: payload.message,
      source: payload.source || null,
      status: payload.status || 'new',
      notes: [],
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating inquiry:', error);
    throw error;
  }
  
  return data as Inquiry;
}

// List inquiries (admin only)
export async function listInquiries(): Promise<Inquiry[]> {
  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error listing inquiries:', error);
    return [];
  }

  return (data || []) as Inquiry[];
}

// Update inquiry status (admin only)
export async function setInquiryStatus(id: string, status: InquiryStatus): Promise<Inquiry> {
  const { data, error } = await supabase
    .from('inquiries')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating inquiry status:', error);
    throw error;
  }

  return data as Inquiry;
}

// Add note to inquiry (admin only)
export async function addInquiryNote(id: string, text: string): Promise<Inquiry> {
  // First fetch current notes
  const { data: current, error: fetchError } = await supabase
    .from('inquiries')
    .select('notes')
    .eq('id', id)
    .single();

  if (fetchError || !current) {
    console.error('Error fetching inquiry notes:', fetchError);
    throw fetchError;
  }

  const currentNotes = ((current as { notes: InquiryNote[] | null }).notes) || [];
  const newNote: InquiryNote = {
    id: crypto.randomUUID?.() ?? `${Date.now()}`,
    createdAt: new Date().toISOString(),
    text,
  };

  const { data, error } = await supabase
    .from('inquiries')
    .update({ notes: [newNote, ...currentNotes] })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error adding inquiry note:', error);
    throw error;
  }

  return data as Inquiry;
}

// Delete inquiry (admin only)
export async function deleteInquiry(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('inquiries')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting inquiry:', error);
    throw error;
  }

  return true;
}
