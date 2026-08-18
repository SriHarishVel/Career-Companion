function ProfileHeader({ profile, initials, firstName, setShowEditModal }) {
  return (
    <div className="profile-hero-wrapper">
      <div className="profile-header">
        <span className="profile-eyebrow">ACCOUNT</span>

        <h1>Your Profile</h1>

        <p>Manage your personal information and account security.</p>
      </div>

      <section className="profile-hero">
        <div className="profile-avatar">{initials}</div>

        <div className="profile-hero-info">
          <span className="profile-hero-label">Personal account</span>

          <h2>Hi, {firstName} 👋</h2>

          <p>{profile.email}</p>
        </div>

        <button
          className="profile-primary-btn"
          onClick={() => setShowEditModal(true)}
        >
          Edit Profile
        </button>
      </section>
    </div>
  );
}

export default ProfileHeader;
