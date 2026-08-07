import { useEffect, useState } from "react";
import {
    getProfile,
    updateProfile,
    changePassword,
} from "../../services/userService";
import EditModal from "../../components/EditModal";
import "./index.css";

function Profile() {

    const [profile, setProfile] = useState(null);

    const [fullName, setFullName] = useState("");

    const [email, setEmail] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");

    const [newPassword, setNewPassword] = useState("");

    const [showEditModal, setShowEditModal] = useState(false);

    const [showPasswordModal, setShowPasswordModal] = useState(false);

    useEffect(() => {

        async function fetchProfile() {
            try {
                const user = await getProfile();
                setProfile(user);
                setFullName(
                    user.fullName
                );
                setEmail(user.email);

            } catch (error) {
                console.error(error);
            }
        }
        fetchProfile();
    }, []);

    async function saveProfile() {

        try {

            const updatedUser =
                await updateProfile({
                    fullName,
                    email,
                });

            setProfile(updatedUser);

        } catch (error) {

            console.error(error);

        }

    }

    async function updateUserPassword() {

        try {

            await changePassword({
                currentPassword,
                newPassword,
            });

            setCurrentPassword("");
            setNewPassword("");

        } catch (error) {

            console.error(error);

        }
    }

    if (!profile) {
        return <p>Loading...</p>;
    }

    return (
        <div className="container profile-container">

            <h1>My Profile</h1>

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

            </div>

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

            </div>

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

export default Profile;