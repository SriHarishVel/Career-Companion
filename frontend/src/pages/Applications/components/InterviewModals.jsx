import FormDialog from "../../../components/FormDialog";
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
  function resetRoundForm() {
    setRoundTitle("");
    setRoundStatus("Pending");
    setRoundDate("");
  }

  function closeAddRoundDialog() {
    setShowRoundModal(false);
    resetRoundForm();
    setRoundApplicationId(null);
  }

  function closeEditRoundDialog() {
    setShowEditRoundModal(false);
    setSelectedRound(null);
    resetRoundForm();
    setRoundApplicationId(null);
  }

  function closeDeleteRoundModal() {
    setShowDeleteRoundModal(false);
    setSelectedRound(null);
    setRoundApplicationId(null);
  }

  function handleSaveEditedRound() {
    if (!selectedRound || !roundApplicationId) {
      return;
    }

    saveEditedRound();
  }

  function handleConfirmDeleteRound() {
    if (!selectedRound || !roundApplicationId) {
      return;
    }

    confirmDeleteRound();
  }

  return (
    <>
      <FormDialog
        isOpen={showRoundModal}
        title="Add Interview Round"
        onClose={closeAddRoundDialog}
        footer={
          <>
            <button type="button" onClick={addRound}>
              Add Round
            </button>

            <button type="button" onClick={closeAddRoundDialog}>
              Cancel
            </button>
          </>
        }
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
      </FormDialog>

      <FormDialog
        isOpen={showEditRoundModal}
        title={
          selectedRound ? `Edit ${selectedRound.title}` : "Edit Interview Round"
        }
        onClose={closeEditRoundDialog}
        footer={
          <>
            <button type="button" onClick={handleSaveEditedRound}>
              Save
            </button>

            <button type="button" onClick={closeEditRoundDialog}>
              Cancel
            </button>
          </>
        }
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
      </FormDialog>

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
