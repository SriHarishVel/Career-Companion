import FormDialog from "../../../components/FormDialog";

function SecuritySection({
  currentPassword,
  newPassword,
  setCurrentPassword,
  setNewPassword,
  showPasswordModal,
  setShowPasswordModal,
  updateUserPassword,
  passwordError,
  setPasswordError,
}) {
  const handleClose = () => {
    setCurrentPassword("");
    setNewPassword("");
    setPasswordError("");
    setShowPasswordModal(false);
  };

  const handleOpen = () => {
    setPasswordError("");
    setShowPasswordModal(true);
  };

  const handleSave = async () => {
    const success = await updateUserPassword();

    if (success) {
      handleClose();
    }
  };

  return (
    <section className="profile-card">
      <div className="profile-card-header">
        <div>
          <span className="profile-card-eyebrow">Account security</span>

          <h2>Security</h2>
        </div>
      </div>

      <div className="security-content">
        <div className="security-item">
          <div className="security-icon">🔒</div>

          <div>
            <span className="security-label">Password</span>

            <strong>••••••••••</strong>

            <p>Keep your account protected with a secure password.</p>
          </div>
        </div>

        <button
          type="button"
          className="profile-secondary-btn"
          onClick={handleOpen}
        >
          Change Password
        </button>
      </div>

      <FormDialog
        isOpen={showPasswordModal}
        title="Change Password"
        onClose={handleClose}
        footer={
          <>
            <button
              type="button"
              className="form-dialog-secondary-btn"
              onClick={handleClose}
            >
              Cancel
            </button>

            <button
              type="button"
              className="form-dialog-primary-btn"
              onClick={handleSave}
            >
              Update Password
            </button>
          </>
        }
      >
        <div className="profile-modal-fields">
          {passwordError && (
            <div className="profile-modal-error">{passwordError}</div>
          )}

          <div className="profile-modal-field">
            <label htmlFor="current-password">Current Password</label>

            <input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                setPasswordError("");
              }}
              placeholder="Enter current password"
            />
          </div>

          <div className="profile-modal-field">
            <label htmlFor="new-password">New Password</label>

            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setPasswordError("");
              }}
              placeholder="Enter new password"
            />

            <small>Password must be at least 6 characters.</small>
          </div>
        </div>
      </FormDialog>
    </section>
  );
}

export default SecuritySection;
