import type { Contact } from "../assets/types";

interface ContactDetailsProps {
  contact: Contact | null;
  onEdit: () => void;
  onCreateAppointment: () => void;
}

export function ContactDetails({
  contact,
  onEdit,
  onCreateAppointment,
}: ContactDetailsProps) {
  if (!contact) {
    return (
      <div className="panel panel-right">
        <p className="muted">Kein Kontakt ausgewählt.</p>
      </div>
    );
  }

  return (
    <div className="panel panel-right">
      <div className="panel-header">
        <h2>Kontaktdetails</h2>
        <button className="btn-secondary" onClick={onCreateAppointment}>Termin vereinbaren</button>
        <button className="btn-secondary" onClick={onEdit}>Bearbeiten</button>
      </div>

      <div className="detail-grid">
        <div>
          <div className="detail-label">Name</div>
          <div className="detail-value">{contact.name}</div>
        </div>

        <div>
          <div className="detail-label">E-Mail</div>
          <div className="detail-value">{contact.email}</div>
        </div>

        <div>
          <div className="detail-label">Telefon</div>
          <div className="detail-value">{contact.phone || "—"}</div>
        </div>

        <div>
          <div className="detail-label">Adresse</div>
          <div className="detail-value">{contact.address || "—"}</div>
        </div>

        <div className="detail-full">
          <div className="detail-label">Notiz</div>
          <div className="detail-value">{contact.note || "—"}</div>
        </div>

        <div>
          <div className="detail-label">Letzter Kontakt</div>
          <div className="detail-value">
            {contact.lastContactAt
              ? new Date(contact.lastContactAt).toLocaleString()
              : "—"}
          </div>
        </div>
      </div>
    </div>
  );
}