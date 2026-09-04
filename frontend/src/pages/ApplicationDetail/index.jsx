import { useEffect, useState } from "react";
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
import ApplicationActions from "./components/ApplicationActions";

import "./index.css";

function getErrorMessage(error, fallbackMessage) {
  return error?.response?.data?.message || fallbackMessage;
}

function ApplicationDetail() {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(Boolean(applicationId));
  const [errorMsg, setErrorMsg] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!applicationId) {
      return;
    }

    let cancelled = false;

    async function loadApplication() {
      try {
        const applicationData = await getApplication(applicationId);

        if (cancelled) {
          return;
        }

        setApplication(applicationData);
        setErrorMsg("");
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error("Failed to load application:", error);

        setApplication(null);

        setErrorMsg(
          getErrorMessage(
            error,
            "Unable to load this application. Please try again.",
          ),
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadApplication();

    return () => {
      cancelled = true;
    };
  }, [applicationId]);

  const handleApplicationUpdated = (updatedApplication) => {
    if (!updatedApplication) {
      return;
    }

    setApplication(updatedApplication);
    setErrorMsg("");
  };

  const handleAddRound = async (roundData) => {
    if (!application?._id) {
      const error = new Error("Application not found.");

      setErrorMsg(error.message);

      throw error;
    }

    try {
      setErrorMsg("");

      const updatedApplication = await addInterviewRound(
        application._id,
        roundData,
      );

      setApplication(updatedApplication);

      return updatedApplication;
    } catch (error) {
      console.error("Failed to add interview round:", error);

      const message = getErrorMessage(error, "Failed to add interview round.");

      setErrorMsg(message);

      throw new Error(message, {
        cause: error,
      });
    }
  };

  const handleUpdateRound = async (roundId, roundData) => {
    if (!application?._id) {
      const error = new Error("Application not found.");

      setErrorMsg(error.message);

      throw error;
    }

    if (!roundId) {
      const error = new Error("Interview round could not be identified.");

      setErrorMsg(error.message);

      throw error;
    }

    try {
      setErrorMsg("");

      const updatedApplication = await updateInterviewRound(
        application._id,
        roundId,
        roundData,
      );

      setApplication(updatedApplication);

      return updatedApplication;
    } catch (error) {
      console.error("Failed to update interview round:", error);

      const message = getErrorMessage(
        error,
        "Failed to update interview round.",
      );

      setErrorMsg(message);

      throw new Error(message, {
        cause: error,
      });
    }
  };

  const handleDeleteRound = async (roundId) => {
    if (!application?._id) {
      const error = new Error("Application not found.");

      setErrorMsg(error.message);

      throw error;
    }

    if (!roundId) {
      const error = new Error("Interview round could not be identified.");

      setErrorMsg(error.message);

      throw error;
    }

    try {
      setErrorMsg("");

      const updatedApplication = await deleteInterviewRound(
        application._id,
        roundId,
      );

      setApplication(updatedApplication);

      return updatedApplication;
    } catch (error) {
      console.error("Failed to delete interview round:", error);

      const message = getErrorMessage(
        error,
        "Failed to delete interview round.",
      );

      setErrorMsg(message);

      throw new Error(message, {
        cause: error,
      });
    }
  };

  const handleDelete = async () => {
    if (!application?._id || deleting) {
      return;
    }

    try {
      setDeleting(true);
      setErrorMsg("");

      await deleteApplication(application._id);

      navigate("/applications");
    } catch (error) {
      console.error("Failed to delete application:", error);

      setErrorMsg(getErrorMessage(error, "Failed to delete application."));

      setDeleting(false);
    }
  };

  const handleBack = () => {
    navigate("/applications");
  };

  const handleRetry = async () => {
    if (!applicationId || loading) {
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const applicationData = await getApplication(applicationId);

      setApplication(applicationData);
    } catch (error) {
      console.error("Failed to load application:", error);

      setApplication(null);

      setErrorMsg(
        getErrorMessage(
          error,
          "Unable to load this application. Please try again.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  if (!applicationId) {
    return (
      <div className="container application-detail-page">
        <div className="application-detail-error">
          <h1>Application not found</h1>

          <p>No application ID was provided for this page.</p>

          <button
            type="button"
            className="application-action-secondary"
            onClick={handleBack}
          >
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

          <p>{errorMsg || "The requested application could not be found."}</p>

          <div className="application-detail-error-actions">
            <button
              type="button"
              className="application-action-secondary"
              onClick={handleBack}
            >
              Back to Applications
            </button>

            <button
              type="button"
              className="application-action-primary"
              onClick={handleRetry}
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

      {errorMsg && (
        <div className="application-detail-error-message" role="alert">
          {errorMsg}
        </div>
      )}

      <main className="application-detail-content">
        <ApplicationOverview application={application} />

        <ApplicationInterviews
          application={application}
          onAddRound={handleAddRound}
          onUpdateRound={handleUpdateRound}
          onDeleteRound={handleDeleteRound}
        />

        <ApplicationActions
          application={application}
          onApplicationUpdated={handleApplicationUpdated}
          onDelete={handleDelete}
          deleting={deleting}
        />
      </main>
    </div>
  );
}

export default ApplicationDetail;
