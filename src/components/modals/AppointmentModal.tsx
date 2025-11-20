import { useState } from "react";
import type {
  AppointmentFormErrors,
  AppointmentFormState,
  AppointmentType,
  Contact,
} from "../../assets/types";
import { Modal } from "../Modal";
import { validateAppointmentForm } from "../../utils/validateAppointmentForm";
import { getTodayAndMaxDate } from "../../utils/date";

interface AppointmentModalProps {
  isOpen: boolean;
  mode: "create" | "edit" | null;
  contacts: Contact[];
  form: AppointmentFormState;
  emailLocked: boolean;
  errors: AppointmentFormErrors;
  onChangeForm: (next: AppointmentFormState) => void;
  onSubmit: (e: React.FormEvent) => void;
  onOpenNewContact: () => void;
  onRequestDelete: () => void;
  onClose: () => void;
}

export function AppointmentModal({
  isOpen,
  mode,
  contacts,
  form,
  errors,
  emailLocked,
  onChangeForm,
  onSubmit,
  onOpenNewContact,
  onRequestDelete,
  onClose,
}: AppointmentModalProps) {
  if (!mode) return null;
  const { todayStr, maxDate } = getTodayAndMaxDate(10);

  const title = mode === "create" ? "Neuen Termin planen" : "Termin ansehen / bearbeiten";
  const [showHoverErrors, setShowHoverErrors] = useState(false);
  const displayErrors: AppointmentFormErrors = showHoverErrors ? validateAppointmentForm(form) : errors;
  const isSubmitDisabled = !form.date || !form.time || !form.contactId || !!displayErrors.date || !!displayErrors.time || !!displayErrors.contactId;

  return (
    <Modal isOpen={isOpen} title={title} onClose={onClose}>
      <form className="form-vertical" noValidate onSubmit={onSubmit}>
        <label className={displayErrors.date ? "has-error" : ""}>
          Datum
          <input
            type="date"
            value={form.date}
            min={mode === "create" ? todayStr : undefined}
            max={maxDate}
            onChange={(e) => onChangeForm({ ...form, date: e.target.value })}
            aria-invalid={!!displayErrors.date}
            aria-describedby={
              displayErrors.date ? "appointment-date-error" : undefined
            }
          />
          {displayErrors.date && (
            <div id="appointment-date-error" className="field-error">
              {displayErrors.date}
            </div>
          )}
        </label>

        <label className={displayErrors.time ? "has-error" : ""}>
          Uhrzeit
          <input
            type="time"
            value={form.time}
            onChange={(e) => onChangeForm({ ...form, time: e.target.value })}
            aria-invalid={!!displayErrors.time}
            aria-describedby={
              displayErrors.time ? "appointment-time-error" : undefined
            }
          />
          {displayErrors.time && (
            <div id="appointment-time-error" className="field-error">
              {displayErrors.time}
            </div>
          )}
        </label>

        <label className={displayErrors.contactId ? "has-error" : ""}>
          Kontakt
          <div className="inline-contact-row">
            {contacts.length > 0 && (
              <select
                value={form.contactId}
                onChange={(e) =>
                  onChangeForm({
                    ...form,
                    contactId: e.target.value ? Number(e.target.value) : "",
                  })
                }
                aria-invalid={!!displayErrors.contactId}
                aria-describedby={
                  displayErrors.contactId
                    ? "appointment-contact-error"
                    : undefined
                }
              >
                <option value="">Kontakt wählen …</option>
                {contacts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.email})
                  </option>
                ))}
              </select>
            )}

            {contacts.length === 0 && (
              <button
                type="button"
                className="btn-secondary"
                onClick={onOpenNewContact}
              >
                Neues Kontakt +
              </button>
            )}
          </div>
          {displayErrors.contactId && (
            <div id="appointment-contact-error" className="field-error">
              {displayErrors.contactId}
            </div>
          )}
        </label>

        <label>
          Kontaktart
          <select
            value={form.type}
            onChange={(e) =>
              onChangeForm({
                ...form,
                type: e.target.value as AppointmentType,
              })
            }
          >
            <option value="chat">Chat</option>
            <option value="email">E-Mail</option>
            <option value="phone">Telefon</option>
            <option value="livecall">Livecall</option>
          </select>
        </label>

        <label>
          Notiz
          <textarea
            rows={3}
            value={form.note}
            onChange={(e) => onChangeForm({ ...form, note: e.target.value })}
          />
        </label>

        {!emailLocked && (
          <div className="form-field">
            <span>E-Mail senden?</span>
            <div className="radio-row">
              <label className="radio-option">
                <input
                  type="radio"
                  name="sendEmail"
                  value="yes"
                  checked={form.sendEmail === "yes"}
                  onChange={(e) =>
                    onChangeForm({
                      ...form,
                      sendEmail: e.target.value as "yes" | "no",
                    })
                  }
                />
                Ja
              </label>

              <label className="radio-option">
                <input
                  type="radio"
                  name="sendEmail"
                  value="no"
                  checked={form.sendEmail === "no"}
                  onChange={(e) =>
                    onChangeForm({
                      ...form,
                      sendEmail: e.target.value as "yes" | "no",
                    })
                  }
                />
                Nein
              </label>
            </div>
          </div>
        )}

        <div className="modal-actions">
          {mode === "edit" && (
            <button
              type="button"
              className="btn-ghost"
              onClick={onRequestDelete}
            >
              Löschen
            </button>
          )}
          <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem" }}>
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
        </div>
      </form>
    </Modal>
  );
}
