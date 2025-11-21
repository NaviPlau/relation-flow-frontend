import { useState } from "react";
import { useAppointmentEditor } from "../hooks/useAppointmentEditor";
import type { Appointment, Contact } from "../assets/types";
import { CalendarSidebar } from "./CalendarSidebar";
import { AppointmentModal } from "./modals/AppointmentModal";
import { DeleteConfirmModal } from "./modals/DeleteConfirmModal";
import { AppointmentList } from "./AppointmentList";
import {
  ContactFormModal,
  type ContactFormErrors,
  type ContactFormState,
} from "./modals/ContactFormModal";
import { validateContactForm } from "../utils/validateContactForm";
import { isPastDate } from "../utils/date";

interface AppointmentsViewProps {
  contacts: Contact[];
  appointments: Appointment[];
  onCreateAppointment: (data: Omit<Appointment, "id">) => Promise<Appointment>;
  onUpdateAppointment: (appointment: Appointment) => Promise<void>;
  onDeleteAppointment: (id: number) => Promise<void>;
  onCreateContactInline: (data: Omit<Contact, "id">) => Promise<Contact>;
  preselectedContactId: number | null;
  onClearPreselectedContact: () => void;
}

export function AppointmentsView({
  contacts,
  appointments,
  onCreateAppointment,
  onUpdateAppointment,
  onDeleteAppointment,
  onCreateContactInline,
  preselectedContactId,
  onClearPreselectedContact,
}: AppointmentsViewProps) {
  const {
    selectedDate,
    setSelectedDate,
    mode,
    setMode,
    editingId,
    emailLocked,
    form,
    formErrors,
    setForm,
    selectedDayAppointments,
    openNewAppointmentForDate,
    selectAppointmentForEdit,
    handleSave,
  } = useAppointmentEditor({
    contacts,
    appointments,
    preselectedContactId,
    onClearPreselectedContact,
    onCreateAppointment,
    onUpdateAppointment,
  });

  const [isNewContactModalOpen, setIsNewContactModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [inlineContactErrors, setInlineContactErrors] =
    useState<ContactFormErrors>({});
  const isSelectedDateInPast = selectedDate ? isPastDate(selectedDate) : false;
  const [contactForm, setContactForm] = useState<ContactFormState>({
    name: "",
    email: "",
    phone: "",
    address: "",
    note: "",
  });

  const handleCreateContactInline = async (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors = validateContactForm(contactForm);
    setInlineContactErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    const contact = await onCreateContactInline({
      name: contactForm.name.trim(),
      email: contactForm.email.trim(),
      note: contactForm.note.trim() || undefined,
      address: contactForm.address.trim() || undefined,
      phone: contactForm.phone.trim() || undefined,
      lastContactAt: new Date().toISOString(),
    });

    setIsNewContactModalOpen(false);
    setForm((f) => ({ ...f, contactId: contact.id }));
    setInlineContactErrors({});
  };

  return (
    <div className="view-container">
      <CalendarSidebar
        contacts={contacts}
        appointments={appointments}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />
      <div className="panel panel-right">
        <div className="panel-header">
          <h2>
            {selectedDate
              ? selectedDate.toLocaleDateString("de-DE", {
                  weekday: "long",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              : "Kein Datum gewählt"}
          </h2>
          <button
            type="button"
            className="btn-secondary"
            disabled={!selectedDate || isSelectedDateInPast}
            onClick={() => {
              if (!selectedDate || isSelectedDateInPast) return;
              openNewAppointmentForDate(selectedDate);
            }}
          >
            Termin an diesem Tag planen
          </button>
        </div>
        {selectedDate && (
          <AppointmentList
            appointments={selectedDayAppointments}
            contacts={contacts}
            onSelect={selectAppointmentForEdit}
          />
        )}
      </div>

      <AppointmentModal
        isOpen={mode !== null}
        mode={mode}
        contacts={contacts}
        form={form}
        emailLocked={emailLocked}
        onChangeForm={setForm}
        onSubmit={handleSave}
        onOpenNewContact={() => setIsNewContactModalOpen(true)}
        onRequestDelete={() => setIsDeleteConfirmOpen(true)}
        onClose={() => setMode(null)}
        errors={formErrors}
      />

      <ContactFormModal
        isOpen={isNewContactModalOpen}
        mode="create"
        form={contactForm}
        errors={inlineContactErrors}
        onChange={setContactForm}
        onSubmit={handleCreateContactInline}
        onClose={() => {
          setIsNewContactModalOpen(false);
          setInlineContactErrors({});
        }}
      />

      <DeleteConfirmModal
        isOpen={isDeleteConfirmOpen}
        emailLocked={emailLocked}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirmDelete={async () => {
          if (editingId != null) {
            await onDeleteAppointment(editingId);
          }
          setIsDeleteConfirmOpen(false);
          setMode(null);
        }}
      />
    </div>
  );
}
