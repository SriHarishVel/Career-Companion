import { useState } from "react";
import FormDialog from "../../../components/FormDialog";

function AccountSection({ handleLogout }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const closeLogoutModal = () => {
    setShowLogoutModal(false);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    handleLogout();
  };

  return (
    <section className="profile-account">
      <div className="profile-account-content">
        <span className="profile-account-label">Account</span>

        <h2>Sign out</h2>

        <p>
          End your current session on this device. You can sign back in anytime.
        </p>
      </div>

      <button
        type="button"
        className="logout-btn"
        onClick={() => setShowLogoutModal(true)}
      >
        <span>Log out</span>
        <span className="logout-arrow">→</span>
      </button>

      <FormDialog
        isOpen={showLogoutModal}
        title="Log out?"
        onClose={closeLogoutModal}
        footer={
          <>
            <button
              type="button"
              className="form-dialog-secondary-btn"
              onClick={closeLogoutModal}
            >
              Cancel
            </button>

            <button
              type="button"
              className="form-dialog-danger-btn"
              onClick={confirmLogout}
            >
              Log out
              <span>→</span>
            </button>
          </>
        }
      >
        <div className="logout-modal-content">
          <div>
            <h3>End your current session?</h3>

            <p>You will need to sign in again to access your account.</p>
          </div>
        </div>
      </FormDialog>
    </section>
  );
}

export default AccountSection;
