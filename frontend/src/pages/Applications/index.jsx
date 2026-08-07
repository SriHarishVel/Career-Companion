import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ConfirmModal from "../../components/ConfirmModal";
import EditModal from "../../components/EditModal";
import { journeyService } from "../../services/journeyService";
import { getGoals } from "../../services/goalService";
import {
    getApplications,
    createApplication,
    updateApplication,
    deleteApplication,
    addInterviewRound,
    updateInterviewRound,
    deleteInterviewRound
} from "../../services/applicationService";
import "./index.css"

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

    useEffect(() => {

        async function fetchData() {

            try {

                const [
                    applications,
                    goals
                ] = await Promise.all([
                    getApplications(),
                    getGoals()
                ]);

                setApplications(applications);
                setGoals(goals);

            } catch (error) {
                console.error(error);
            }

        }

        fetchData();

    }, []);

    useEffect(() => {
        if (
            journeyAction === "addApplication"
        ) {
            applicationFormRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }

    }, [journeyAction]);

    

    const primaryGoalOptions = goals.filter(
        goal => goal.goalType === "Primary"
    );

    function getGoalTitle(goalId) {

        const goal = goals.find(
            goal => goal._id === goalId
        );

        return goal
            ? goal.title
            : null;

    }

    function goToNextStep() {

        const nextStep = journeyService.getNextStep();

        navigate(nextStep.page, {
            state: {
                fromJourney: true,
                action: nextStep.action
            }
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

    function openEditRoundModal(
        applicationId,
        round
    ) {
        setRoundApplicationId(
            applicationId
        );

        setSelectedRound(round);

        setRoundTitle(round.title);
        setRoundStatus(round.status);
        setRoundDate(round.date || "");
        
        setShowEditRoundModal(true);
    }

    async function saveApplication() {

        try {

            await updateApplication(
                selectedApplication._id,
                {
                    company: editCompany,
                    role: editRole,
                    status: editStatus,
                    appliedDate: editAppliedDate,
                    applicationUrl: editApplicationUrl,
                    primaryGoal: editPrimaryGoalId || null
                }
            );

            const applications =
                await getApplications();

            setApplications(applications);

            setShowEditModal(false);
            setSelectedApplication(null);
            setEditPrimaryGoalId("");

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
                primaryGoal: primaryGoalId || null

            });

            const applications =
                await getApplications();

            setApplications(applications);

            if (
                journeyAction === "addApplication"
            ) {
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

            await deleteApplication(
                applicationToDeleteId
            );

            const applications =
                await getApplications();

            setApplications(applications);

            setShowDeleteModal(false);
            setApplicationToDeleteId(null);

        } catch (error) {

            console.error(error);

        }

    }

    let filteredApplications =
        applications.filter(
            application => {

                const matchesSearch =
                    application.company
                        .toLowerCase()
                        .includes(
                            searchTerm.toLowerCase()
                        ) ||
                    application.role
                        .toLowerCase()
                        .includes(
                            searchTerm.toLowerCase()
                        );

                const matchesStatus =
                    statusFilter === "All" ||
                    application.status === statusFilter;

                return (
                    matchesSearch &&
                    matchesStatus
                );
            }
        )
        .filter(application =>
            goalFilter === "All"
                ? true
                : application.primaryGoal?._id === goalFilter
        );

    filteredApplications.sort(
        (a, b) => {

            switch (sortBy) {

                case "Applied Date":
                    return new Date(
                        b.appliedDate
                    ) -
                    new Date(
                        a.appliedDate
                    );

                case "Company":
                    return a.company.localeCompare(
                        b.company
                    );

                case "Role":
                    return a.role.localeCompare(
                        b.role
                    );

                default:
                    return (
                        new Date(b.updatedAt) -
                        new Date(a.updatedAt)
                    );
            }
        }
    );

    async function addRound() {

        if (!roundTitle.trim()) {
            return;
        }

        try {

            await addInterviewRound(
                roundApplicationId,
                {
                    title: roundTitle,
                    status: roundStatus,
                    date: roundDate,
                }
            );

            const applications =
                await getApplications();

            setApplications(applications);

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

            await updateInterviewRound(
                roundApplicationId,
                selectedRound._id,
                {
                    title: roundTitle,
                    status: roundStatus,
                    date: roundDate,
                }
            );

            const applications =
                await getApplications();

            setApplications(applications);

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

            await deleteInterviewRound(
                roundApplicationId,
                selectedRound._id
            );

            const applications =
                await getApplications();

            setApplications(applications);

            setShowDeleteRoundModal(false);
            setSelectedRound(null);
            setRoundApplicationId(null);

        } catch (error) {

            console.error(error);

        }

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
                    <p className="journey-message">
                        {journeyStep.description}
                    </p>
                )}
            </>

            <div className="add-application-card" ref={applicationFormRef}>
                <h3>Add Application</h3>

                <input
                    type="text"
                    placeholder="Company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                />

                <input
                    type="url"
                    placeholder="Application URL"
                    value={applicationUrl}
                    onChange={(e) => setApplicationUrl(e.target.value)}
                />

                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="Applied">Applied</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Withdrawn">Withdrawn</option>
                </select>

                <select
                    value={primaryGoalId}
                    onChange={(e) =>
                        setPrimaryGoalId(e.target.value)
                    }
                >
                    <option value="">
                        Career Goal (Optional)
                    </option>

                    {primaryGoalOptions.map(goal => (
                        <option
                            key={goal._id}
                            value={goal._id}
                        >
                            {goal.title}
                        </option>
                    ))}
                </select>

                <input
                    type="date"
                    value={appliedDate}
                    onChange={(e) => setAppliedDate(e.target.value)}
                />

                <button onClick={addApplication}>
                    Add Application
                </button>
            </div>

            <div className="filters-card">
                <h3>Filters</h3>

                <div className="filters-toolbar">

                    <div className="filter-group">
                        <label>Search</label>

                        <input
                            type="text"
                            placeholder="Company or Role"
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(e.target.value)
                            }
                        />
                    </div>

                    <div className="filter-group">
                        <label>Status</label>

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                        >
                            <option value="All">All</option>
                            <option value="Applied">Applied</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Offer">Offer</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Withdrawn">Withdrawn</option>
                        </select>
                    </div>
                    
                    <select
                        value={goalFilter}
                        onChange={(e) => setGoalFilter(e.target.value)}
                    >
                        <option value="All">All Career Goals</option>

                        {primaryGoalOptions.map(goal => (
                            <option
                                key={goal._id}
                                value={goal._id}
                            >
                                {goal.title}
                            </option>
                        ))}
                    </select>

                    <div className="filter-group">
                        <label>Sort By</label>

                        <select
                            value={sortBy}
                            onChange={(e) =>
                                setSortBy(e.target.value)
                            }
                        >
                            <option value="Last Updated">
                                Last Updated
                            </option>

                            <option value="Applied Date">
                                Applied Date
                            </option>

                            <option value="Company">
                                Company
                            </option>

                            <option value="Role">
                                Role
                            </option>
                        </select>
                    </div>

                </div>
            </div>

            <div className="applications-grid">

                {filteredApplications.map(
                    application => (
                        <div
                            key={application._id}
                            className="application-card"
                        >
                            <h2>
                                {application.role}
                            </h2>

                            <p>
                                {application.company}
                            </p>

                            {application.primaryGoal && (
                                <p className="related-goal">
                                    Career Goal:
                                    {" "}
                                    {application.primaryGoal.title}
                                </p>
                            )}

                            <span
                                className={`application-status ${application.status
                                    .toLowerCase()
                                    .replace(" ", "-")}`}
                            >
                                {application.status}
                            </span>

                            <p>
                                Applied:
                                {" "}
                                {application.appliedDate
                                    ? new Date(application.appliedDate)
                                        .toLocaleDateString("en-GB")
                                    : "-"}
                            </p>
                            
                            <p>
                                Interview Rounds:
                                {" "}
                                {(application.interviewRounds || []).length}
                            </p>
                            
                            {[...(application.interviewRounds || [])] 
                                .sort((a, b) =>
                                    new Date(a.date) -
                                    new Date(b.date)
                                )
                                .map( round => (
                                    <div
                                        key={round._id}
                                        className={`round-item ${round.status.toLowerCase()}`}
                                    >
                                        <div className="round-content">
                                            <div>
                                                {round.title} • {round.status}
                                            </div>

                                            {round.date && (
                                                <small className="round-date">
                                                    {new Date(round.date)
                                                        .toLocaleDateString(
                                                            "en-GB",
                                                            {
                                                                day: "2-digit",
                                                                month: "short",
                                                                year: "numeric"
                                                            }
                                                        )}
                                                </small>
                                            )}
                                        </div>
                                        <div className="round-actions">

                                            <button
                                                className="round-action-btn"
                                                title="Edit Round"
                                                onClick={() =>
                                                    openEditRoundModal(
                                                        application._id,
                                                        round
                                                    )
                                                }
                                            >
                                                ✏️
                                            </button>

                                            <button
                                                className="round-action-btn delete"
                                                title="Delete Round"
                                                onClick={() => {
                                                    setRoundApplicationId(
                                                        application._id
                                                    );

                                                    setSelectedRound(
                                                        round
                                                    );

                                                    setShowDeleteRoundModal(
                                                        true
                                                    );
                                                }}
                                            >
                                                ✖
                                            </button>

                                        </div>
                                    </div>
                                )
                            )}

                            <p>
                                Last Updated:
                                {" "}
                                {new Date(
                                    application.updatedAt
                                ).toLocaleString()}
                            </p>

                            <div className="card-actions">

                                {application.applicationUrl && (
                                    <a
                                        href={
                                            application.applicationUrl.startsWith("http")
                                                ? application.applicationUrl
                                                : `https://${application.applicationUrl}`
                                        }
                                        className="view-posting-link"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        ↗ View Posting
                                    </a>
                                )}

                                
                                <button
                                    onClick={() => {
                                        setRoundApplicationId(
                                            application._id
                                        );

                                        setShowRoundModal(true);
                                    }}
                                >
                                    Add Round
                                </button>

                                <button
                                    className="edit-btn"
                                    onClick={() =>
                                        openEditModal(application)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    className="delete-btn"
                                    onClick={() => {
                                        setApplicationToDeleteId(application._id);
                                        setShowDeleteModal(true);
                                    }}
                                >
                                    Delete
                                </button>

                            </div>
                        </div>
                    )
                )}

            </div>
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


            <EditModal
                isOpen={showEditModal}
                title="Edit Application"
                onSave={saveApplication}
                onCancel={() => {
                    setShowEditModal(false);
                    setSelectedApplication(null);
                    setEditPrimaryGoalId("");
                }}
            >
                <input
                    type="text"
                    value={editCompany}
                    onChange={(e) =>
                        setEditCompany(e.target.value)
                    }
                    placeholder="Company"
                />

                <input
                    type="text"
                    value={editRole}
                    onChange={(e) =>
                        setEditRole(e.target.value)
                    }
                    placeholder="Role"
                />

                <input
                    type="url"
                    value={editApplicationUrl}
                    onChange={(e) =>
                        setEditApplicationUrl(e.target.value)
                    }
                    placeholder="Application URL"
                />

                <select
                    value={editStatus}
                    onChange={(e) =>
                        setEditStatus(e.target.value)
                    }
                >
                    <option value="Applied">Applied</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Withdrawn">Withdrawn</option>
                </select>
                
                <select
                    value={editPrimaryGoalId}
                    onChange={(e) =>
                        setEditPrimaryGoalId(e.target.value)
                    }
                >
                    <option value="">
                        Career Goal (Optional)
                    </option>

                    {primaryGoalOptions.map(goal => (
                        <option
                            key={goal._id}
                            value={goal._id}
                        >
                            {goal.title}
                        </option>
                    ))}
                </select>

                <input
                    type="date"
                    value={editAppliedDate}
                    onChange={(e) =>
                        setEditAppliedDate(e.target.value)
                    }
                />
            </EditModal>

            <EditModal
                isOpen={showRoundModal}
                title="Add Interview Round"
                onSave={addRound}
                onCancel={() => {
                    setShowRoundModal(false);
                    setRoundTitle("");
                    setRoundStatus("Pending");
                    setRoundApplicationId(null);
                    setRoundDate("");
                }}
            >
                <input
                    type="text"
                    placeholder="Round Name"
                    value={roundTitle}
                    onChange={(e) =>
                        setRoundTitle(e.target.value)
                    }
                />

                <select
                    value={roundStatus}
                    onChange={(e) =>
                        setRoundStatus(e.target.value)
                    }
                >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Failed">Failed</option>
                </select>

                <input
                    type="date"
                    value={roundDate}
                    onChange={(e) =>
                        setRoundDate(e.target.value)
                    }
                />

            </EditModal>

            <EditModal
                isOpen={showEditRoundModal}
                title="Edit Interview Round"
                onSave={saveEditedRound}
                onCancel={() => {
                    setShowEditRoundModal(false);
                    setSelectedRound(null);
                    setRoundTitle("");
                    setRoundStatus("Pending");
                    setRoundDate("");
                }}
            >
                <input
                    type="text"
                    value={roundTitle}
                    onChange={(e) =>
                        setRoundTitle(e.target.value)
                    }
                    placeholder="Round Name"
                />

                <select
                    value={roundStatus}
                    onChange={(e) =>
                        setRoundStatus(e.target.value)
                    }
                >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Failed">Failed</option>
                </select>

                <input
                    type="date"
                    value={roundDate}
                    onChange={(e) =>
                        setRoundDate(e.target.value)
                    }
                />

            </EditModal>

            <ConfirmModal
                isOpen={showDeleteRoundModal}
                title="Delete Interview Round"
                message="Are you sure you want to delete this interview round?"
                onConfirm={confirmDeleteRound}
                onCancel={() => {
                    setShowDeleteRoundModal(false);
                    setSelectedRound(null);
                    setRoundApplicationId(null);
                }}
            />

        </div>
    );
}

export default Applications;