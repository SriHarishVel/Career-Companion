import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getResource,
  updateResource,
  deleteResource,
} from "../../services/resourceService";

import { getSkills } from "../../services/skillService";

import LoadingState from "../../components/LoadingState";

import ResourceOverview from "./components/ResourceOverview";
import ResourceDescription from "./components/ResourceDescription";
import ResourceSkill from "./components/ResourceSkill";
import ResourceActions from "./components/ResourceActions";

import "./index.css";

function ResourceDetail() {
  const { resourceId } = useParams();
  const navigate = useNavigate();

  /* RESOURCE */

  const [resource, setResource] = useState(null);
  const [skills, setSkills] = useState([]);

  /* UI */

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [deleting, setDeleting] = useState(false);

  /* LOAD RESOURCE + SKILLS */

  useEffect(() => {
    async function loadResourceDetail() {
      try {
        setLoading(true);
        setErrorMsg("");

        const [resourceData, skillData] = await Promise.all([
          getResource(resourceId),
          getSkills(),
        ]);

        setResource(resourceData);
        setSkills(skillData?.skills || skillData || []);
      } catch (error) {
        console.error("Failed to load resource details:", error);

        setErrorMsg(
          error.response?.data?.message ||
            "Unable to load this resource. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    }

    if (resourceId) {
      loadResourceDetail();
    }
  }, [resourceId]);

  /* BACK */

  const handleBack = () => {
    navigate("/resources");
  };

  /* OPEN RESOURCE */

  const handleOpenResource = () => {
    if (!resource?.url) {
      return;
    }

    const url = resource.url.startsWith("http")
      ? resource.url
      : `https://${resource.url}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  /* FAVORITE */

  const handleToggleFavorite = async () => {
    if (!resource) {
      return;
    }

    try {
      setErrorMsg("");

      const updatedResource = await updateResource(resource._id, {
        favorite: !resource.favorite,
      });

      setResource(updatedResource);
    } catch (error) {
      console.error("Failed to update favorite:", error);

      setErrorMsg(
        error.response?.data?.message || "Unable to update favorite status.",
      );
    }
  };

  /* COMPLETION */

  const handleToggleCompleted = async () => {
    if (!resource) {
      return;
    }

    try {
      setErrorMsg("");

      const updatedResource = await updateResource(resource._id, {
        completed: !resource.completed,
      });

      setResource(updatedResource);
    } catch (error) {
      console.error("Failed to update resource completion:", error);

      setErrorMsg(
        error.response?.data?.message ||
          "Unable to update resource completion.",
      );
    }
  };

  /* RESOURCE UPDATED */

  const handleResourceUpdated = async (updatedResource) => {
    try {
      setErrorMsg("");

      const freshResource = await getResource(updatedResource._id);

      setResource(freshResource || updatedResource);
    } catch (error) {
      console.error("Failed to refresh resource:", error);

      setResource(updatedResource);
    }
  };

  /* DELETE */

  const handleDelete = async () => {
    if (!resource || deleting) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${resource.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setErrorMsg("");

      await deleteResource(resource._id);

      navigate("/resources");
    } catch (error) {
      console.error("Failed to delete resource:", error);

      setErrorMsg(
        error.response?.data?.message || "Unable to delete this resource.",
      );

      setDeleting(false);
    }
  };

  /* LOADING */

  if (loading) {
    return (
      <div className="container resource-detail-page">
        <LoadingState message="Loading resource..." />
      </div>
    );
  }

  /* ERROR */

  if (errorMsg && !resource) {
    return (
      <div className="container resource-detail-page">
        <div className="resource-detail-topbar">
          <button
            type="button"
            className="resource-detail-back-btn"
            onClick={handleBack}
          >
            <span className="back-chevron">‹</span>

            <span>Resources</span>
          </button>
        </div>

        <div className="resource-detail-error">
          <h1>Unable to load resource</h1>

          <p>{errorMsg}</p>

          <button
            type="button"
            className="resource-action-secondary"
            onClick={handleBack}
          >
            Back to Resources
          </button>
        </div>
      </div>
    );
  }

  if (!resource) {
    return null;
  }

  return (
    <div className="container resource-detail-page">
      {/* TOP NAVIGATION */}

      <div className="resource-detail-topbar">
        <button
          type="button"
          className="resource-detail-back-btn"
          onClick={handleBack}
        >
          <span className="back-chevron">‹</span>

          <span>Resources</span>
        </button>
      </div>

      {/* ERROR */}

      {errorMsg && (
        <div className="resource-detail-error-message" role="alert">
          {errorMsg}
        </div>
      )}

      {/* CONTENT */}

      <main className="resource-detail-content">
        <ResourceOverview
          title={resource.title}
          type={resource.type}
          url={resource.url}
          favorite={resource.favorite}
          completed={resource.completed}
          onOpenResource={handleOpenResource}
          onToggleFavorite={handleToggleFavorite}
          onToggleCompleted={handleToggleCompleted}
        />

        <ResourceDescription description={resource.description} />

        <ResourceSkill
          skill={resource.skill}
          onSkillClick={(connectedSkillId) =>
            navigate(`/skills/${connectedSkillId}`)
          }
        />

        <ResourceActions
          resource={resource}
          skills={skills}
          onResourceUpdated={handleResourceUpdated}
          onDelete={handleDelete}
          deleting={deleting}
        />
      </main>
    </div>
  );
}

export default ResourceDetail;
