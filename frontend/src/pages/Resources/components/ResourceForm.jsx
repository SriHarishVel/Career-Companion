function ResourceForm({
    editingResourceId,
    newType,
    setNewType,
    newTitle,
    setNewTitle,
    newUrl,
    setNewUrl,
    skillId,
    setSkillId,
    skills,
    errorMsg,
    addResource
}) {
    return (
        <div className="add-resource-card">

            <h3>
                {editingResourceId
                    ? "Edit Resource"
                    : "Add Resource"}
            </h3>

            <select
                value={newType}
                onChange={(e) =>
                    setNewType(e.target.value)
                }
            >
                <option value="Documentation">
                    Documentation
                </option>

                <option value="Course">
                    Course
                </option>

                <option value="Video">
                    Video
                </option>

                <option value="Article">
                    Article
                </option>
            </select>

            <input
                type="text"
                placeholder="Resource Title"
                value={newTitle}
                onChange={(e) =>
                    setNewTitle(e.target.value)
                }
            />

            <input
                type="url"
                placeholder="Resource URL"
                value={newUrl}
                onChange={(e) =>
                    setNewUrl(e.target.value)
                }
            />

            <select
                value={skillId}
                onChange={(e) =>
                    setSkillId(e.target.value)
                }
            >
                <option value="">
                    Related Skill (Optional)
                </option>

                {skills.map(skill => (
                    <option
                        key={skill._id}
                        value={skill._id}
                    >
                        {skill.name}
                    </option>
                ))}
            </select>

            {errorMsg && (
                <p className="error">
                    {errorMsg}
                </p>
            )}

            <button onClick={addResource}>
                {editingResourceId
                    ? "Update Resource"
                    : "Add Resource"}
            </button>

        </div>
    );
}

export default ResourceForm;