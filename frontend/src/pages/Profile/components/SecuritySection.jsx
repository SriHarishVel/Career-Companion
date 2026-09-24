import FormDialog from "../../../components/FormDialog";

function SecuritySection({
  profile,
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
  const hasPassword = profile?.hasPassword;

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

            {hasPassword ? (
              <>
                <strong>••••••••••</strong>

                <p>Keep your account protected with a secure password.</p>
              </>
            ) : (
              <p>
                You signed in with Google. Set a password to also sign in with
                your email and password.
              </p>
            )}
          </div>
        </div>

        <button type="button" className="btn-secondary" onClick={handleOpen}>
          {hasPassword ? "Change Password" : "Set Password"}
        </button>
      </div>

      <FormDialog
        isOpen={showPasswordModal}
        title={hasPassword ? "Change Password" : "Set Password"}
        onClose={handleClose}
        footer={
          <>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleClose}
            >
              Cancel
            </button>

            <button
              type="button"
              className="btn-primary-outline"
              onClick={handleSave}
            >
              {hasPassword ? "Update Password" : "Set Password"}
            </button>
          </>
        }
      >
        <div className="profile-modal-fields">
          {passwordError && (
            <div className="profile-modal-error">{passwordError}</div>
          )}

          {hasPassword && (
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
          )}

          <div className="profile-modal-field">
            <label htmlFor="new-password">
              {hasPassword ? "New Password" : "Password"}
            </label>

            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setPasswordError("");
              }}
              placeholder={
                hasPassword ? "Enter new password" : "Enter password"
              }
            />

            <small>Password must be at least 6 characters.</small>
          </div>
        </div>
      </FormDialog>
    </section>
  );
}

export default SecuritySection;