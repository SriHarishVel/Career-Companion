import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ConfirmModal from "../../components/ConfirmModal";
import EditModal from "../../components/EditModal";
import LoadingState from "../../components/LoadingState";
import { journeyService } from "../../services/journeyService";
import { getGoals } from "../../services/goalService";
import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
  addInterviewRound,
  updateInterviewRound,
  deleteInterviewRound,
} from "../../services/applicationService";
import ApplicationForm from "./components/ApplicationForm";
import ApplicationFilters from "./components/ApplicationFilters";
import ApplicationList from "./components/ApplicationList";
import InterviewModals from "./components/InterviewModals";
import "./index.css";

function Applications() {
  const navigate = useNavigate();
  const location = useLocation();
  const journeyAction = location.state?.action;
  const journeyStep = journeyService.getNextStep();
  const applicationFormRef = useRef(null);

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");
  const [appliedDate, setAppliedDate] = useState("");
  const [applicationUrl, setApplicationUrl] = useState("");

  const [applications, setApplications] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Last Updated");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [applicationToDeleteId, setApplicationToDeleteId] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const [editCompany, setEditCompany] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editStatus, setEditStatus] = useState("Applied");
  const [editAppliedDate, setEditAppliedDate] = useState("");
  const [editApplicationUrl, setEditApplicationUrl] = useState("");

  const [showRoundModal, setShowRoundModal] = useState(false);
  const [roundApplicationId, setRoundApplicationId] = useState(null);

  const [roundTitle, setRoundTitle] = useState("");
  const [roundStatus, setRoundStatus] = useState("Pending");
  const [roundDate, setRoundDate] = useState("");

  const [showEditRoundModal, setShowEditRoundModal] = useState(false);
  const [selectedRound, setSelectedRound] = useState(null);

  const [showDeleteRoundModal, setShowDeleteRoundModal] = useState(false);

  const [goals, setGoals] = useState([]);
  const [primaryGoalId, setPrimaryGoalId] = useState("");
  const [editPrimaryGoalId, setEditPrimaryGoalId] = useState("");
  const [goalFilter, setGoalFilter] = useState("All");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const [applications, goals] = await Promise.all([
          getApplications({
            search: searchTerm || undefined,

            status: statusFilter === "All" ? undefined : statusFilter,

            primaryGoal: goalFilter === "All" ? undefined : goalFilter,

            sort:
              sortBy === "Last Updated"
                ? undefined
                : sortBy === "Applied Date"
                  ? "appliedDate"
                  : sortBy === "Company"
                    ? "company"
                    : sortBy === "Role"
                      ? "role"
                      : undefined,
          }),

          getGoals(),
        ]);

        setApplications(applications);
        setGoals(goals);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [searchTerm, statusFilter, goalFilter, sortBy]);

  useEffect(() => {
    if (journeyAction === "addApplication") {
      applicationFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [journeyAction]);

  const primaryGoalOptions = goals.filter(
    (goal) => goal.goalType === "Primary",
  );

  async function refreshApplications() {
    const applications = await getApplications({
      search: searchTerm || undefined,

      status: statusFilter === "All" ? undefined : statusFilter,

      primaryGoal: goalFilter === "All" ? undefined : goalFilter,

      sort:
        sortBy === "Last Updated"
          ? undefined
          : sortBy === "Applied Date"
            ? "appliedDate"
            : sortBy === "Company"
              ? "company"
              : sortBy === "Role"
                ? "role"
                : undefined,
    });

    setApplications(applications);
  }

  function getGoalTitle(goalId) {
    const goal = goals.find((goal) => goal._id === goalId);

    return goal ? goal.title : null;
  }

  function goToNextStep() {
    const nextStep = journeyService.getNextStep();

    navigate(nextStep.page, {
      state: {
        fromJourney: true,
        action: nextStep.action,
      },
    });
  }

  function openEditModal(application) {
    setSelectedApplication(application);

    setEditCompany(application.company);
    setEditRole(application.role);
    setEditStatus(application.status);
    setEditAppliedDate(application.appliedDate);
    setEditApplicationUrl(application.applicationUrl);

    setShowEditModal(true);
    setEditPrimaryGoalId(application.primaryGoal?._id || "");
  }

  function closeEditModal() {
    setShowEditModal(false);
    setSelectedApplication(null);
    setEditCompany("");
    setEditRole("");
    setEditStatus("Applied");
    setEditAppliedDate("");
    setEditApplicationUrl("");
    setEditPrimaryGoalId("");
  }

  function openEditRoundModal(applicationId, round) {
    setRoundApplicationId(applicationId);

    setSelectedRound(round);

    setRoundTitle(round.title);
    setRoundStatus(round.status);
    setRoundDate(round.date || "");

    setShowEditRoundModal(true);
  }

  async function saveApplication() {
    try {
      await updateApplication(selectedApplication._id, {
        company: editCompany,
        role: editRole,
        status: editStatus,
        appliedDate: editAppliedDate,
        applicationUrl: editApplicationUrl,
        primaryGoal: editPrimaryGoalId || null,
      });

      await refreshApplications();

      closeEditModal();
    } catch (error) {
      console.error(error);
    }
  }

  async function addApplication() {
    if (!company.trim() || !role.trim()) {
      return;
    }

    try {
      await createApplication({
        company: company.trim(),
        role: role.trim(),
        status,
        appliedDate,
        applicationUrl,
        primaryGoal: primaryGoalId || null,
      });

      await refreshApplications();

      if (journeyAction === "addApplication") {
        goToNextStep();
      }

      setCompany("");
      setRole("");
      setStatus("Applied");
      setAppliedDate("");
      setApplicationUrl("");
      setPrimaryGoalId("");
    } catch (error) {
      console.error(error);
    }
  }

  async function confirmDeleteApplication() {
    try {
      await deleteApplication(applicationToDeleteId);

      await refreshApplications();

      setShowDeleteModal(false);
      setApplicationToDeleteId(null);
    } catch (error) {
      console.error(error);
    }
  }

  async function addRound() {
    if (!roundTitle.trim()) {
      return;
    }

    try {
      await addInterviewRound(roundApplicationId, {
        title: roundTitle,
        status: roundStatus,
        date: roundDate,
      });

      await refreshApplications();

      setRoundTitle("");
      setRoundStatus("Pending");
      setRoundApplicationId(null);
      setShowRoundModal(false);
      setRoundDate("");
    } catch (error) {
      console.error(error);
    }
  }

  async function saveEditedRound() {
    try {
      await updateInterviewRound(roundApplicationId, selectedRound._id, {
        title: roundTitle,
        status: roundStatus,
        date: roundDate,
      });

      await refreshApplications();

      setShowEditRoundModal(false);
      setSelectedRound(null);
      setRoundTitle("");
      setRoundStatus("Pending");
      setRoundDate("");
      setRoundApplicationId(null);
    } catch (error) {
      console.error(error);
    }
  }

  async function confirmDeleteRound() {
    try {
      await deleteInterviewRound(roundApplicationId, selectedRound._id);

      await refreshApplications();

      setShowDeleteRoundModal(false);
      setSelectedRound(null);
      setRoundApplicationId(null);
    } catch (error) {
      console.error(error);
    }
  }

  if (loading) {
    return (
      <div className="container">
        <h1>Applications</h1>

        <LoadingState message="Loading your applications..." />
      </div>
    );
  }

  return (
    <div className="container">
      <>
        <h1>
          {journeyAction
            ? journeyStep.title
            : goalFilter === "All"
              ? "Applications"
              : `Applications for ${getGoalTitle(goalFilter)}`}
        </h1>

        {journeyAction && (
          <p className="journey-message">{journeyStep.description}</p>
        )}
      </>

      <div ref={applicationFormRef}>
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
          addApplication={addApplication}
        />
      </div>

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

      <ApplicationList
        applications={applications}
        openEditRoundModal={openEditRoundModal}
        setRoundApplicationId={setRoundApplicationId}
        setSelectedRound={setSelectedRound}
        setShowDeleteRoundModal={setShowDeleteRoundModal}
        setShowRoundModal={setShowRoundModal}
        openEditModal={openEditModal}
        setApplicationToDeleteId={setApplicationToDeleteId}
        setShowDeleteModal={setShowDeleteModal}
      />

      <EditModal
        isOpen={showEditModal}
        title="Edit Application"
        onSave={saveApplication}
        onCancel={closeEditModal}
      >
        <div className="application-form-fields">
          <div className="filter-group">
            <label>Company</label>

            <input
              type="text"
              placeholder="e.g. Google"
              value={editCompany}
              onChange={(e) => setEditCompany(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Role</label>

            <input
              type="text"
              placeholder="e.g. Software Engineer"
              value={editRole}
              onChange={(e) => setEditRole(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Application URL</label>

            <input
              type="url"
              placeholder="https://..."
              value={editApplicationUrl}
              onChange={(e) => setEditApplicationUrl(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Status</label>

            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
            >
              <option value="Applied">Applied</option>

              <option value="In Progress">In Progress</option>

              <option value="Offer">Offer</option>

              <option value="Rejected">Rejected</option>

              <option value="Withdrawn">Withdrawn</option>
            </select>
          </div>

          <div className="filter-group">
            <label>
              Career Goal
              <span className="optional-label">Optional</span>
            </label>

            <select
              value={editPrimaryGoalId}
              onChange={(e) => setEditPrimaryGoalId(e.target.value)}
            >
              <option value="">No Career Goal</option>

              {primaryGoalOptions.map((goal) => (
                <option key={goal._id} value={goal._id}>
                  {goal.title}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Applied Date</label>

            <input
              type="date"
              value={editAppliedDate}
              onChange={(e) => setEditAppliedDate(e.target.value)}
            />
          </div>
        </div>
      </EditModal>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Application"
        message="Are you sure you want to delete this application?"
        onConfirm={confirmDeleteApplication}
        onCancel={() => {
          setShowDeleteModal(false);
          setApplicationToDeleteId(null);
        }}
      />

      <InterviewModals
        showRoundModal={showRoundModal}
        setShowRoundModal={setShowRoundModal}
        addRound={addRound}
        showEditRoundModal={showEditRoundModal}
        setShowEditRoundModal={setShowEditRoundModal}
        saveEditedRound={saveEditedRound}
        showDeleteRoundModal={showDeleteRoundModal}
        setShowDeleteRoundModal={setShowDeleteRoundModal}
        confirmDeleteRound={confirmDeleteRound}
        selectedRound={selectedRound}
        setSelectedRound={setSelectedRound}
        roundApplicationId={roundApplicationId}
        setRoundApplicationId={setRoundApplicationId}
        roundTitle={roundTitle}
        setRoundTitle={setRoundTitle}
        roundStatus={roundStatus}
        setRoundStatus={setRoundStatus}
        roundDate={roundDate}
        setRoundDate={setRoundDate}
      />
    </div>
  );
}

export default Applications;
