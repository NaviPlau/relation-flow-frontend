import type { Contact } from "../assets/types";

interface ContactListProps {
  contacts: Contact[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onCreate: () => void;
}

export function ContactList({
  contacts,
  selectedId,
  onSelect,
  onCreate,
}: ContactListProps) {
  return (
    <div className="panel panel-left">
      <div className="panel-header">
        <h2>Kontakte</h2>
        <button className="btn-primary" onClick={onCreate}>+ Neuer Kontakt</button>
      </div>

      <div className="list-scroll">
        {contacts.length === 0 && (
          <p className="muted">Noch keine Kontakte.</p>
        )}

        <ul className="contact-list">
          {contacts.map((c) => (
            <li
              key={c.id}
              className={c.id === selectedId ? "contact-list-item active" : "contact-list-item"}
              onClick={() => onSelect(c.id)}
            >
              <div className="contact-main">
                <div className="contact-name">{c.name}</div>
                <div className="contact-email">{c.email}</div>
              </div>

              {c.lastContactAt && (
                <div className="contact-meta">
                  letzter Kontakt: {new Date(c.lastContactAt).toLocaleDateString()}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}