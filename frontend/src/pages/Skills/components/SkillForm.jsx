function SkillForm({
    editingSkillId,
    newSkill,
    setNewSkill,
    newCategory,
    setNewCategory,
    secondaryGoalId,
    setSecondaryGoalId,
    secondaryGoalOptions,
    newResource,
    setNewResource,
    errorMsg,
    addSkill,
    handleCancelEdit,
    skillFormRef,
}) {
    return (
        <div className="add-skill-card" ref={skillFormRef}>

            <h3>
                {editingSkillId
                    ? "Edit Skill"
                    : "Add Skill"}
            </h3>

            <input
                type="text"
                placeholder={
                    editingSkillId
                        ? "Edit Skill"
                        : "Add Skill"
                }
                value={newSkill}
                onChange={(e) => {
                    setNewSkill(e.target.value);
                }}
            />

            <select
                value={newCategory}
                onChange={(e) =>
                    setNewCategory(e.target.value)
                }
            >
                <option value="Programming">
                    Programming
                </option>
                <option value="Database">
                    Database
                </option>
                <option value="Framework">
                    Framework
                </option>
                <option value="Tools">
                    Tools
                </option>
                <option value="Soft Skills">
                    Soft Skills
                </option>
                <option value="Other">
                    Other
                </option>
            </select>

            {errorMsg && (
                <p className="error">
                    {errorMsg}
                </p>
            )}

            <select
                value={secondaryGoalId}
                onChange={(e) =>
                    setSecondaryGoalId(e.target.value)
                }
            >
                <option value="">
                    Related Goal (Optional)
                </option>

                {secondaryGoalOptions.map((goal) => (
                    <option
                        key={goal._id}
                        value={goal._id}
                    >
                        {goal.title}
                    </option>
                ))}
            </select>

            <input
                type="url"
                placeholder="Learning Resource URL (Optional)"
                value={newResource}
                onChange={(e) =>
                    setNewResource(e.target.value)
                }
            />

            <button onClick={addSkill}>
                {editingSkillId
                    ? "Update Skill"
                    : "Add Skill"}
            </button>

            {editingSkillId && (
                <button
                    className="cancel-btn"
                    onClick={handleCancelEdit}
                >
                    Cancel Edit
                </button>
            )}

        </div>
    );
}

export default SkillForm;