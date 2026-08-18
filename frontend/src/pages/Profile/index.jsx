import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getProfile,
  updateProfile,
  changePassword,
} from "../../services/userService";

import { logout } from "../../services/authService";

import LoadingState from "../../components/LoadingState";

import ProfileHeader from "./components/ProfileHeader";
import ProfileInfo from "./components/ProfileInfo";
import SecuritySection from "./components/SecuritySection";
import AccountSection from "./components/AccountSection";

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
        console.error("Failed to load profile:", error);

        setError("Unable to load your profile. Please try again.");
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
      console.error("Failed to update profile:", error);

      setError("Unable to update your profile. Please try again.");
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
      console.error("Failed to change password:", error);

      setError(
        "Unable to change your password. Please check your current password and try again.",
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
        <LoadingState message="Loading your profile..." />
      </div>
    );
  }
  if (!profile) {
    return (
      <div className="container profile-container">
        <div className="profile-error-state">
          <h1>Unable to load profile</h1>

          <p>{error || "Something went wrong while loading your profile."}</p>

          <button
            className="profile-primary-btn"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const firstName = profile.fullName?.trim().split(/\s+/)[0] || "there";

  const initials =
    profile.fullName
      ?.trim()
      .split(/\s+/)
      .map((name) => name[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  return (
    <div className="container profile-container">
      {error && <div className="profile-error">{error}</div>}

      <ProfileHeader
        profile={profile}
        initials={initials}
        firstName={firstName}
        setShowEditModal={setShowEditModal}
      />

      <div className="profile-content-grid">
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

      <AccountSection handleLogout={handleLogout} />
    </div>
  );
}

export default Profile;
