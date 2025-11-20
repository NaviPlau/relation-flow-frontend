import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { ContactsView } from "./components/ContactsView";
import { AppointmentsView } from "./components/AppointmentsView";
import type { Appointment, Contact } from "./assets/types";

function App() {
  const [activeView, setActiveView] = useState<"contacts" | "appointments">(
    "contacts"
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [nextContactId, setNextContactId] = useState(1);
  const [nextAppointmentId, setNextAppointmentId] = useState(1);
  const [preselectedContactId, setPreselectedContactId] = useState<  number | null  >(null);

  const createContact = (data: Omit<Contact, "id">): Contact => {
    const contact: Contact = { id: nextContactId, ...data };
    setContacts((prev) => [...prev, contact]);
    setNextContactId((id) => id + 1);
    return contact;
  };

  const createAppointment = (data: Omit<Appointment, "id">): Appointment => {
    const appt: Appointment = { id: nextAppointmentId, ...data };
    setAppointments((prev) => [...prev, appt]);
    setNextAppointmentId((id) => id + 1);
    return appt;
  };

  const handleSelectContactForAppointment = (contact: Contact) => {
    setPreselectedContactId(contact.id);
    setActiveView("appointments");
  };

  const updateContact = (updated: Contact) => {
    setContacts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const updateAppointment = (updated: Appointment) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a))
    );
  };

  const deleteAppointment = (id: number) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

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
            onCreateContact={createContact}
            onUpdateContact={updateContact}
            onSelectContactForAppointment={handleSelectContactForAppointment}
          />
        ) : (
          <AppointmentsView
            contacts={contacts}
            appointments={appointments}
            onCreateAppointment={createAppointment}
            onUpdateAppointment={updateAppointment}
            onDeleteAppointment={deleteAppointment}
            onCreateContactInline={createContact}
            preselectedContactId={preselectedContactId}
            onClearPreselectedContact={() => setPreselectedContactId(null)}
          />
        )}
      </main>
    </div>
  );
}

export default App;
