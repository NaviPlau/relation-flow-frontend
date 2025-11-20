import { useState, useEffect } from "react";
import type {
  Appointment, Contact,
  AppointmentFormErrors, AppointmentFormState,
  Mode
} from "../assets/types";
import { sameDay } from "../utils/date";
import { formatDateForInput } from "../utils/date";
import { validateAppointmentForm } from "../utils/validateAppointmentForm";

interface UseAppointmentEditorOptions {
  contacts: Contact[];
  appointments: Appointment[];
  preselectedContactId: number | null;
  onClearPreselectedContact: () => void;
  onCreateAppointment: (data: Omit<Appointment, "id">) => Appointment;
  onUpdateAppointment: (appointment: Appointment) => void;
}

export function useAppointmentEditor({
  contacts,
  appointments,
  preselectedContactId,
  onClearPreselectedContact,
  onCreateAppointment,
  onUpdateAppointment,
}: UseAppointmentEditorOptions) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [mode, setMode] = useState<Mode>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [emailLocked, setEmailLocked] = useState(false);
  const [formErrors, setFormErrors] = useState<AppointmentFormErrors>({});

  const [form, setForm] = useState<AppointmentFormState>({
    date: "",
    time: "",
    contactId: "",
    type: "livecall",
    note: "",
    sendEmail: "no",
  });

  useEffect(() => {
    if (preselectedContactId != null) {
      const exists = contacts.some((c) => c.id === preselectedContactId);
      if (!exists) {
        onClearPreselectedContact();
        return;
      }

      setEditingId(null);
      setEmailLocked(false);
      setForm({
        date: "",
        time: "",
        contactId: preselectedContactId,
        type: "livecall",
        note: "",
        sendEmail: "no",
      });
      setFormErrors({});
      setMode("create");
      onClearPreselectedContact();
    }
  }, [preselectedContactId, contacts, onClearPreselectedContact]);

  const openNewAppointmentForDate = (date: Date) => {
    setEditingId(null);
    setEmailLocked(false);
    setForm({
      date: formatDateForInput(date),
      time: "",
      contactId: "",
      type: "livecall",
      note: "",
      sendEmail: "no",
    });
    setMode("create");
  };

  const selectAppointmentForEdit = (a: Appointment) => {
    setEditingId(a.id);
    setEmailLocked(a.sendEmail === "yes");
    setForm({
      date: formatDateForInput(new Date(a.datetime)),
      time: new Date(a.datetime).toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      contactId: a.contactId,
      type: a.type,
      note: a.note ?? "",
      sendEmail: a.sendEmail ?? "no",
    });
    setMode("edit");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors = validateAppointmentForm(form);
    setFormErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const datetime = new Date(`${form.date}T${form.time}:00`).toISOString();

    if (mode === "create") {
      const appt = onCreateAppointment({
        contactId: form.contactId as number,
        datetime,
        type: form.type,
        note: form.note.trim() || undefined,
        sendEmail: form.sendEmail,
      });
      setSelectedDate(new Date(appt.datetime));
    }

    if (mode === "edit" && editingId != null) {
      const updated: Appointment = {
        id: editingId,
        contactId: form.contactId as number,
        datetime,
        type: form.type,
        note: form.note.trim() || undefined,
        sendEmail: form.sendEmail,
      };
      onUpdateAppointment(updated);
      setSelectedDate(new Date(updated.datetime));
    }

    setMode(null);
    setFormErrors({});
  };

  const dayAppointments = (date: Date) =>
    appointments.filter((a) => sameDay(new Date(a.datetime), date));

  const selectedDayAppointments =
    selectedDate != null ? dayAppointments(selectedDate) : [];

  return {
    selectedDate,
    setSelectedDate,
    mode,
    setMode,
    editingId,
    emailLocked,
    form,
    setForm,
    selectedDayAppointments,
    openNewAppointmentForDate,
    selectAppointmentForEdit,
    handleSave,
    formErrors,
  };
}

