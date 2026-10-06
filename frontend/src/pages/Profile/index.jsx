import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

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

  const {
    data: profile,
    isLoading: loading,
    error: profileQueryError,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,

    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["profile"], updatedUser);

      setFullName(updatedUser.fullName || "");
      setEmail(updatedUser.email || "");

      setProfileSuccess("Profile updated successfully.");
      setShowEditModal(false);
    },

    onError: (error) => {
      console.error("Failed to update profile:", error);

      setProfileError(
        error.response?.data?.message ||
          "Unable to update your profile. Please try again.",
      );
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,

    onSuccess: () => {
      setCurrentPassword("");
      setNewPassword("");

      setPasswordSuccess("Password updated successfully.");
    },

    onError: (error) => {
      console.error("Failed to change password:", error);

      setPasswordError(
        error.response?.data?.message ||
          "Unable to change your password. Please try again.",
      );
    },
  });

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
    setProfileError("");

    const result = await updateProfileMutation.mutateAsync({
      fullName,
      email,
    });

    return Boolean(result);
  }

  async function updateUserPassword() {
    setPasswordError("");

    const result = await changePasswordMutation.mutateAsync({
      currentPassword,
      newPassword,
    });

    return Boolean(result);
  }

  function handleLogout() {
    logout();

    queryClient.removeQueries({
      queryKey: ["profile"],
    });

    navigate("/login");
  }

  function handleEditModalChange(value) {
    setProfileError("");

    if (value) {
      setFullName(profile.fullName || "");
      setEmail(profile.email || "");
    }

    setShowEditModal(value);
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

          <p>
            {profileQueryError
              ? "Unable to load your profile. Please try again."
              : "Something went wrong while loading your profile."}
          </p>

          <button
            type="button"
            className="btn-primary"
            onClick={() =>
              queryClient.invalidateQueries({
                queryKey: ["profile"],
              })
            }
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
      {profileQueryError && (
        <div className="profile-error">
          Unable to refresh your profile information.
        </div>
      )}

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
        setShowEditModal={handleEditModalChange}
      />

      <div className="profile-content-grid">
        <ProfileInfo
          profile={profile}
          fullName={fullName}
          email={email}
          setFullName={setFullName}
          setEmail={setEmail}
          showEditModal={showEditModal}
          setShowEditModal={handleEditModalChange}
          saveProfile={saveProfile}
          profileError={profileError}
          setProfileError={setProfileError}
        />

        <SecuritySection
          profile={profile}
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