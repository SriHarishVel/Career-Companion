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

  const [profileSuccess, setProfileSuccess] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");

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

  useEffect(() => {
    if (!profileSuccess) {
      return;
    }

    const timer = setTimeout(() => {
      setProfileSuccess("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [profileSuccess]);

  useEffect(() => {
    if (!passwordSuccess) {
      return;
    }

    const timer = setTimeout(() => {
      setPasswordSuccess("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [passwordSuccess]);

  async function saveProfile() {
    try {
      setProfileError("");

      const updatedUser = await updateProfile({
        fullName,
        email,
      });

      setProfile(updatedUser);
      setFullName(updatedUser.fullName || "");
      setEmail(updatedUser.email || "");

      setProfileSuccess("Profile updated successfully.");
      setShowEditModal(false);

      return true;
    } catch (error) {
      console.error("Failed to update profile:", error);

      setProfileError(
        error.response?.data?.message ||
          "Unable to update your profile. Please try again.",
      );

      return false;
    }
  }

  async function updateUserPassword() {
    try {
      setPasswordError("");

      await changePassword({
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");

      setPasswordSuccess("Password updated successfully.");

      return true;
    } catch (error) {
      console.error("Failed to change password:", error);

      setPasswordError(
        error.response?.data?.message ||
          "Unable to change your password. Please try again.",
      );

      return false;
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
            type="button"
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

      {profileSuccess && (
        <div className="profile-success">{profileSuccess}</div>
      )}

      {passwordSuccess && (
        <div className="profile-success">{passwordSuccess}</div>
      )}

      <ProfileHeader
        profile={profile}
        initials={initials}
        firstName={firstName}
        setShowEditModal={(value) => {
          setProfileError("");
          setShowEditModal(value);
        }}
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
          profileError={profileError}
          setProfileError={setProfileError}
        />

        <SecuritySection
          currentPassword={currentPassword}
          newPassword={newPassword}
          setCurrentPassword={setCurrentPassword}
          setNewPassword={setNewPassword}
          showPasswordModal={showPasswordModal}
          setShowPasswordModal={setShowPasswordModal}
          updateUserPassword={updateUserPassword}
          passwordError={passwordError}
          setPasswordError={setPasswordError}
        />
      </div>

      <AccountSection handleLogout={handleLogout} />
    </div>
  );
}

export default Profile;
