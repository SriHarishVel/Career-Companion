function ApplicationList({
    applications,
    openEditRoundModal,
    setRoundApplicationId,
    setSelectedRound,
    setShowDeleteRoundModal,
    setShowRoundModal,
    openEditModal,
    setApplicationToDeleteId,
    setShowDeleteModal,
}) {
    return (
        <div className="applications-grid">
            {applications.map((application) => (
                <div
                    key={application._id}
                    className="application-card"
                >
                    <h3>
                        {application.role}
                    </h3>

                    <p>
                        {application.company}
                    </p>

                    {application.primaryGoal && (
                        <p className="related-goal">
                            Career Goal:{" "}
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
                        Applied:{" "}
                        {application.appliedDate
                            ? new Date(
                                  application.appliedDate
                              ).toLocaleDateString("en-GB")
                            : "-"}
                    </p>

                    <p>
                        Interview Rounds:{" "}
                        {(application.interviewRounds || []).length}
                    </p>

                    {[...(application.interviewRounds || [])]
                        .sort(
                            (a, b) =>
                                new Date(a.date) -
                                new Date(b.date)
                        )
                        .map((round) => (
                            <div
                                key={round._id}
                                className={`round-item ${round.status.toLowerCase()}`}
                            >
                                <div className="round-content">
                                    <div>
                                        {round.title} •{" "}
                                        {round.status}
                                    </div>

                                    {round.date && (
                                        <small className="round-date">
                                            {new Date(
                                                round.date
                                            ).toLocaleDateString(
                                                "en-GB",
                                                {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
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

                                            setSelectedRound(round);

                                            setShowDeleteRoundModal(
                                                true
                                            );
                                        }}
                                    >
                                        ✖
                                    </button>
                                </div>
                            </div>
                        ))}

                    <p>
                        Last Updated:{" "}
                        {new Date(
                            application.updatedAt
                        ).toLocaleString()}
                    </p>

                    <div className="card-actions">
                        {application.applicationUrl && (
                            <a
                                href={
                                    application.applicationUrl.startsWith(
                                        "http"
                                    )
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
                                setApplicationToDeleteId(
                                    application._id
                                );

                                setShowDeleteModal(true);
                            }}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ApplicationList;