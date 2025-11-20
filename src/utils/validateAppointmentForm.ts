import type { AppointmentFormState, AppointmentFormErrors } from "../assets/types";
import { getTodayAndMaxDate } from "./date";

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

export function validateAppointmentForm(
  form: AppointmentFormState
): AppointmentFormErrors {
  const errors: AppointmentFormErrors = {};

  if (!form.date) {
    errors.date = "Bitte ein Datum wählen.";
  } else {
    const { today, max } = getTodayAndMaxDate(10);
    const selected = new Date(form.date);
    selected.setHours(0, 0, 0, 0);
    if (selected < today) {
      errors.date =
        "Termine in der Vergangenheit können nicht neu angelegt werden.";
    } else if (selected > max) {
      errors.date = "Datum darf maximal 10 Jahre in der Zukunft liegen.";
    }
  }

  if (!form.time) {
    errors.time = "Bitte eine Uhrzeit eingeben.";
  }

  if (!form.contactId) {
    errors.contactId = "Bitte einen Kontakt auswählen.";
  }

  if (form.time && !timeRegex.test(form.time)) {
    errors.time = "Bitte eine gültige Uhrzeit im Format HH:MM angeben.";
  }

  return errors;
}