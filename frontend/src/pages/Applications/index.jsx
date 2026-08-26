import { useEffect, useMemo, useState } from "react";

import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from "../../services/applicationService";

import { getGoals } from "../../services/goalService";

import LoadingState from "../../components/LoadingState";
import FormDialog from "../../components/FormDialog";
import ConfirmModal from "../../components/ConfirmModal";

import ApplicationFilters from "./components/ApplicationFilters";
import ApplicationForm from "./components/ApplicationForm";
import ApplicationCard from "./components/ApplicationCard";

import "./index.css";

function Applications() {
  /* Data */

  const [applications, setApplications] = useState([]);
  const [primaryGoalOptions, setPrimaryGoalOptions] = useState([]);

  /* Filters */

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [goalFilter, setGoalFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Last Updated");

  /* Application form */

  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const [editingApplicationId, setEditingApplicationId] = useState(null);

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [applicationUrl, setApplicationUrl] = useState("");
  const [status, setStatus] = useState("Applied");
  const [primaryGoalId, setPrimaryGoalId] = useState("");
  const [appliedDate, setAppliedDate] = useState("");

  /* Delete */

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [applicationToDeleteId, setApplicationToDeleteId] = useState(null);

  /* UI */

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  /* Load applications */

  useEffect(() => {
    let cancelled = false;

    async function loadApplications() {
      try {
        const [applicationData, goalData] = await Promise.all([
          getApplications(),
          getGoals({
            goalType: "Primary",
          }),
        ]);

        if (cancelled) {
          return;
        }

        setApplications(applicationData);
        setPrimaryGoalOptions(goalData);
        setErrorMsg("");
        setLoading(false);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error("Failed to load applications:", error);

        setErrorMsg(
          error.response?.data?.message ||
            "Unable to load applications. Please try again.",
        );

        setLoading(false);
      }
    }

    loadApplications();

    return () => {
      cancelled = true;
    };
  }, []);

  /* Filter applications */

  const filteredApplications = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    const filtered = applications.filter((application) => {
      const matchesSearch =
        !search ||
        application.company?.toLowerCase().includes(search) ||
        application.role?.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" || application.status === statusFilter;

      const matchesGoal =
        goalFilter === "All" ||
        application.primaryGoal?._id === goalFilter ||
        application.primaryGoal === goalFilter;

      return matchesSearch && matchesStatus && matchesGoal;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "Applied Date") {
        return new Date(b.appliedDate || 0) - new Date(a.appliedDate || 0);
      }

      if (sortBy === "Company") {
        return (a.company || "").localeCompare(b.company || "");
      }

      if (sortBy === "Role") {
        return (a.role || "").localeCompare(b.role || "");
      }

      return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
    });
  }, [applications, searchTerm, statusFilter, goalFilter, sortBy]);

  /* Reset form */

  const resetApplicationForm = () => {
    setCompany("");
    setRole("");
    setApplicationUrl("");
    setStatus("Applied");
    setPrimaryGoalId("");
    setAppliedDate("");
    setEditingApplicationId(null);
  };

  /* Open create */

  const openCreateModal = () => {
    resetApplicationForm();
    setErrorMsg("");
    setShowApplicationForm(true);
  };

  /* Open edit */

  const openEditModal = (application) => {
    setEditingApplicationId(application._id);

    setCompany(application.company || "");
    setRole(application.role || "");
    setApplicationUrl(application.applicationUrl || "");
    setStatus(application.status || "Applied");

    setPrimaryGoalId(application.primaryGoal?._id || "");

    setAppliedDate(
      application.appliedDate
        ? new Date(application.appliedDate).toISOString().split("T")[0]
        : "",
    );

    setErrorMsg("");
    setShowApplicationForm(true);
  };

  /* Close form */

  const closeApplicationForm = () => {
    if (saving) {
      return;
    }

    setShowApplicationForm(false);
    resetApplicationForm();
    setErrorMsg("");
  };

  /* Save application */

  const handleApplicationSubmit = async (event) => {
    event.preventDefault();

    if (!company.trim() || !role.trim()) {
      setErrorMsg("Company and role are required.");
      return;
    }

    try {
      setSaving(true);
      setErrorMsg("");

      const payload = {
        company: company.trim(),
        role: role.trim(),
        applicationUrl: applicationUrl.trim(),
        status,
        primaryGoal: primaryGoalId || null,
        appliedDate: appliedDate || null,
      };

      if (editingApplicationId) {
        const updatedApplication = await updateApplication(
          editingApplicationId,
          payload,
        );

        setApplications((current) =>
          current.map((application) =>
            application._id === editingApplicationId
              ? updatedApplication
              : application,
          ),
        );
      } else {
        const newApplication = await createApplication(payload);

        setApplications((current) => [newApplication, ...current]);
      }

      setShowApplicationForm(false);
      resetApplicationForm();
    } catch (error) {
      console.error("Failed to save application:", error);

      setErrorMsg(
        error.response?.data?.message ||
          "Unable to save the application. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* Delete application */

  const handleDeleteApplication = async () => {
    if (!applicationToDeleteId) {
      return;
    }

    try {
      setErrorMsg("");

      await deleteApplication(applicationToDeleteId);

      setApplications((current) =>
        current.filter(
          (application) => application._id !== applicationToDeleteId,
        ),
      );

      setShowDeleteModal(false);
      setApplicationToDeleteId(null);
    } catch (error) {
      console.error("Failed to delete application:", error);

      setErrorMsg(
        error.response?.data?.message || "Unable to delete the application.",
      );
    }
  };

  /* Loading */

  if (loading) {
    return (
      <div className="container applications-page">
        <LoadingState message="Loading applications..." />
      </div>
    );
  }

  return (
    <div className="container applications-page">
      <header className="applications-page-header">
        <div>
          <span className="section-label">Career Tracking</span>

          <h1>Applications</h1>

        </div>

        <button
          type="button"
          className="application-action-primary"
          onClick={openCreateModal}
        >
          Add Application
        </button>
      </header>

      {errorMsg && (
        <div className="application-detail-error-message" role="alert">
          {errorMsg}
        </div>
      )}

      <ApplicationFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        goalFilter={goalFilter}
        setGoalFilter={setGoalFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        primaryGoalOptions={primaryGoalOptions}
      />

      {filteredApplications.length > 0 ? (
        <div className="applications-grid">
          {filteredApplications.map((application) => (
            <ApplicationCard
              key={application._id}
              application={application}
              openEditModal={openEditModal}
              setApplicationToDeleteId={setApplicationToDeleteId}
              setShowDeleteModal={setShowDeleteModal}
            />
          ))}
        </div>
      ) : (
        <div className="applications-empty">
          <h2>No applications found</h2>

          <p>Try changing your filters or add your first application.</p>

          <button
            type="button"
            className="application-action-primary"
            onClick={openCreateModal}
          >
            Add Application
          </button>
        </div>
      )}

      <FormDialog
        isOpen={showApplicationForm}
        title={editingApplicationId ? "Edit Application" : "Add Application"}
        onClose={closeApplicationForm}
        footer={
          <>
            <button
              type="button"
              className="application-action-secondary"
              onClick={closeApplicationForm}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              form="application-form"
              className="application-action-primary"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingApplicationId
                  ? "Save Changes"
                  : "Add Application"}
            </button>
          </>
        }
      >
        <ApplicationForm
          company={company}
          setCompany={setCompany}
          role={role}
          setRole={setRole}
          applicationUrl={applicationUrl}
          setApplicationUrl={setApplicationUrl}
          status={status}
          setStatus={setStatus}
          primaryGoalId={primaryGoalId}
          setPrimaryGoalId={setPrimaryGoalId}
          appliedDate={appliedDate}
          setAppliedDate={setAppliedDate}
          primaryGoalOptions={primaryGoalOptions}
          errorMsg={errorMsg}
          onSubmit={handleApplicationSubmit}
        />
      </FormDialog>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Application"
        message="Are you sure you want to delete this application? This action cannot be undone."
        onConfirm={handleDeleteApplication}
        onCancel={() => {
          setShowDeleteModal(false);
          setApplicationToDeleteId(null);
        }}
      />
    </div>
  );
}

export default Applications;
