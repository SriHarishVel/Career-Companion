import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getProfile,
    updateProfile,
    changePassword,
} from "../../services/userService";

import { logout } from "../../services/authService";

import ProfileInfo from "./components/ProfileInfo";
import SecuritySection from "./components/SecuritySection";

import "./index.css";

function Profile() {

    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [showEditModal, setShowEditModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        async function fetchProfile() {

            try {

                setLoading(true);
                setError("");

                const user = await getProfile();

                setProfile(user);
                setFullName(user.fullName || "");
                setEmail(user.email || "");

            } catch (error) {

                console.error(
                    "Failed to load profile:",
                    error
                );

                setError(
                    "Unable to load your profile. Please try again."
                );

            } finally {

                setLoading(false);

            }
        }

        fetchProfile();

    }, []);


    async function saveProfile() {

        try {

            setError("");

            const updatedUser = await updateProfile({
                fullName,
                email,
            });

            setProfile(updatedUser);

            setFullName(updatedUser.fullName || "");
            setEmail(updatedUser.email || "");

            setShowEditModal(false);

        } catch (error) {

            console.error(
                "Failed to update profile:",
                error
            );

            setError(
                "Unable to update your profile. Please try again."
            );

        }

    }


    async function updateUserPassword() {

        try {

            setError("");

            await changePassword({
                currentPassword,
                newPassword,
            });

            setCurrentPassword("");
            setNewPassword("");

            setShowPasswordModal(false);

        } catch (error) {

            console.error(
                "Failed to change password:",
                error
            );

            setError(
                "Unable to change your password. Please check your current password and try again."
            );

        }

    }


    function handleLogout() {

        logout();
        navigate("/login");

    }


    if (loading) {

        return (
            <div className="container profile-container">

                <h1>My Profile</h1>

                <p>
                    Loading your profile...
                </p>

            </div>
        );

    }


    if (!profile) {

        return (
            <div className="container profile-container">

                <h1>My Profile</h1>

                <p>
                    {error || "Unable to load your profile."}
                </p>

                <button
                    onClick={() => window.location.reload()}
                >
                    Try Again
                </button>

            </div>
        );

    }


    return (
        <div className="container profile-container">

            <div className="profile-header">

                <span className="profile-eyebrow">
                    ACCOUNT
                </span>

                <h1>
                    Hi, {profile.fullName.split(" ")[0]} 👋
                </h1>

                <p>
                    Manage your personal information and account security.
                </p>

            </div>


            {error && (
                <div className="profile-error">
                    {error}
                </div>
            )}


            <ProfileInfo
                profile={profile}
                fullName={fullName}
                email={email}
                setFullName={setFullName}
                setEmail={setEmail}
                showEditModal={showEditModal}
                setShowEditModal={setShowEditModal}
                saveProfile={saveProfile}
            />


            <SecuritySection
                currentPassword={currentPassword}
                newPassword={newPassword}
                setCurrentPassword={setCurrentPassword}
                setNewPassword={setNewPassword}
                showPasswordModal={showPasswordModal}
                setShowPasswordModal={setShowPasswordModal}
                updateUserPassword={updateUserPassword}
            />


            <section className="profile-account">

                <div>
                    <h2>
                        Account
                    </h2>

                    <p>
                        Finished for now? You can safely sign out of your account.
                    </p>
                </div>

                <button
                    className="logout-btn"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </section>

        </div>
    );
}

export default Profile;