import "./index.css";

function EditModal({
    isOpen,
    title,
    children,
    onSave,
    onCancel,
    saveButtonText = "Save",
    cancelButtonText = "Cancel",
}) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-card">

                <h2>{title}</h2>

                <div className="modal-content">
                    {children}
                </div>

                <div className="modal-actions">

                    <button
                        className="save-btn"
                        onClick={onSave}
                    >
                        {saveButtonText}
                    </button>

                    <button
                        className="cancel-btn"
                        onClick={onCancel}
                    >
                        {cancelButtonText}
                    </button>

                </div>

            </div>
        </div>
    );
}

export default EditModal;