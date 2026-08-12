import EditModal from "../../../components/EditModal";

function SecuritySection({
    currentPassword,
    newPassword,
    setCurrentPassword,
    setNewPassword,
    showPasswordModal,
    setShowPasswordModal,
    updateUserPassword
}) {

    return (
        <div className="profile-card">

            <h2>Security</h2>

            <div className="profile-row">
                <span>Password</span>
                <strong>••••••••••</strong>
            </div>

            <button
                onClick={() =>
                    setShowPasswordModal(true)
                }
            >
                Change Password
            </button>

            <EditModal
                isOpen={showPasswordModal}
                title="Change Password"
                saveButtonText="Update Password"
                onSave={async () => {

                    await updateUserPassword();

                    setShowPasswordModal(false);

                }}
                onCancel={() => {

                    setCurrentPassword("");
                    setNewPassword("");

                    setShowPasswordModal(false);

                }}
            >

                <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) =>
                        setCurrentPassword(
                            e.target.value
                        )
                    }
                    placeholder="Current Password"
                />

                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) =>
                        setNewPassword(
                            e.target.value
                        )
                    }
                    placeholder="New Password"
                />

            </EditModal>

        </div>
    );
}

export default SecuritySection;