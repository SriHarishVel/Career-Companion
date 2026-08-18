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
        <div className="interview-form-fields">
          <div className="filter-group">
            <label>Round Name</label>

            <input
              type="text"
              placeholder="e.g. Technical Interview"
              value={roundTitle}
              onChange={(e) => setRoundTitle(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Status</label>

            <select
              value={roundStatus}
              onChange={(e) => setRoundStatus(e.target.value)}
            >
              <option value="Pending">Pending</option>

              <option value="Completed">Completed</option>

              <option value="Failed">Failed</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Interview Date</label>

            <input
              type="date"
              value={roundDate}
              onChange={(e) => setRoundDate(e.target.value)}
            />
          </div>
        </div>
      </EditModal>

      <EditModal
        isOpen={showEditRoundModal}
        title={
          selectedRound ? `Edit ${selectedRound.title}` : "Edit Interview Round"
        }
        onSave={handleSaveEditedRound}
        onCancel={closeEditRoundModal}
      >
        <div className="interview-form-fields">
          <div className="filter-group">
            <label>Round Name</label>

            <input
              type="text"
              value={roundTitle}
              onChange={(e) => setRoundTitle(e.target.value)}
              placeholder="e.g. Technical Interview"
            />
          </div>

          <div className="filter-group">
            <label>Status</label>

            <select
              value={roundStatus}
              onChange={(e) => setRoundStatus(e.target.value)}
            >
              <option value="Pending">Pending</option>

              <option value="Completed">Completed</option>

              <option value="Failed">Failed</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Interview Date</label>

            <input
              type="date"
              value={roundDate}
              onChange={(e) => setRoundDate(e.target.value)}
            />
          </div>
        </div>
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
