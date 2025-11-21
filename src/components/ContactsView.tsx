import { useState } from "react";
import type { Contact } from "../assets/types";
import {
  ContactFormModal,
  type ContactFormErrors,
  type ContactFormState,
} from "./modals/ContactFormModal";
import { ContactDetails } from "./ContactDetails";
import { ContactList } from "./ContactList";
import { validateContactForm } from "../utils/validateContactForm";

interface ContactsViewProps {
  contacts: Contact[];
  onCreateContact: (data: Omit<Contact, "id">) => Promise<Contact>;
  onUpdateContact: (contact: Contact) => Promise<void>;
  onSelectContactForAppointment: (contact: Contact) => void;
}

export function ContactsView({
  contacts,
  onCreateContact,
  onUpdateContact,
  onSelectContactForAppointment,
}: ContactsViewProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);

  const [form, setForm] = useState<ContactFormState>({
    name: "",
    email: "",
    note: "",
    address: "",
    phone: "",
  });

  const [errors, setErrors] = useState<ContactFormErrors>({});

  const selectedContact =
    contacts.find((c) => c.id === selectedId) ?? contacts[0] ?? null;

  const openCreate = () => {
    setForm({
      name: "",
      email: "",
      note: "",
      address: "",
      phone: "",
    });
    setErrors({});
    setModalMode("create");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors = validateContactForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    if (modalMode === "create") {
      const contact = await onCreateContact({
        name: form.name.trim(),
        email: form.email.trim(),
        note: form.note.trim() || undefined,
        address: form.address.trim() || undefined,
        phone: form.phone.trim() || undefined,
        lastContactAt: new Date().toISOString(),
      });
      setSelectedId(contact.id);
    }

    if (modalMode === "edit" && selectedContact) {
      const updated: Contact = {
        ...selectedContact,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        address: form.address.trim() || undefined,
        note: form.note.trim() || undefined,
      };
      await onUpdateContact(updated);
    }

    setModalMode(null);
  };

  return (
    <div className="view-container">
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onCreate={openCreate}
      />

      <ContactDetails
        contact={selectedContact}
        onEdit={() => {
          if (!selectedContact) return;
          setForm({
            name: selectedContact.name,
            email: selectedContact.email,
            phone: selectedContact.phone || "",
            address: selectedContact.address || "",
            note: selectedContact.note || "",
          });
          setErrors({});
          setModalMode("edit");
        }}
        onCreateAppointment={() => {
          if (!selectedContact) return;
          onSelectContactForAppointment(selectedContact);
        }}
      />

      <ContactFormModal
        isOpen={modalMode !== null}
        mode={modalMode}
        form={form}
        errors={errors}
        onChange={setForm}
        onSubmit={handleSave}
        onClose={() => {
          setModalMode(null);
          setErrors({});
        }}
      />
    </div>
  );
}
