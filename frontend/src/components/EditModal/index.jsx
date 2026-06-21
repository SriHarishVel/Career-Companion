import "./index.css";

function EditModal({
    isOpen,
    title,
    children,
    onSave,
    onCancel
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
                        onClick={onSave}
                    >
                        Save
                    </button>

                    <button
                        className="cancel-btn"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>

            </div>
        </div>
    );
}

export default EditModal;