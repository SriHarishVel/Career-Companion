import { useState, useEffect } from "react";
import initialApplications from "../../data/applications";
import ConfirmModal from "../../components/ConfirmModal";
import EditModal from "../../components/EditModal";
import "./index.css"

function Applications() {

    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [status, setStatus] = useState("Applied");
    const [appliedDate, setAppliedDate] = useState("");
    const [applicationUrl, setApplicationUrl] = useState("");

    const [applications, setApplications] = useState(() => {
        const savedApplications =
            localStorage.getItem("applications");

        if (savedApplications) {
            return JSON.parse(savedApplications);
        }

        return initialApplications;
    });

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

    useEffect(() => {
        localStorage.setItem(
            "applications",
            JSON.stringify(
                applications
            )
        );
    }, [applications]);

    function openEditModal(application) {
        setSelectedApplication(application);

        setEditCompany(application.company);
        setEditRole(application.role);
        setEditStatus(application.status);
        setEditAppliedDate(application.appliedDate);

        setShowEditModal(true);
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

    function saveApplication() {
        setApplications(
            applications.map(application =>
                application.id === selectedApplication.id
                    ? {
                        ...application,
                        company: editCompany,
                        role: editRole,
                        status: editStatus,
                        appliedDate: editAppliedDate,
                        applicationUrl: editApplicationUrl,
                        lastUpdated: Date.now()
                    }
                    : application
            )
        );

        setShowEditModal(false);
        setSelectedApplication(null);
    }

    function addApplication() {
        if (!company.trim() || !role.trim()) {
            return;
        }

       const newApplication = {
            id: Date.now(),
            company: company.trim(),
            role: role.trim(),
            status,
            appliedDate,
            applicationUrl,
            interviewRounds: [],
            lastUpdated: Date.now()
        };

        setApplications(prev => [
            ...prev,
            newApplication
        ]);

        setCompany("");
        setRole("");
        setStatus("Applied");
        setAppliedDate("");
        setApplicationUrl("");
    }

    function confirmDeleteApplication() {
        setApplications(
            applications.filter(
                application =>
                    application.id !== applicationToDeleteId
            )
        );

        setShowDeleteModal(false);
        setApplicationToDeleteId(null);
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
                        b.lastUpdated -
                        a.lastUpdated
                    );
            }
        }
    );

    function addRound() {

        if (!roundTitle.trim()) {
            return;
        }

        setApplications(
            applications.map(application =>
                application.id === roundApplicationId
                    ? {
                        ...application,
                        interviewRounds: [
                            ...(application.interviewRounds || []),
                            {
                                id: Date.now(),
                                title: roundTitle,
                                status: roundStatus,
                                date: roundDate
                            }
                        ],
                        lastUpdated: Date.now()
                    }
                    : application
            )
        );

        setRoundTitle("");
        setRoundStatus("Pending");
        setRoundApplicationId(null);
        setShowRoundModal(false);
        setRoundDate("");
    }

    function saveEditedRound() {

        setApplications(
            applications.map(application => {

                if (
                    application.id !==
                    roundApplicationId
                ) {
                    return application;
                }

                return {
                    ...application,

                    interviewRounds:
                        application.interviewRounds.map(
                            round =>
                                round.id ===
                                selectedRound.id
                                    ? {
                                        ...round,
                                        title: roundTitle,
                                        status: roundStatus,
                                        date: roundDate
                                    }
                                    : round
                        ),

                    lastUpdated:
                        Date.now()
                };
            })
        );

        setShowEditRoundModal(false);
        setSelectedRound(null);
        setRoundTitle("");
        setRoundStatus("Pending");
        setRoundDate("");
    }

    return (
        <div className="container">
            <h1>
                Applications
            </h1>

            <div className="add-application-card">
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
                            key={application.id}
                            className="application-card"
                        >
                            <h2>
                                {application.role}
                            </h2>

                            <p>
                                {application.company}
                            </p>

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
                                {application.appliedDate}
                            </p>
                            
                            <p>
                                Interview Rounds:
                                {" "}
                                {(application.interviewRounds || []).length}
                            </p>
                            
                            {(application.interviewRounds || []).map(
                                round => (
                                    <div
                                        key={round.id}
                                        className={`round-item ${round.status.toLowerCase()}`}
                                    >   
                                        <span>
                                            {round.title} • {round.status}
                                            {round.date && (
                                                <>
                                                    {" • "}
                                                    {round.date}
                                                </>
                                            )}
                                        </span>

                                        <button
                                            className="edit-btn"
                                            onClick={() =>
                                                openEditRoundModal(
                                                    application.id,
                                                    round
                                                )
                                            }
                                        >
                                            Edit
                                        </button>
                                    </div>
                                )
                            )}

                            <p>
                                Last Updated:
                                {" "}
                                {new Date(
                                    application.lastUpdated
                                ).toLocaleString()
                                }
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
                                            application.id
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
                                        setApplicationToDeleteId(application.id);
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
        </div>
    );
}

export default Applications;