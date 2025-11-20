import { useState } from "react";
import { Modal } from "../Modal";
import { validateContactForm } from "../../utils/validateContactForm";

export type ContactFormState = {
  name: string;
  email: string;
  phone: string;
  address: string;
  note: string;
};

export type ContactFormErrors = Partial<Record<keyof ContactFormState, string>>;

interface ContactFormModalProps {
  isOpen: boolean;
  mode: "create" | "edit" | null;
  form: ContactFormState;
  errors: ContactFormErrors;
  onChange: (next: ContactFormState) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export function ContactFormModal({
  isOpen,
  mode,
  form,
  errors,
  onChange,
  onSubmit,
  onClose,
}: ContactFormModalProps) {
  if (!isOpen || mode === null) return null;
  const title = mode === "create" ? "Neuer Kontakt" : "Kontakt bearbeiten";
  const handleChange =
    (field: keyof ContactFormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange({ ...form, [field]: e.target.value });
    };

  const isSubmitDisabled = !form.name || !form.email || !!errors.name || !!errors.email ||  !!errors.phone;

  const [showHoverErrors, setShowHoverErrors] = useState(false);
  const displayErrors: ContactFormErrors = showHoverErrors  ? validateContactForm(form) : errors;

 return (
    <Modal isOpen={isOpen} title={title} onClose={onClose}>
      <form className="form-vertical" noValidate onSubmit={onSubmit}>
        <label className={displayErrors.name ? "has-error" : ""}>
          Name
          <input value={form.name} onChange={handleChange("name")} />
          {displayErrors.name && (
            <div className="field-error">{displayErrors.name}</div>
          )}
        </label>

        <label className={displayErrors.email ? "has-error" : ""}>
          E-Mail
          <input
            type="email"
            value={form.email}
            onChange={handleChange("email")}
          />
          {displayErrors.email && (
            <div className="field-error">{displayErrors.email}</div>
          )}
        </label>

        <label className={displayErrors.phone ? "has-error" : ""}>
          Telefon
          <input value={form.phone} onChange={handleChange("phone")} />
          {displayErrors.phone && (
            <div className="field-error">{displayErrors.phone}</div>
          )}
        </label>

        <label className={displayErrors.address ? "has-error" : ""}>
          Adresse
          <input value={form.address} onChange={handleChange("address")} />
          {displayErrors.address && (
            <div className="field-error">{displayErrors.address}</div>
          )}
        </label>

        <label className={displayErrors.note ? "has-error" : ""}>
          Notiz
          <textarea
            rows={3}
            value={form.note}
            onChange={handleChange("note")}
          />
          {displayErrors.note && (
            <div className="field-error">{displayErrors.note}</div>
          )}
        </label>

        <div className="modal-actions">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Abbrechen
          </button>

          <div
            onMouseEnter={() => setShowHoverErrors(true)}
            onMouseLeave={() => setShowHoverErrors(false)}
          >
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitDisabled}
            >
              {mode === "create" ? "Speichern" : "Aktualisieren"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}