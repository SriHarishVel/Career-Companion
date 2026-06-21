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
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedApplicationId, setSelectedApplicationId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [editCompany, setEditCompany] = useState("");
    const [editRole, setEditRole] = useState("");
    const [editStatus, setEditStatus] = useState("Applied");
    const [editAppliedDate, setEditAppliedDate] = useState("");
    const [applications, setApplications] =
        useState(() => {
            const savedApplications =
                localStorage.getItem(
                    "applications"
                );

            if (savedApplications) {
                return JSON.parse(
                    savedApplications
                );
            }

            return initialApplications;
        });

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
    }

    function confirmDeleteApplication() {
        setApplications(
            applications.filter(
                application =>
                    application.id !== selectedApplicationId
            )
        );

        setShowDeleteModal(false);
        setSelectedApplicationId(null);
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
            <div className="applications-grid">

                {applications.map(
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

                            <p>
                                Status:
                                {" "}
                                {application.status}
                            </p>

                            <p>
                                Applied:
                                {" "}
                                {application.appliedDate}
                            </p>

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
                                    setSelectedApplicationId(application.id);
                                    setShowDeleteModal(true);
                                }}
                            >
                                Delete
                            </button>
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
                    setSelectedApplicationId(null);
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
        </div>
    );
}

export default Applications;