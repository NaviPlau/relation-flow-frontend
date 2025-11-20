export type AppointmentType = "chat" | "email" | "phone" | "livecall";

export type Mode = "create" | "edit" | null;

export interface Contact {
  id: number;
  name: string;
  email: string;
  note?: string;
  address?: string;
  phone?: string;
  lastContactAt?: string;
}

export interface Appointment {
  id: number;
  contactId: number;
  type: AppointmentType;
  datetime: string;
  note?: string;
  sendEmail: "yes" | "no";
}

export type AppointmentFormState = {
  date: string;
  time: string;
  contactId: number | "";
  type: AppointmentType;
  note: string;
  sendEmail: "yes" | "no";
};

export type AppointmentFormErrors = {
  date?: string;
  time?: string;
  contactId?: string;
};


