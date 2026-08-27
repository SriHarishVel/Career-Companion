function ResourceSkill({ skill, onSkillClick }) {
  return (
    <section className="resource-skill-section">
      <div className="resource-section-header">
        <span className="resource-section-label">Related Skill</span>

        <h2>Skill Connection</h2>
      </div>

      {skill && skill._id ? (
        <button
          type="button"
          className="resource-skill-card"
          onClick={() => onSkillClick(skill._id)}
        >
          <div className="resource-skill-content">
            <span className="resource-skill-name">{skill.name}</span>

            {skill.level && (
              <span className="resource-skill-level">{skill.level}</span>
            )}

            {skill.category && (
              <span className="resource-skill-category">{skill.category}</span>
            )}
          </div>

          <span className="resource-skill-arrow" aria-hidden="true">
            →
          </span>
        </button>
      ) : (
        <div className="resource-no-skill">
          <h3>No Skill Linked</h3>

          <p>This resource is not currently connected to a skill.</p>
        </div>
      )}
    </section>
  );
}

export default ResourceSkill;
