function AccountSection({ handleLogout }) {
  return (
    <section className="profile-account">
      <div className="profile-account-content">
        <span className="profile-account-label">Account</span>

        <h2>Sign out</h2>

        <p>End your current session on this device.</p>
      </div>

      <button type="button" className="logout-btn" onClick={handleLogout}>
        Log out
        <span>→</span>
      </button>
    </section>
  );
}

export default AccountSection;
