function SkillActions({ skill, onEdit, onUpdateProgress, onDelete, deleting }) {
  const progress = Number(skill.progress) || 0;
  const progressComplete = progress >= 100;

  return (
    <section className="skill-detail-actions">
      <button
        type="button"
        className="skill-action-primary"
        onClick={onUpdateProgress}
        disabled={progressComplete}
      >
        {progressComplete ? "Progress Complete" : "Update Progress"}
      </button>

      <button type="button" className="skill-action-secondary" onClick={onEdit}>
        Edit Skill
      </button>

      <button
        type="button"
        className="skill-action-danger"
        onClick={onDelete}
        disabled={deleting}
      >
        {deleting ? "Deleting..." : "Delete Skill"}
      </button>
    </section>
  );
}

export default SkillActions;
