import { useNavigate } from "react-router-dom";

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function ReminderList({ reminders, onReminderClick }) {
  return (
    <div className="dashboard-list">
      {reminders.map((reminder) => (
        <button
          key={`${reminder.applicationId}-${reminder.activityId}`}
          type="button"
          className="dashboard-list-item dashboard-reminder-item"
          onClick={() => onReminderClick(reminder.applicationId)}
        >
          <div>
            <h3>{reminder.title}</h3>

            <p>
              {reminder.role} at {reminder.company}
            </p>

            {reminder.description && <p>{reminder.description}</p>}
          </div>

          <strong>{formatDate(reminder.date)}</strong>
        </button>
      ))}
    </div>
  );
}

function FollowUpReminders({ followUpReminders }) {
  const navigate = useNavigate();

  const { overdue, today, upcoming } = followUpReminders;

  const hasReminders =
    overdue.length > 0 || today.length > 0 || upcoming.length > 0;

  if (!hasReminders) {
    return null;
  }

  const handleReminderClick = (applicationId) => {
    navigate(`/applications/${applicationId}`);
  };

  return (
    <div className="dashboard-section">
      <h2>Follow-up Reminders</h2>

      {overdue.length > 0 && (
        <div>
          <h3>Overdue</h3>

          <ReminderList
            reminders={overdue}
            onReminderClick={handleReminderClick}
          />
        </div>
      )}

      {today.length > 0 && (
        <div>
          <h3>Today</h3>

          <ReminderList
            reminders={today}
            onReminderClick={handleReminderClick}
          />
        </div>
      )}

      {upcoming.length > 0 && (
        <div>
          <h3>Upcoming</h3>

          <ReminderList
            reminders={upcoming}
            onReminderClick={handleReminderClick}
          />
        </div>
      )}
    </div>
  );
}

export default FollowUpReminders;