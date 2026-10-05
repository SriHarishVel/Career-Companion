import { useMemo, useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import useQueryParams from "../../hooks/useQueryParams";

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
  const queryClient = useQueryClient();

  const { getParam, setParams, clearParams } = useQueryParams();

  /* URL filter state */

  const searchTerm = getParam("search") || "";
  const statusFilter = getParam("status") || "All";
  const goalFilter = getParam("goal") || "All";
  const sortBy = getParam("sort") || "Last Updated";

  /* Draft filter state */

  const [draftSearchTerm, setDraftSearchTerm] = useState(searchTerm);
  const [draftStatusFilter, setDraftStatusFilter] = useState(statusFilter);
  const [draftGoalFilter, setDraftGoalFilter] = useState(goalFilter);
  const [draftSortBy, setDraftSortBy] = useState(sortBy);

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

  const [errorMsg, setErrorMsg] = useState("");

  /* Load applications */

  const {
    data: applications = [],
    isLoading: applicationsLoading,
    error: applicationsError,
  } = useQuery({
    queryKey: ["applications"],
    queryFn: getApplications,
  });

  /* Load primary goals */

  const { data: primaryGoalOptions = [], error: goalsError } = useQuery({
    queryKey: ["goals", "primary"],
    queryFn: () => getGoals({ goalType: "Primary" }),
  });

  /* Save application */

  const saveApplicationMutation = useMutation({
    mutationFn: ({ applicationId, payload }) => {
      if (applicationId) {
        return updateApplication(applicationId, payload);
      }

      return createApplication(payload);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["applications"],
      });

      setShowApplicationForm(false);
      resetApplicationForm();
    },

    onError: (error) => {
      console.error("Failed to save application:", error);

      setErrorMsg(
        error.response?.data?.message ||
          "Unable to save the application. Please try again.",
      );
    },
  });

  /* Delete application */

  const deleteApplicationMutation = useMutation({
    mutationFn: deleteApplication,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["applications"],
      });

      setShowDeleteModal(false);
      setApplicationToDeleteId(null);
    },

    onError: (error) => {
      console.error("Failed to delete application:", error);

      setErrorMsg(
        error.response?.data?.message || "Unable to delete the application.",
      );
    },
  });

  /* Apply filters */

  function applyFilters() {
    setParams({
      search: draftSearchTerm || "",
      status: draftStatusFilter === "All" ? "" : draftStatusFilter,
      goal: draftGoalFilter === "All" ? "" : draftGoalFilter,
      sort: draftSortBy === "Last Updated" ? "" : draftSortBy,
    });
  }

  /* Clear filters */

  function clearFilters() {
    setDraftSearchTerm("");
    setDraftStatusFilter("All");
    setDraftGoalFilter("All");
    setDraftSortBy("Last Updated");

    clearParams(["search", "status", "goal", "sort"]);
  }

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

  function resetApplicationForm() {
    setCompany("");
    setRole("");
    setApplicationUrl("");
    setStatus("Applied");
    setPrimaryGoalId("");
    setAppliedDate("");
    setEditingApplicationId(null);
  }

  /* Open create */

  function openCreateModal() {
    resetApplicationForm();
    setErrorMsg("");
    setShowApplicationForm(true);
  }

  /* Close form */

  function closeApplicationForm() {
    if (saveApplicationMutation.isPending) {
      return;
    }

    setShowApplicationForm(false);
    resetApplicationForm();
    setErrorMsg("");
  }

  /* Save application */

  function handleApplicationSubmit(event) {
    event.preventDefault();

    if (!company.trim() || !role.trim()) {
      setErrorMsg("Company and role are required.");
      return;
    }

    setErrorMsg("");

    const payload = {
      company: company.trim(),
      role: role.trim(),
      applicationUrl: applicationUrl.trim(),
      status,
      primaryGoal: primaryGoalId || null,
      appliedDate: appliedDate || null,
    };

    saveApplicationMutation.mutate({
      applicationId: editingApplicationId,
      payload,
    });
  }

  /* Delete application */

  function handleDeleteApplication() {
    if (!applicationToDeleteId || deleteApplicationMutation.isPending) {
      return;
    }

    setErrorMsg("");

    deleteApplicationMutation.mutate(applicationToDeleteId);
  }

  /* Loading */

  const loading = applicationsLoading;

  const displayedError =
    errorMsg ||
    (applicationsError
      ? applicationsError.response?.data?.message ||
        "Unable to load applications. Please try again."
      : "") ||
    (goalsError
      ? goalsError.response?.data?.message ||
        "Unable to load primary goals. Please try again."
      : "");

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

        <button type="button" className="btn-primary" onClick={openCreateModal}>
          Add Application
        </button>
      </header>

      {displayedError && (
        <div className="application-detail-error-message" role="alert">
          {displayedError}
        </div>
      )}

      <ApplicationFilters
        searchTerm={draftSearchTerm}
        setSearchTerm={setDraftSearchTerm}
        statusFilter={draftStatusFilter}
        setStatusFilter={setDraftStatusFilter}
        goalFilter={draftGoalFilter}
        setGoalFilter={setDraftGoalFilter}
        sortBy={draftSortBy}
        setSortBy={setDraftSortBy}
        primaryGoalOptions={primaryGoalOptions}
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
      />

      {filteredApplications.length > 0 ? (
        <div className="applications-grid">
          {filteredApplications.map((application) => (
            <ApplicationCard key={application._id} application={application} />
          ))}
        </div>
      ) : (
        <div className="applications-empty">
          <h2>No applications found</h2>

          <p>Try changing your filters or add your first application.</p>

          <button
            type="button"
            className="btn-primary"
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
              className="btn-secondary"
              onClick={closeApplicationForm}
              disabled={saveApplicationMutation.isPending}
            >
              Cancel
            </button>

            <button
              type="submit"
              form="application-form"
              className="btn-primary"
              disabled={saveApplicationMutation.isPending}
            >
              {saveApplicationMutation.isPending
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