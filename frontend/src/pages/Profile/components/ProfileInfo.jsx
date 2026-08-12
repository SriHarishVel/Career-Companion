import EditModal from "../../../components/EditModal";

function ProfileInfo({
    profile,
    fullName,
    email,
    setFullName,
    setEmail,
    showEditModal,
    setShowEditModal,
    saveProfile
}) {

    return (
        <div className="profile-card">

            <h2>Account Information</h2>

            <div className="profile-row">
                <span>Full Name</span>
                <strong>{profile.fullName}</strong>
            </div>

            <div className="profile-row">
                <span>Email</span>
                <strong>{profile.email}</strong>
            </div>

            <div className="profile-row">
                <span>Member Since</span>
                <strong>
                    {new Date(profile.createdAt)
                        .toLocaleDateString("en-GB")}
                </strong>
            </div>

            <button
                onClick={() =>
                    setShowEditModal(true)
                }
            >
                Edit Profile
            </button>

            <EditModal
                isOpen={showEditModal}
                title="Edit Profile"
                saveButtonText="Save Changes"
                onSave={async () => {

                    await saveProfile();

                    setShowEditModal(false);

                }}
                onCancel={() =>
                    setShowEditModal(false)
                }
            >

                <input
                    type="text"
                    value={fullName}
                    onChange={(e) =>
                        setFullName(e.target.value)
                    }
                    placeholder="Full Name"
                />

                <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    placeholder="Email"
                />

            </EditModal>

        </div>
    );
}

export default ProfileInfo;