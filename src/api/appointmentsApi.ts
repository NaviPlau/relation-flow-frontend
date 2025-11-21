import type { Appointment, Contact } from "../assets/types";
import { apiGet, apiPost, apiPut, apiDelete } from "../utils/apiClient";

export async function fetchContacts(): Promise<Contact[]> {
  return apiGet<Contact[]>("/appointments/contacts/");
}

export async function fetchAppointments(): Promise<Appointment[]> {
  return apiGet<Appointment[]>("/appointments/");
}

export async function createContact(
  data: Omit<Contact, "id">
): Promise<Contact> {
  return apiPost<Contact>("/appointments/contacts/", data);
}

export async function updateContact(
  id: number,
  data: Omit<Contact, "id">
): Promise<Contact> {
  return apiPut<Contact>(`/appointments/contacts/${id}/`, data);
}

export async function createAppointment(
  data: Omit<Appointment, "id">
): Promise<Appointment> {
  return apiPost<Appointment>("/appointments/", data);
}

export async function updateAppointment(
  id: number,
  data: Omit<Appointment, "id">
): Promise<Appointment> {
  return apiPut<Appointment>(`/appointments/${id}/`, data);
}

export async function deleteAppointment(id: number): Promise<void> {
  await apiDelete<void>(`/appointments/${id}/`);
}