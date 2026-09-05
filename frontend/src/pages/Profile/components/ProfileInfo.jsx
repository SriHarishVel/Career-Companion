import FormDialog from "../../../components/FormDialog";

function ProfileInfo({
  profile,
  fullName,
  email,
  setFullName,
  setEmail,
  showEditModal,
  setShowEditModal,
  saveProfile,
  profileError,
  setProfileError,
}) {
  const handleClose = () => {
    setFullName(profile.fullName || "");
    setEmail(profile.email || "");
    setProfileError("");
    setShowEditModal(false);
  };

  const handleSave = async () => {
    await saveProfile();
  };

  return (
    <section className="profile-card">
      <div className="profile-card-header">
        <div>
          <span className="profile-card-eyebrow">Personal information</span>

          <h2>Account Information</h2>
        </div>
      </div>

      <div className="profile-info-list">
        <div className="profile-row">
          <div>
            <span>Full Name</span>
            <strong>{profile.fullName}</strong>
          </div>
        </div>

        <div className="profile-row">
          <div>
            <span>Email</span>
            <strong>{profile.email}</strong>
          </div>
        </div>

        <div className="profile-row">
          <div>
            <span>Member Since</span>

            <strong>
              {profile.createdAt
                ? new Date(profile.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "-"}
            </strong>
          </div>
        </div>
      </div>

      <FormDialog
        isOpen={showEditModal}
        title="Edit Profile"
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
              Save Changes
            </button>
          </>
        }
      >
        <div className="profile-modal-fields">
          {profileError && (
            <div className="profile-modal-error">{profileError}</div>
          )}

          <div className="profile-modal-field">
            <label htmlFor="profile-full-name">Full Name</label>

            <input
              id="profile-full-name"
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setProfileError("");
              }}
              placeholder="Enter your full name"
            />
          </div>

          <div className="profile-modal-field">
            <label htmlFor="profile-email">Email</label>

            <input
              id="profile-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setProfileError("");
              }}
              placeholder="Enter your email"
            />
          </div>
        </div>
      </FormDialog>
    </section>
  );
}

export default ProfileInfo;
