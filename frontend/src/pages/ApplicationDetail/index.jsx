import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import {
  getApplication,
  addInterviewRound,
  updateInterviewRound,
  deleteInterviewRound,
  deleteApplication,
} from "../../services/applicationService";

import LoadingState from "../../components/LoadingState";

import ApplicationOverview from "./components/ApplicationOverview";
import ApplicationInterviews from "./components/ApplicationInterviews";
import ApplicationActivity from "./components/ApplicationActivity";
import ApplicationActions from "./components/ApplicationActions";

import "./index.css";

function getErrorMessage(error, fallbackMessage) {
  return error?.response?.data?.message || fallbackMessage;
}

function ApplicationDetail() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: application,
    isLoading: loading,
    error: applicationError,
  } = useQuery({
    queryKey: ["applications", applicationId],
    queryFn: () => getApplication(applicationId),
    enabled: Boolean(applicationId),
  });

  const addRoundMutation = useMutation({
    mutationFn: (roundData) => {
      if (!application?._id) {
        throw new Error("Application not found.");
      }

      return addInterviewRound(application._id, roundData);
    },

    onSuccess: async (updatedApplication) => {
      queryClient.setQueryData(
        ["applications", applicationId],
        updatedApplication,
      );

      await queryClient.invalidateQueries({
        queryKey: ["applications"],
      });
    },
  });

  const updateRoundMutation = useMutation({
    mutationFn: ({ roundId, roundData }) => {
      if (!application?._id) {
        throw new Error("Application not found.");
      }

      if (!roundId) {
        throw new Error("Interview round could not be identified.");
      }

      return updateInterviewRound(application._id, roundId, roundData);
    },

    onSuccess: async (updatedApplication) => {
      queryClient.setQueryData(
        ["applications", applicationId],
        updatedApplication,
      );

      await queryClient.invalidateQueries({
        queryKey: ["applications"],
      });
    },
  });

  const deleteRoundMutation = useMutation({
    mutationFn: (roundId) => {
      if (!application?._id) {
        throw new Error("Application not found.");
      }

      if (!roundId) {
        throw new Error("Interview round could not be identified.");
      }

      return deleteInterviewRound(application._id, roundId);
    },

    onSuccess: async (updatedApplication) => {
      queryClient.setQueryData(
        ["applications", applicationId],
        updatedApplication,
      );

      await queryClient.invalidateQueries({
        queryKey: ["applications"],
      });
    },
  });

  const deleteApplicationMutation = useMutation({
    mutationFn: () => {
      if (!application?._id) {
        throw new Error("Application not found.");
      }

      return deleteApplication(application._id);
    },

    onSuccess: async () => {
      queryClient.removeQueries({
        queryKey: ["applications", applicationId],
      });

      await queryClient.invalidateQueries({
        queryKey: ["applications"],
      });

      navigate("/applications");
    },
  });

  const handleApplicationUpdated = (updatedApplication) => {
    if (!updatedApplication) {
      return;
    }

    queryClient.setQueryData(
      ["applications", applicationId],
      updatedApplication,
    );
  };

  const handleAddRound = async (roundData) => {
    try {
      return await addRoundMutation.mutateAsync(roundData);
    } catch (error) {
      console.error("Failed to add interview round:", error);

      const message = getErrorMessage(error, "Failed to add interview round.");

      throw new Error(message, {
        cause: error,
      });
    }
  };

  const handleUpdateRound = async (roundId, roundData) => {
    try {
      return await updateRoundMutation.mutateAsync({
        roundId,
        roundData,
      });
    } catch (error) {
      console.error("Failed to update interview round:", error);

      const message = getErrorMessage(
        error,
        "Failed to update interview round.",
      );

      throw new Error(message, {
        cause: error,
      });
    }
  };

  const handleDeleteRound = async (roundId) => {
    try {
      return await deleteRoundMutation.mutateAsync(roundId);
    } catch (error) {
      console.error("Failed to delete interview round:", error);

      const message = getErrorMessage(
        error,
        "Failed to delete interview round.",
      );

      throw new Error(message, {
        cause: error,
      });
    }
  };

  const handleDelete = async () => {
    if (!application?._id || deleteApplicationMutation.isPending) {
      return;
    }

    try {
      await deleteApplicationMutation.mutateAsync();
    } catch (error) {
      console.error("Failed to delete application:", error);
    }
  };

  const handleBack = () => {
    navigate("/applications");
  };

  if (!applicationId) {
    return (
      <div className="container application-detail-page">
        <div className="application-detail-error">
          <h1>Application not found</h1>

          <p>No application ID was provided for this page.</p>

          <button type="button" className="btn-secondary" onClick={handleBack}>
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container application-detail-page">
        <LoadingState message="Loading application..." />
      </div>
    );
  }

  if (!application) {
    const errorMsg = getErrorMessage(
      applicationError,
      "The requested application could not be found.",
    );

    return (
      <div className="container application-detail-page">
        <div className="application-detail-topbar">
          <button
            type="button"
            className="application-detail-back-btn"
            onClick={handleBack}
          >
            <span className="back-chevron" aria-hidden="true">
              ‹
            </span>

            <span>Applications</span>
          </button>
        </div>

        <div className="application-detail-error">
          <h1>Unable to load application</h1>

          <p>{errorMsg}</p>

          <div className="application-detail-error-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleBack}
            >
              Back to Applications
            </button>

            <button
              type="button"
              className="btn-primary"
              onClick={() =>
                queryClient.invalidateQueries({
                  queryKey: ["applications", applicationId],
                })
              }
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container application-detail-page">
      <div className="application-detail-topbar">
        <button
          type="button"
          className="application-detail-back-btn"
          onClick={handleBack}
        >
          <span className="back-chevron" aria-hidden="true">
            ‹
          </span>

          <span>Applications</span>
        </button>
      </div>

      <main className="application-detail-content">
        <ApplicationOverview application={application} />

        <ApplicationInterviews
          application={application}
          onAddRound={handleAddRound}
          onUpdateRound={handleUpdateRound}
          onDeleteRound={handleDeleteRound}
        />

        <ApplicationActivity
          application={application}
          onApplicationUpdated={handleApplicationUpdated}
        />

        <ApplicationActions
          application={application}
          onApplicationUpdated={handleApplicationUpdated}
          onDelete={handleDelete}
          deleting={deleteApplicationMutation.isPending}
        />
      </main>
    </div>
  );
}

export default ApplicationDetail;