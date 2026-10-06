import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getResource,
  updateResource,
  deleteResource,
} from "../../services/resourceService";

import { getSkills } from "../../services/skillService";

import LoadingState from "../../components/LoadingState";

import ResourceOverview from "./components/ResourceOverview";
import ResourcePreview from "./components/ResourcePreview";
import ResourceDescription from "./components/ResourceDescription";
import ResourceSkill from "./components/ResourceSkill";
import ResourceActions from "./components/ResourceActions";

import "./index.css";

function ResourceDetail() {
  const { resourceId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const {
    data: resource,
    isLoading: resourceLoading,
    error: resourceError,
  } = useQuery({
    queryKey: ["resources", resourceId],
    queryFn: () => getResource(resourceId),
    enabled: Boolean(resourceId),
  });

  const {
    data: skillsData,
    isLoading: skillsLoading,
    error: skillsError,
  } = useQuery({
    queryKey: ["skills", "all"],
    queryFn: getSkills,
  });

  const skills = useMemo(() => {
    return skillsData?.skills || skillsData || [];
  }, [skillsData]);

  const updateResourceMutation = useMutation({
    mutationFn: ({ id, data }) => updateResource(id, data),

    onSuccess: (updatedResource) => {
      if (!updatedResource?._id) {
        return;
      }

      queryClient.setQueryData(
        ["resources", updatedResource._id],
        updatedResource,
      );

      queryClient.invalidateQueries({
        queryKey: ["resources"],
      });
    },

    onError: (error) => {
      console.error("Failed to update resource:", error);
    },
  });

  const deleteResourceMutation = useMutation({
    mutationFn: (id) => deleteResource(id),

    onSuccess: (_, deletedResourceId) => {
      queryClient.removeQueries({
        queryKey: ["resources", deletedResourceId],
      });

      queryClient.invalidateQueries({
        queryKey: ["resources"],
      });

      navigate("/resources");
    },

    onError: (error) => {
      console.error("Failed to delete resource:", error);
    },
  });

  const loading = resourceLoading || skillsLoading;

  const queryError = resourceError || skillsError;

  useEffect(() => {
    if (!successMsg) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setSuccessMsg("");
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [successMsg]);

  const handleBack = () => {
    navigate("/resources");
  };

  const handleResourceUpdated = (updatedResource) => {
    if (!updatedResource?._id) {
      return;
    }

    queryClient.setQueryData(
      ["resources", updatedResource._id],
      updatedResource,
    );

    queryClient.invalidateQueries({
      queryKey: ["resources"],
    });

    setErrorMsg("");
    setSuccessMsg("Resource updated successfully.");
  };

  const handleSaveDescription = async (description) => {
    if (!resource) {
      return;
    }

    try {
      setErrorMsg("");
      setSuccessMsg("");

      const updatedResource = await updateResourceMutation.mutateAsync({
        id: resource._id,
        data: {
          description,
        },
      });

      handleResourceUpdated(updatedResource);
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || "Unable to update resource notes.",
      );

      throw error;
    }
  };

  const handleToggleFavorite = async () => {
    if (!resource) {
      return;
    }

    try {
      setErrorMsg("");
      setSuccessMsg("");

      const updatedResource = await updateResourceMutation.mutateAsync({
        id: resource._id,
        data: {
          favorite: !resource.favorite,
        },
      });

      handleResourceUpdated(updatedResource);
    } catch (error) {
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

      const updatedResource = await updateResourceMutation.mutateAsync({
        id: resource._id,
        data: {
          completed: !resource.completed,
        },
      });

      handleResourceUpdated(updatedResource);
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message ||
          "Unable to update resource completion.",
      );
    }
  };

  const handleDelete = async () => {
    if (!resource || deleteResourceMutation.isPending) {
      return;
    }

    try {
      setErrorMsg("");
      setSuccessMsg("");

      await deleteResourceMutation.mutateAsync(resource._id);
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || "Failed to delete resource.",
      );
    }
  };

  if (!resourceId) {
    return null;
  }

  if (loading) {
    return (
      <div className="container resource-detail-page">
        <LoadingState message="Loading resource..." />
      </div>
    );
  }

  if (queryError || !resource) {
    const message =
      queryError?.response?.data?.message ||
      "Unable to load this resource. Please try again.";

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

          <p>{message}</p>

          <button
            type="button"
            className="btn-secondary"
            onClick={() =>
              queryClient.invalidateQueries({
                queryKey: ["resources", resourceId],
              })
            }
          >
            Try Again
          </button>
        </div>
      </div>
    );
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
          resource={resource}
          onToggleFavorite={handleToggleFavorite}
          onToggleCompleted={handleToggleCompleted}
        />

        <ResourcePreview
          resource={resource}
          onResourceUpdated={handleResourceUpdated}
        />

        <ResourceDescription
          description={resource.description}
          onSave={handleSaveDescription}
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
          deleting={deleteResourceMutation.isPending}
        />
      </main>
    </div>
  );
}

export default ResourceDetail;