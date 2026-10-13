import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import LoadingState from "../../components/LoadingState";
import TargetRoleForm from "./components/TargetRoleForm";
import TargetRoleDetails from "./components/TargetRoleDetails";

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
  const [selectedRole, setSelectedRole] = useState(null);

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
    setSelectedRole(null);
    setShowForm(true);
  }

  function closeCreateForm() {
    if (createRoleMutation.isPending) return;

    setShowForm(false);
    setFormError("");
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

  const currentSelectedRole = selectedRole
    ? roles.find((role) => role._id === selectedRole._id)
    : null;

  if (currentSelectedRole && !showForm) {
    return (
      <div className="container target-roles-page">
        <header className="target-roles-header">
          <div>
            <span className="target-roles-eyebrow">CAREER DEVELOPMENT</span>
            <h1>Career Readiness</h1>
          </div>
        </header>

        <TargetRoleDetails
          role={currentSelectedRole}
          onClose={() => setSelectedRole(null)}
        />
      </div>
    );
  }

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
          onSubmit={handleCreateRole}
          onClose={closeCreateForm}
          saving={createRoleMutation.isPending}
        />
      )}

      {!showForm && roles.length > 0 && (
        <section
          className="career-readiness-overview"
          aria-label="Career readiness overview"
        >
          <div className="readiness-overview-heading">
            <div>
              <h2>Your overview</h2>
            </div>

            <span className="roles-count">
              {roles.length} {roles.length === 1 ? "role" : "roles"}
            </span>
          </div>

          <div className="readiness-metrics">
            <article className="readiness-metric readiness-metric-primary">
              <span className="readiness-metric-label">Average readiness</span>
              <strong>
                {readinessQueries.isLoading
                  ? "—"
                  : averageReadiness == null
                    ? "N/A"
                    : `${averageReadiness}%`}
              </strong>
              <span className="readiness-metric-note">
                Across assessed roles
              </span>
            </article>

            <article className="readiness-metric">
              <span className="readiness-metric-label">Skills matched</span>
              <strong>
                {readinessQueries.isLoading
                  ? "—"
                  : `${totalMetRequirements}/${totalRequirements}`}
              </strong>
              <span className="readiness-metric-note">
                Requirements currently met
              </span>
            </article>

            <article className="readiness-metric">
              <span className="readiness-metric-label">Skill gaps</span>
              <strong>
                {readinessQueries.isLoading ? "—" : totalSkillGaps}
              </strong>
              <span className="readiness-metric-note">
                Requirements to improve
              </span>
            </article>
          </div>
        </section>
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
        <section className="target-role-analysis">
          <div className="target-role-analysis-heading">
            <div>
              <h2>Your target roles</h2>
            </div>
          </div>

          <div className="target-roles-grid">
            {roles.map((role) => {
              const readiness = readinessByRole.get(role._id);
              const score = readiness?.readinessScore;
              const gaps = readiness?.gaps || [];
              const summary = readiness?.summary;
              const requirementCount = summary?.totalRequirements ?? 0;
              const metCount = summary?.metRequirements ?? 0;

              return (
                <article className="target-role-card" key={role._id}>
                  <div className="target-role-card-header">
                    <div className="target-role-title-group">
                      <span className="target-role-card-label">
                        TARGET ROLE
                      </span>
                      <h3>{role.title}</h3>
                    </div>

                    {readinessQueries.isLoading ? (
                      <span className="readiness-score unavailable">
                        Loading
                      </span>
                    ) : score != null ? (
                      <div
                        className="readiness-score-ring"
                        role="img"
                        aria-label={`${score}% readiness for ${role.title}`}
                        style={{
                          "--readiness-progress": `${score}%`,
                        }}
                      >
                        <div className="readiness-score-ring-inner">
                          <strong>{score}%</strong>
                          <span>ready</span>
                        </div>
                      </div>
                    ) : (
                      <span className="readiness-score unavailable">
                        Not assessed
                      </span>
                    )}
                  </div>

                  {role.description && (
                    <p className="target-role-description">
                      {role.description}
                    </p>
                  )}

                  {readinessQueries.isLoading ? (
                    <p className="target-role-loading">
                      Analyzing skill requirements...
                    </p>
                  ) : readiness ? (
                    <>
                      {requirementCount > 0 ? (
                        <>
                          <div className="target-role-match-summary">
                            <span>
                              <strong>{metCount}</strong> of {requirementCount}{" "}
                              requirements met
                            </span>
                            <span>{requirementCount - metCount} remaining</span>
                          </div>

                          <div
                            className="readiness-progress"
                            role="progressbar"
                            aria-label={`${role.title} requirements met`}
                            aria-valuemin={0}
                            aria-valuemax={requirementCount}
                            aria-valuenow={metCount}
                          >
                            <div
                              className="readiness-progress-fill"
                              style={{
                                width: `${
                                  (metCount / requirementCount) * 100
                                }%`,
                              }}
                            />
                          </div>
                        </>
                      ) : (
                        <p className="target-role-no-requirements">
                          Add skill requirements to assess your readiness for
                          this role.
                        </p>
                      )}

                      <div className="target-role-gap-section">
                        <div className="target-role-gap-heading">
                          <h4>Skill gap analysis</h4>
                          {gaps.length > 0 && (
                            <span className="target-role-gap-count">
                              {gaps.length}
                            </span>
                          )}
                        </div>

                        {gaps.length > 0 ? (
                          <ul className="target-role-gap-list">
                            {gaps.slice(0, 3).map((gap) => (
                              <li key={gap.skillName}>
                                <span
                                  className={`target-role-gap-indicator ${
                                    gap.status === "Missing"
                                      ? "is-missing"
                                      : "is-below-level"
                                  }`}
                                  aria-hidden="true"
                                />

                                <span className="target-role-gap-name">
                                  {gap.skillName}
                                </span>

                                <span
                                  className={`gap-status ${
                                    gap.status === "Missing"
                                      ? "is-missing"
                                      : "is-below-level"
                                  }`}
                                >
                                  {gap.status}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : requirementCount > 0 ? (
                          <p className="target-role-no-gaps">
                            All role requirements are met.
                          </p>
                        ) : null}

                        {gaps.length > 3 && (
                          <p className="more-gaps">
                            +{gaps.length - 3} more skill gaps
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <p className="target-role-loading">
                      Readiness data is unavailable.
                    </p>
                  )}

                  <button
                    type="button"
                    className="btn-secondary target-role-details-button"
                    onClick={() => setSelectedRole(role)}
                  >
                    View Full Analysis
                    <span aria-hidden="true">→</span>
                  </button>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

export default TargetRoles;
