import { Modal } from "../Modal";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  emailLocked: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
}

export function DeleteConfirmModal({
  isOpen,
  emailLocked,
  onClose,
  onConfirmDelete,
}: DeleteConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      title={emailLocked ? "Termin absagen & archivieren" : "Termin löschen"}
      onClose={onClose}
    >
      {emailLocked ? (
        <>
          <p className="muted">
            Für diesen Termin ist die E-Mail-Versendung bereits aktiviert.
          </p>
          <p className="muted">
            Du kannst den Termin absagen und archivieren, oder den Vorgang
            abbrechen.
          </p>
          <div className="modal-actions">
            <button
              type="button"
              className="btn-ghost"
              onClick={onClose}
            >
              Abbrechen
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={onConfirmDelete}
            >
              Termin absagen & archivieren
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="muted">
            Möchtest du diesen Termin wirklich löschen?
          </p>
          <div className="modal-actions">
            <button
              type="button"
              className="btn-ghost"
              onClick={onClose}
            >
              Abbrechen
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={onConfirmDelete}
            >
              Löschen
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}