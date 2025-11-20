import type { ContactFormErrors, ContactFormState } from "../components/modals/ContactFormModal";


const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactForm(form: ContactFormState): ContactFormErrors {
  const errors: ContactFormErrors = {};

  const name = form.name.trim();
  if (!name) {
    errors.name = "Name ist erforderlich.";
  } else if (name.length < 3) {
    errors.name = "Name sollte mindestens 3 Zeichen haben.";
  }
  
  const email = form.email.trim();
  if (!email) {
    errors.email = "E-Mail ist erforderlich.";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Bitte eine gültige E-Mail-Adresse eingeben.";
  }

  const phone = form.phone.trim();
  if (phone && phone.length < 6) {
    errors.phone = "Telefonnummer ist zu kurz.";
  }

  const note = form.note.trim();
  if (note && note.length > 1000) {
    errors.note = "Notiz darf maximal 1000 Zeichen haben.";
  }

  return errors;
}