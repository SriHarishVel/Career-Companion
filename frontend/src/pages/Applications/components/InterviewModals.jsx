import EditModal from "../../../components/EditModal";
import ConfirmModal from "../../../components/ConfirmModal";

function InterviewModals({
    showRoundModal,
    setShowRoundModal,
    addRound,

    showEditRoundModal,
    setShowEditRoundModal,
    saveEditedRound,

    showDeleteRoundModal,
    setShowDeleteRoundModal,
    confirmDeleteRound,

    selectedRound,
    setSelectedRound,
    roundApplicationId,
    setRoundApplicationId,

    roundTitle,
    setRoundTitle,
    roundStatus,
    setRoundStatus,
    roundDate,
    setRoundDate,
}) {
    const resetRoundForm = () => {
        setRoundTitle("");
        setRoundStatus("Pending");
        setRoundDate("");
    };

    const closeAddRoundModal = () => {
        setShowRoundModal(false);
        resetRoundForm();
        setRoundApplicationId(null);
    };

    const closeEditRoundModal = () => {
        setShowEditRoundModal(false);
        setSelectedRound(null);
        resetRoundForm();
        setRoundApplicationId(null);
    };

    const closeDeleteRoundModal = () => {
        setShowDeleteRoundModal(false);
        setSelectedRound(null);
        setRoundApplicationId(null);
    };

    const handleSaveEditedRound = () => {
        if (!selectedRound || !roundApplicationId) {
            return;
        }

        saveEditedRound();
    };

    const handleConfirmDeleteRound = () => {
        if (!selectedRound || !roundApplicationId) {
            return;
        }

        confirmDeleteRound();
    };

    return (
        <>
            <EditModal
                isOpen={showRoundModal}
                title="Add Interview Round"
                onSave={addRound}
                onCancel={closeAddRoundModal}
            >
                <input
                    type="text"
                    placeholder="Round Name"
                    value={roundTitle}
                    onChange={(e) => setRoundTitle(e.target.value)}
                />

                <select
                    value={roundStatus}
                    onChange={(e) => setRoundStatus(e.target.value)}
                >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Failed">Failed</option>
                </select>

                <input
                    type="date"
                    value={roundDate}
                    onChange={(e) => setRoundDate(e.target.value)}
                />
            </EditModal>

            <EditModal
                isOpen={showEditRoundModal}
                title={selectedRound ? `Edit ${selectedRound.title}` : "Edit Interview Round"}
                onSave={handleSaveEditedRound}
                onCancel={closeEditRoundModal}
            >
                <input
                    type="text"
                    value={roundTitle}
                    onChange={(e) => setRoundTitle(e.target.value)}
                    placeholder="Round Name"
                />

                <select
                    value={roundStatus}
                    onChange={(e) => setRoundStatus(e.target.value)}
                >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Failed">Failed</option>
                </select>

                <input
                    type="date"
                    value={roundDate}
                    onChange={(e) => setRoundDate(e.target.value)}
                />
            </EditModal>

            <ConfirmModal
                isOpen={showDeleteRoundModal}
                title="Delete Interview Round"
                message="Are you sure you want to delete this interview round?"
                onConfirm={handleConfirmDeleteRound}
                onCancel={closeDeleteRoundModal}
            />
        </>
    );
}

export default InterviewModals;