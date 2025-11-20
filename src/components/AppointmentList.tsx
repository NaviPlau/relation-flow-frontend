import type { Appointment, Contact } from "../assets/types";

interface AppointmentListProps {
  appointments: Appointment[];
  contacts: Contact[];
  onSelect: (appointment: Appointment) => void;
}

function formatTime(datetime: string) {
  return new Date(datetime).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getTypeLabel(type: Appointment["type"]) {
  switch (type) {
    case "chat":
      return "Chat";
    case "email":
      return "E-Mail";
    case "phone":
      return "Telefon";
    case "livecall":
    default:
      return "Livecall";
  }
}

export function AppointmentList({
  appointments,
  contacts,
  onSelect,
}: AppointmentListProps) {
  if (appointments.length === 0) {
    return <p className="muted">Keine Termine an diesem Tag.</p>;
  }

  return (
    <ul className="appointment-list">
      {appointments.map((a) => {
        const contact = contacts.find((c) => c.id === a.contactId);

        return (
          <li
            key={a.id}
            className="appointment-item"
            onClick={() => onSelect(a)}
          >
            <div>
              <div className="appointment-time">{formatTime(a.datetime)}</div>
              <div className="appointment-contact">
                {contact ? contact.name : "Unbekannt"}
              </div>
              <div className="appointment-type">
                {getTypeLabel(a.type)}
              </div>
            </div>
            {a.note && (
              <div className="appointment-note">Notiz: {a.note}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
