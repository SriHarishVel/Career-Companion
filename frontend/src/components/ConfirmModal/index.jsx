function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Delete",
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="confirm-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onCancel();
        }
      }}
    >
      <div className="confirm-modal" role="dialog" aria-modal="true">
        <div className="confirm-modal-content">
          <h2>{title}</h2>

          <p>{message}</p>
        </div>

        <div className="confirm-modal-actions">
          <button
            type="button"
            className="confirm-modal-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            type="button"
            className="confirm-modal-confirm"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;