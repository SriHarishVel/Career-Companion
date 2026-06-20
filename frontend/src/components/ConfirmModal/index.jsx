import "./index.css";

function ConfirmModal({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel
}) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay">

            <div className="modal">

                <h2>{title}</h2>

                <p>{message}</p>

                <div className="modal-actions">

                    <button
                        className="cancel-btn"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>

                    <button
                        className="delete-btn"
                        onClick={onConfirm}
                    >
                        Delete
                    </button>

                </div>

            </div>

        </div>
    );
}

export default ConfirmModal;