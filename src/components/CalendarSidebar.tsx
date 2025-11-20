import { useMemo, useState } from "react";
import type { Appointment, Contact } from "../assets/types";
import { isPastDate } from "../utils/date";

type CalendarDay = {
  date: Date;
  isCurrentMonth: boolean;
};

interface CalendarSidebarProps {
  contacts: Contact[];
  appointments: Appointment[];
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function CalendarSidebar({
  contacts,
  appointments,
  selectedDate,
  onSelectDate,
}: CalendarSidebarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const days: CalendarDay[] = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const startWeekDay = (start.getDay() + 6) % 7;
    const daysInMonth = end.getDate();
    const result: CalendarDay[] = [];

    for (let i = 0; i < startWeekDay; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() - (startWeekDay - i));
      result.push({ date: d, isCurrentMonth: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      result.push({ date: d, isCurrentMonth: true });
    }

    while (result.length < 42) {
      const last = result[result.length - 1].date;
      const d = new Date(last);
      d.setDate(last.getDate() + 1);
      result.push({ date: d, isCurrentMonth: false });
    }

    return result;
  }, [currentMonth]);

  const dayAppointments = (date: Date) =>  appointments.filter((a) => sameDay(new Date(a.datetime), date));

  const hoverDayAppointments =  hoverDate != null ? dayAppointments(hoverDate) : [];

  const monthLabel = currentMonth.toLocaleString("de-DE", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="panel panel-left">
      <div className="panel-header">
        <h2>Termine</h2>
      </div>
      <div className="calendar-header">
        <button
          type="button"
          className="btn-ghost small"
          onClick={() =>
            setCurrentMonth(
              (m) => new Date(m.getFullYear(), m.getMonth() - 1, 1)
            )
          }
        >
          ‹
        </button>
        <div className="calendar-month">{monthLabel}</div>
        <button
          type="button"
          className="btn-ghost small"
          onClick={() =>
            setCurrentMonth(
              (m) => new Date(m.getFullYear(), m.getMonth() + 1, 1)
            )
          }
        >
          ›
        </button>
      </div>
      <div className="calendar-grid">
        {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((d) => (
          <div key={d} className="calendar-weekday">
            {d}
          </div>
        ))}
        {days.map(({ date, isCurrentMonth }) => {
          const isToday = sameDay(date, new Date());
          const hasAppts = dayAppointments(date).length > 0;
          const isSelected =
            selectedDate != null && sameDay(date, selectedDate);
          const isPast = isPastDate(date);

          return (
            <button
              key={date.toISOString()}
              type="button"
              className={[
                "calendar-day",
                !isCurrentMonth ? "calendar-day-faded" : "",
                isToday ? "calendar-day-today" : "",
                hasAppts ? "calendar-day-has" : "",
                isSelected ? "calendar-day-selected" : "",
                isPast && !isToday ? "calendar-day-past" : "", // 👈 neu
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => onSelectDate(date)}
              onMouseEnter={() => setHoverDate(date)}
              onMouseLeave={() =>
                setHoverDate((current) =>
                  current && sameDay(current, date) ? null : current
                )
              }
            >
              <span>{date.getDate()}</span>
            </button>
          );
        })}
      </div>

      {hoverDayAppointments.length > 0 && (
        <div className="hover-card">
          <div className="hover-card-title">
            {hoverDate &&
              hoverDate.toLocaleDateString("de-DE", {
                weekday: "short",
                day: "2-digit",
                month: "2-digit",
              })}
          </div>
          <ul>
            {hoverDayAppointments.map((a) => {
              const contact =
                contacts.find((c) => c.id === a.contactId) ?? null;
              return (
                <li key={a.id}>
                  {new Date(a.datetime).toLocaleTimeString("de-DE", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  – {contact ? contact.name : "Unbekannt"}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
