import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import LoadingState from "../../components/LoadingState";
import ConfirmModal from "../../components/ConfirmModal";
import TargetRoleForm from "./components/TargetRoleForm";
import TargetRoleOverview from "./components/TargetRoleOverview";
import TargetRoleList from "./components/TargetRoleList";

import {
  getTargetRoles,
  getTargetRoleReadiness,
  createTargetRole,
  updateTargetRole,
  deleteTargetRole,
} from "../../services/targetRoleService";

import "./index.css";

function TargetRoles() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleToDelete, setRoleToDelete] = useState(null);

  const {
    data: roles = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["target-roles"],
    queryFn: getTargetRoles,
    staleTime: 5 * 60 * 1000,
  });

  const readinessQueries = useQuery({
    queryKey: ["target-role-readiness", roles.map((role) => role._id)],
    queryFn: async () =>
      Promise.all(
        roles.map(async (role) => ({
          roleId: role._id,
          readiness: await getTargetRoleReadiness(role._id),
        })),
      ),
    enabled: roles.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  const refreshTargetRoleData = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["target-roles"],
      }),
      queryClient.invalidateQueries({
        queryKey: ["target-role-readiness"],
      }),
    ]);
  };

  const createRoleMutation = useMutation({
    mutationFn: createTargetRole,
    onSuccess: async () => {
      await refreshTargetRoleData();
      setShowForm(false);
      setSelectedRole(null);
      setFormError("");
    },
    onError: (mutationError) => {
      setFormError(
        mutationError.response?.data?.message ||
          "Unable to create the target role. Please try again.",
      );
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ roleId, roleData }) => updateTargetRole(roleId, roleData),
    onSuccess: async () => {
      await refreshTargetRoleData();
      setShowForm(false);
      setSelectedRole(null);
      setFormError("");
    },
    onError: (mutationError) => {
      setFormError(
        mutationError.response?.data?.message ||
          "Unable to update the target role. Please try again.",
      );
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: deleteTargetRole,
    onSuccess: async () => {
      await refreshTargetRoleData();
      setSelectedRole(null);
      setShowForm(false);
      setFormError("");
    },
    onError: (mutationError) => {
      setFormError(
        mutationError.response?.data?.message ||
          "Unable to delete the target role. Please try again.",
      );
    },
  });

  async function handleSubmitRole(roleData) {
    setFormError("");

    if (selectedRole) {
      await updateRoleMutation.mutateAsync({
        roleId: selectedRole._id,
        roleData,
      });
      return;
    }

    await createRoleMutation.mutateAsync(roleData);
  }

  function openCreateForm() {
    setFormError("");
    setSelectedRole(null);
    setShowForm(true);
  }

  function openEditForm(role) {
    setFormError("");
    setSelectedRole(role);
    setShowForm(true);
  }

  function closeCreateForm() {
    if (createRoleMutation.isPending || updateRoleMutation.isPending) {
      return;
    }

    setShowForm(false);
    setSelectedRole(null);
    setFormError("");
  }

  function handleDeleteRole(role) {
    setFormError("");
    setRoleToDelete(role);
  }

  async function confirmDeleteRole() {
    if (!roleToDelete || deleteRoleMutation.isPending) {
      return;
    }

    setFormError("");

    try {
      await deleteRoleMutation.mutateAsync(roleToDelete._id);
      setRoleToDelete(null);
    } catch {
      // The mutation's onError handler sets the error message.
    }
  }

  function cancelDeleteRole() {
    if (deleteRoleMutation.isPending) {
      return;
    }

    setRoleToDelete(null);
  }

  function openRoleDetails(role) {
    navigate(`/target-roles/${role._id}`);
  }

  if (isLoading) {
    return (
      <div className="container target-roles-page">
        <h1>Career Readiness</h1>
        <LoadingState message="Loading your target roles..." />
      </div>
    );
  }

  const displayedError =
    formError ||
    error?.response?.data?.message ||
    (error ? "Unable to load target roles. Please try again." : "") ||
    readinessQueries.error?.response?.data?.message ||
    (readinessQueries.error
      ? "Unable to load role readiness. Please try again."
      : "");

  const readinessByRole = new Map(
    (readinessQueries.data || []).map(({ roleId, readiness }) => [
      roleId,
      readiness,
    ]),
  );

  const readinessResults = roles
    .map((role) => readinessByRole.get(role._id))
    .filter((readiness) => readiness?.summary);

  const assessedRoles = readinessResults.filter(
    (readiness) => readiness.readinessScore != null,
  );

  const averageReadiness =
    assessedRoles.length > 0
      ? Math.round(
          assessedRoles.reduce(
            (total, readiness) => total + readiness.readinessScore,
            0,
          ) / assessedRoles.length,
        )
      : null;

  const totalRequirements = readinessResults.reduce(
    (total, readiness) => total + (readiness.summary?.totalRequirements ?? 0),
    0,
  );

  const totalMetRequirements = readinessResults.reduce(
    (total, readiness) => total + (readiness.summary?.metRequirements ?? 0),
    0,
  );

  const totalSkillGaps = readinessResults.reduce(
    (total, readiness) => total + (readiness.gaps?.length ?? 0),
    0,
  );

  return (
    <div className="container target-roles-page">
      <header className="target-roles-header">
        <div>
          <span className="target-roles-eyebrow">CAREER DEVELOPMENT</span>
          <h1>Career Readiness</h1>
        </div>

        {!showForm && (
          <button
            type="button"
            className="btn-primary"
            onClick={openCreateForm}
          >
            + Add Target Role
          </button>
        )}
      </header>

      {displayedError && (
        <div className="target-role-error" role="alert">
          {displayedError}
        </div>
      )}

      {showForm && (
        <TargetRoleForm
          key={selectedRole?._id || "new-target-role"}
          initialRole={selectedRole}
          onSubmit={handleSubmitRole}
          onClose={closeCreateForm}
          saving={createRoleMutation.isPending || updateRoleMutation.isPending}
        />
      )}

      {!showForm && roles.length > 0 && (
        <TargetRoleOverview
          roleCount={roles.length}
          averageReadiness={averageReadiness}
          totalMetRequirements={totalMetRequirements}
          totalRequirements={totalRequirements}
          totalSkillGaps={totalSkillGaps}
          isLoading={readinessQueries.isLoading}
        />
      )}

      {!showForm && roles.length === 0 && (
        <section className="target-roles-empty-state">
          <div className="target-roles-empty-icon" aria-hidden="true">
            <span>↗</span>
          </div>

          <h2>Define your next career step</h2>

          <p>
            Add a target role to compare its skill requirements against your
            existing skills. You’ll get a readiness score and a prioritized view
            of the gaps to work on.
          </p>
        </section>
      )}

      {!showForm && roles.length > 0 && (
        <TargetRoleList
          roles={roles}
          readinessByRole={readinessByRole}
          readinessLoading={readinessQueries.isLoading}
          deleting={deleteRoleMutation.isPending}
          onViewDetails={openRoleDetails}
          onEdit={openEditForm}
          onDelete={handleDeleteRole}
        />
      )}

      <ConfirmModal
        isOpen={Boolean(roleToDelete)}
        title="Delete Target Role"
        message={
          roleToDelete
            ? `Delete "${roleToDelete.title}"? This will remove the target role and its readiness analysis.`
            : ""
        }
        confirmText={deleteRoleMutation.isPending ? "Deleting..." : "Delete"}
        onConfirm={confirmDeleteRole}
        onCancel={cancelDeleteRole}
      />
    </div>
  );
}

export default TargetRoles;