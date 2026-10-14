import TargetRoleCard from "./TargetRoleCard";

function TargetRoleList({
  roles,
  readinessByRole,
  readinessLoading,
  deleting,
  onViewDetails,
  onEdit,
  onDelete,
}) {
  return (
    <section className="target-role-analysis">
      <div className="target-role-analysis-heading">
        <div>
          <h2>Your target roles</h2>
        </div>
      </div>

      <div className="target-roles-grid">
        {roles.map((role) => (
          <TargetRoleCard
            key={role._id}
            role={role}
            readiness={readinessByRole.get(role._id)}
            readinessLoading={readinessLoading}
            deleting={deleting}
            onViewDetails={onViewDetails}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}

export default TargetRoleList;