import "./index.css";

function FormDialog({ isOpen, title, children, footer, onClose }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="form-dialog-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="form-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-dialog-title"
      >
        <div className="form-dialog-header">
          <h2 id="form-dialog-title">{title}</h2>

          <button
            type="button"
            className="form-dialog-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="form-dialog-content">{children}</div>

        {footer && <div className="form-dialog-actions">{footer}</div>}
      </div>
    </div>
  );
}

export default FormDialog;
