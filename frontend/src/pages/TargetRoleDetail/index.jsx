import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import {
  getTargetRole,
  getTargetRoleReadiness,
} from "../../services/targetRoleService";

import LoadingState from "../../components/LoadingState";

import "./index.css";

function TargetRoleDetail() {
  const { roleId } = useParams();
  const navigate = useNavigate();

  const {
    data: role,
    isLoading: roleLoading,
    error: roleError,
    refetch: refetchRole,
    isFetching: roleFetching,
  } = useQuery({
    queryKey: ["target-role", roleId],
    queryFn: () => getTargetRole(roleId),
    enabled: Boolean(roleId),
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: readiness,
    isLoading: readinessLoading,
    error: readinessError,
    refetch: refetchReadiness,
    isFetching: readinessFetching,
  } = useQuery({
    queryKey: ["target-role-readiness", roleId],
    queryFn: () => getTargetRoleReadiness(roleId),
    enabled: Boolean(roleId) && Boolean(role),
    staleTime: 5 * 60 * 1000,
  });

  function goBack() {
    navigate("/target-roles");
  }

  async function retryLoading() {
    if (roleError || !role) {
      await refetchRole();
      return;
    }

    await refetchReadiness();
  }

  if (roleLoading) {
    return (
      <div className="container target-role-detail-page">
        <LoadingState message="Loading target role..." />
      </div>
    );
  }

  if (roleError || !role) {
    return (
      <div className="container target-role-detail-page">
        <div className="target-role-error" role="alert">
          <h1>Unable to load target role</h1>
          <p>
            {roleError?.response?.data?.message ||
              "Unable to load this target role. Please try again."}
          </p>

          <div className="target-role-detail-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={retryLoading}
              disabled={roleFetching}
            >
              {roleFetching ? "Retrying..." : "Try Again"}
            </button>

            <button type="button" className="btn-primary" onClick={goBack}>
              Back to Target Roles
            </button>
          </div>
        </div>
      </div>
    );
  }

  const requirements = readiness?.requirements || [];
  const gaps = readiness?.gaps || [];
  const summary = readiness?.summary;
  const score = readiness?.readinessScore;
  const totalRequirements = summary?.totalRequirements ?? 0;
  const metRequirements = summary?.metRequirements ?? 0;

  return (
    <div className="container target-role-detail-page">
      <header className="target-role-detail-header">
        <button type="button" className="btn-ghost" onClick={goBack}>
          <span aria-hidden="true">←</span>
          Back to Target Roles
        </button>

        <div className="target-role-detail-title">
          <h1>{role.title}</h1>
          {role.description && <p>{role.description}</p>}
        </div>
      </header>

      {readinessError ? (
        <div className="target-role-error" role="alert">
          <h2>Unable to load readiness analysis</h2>
          <p>
            {readinessError.response?.data?.message ||
              "Unable to load the skill requirements for this role."}
          </p>

          <button
            type="button"
            className="btn-secondary"
            onClick={retryLoading}
            disabled={readinessFetching}
          >
            {readinessFetching ? "Retrying..." : "Try Again"}
          </button>
        </div>
      ) : readinessLoading ? (
        <LoadingState message="Analyzing your readiness..." />
      ) : readiness ? (
        <>
          <section
            className="target-role-readiness-overview card"
            aria-label="Role readiness overview"
          >
            <div className="target-role-readiness-heading">
              <div>
                <h2>Readiness overview</h2>
              </div>

              <div
                className="readiness-score-ring"
                style={{
                  "--readiness-progress": `${score ?? 0}%`,
                }}
                role="img"
                aria-label={`${score ?? 0}% readiness`}
              >
                <div className="readiness-score-ring-inner">
                  <strong>{score == null ? "N/A" : `${score}%`}</strong>
                  <span>ready</span>
                </div>
              </div>
            </div>

            <div className="target-role-detail-metrics">
              <div className="target-role-detail-metric">
                <span>Requirements met</span>
                <strong>
                  {metRequirements}/{totalRequirements}
                </strong>
              </div>

              <div className="target-role-detail-metric">
                <span>Skill gaps</span>
                <strong>{gaps.length}</strong>
              </div>
            </div>

            {totalRequirements > 0 && (
              <div
                className="progress-bar"
                role="progressbar"
                aria-label="Role requirements met"
                aria-valuemin={0}
                aria-valuemax={totalRequirements}
                aria-valuenow={metRequirements}
              >
                <div
                  className="progress-fill"
                  style={{
                    width: `${(metRequirements / totalRequirements) * 100}%`,
                  }}
                />
              </div>
            )}
          </section>

          <section className="target-role-requirements-section">
            <div className="target-role-detail-section-header">
              <div>
                <h2>Skill requirements</h2>
              </div>
            </div>

            {requirements.length > 0 ? (
              <div className="target-role-detail-requirements">
                {requirements.map((requirement, index) => (
                  <article
                    className="card target-role-requirement-card"
                    key={
                      requirement.skillName ||
                      requirement.name ||
                      `${requirement.skill?._id || "requirement"}-${index}`
                    }
                  >
                    <div className="target-role-requirement-card-header">
                      <div className="card-header">
                        <h3>
                          {requirement.skillName ||
                            requirement.name ||
                            requirement.skill?.name ||
                            "Unnamed skill"}
                        </h3>
                      </div>

                      <span className="gap-status">
                        {requirement.status || "Not assessed"}
                      </span>
                    </div>

                    <div className="target-role-requirement-levels">
                      <div>
                        <span>Required level</span>
                        <strong>
                          {requirement.requiredLevel || "Not specified"}
                        </strong>
                      </div>

                      <div>
                        <span>Your level</span>
                        <strong>
                          {requirement.currentLevel ||
                            requirement.userLevel ||
                            "Not matched"}
                        </strong>
                      </div>
                    </div>

                    {requirement.importance && (
                      <p className="target-role-requirement-importance">
                        Importance: {requirement.importance}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <div className="target-role-detail-empty card">
                <h3>No skill requirements yet</h3>
                <p>
                  Edit this target role and add skill requirements to assess
                  your career readiness.
                </p>
              </div>
            )}
          </section>

          {gaps.length > 0 && (
            <section className="target-role-prioritized-gaps">
              <div className="target-role-detail-section-header">
                <div>
                  <h2>Skills to improve</h2>
                </div>
              </div>

              <div className="target-role-detail-gaps">
                {gaps.map((gap, index) => (
                  <article
                    className="card target-role-gap-card"
                    key={`${gap.skillName || gap.name || "gap"}-${index}`}
                  >
                    <div className="card-header">
                      <h3>{gap.skillName || gap.name || "Unnamed skill"}</h3>
                    </div>

                    <span
                      className={`gap-status ${
                        gap.status === "Missing"
                          ? "is-missing"
                          : "is-below-level"
                      }`}
                    >
                      {gap.status || "Needs improvement"}
                    </span>

                    {gap.requiredLevel && (
                      <p>Required level: {gap.requiredLevel}</p>
                    )}

                    {gap.currentLevel && <p>Your level: {gap.currentLevel}</p>}
                  </article>
                ))}
              </div>
            </section>
          )}
        </>
      ) : null}
    </div>
  );
}

export default TargetRoleDetail;
