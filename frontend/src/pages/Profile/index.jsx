import { useEffect, useState } from "react";
import {
    getProfile,
    updateProfile,
    changePassword,
} from "../../services/userService";
import ProfileInfo from "./components/ProfileInfo";
import SecuritySection from "./components/SecuritySection";
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

        </div>
    );

}

export default Profile;