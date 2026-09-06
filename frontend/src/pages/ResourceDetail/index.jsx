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

  const [resource, setResource] = useState(null);
  const [skills, setSkills] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!resourceId) {
      return;
    }

    let cancelled = false;

    async function loadResourceDetail() {
      try {
        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        const [resourceData, skillData] = await Promise.all([
          getResource(resourceId),
          getSkills(),
        ]);

        if (cancelled) {
          return;
        }

        setResource(resourceData);
        setSkills(skillData?.skills || skillData || []);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error("Failed to load resource details:", error);

        setErrorMsg(
          error.response?.data?.message ||
            "Unable to load this resource. Please try again.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadResourceDetail();

    return () => {
      cancelled = true;
    };
  }, [resourceId]);

  const handleBack = () => {
    navigate("/resources");
  };

  const handleOpenResource = () => {
    if (!resource?.url) {
      return;
    }

    const url = resource.url.startsWith("http")
      ? resource.url
      : `https://${resource.url}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleResourceUpdated = async (updatedResource) => {
    if (!updatedResource?._id) {
      return;
    }

    try {
      setErrorMsg("");
      setSuccessMsg("");

      const freshResource = await getResource(updatedResource._id);

      setResource(freshResource || updatedResource);
      setSuccessMsg("Resource updated successfully.");
    } catch (error) {
      console.error("Failed to refresh resource:", error);

      setResource(updatedResource);

      setErrorMsg(
        error.response?.data?.message ||
          "Resource was updated, but the latest data could not be loaded.",
      );
    }
  };

  const handleToggleFavorite = async () => {
    if (!resource) {
      return;
    }

    try {
      setErrorMsg("");
      setSuccessMsg("");

      const updatedResource = await updateResource(resource._id, {
        favorite: !resource.favorite,
      });

      await handleResourceUpdated(updatedResource);
    } catch (error) {
      console.error("Failed to update favorite:", error);

      setErrorMsg(
        error.response?.data?.message || "Unable to update favorite status.",
      );
    }
  };

  const handleToggleCompleted = async () => {
    if (!resource) {
      return;
    }

    try {
      setErrorMsg("");
      setSuccessMsg("");

      const updatedResource = await updateResource(resource._id, {
        completed: !resource.completed,
      });

      await handleResourceUpdated(updatedResource);
    } catch (error) {
      console.error("Failed to update resource completion:", error);

      setErrorMsg(
        error.response?.data?.message ||
          "Unable to update resource completion.",
      );
    }
  };

  const handleDelete = async () => {
    if (!resource || deleting) {
      return;
    }

    try {
      setDeleting(true);
      setErrorMsg("");
      setSuccessMsg("");

      await deleteResource(resource._id);

      navigate("/resources");
    } catch (error) {
      console.error("Failed to delete resource:", error);

      setErrorMsg(
        error.response?.data?.message || "Failed to delete resource.",
      );

      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="container resource-detail-page">
        <LoadingState message="Loading resource..." />
      </div>
    );
  }

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

      {errorMsg && (
        <div className="resource-detail-error-message" role="alert">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="resource-detail-success-message" role="status">
          {successMsg}
        </div>
      )}

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

        <ResourceDescription
          description={resource.description}
          onResourceUpdated={handleResourceUpdated}
        />

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
