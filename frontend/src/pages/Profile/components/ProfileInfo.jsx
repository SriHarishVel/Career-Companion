import FormDialog from "../../../components/FormDialog";

function ProfileInfo({
  profile,
  fullName,
  email,
  setFullName,
  setEmail,
  showEditModal,
  setshowEditModal,
  saveProfile,
}) {
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
        saveButtonText="Save Changes"
        onSave={async () => {
          await saveProfile();
          setshowEditModal(false);
        }}
        onCancel={() => setshowEditModal(false)}
      >
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full Name"
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
      </FormDialog>
    </section>
  );
}

export default ProfileInfo;
