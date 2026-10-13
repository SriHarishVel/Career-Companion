import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import LoadingState from "../../components/LoadingState";

import TargetRoleForm from "./components/TargetRoleForm";

import {
  getTargetRoles,
  getTargetRoleReadiness,
  createTargetRole,
} from "../../services/targetRoleService";

import "./index.css";

function TargetRoles() {
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");

  const {
    data: roles = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["target-roles"],
    queryFn: getTargetRoles,
  });

  const readinessQueries = useQuery({
    queryKey: ["target-role-readiness", roles.map((role) => role._id)],
    queryFn: async () =>
      Promise.all(
        roles.map(async (role) => {
          const readiness = await getTargetRoleReadiness(role._id);

          return {
            roleId: role._id,
            readiness,
          };
        }),
      ),
    enabled: roles.length > 0,
  });

  const createRoleMutation = useMutation({
    mutationFn: createTargetRole,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["target-roles"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["target-role-readiness"],
      });

      setShowForm(false);
      setFormError("");
    },

    onError: (mutationError) => {
      setFormError(
        mutationError.response?.data?.message ||
          "Unable to create the target role. Please try again.",
      );
    },
  });

  async function handleCreateRole(roleData) {
    setFormError("");
    await createRoleMutation.mutateAsync(roleData);
  }

  function openCreateForm() {
    setFormError("");
    setShowForm(true);
  }

  function closeCreateForm() {
    if (createRoleMutation.isPending) {
      return;
    }

    setShowForm(false);
    setFormError("");
  }

  if (isLoading) {
    return (
      <div className="container">
        <h1>Target Roles</h1>
        <LoadingState message="Loading target roles..." />
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

  return (
    <div className="container target-roles-page">
      <div className="page-header">
        <div>
          <h1>Target Roles</h1>
          <p>
            Track your career goals and identify the skills you need to
            develop.
          </p>
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
      </div>

      {displayedError && (
        <div className="target-role-error" role="alert">
          {displayedError}
        </div>
      )}

      {showForm && (
        <TargetRoleForm
          onSubmit={handleCreateRole}
          onClose={closeCreateForm}
          saving={createRoleMutation.isPending}
        />
      )}

      {!showForm && roles.length === 0 ? (
        <div className="empty-state">
          <h3>No target roles yet</h3>
          <p>
            Add a target role to see how your current skills match its
            requirements.
          </p>
          <button
            type="button"
            className="btn-primary"
            onClick={openCreateForm}
          >
            Create Your First Target Role
          </button>
        </div>
      ) : (
        !showForm && (
          <div className="target-roles-grid">
            {roles.map((role) => {
              const readiness = readinessByRole.get(role._id);
              const score = readiness?.readinessScore;
              const gaps = readiness?.gaps || [];

              return (
                <article className="target-role-card" key={role._id}>
                  <div className="target-role-card-header">
                    <h2>{role.title}</h2>

                    {score == null ? (
                      <span className="readiness-score unavailable">
                        {readiness ? "Not assessed" : "Loading"}
                      </span>
                    ) : (
                      <span className="readiness-score">
                        {score}% ready
                      </span>
                    )}
                  </div>

                  {role.description && <p>{role.description}</p>}

                  {readinessQueries.isLoading ? (
                    <p>Calculating readiness...</p>
                  ) : readiness ? (
                    <>
                      <div
                        className="readiness-progress"
                        role="progressbar"
                        aria-label={`${role.title} readiness`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={score ?? 0}
                      >
                        <div
                          className="readiness-progress-fill"
                          style={{ width: `${score ?? 0}%` }}
                        />
                      </div>

                      <p className="requirement-summary">
                        {readiness.summary?.metRequirements ?? 0} of{" "}
                        {readiness.summary?.totalRequirements ?? 0}{" "}
                        requirements met
                      </p>

                      {gaps.length > 0 ? (
                        <div className="skill-gaps">
                          <h3>Priority skill gaps</h3>

                          <ul>
                            {gaps.slice(0, 3).map((gap) => (
                              <li key={gap.skillName}>
                                <span>{gap.skillName}</span>
                                <span className="gap-status">
                                  {gap.status}
                                </span>
                              </li>
                            ))}
                          </ul>

                          {gaps.length > 3 && (
                            <p className="more-gaps">
                              And {gaps.length - 3} more
                            </p>
                          )}
                        </div>
                      ) : score != null ? (
                        <p className="no-skill-gaps">
                          All role requirements are met.
                        </p>
                      ) : (
                        <p>No requirements have been added to this role.</p>
                      )}
                    </>
                  ) : (
                    <p>Readiness data is unavailable.</p>
                  )}
                </article>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}

export default TargetRoles;