import { useEffect, useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { ContactsView } from "./components/ContactsView";
import { AppointmentsView } from "./components/AppointmentsView";
import type { Appointment, Contact } from "./assets/types";

import {
  fetchContacts,
  fetchAppointments,
  createContact,
  updateContact,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from "./api/appointmentsApi";

function App() {
  const [activeView, setActiveView] = useState<"contacts" | "appointments">(
    "contacts"
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [preselectedContactId, setPreselectedContactId] =
    useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [contactsRes, appointmentsRes] = await Promise.all([
          fetchContacts(),
          fetchAppointments(),
        ]);
        setContacts(contactsRes);
        setAppointments(appointmentsRes);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);


  const handleCreateContact = async (
    data: Omit<Contact, "id">
  ): Promise<Contact> => {
    const created = await createContact(data);
    setContacts((prev) => [...prev, created]);
    return created;
  };

  const handleUpdateContact = async (updated: Contact): Promise<void> => {
    const { id, ...rest } = updated;
    const saved = await updateContact(id, rest);
    setContacts((prev) =>
      prev.map((c) => (c.id === saved.id ? saved : c))
    );
  };


  const handleCreateAppointment = async (
    data: Omit<Appointment, "id">
  ): Promise<Appointment> => {
    const created = await createAppointment(data);
    setAppointments((prev) => [...prev, created]);
    return created;
  };

  const handleUpdateAppointment = async (
    updated: Appointment
  ): Promise<void> => {
    const { id, ...rest } = updated;
    const saved = await updateAppointment(id, rest);
    setAppointments((prev) =>
      prev.map((a) => (a.id === saved.id ? saved : a))
    );
  };

  const handleDeleteAppointment = async (id: number): Promise<void> => {
    await deleteAppointment(id);
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };


  const handleSelectContactForAppointment = (contact: Contact) => {
    setPreselectedContactId(contact.id);
    setActiveView("appointments");
  };

  if (loading) {
    return <div className="app-root">Lade Daten…</div>;
  }

  if (error) {
    return <div className="app-root error">{error}</div>;
  }

  return (
    <div className="app-root">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
        activeView={activeView}
        onChangeView={setActiveView}
      />
      <main className="main-area">
        {activeView === "contacts" ? (
          <ContactsView
            contacts={contacts}
            onCreateContact={handleCreateContact}
            onUpdateContact={handleUpdateContact}
            onSelectContactForAppointment={handleSelectContactForAppointment}
          />
        ) : (
          <AppointmentsView
            contacts={contacts}
            appointments={appointments}
            onCreateAppointment={handleCreateAppointment}
            onUpdateAppointment={handleUpdateAppointment}
            onDeleteAppointment={handleDeleteAppointment}
            onCreateContactInline={handleCreateContact}
            preselectedContactId={preselectedContactId}
            onClearPreselectedContact={() => setPreselectedContactId(null)}
          />
        )}
      </main>
    </div>
  );
}

export default App;
