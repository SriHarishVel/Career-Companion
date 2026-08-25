import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getResource,
  updateResource,
  deleteResource,
} from "../../services/resourceService";

import { getSkills } from "../../services/skillService";

import LoadingState from "../../components/LoadingState";

import ResourceForm from "../Resources/components/ResourceForm";
import ResourceOverview from "./components/ResourceOverview";
import ResourceSkill from "./components/ResourceSkill";
import ResourceActions from "./components/ResourceActions";

import "./index.css";

function ResourceDetail() {
  const { resourceId } = useParams();
  const navigate = useNavigate();

  /* RESOURCE */

  const [resource, setResource] = useState(null);
  const [skills, setSkills] = useState([]);

  /* EDIT FORM */

  const [showResourceForm, setShowResourceForm] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newType, setNewType] = useState("Documentation");
  const [skillId, setSkillId] = useState("");

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
        setSkills(skillData);
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

  /* OPEN EDIT */

  const handleEdit = () => {
    if (!resource) {
      return;
    }

    setNewTitle(resource.title || "");
    setNewUrl(resource.url || "");
    setNewType(resource.type || "Documentation");
    setSkillId(resource.skill?._id || "");

    setErrorMsg("");
    setShowResourceForm(true);
  };

  /* CLOSE EDIT */

  const handleCloseEdit = () => {
    setShowResourceForm(false);

    setNewTitle("");
    setNewUrl("");
    setNewType("Documentation");
    setSkillId("");

    setErrorMsg("");
  };

  /* UPDATE RESOURCE */

  const handleUpdateResource = async () => {
    const title = newTitle.trim();
    const url = newUrl.trim();

    if (!title || !url) {
      setErrorMsg("Title and URL cannot be empty.");
      return;
    }

    try {
      setErrorMsg("");

      const formattedUrl = url.startsWith("http") ? url : `https://${url}`;

      await updateResource(resource._id, {
        title,
        type: newType,
        url: formattedUrl,
        skill: skillId || null,
      });

      const freshResource = await getResource(resource._id);

      setResource(freshResource);

      setShowResourceForm(false);

      setNewTitle("");
      setNewUrl("");
      setNewType("Documentation");
      setSkillId("");
    } catch (error) {
      console.error("Failed to update resource:", error);

      setErrorMsg(
        error.response?.data?.message ||
          "Unable to update the resource. Please try again.",
      );
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
          onOpenResource={handleOpenResource}
          onToggleFavorite={handleToggleFavorite}
        />

        <ResourceSkill
          skill={resource.skill}
          onSkillClick={(connectedSkillId) =>
            navigate(`/skills/${connectedSkillId}`)
          }
        />

        <ResourceActions
          onOpenResource={handleOpenResource}
          onEdit={handleEdit}
          onDelete={handleDelete}
          deleting={deleting}
        />
      </main>

      {/* EDIT RESOURCE */}

      <ResourceForm
        isOpen={showResourceForm}
        onClose={handleCloseEdit}
        editingResourceId={resource._id}
        newType={newType}
        setNewType={setNewType}
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        newUrl={newUrl}
        setNewUrl={setNewUrl}
        skillId={skillId}
        setSkillId={setSkillId}
        skills={skills}
        errorMsg={errorMsg}
        addResource={handleUpdateResource}
      />
    </div>
  );
}

export default ResourceDetail;
