import { useEffect, useState } from "react";

import {
    getProfile,
    updateProfile,
    changePassword,
} from "../../services/userService";

import "./index.css";

function Profile() {

    const [profile, setProfile] = useState(null);

    const [fullName, setFullName] = useState("");

    const [email, setEmail] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");

    const [newPassword, setNewPassword] = useState("");

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
        <div className="container">

            <h1>Profile</h1>

            <div className="profile-card">

                <h2>Account Information</h2>

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

                <p>
                    Joined:
                    {" "}
                    {new Date(
                        profile.createdAt
                    ).toLocaleDateString("en-GB")}
                </p>

                <button
                    onClick={saveProfile}
                >
                    Save Profile
                </button>

            </div>

            <div className="profile-card">

                <h2>Change Password</h2>

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

                <button
                    onClick={
                        updateUserPassword
                    }
                >
                    Change Password
                </button>

            </div>

        </div>
    );

}

export default Profile;