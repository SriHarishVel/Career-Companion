function AccountSection({ handleLogout }) {
    return (
        <section className="profile-account">
            <div className="profile-account-content">
                <span className="profile-account-label">
                    Account
                </span>

                <h2>Sign out</h2>

                <p>
                    End your current session on this device.
                </p>
            </div>

            <button
                className="logout-btn"
                onClick={handleLogout}
            >
                Log out
            </button>
        </section>
    );
}

export default AccountSection;