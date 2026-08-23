import FormDialog from "../../../components/FormDialog";

function SecuritySection({
  currentPassword,
  newPassword,
  setCurrentPassword,
  setNewPassword,
  showPasswordModal,
  setShowPasswordModal,
  updateUserPassword,
}) {
  const closePasswordModal = () => {
    setCurrentPassword("");
    setNewPassword("");
    setShowPasswordModal(false);
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
          className="profile-secondary-btn"
          onClick={() => setShowPasswordModal(true)}
        >
          Change Password
        </button>
      </div>

      <FormDialog
        isOpen={showPasswordModal}
        title="Change Password"
        saveButtonText="Update Password"
        onSave={async () => {
          await updateUserPassword();
          setShowPasswordModal(false);
        }}
        onCancel={closePasswordModal}
      >
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current Password"
        />

        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
        />
      </FormDialog>
    </section>
  );
}

export default SecuritySection;
