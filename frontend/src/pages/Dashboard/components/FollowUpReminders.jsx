import { useNavigate } from "react-router-dom";

function formatDate(date) {
  const parsedDate = new Date(date);

  if (!date || Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function ReminderList({ reminders, onReminderClick, showOverdueDays = false }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="dashboard-list">
      {reminders.map((reminder) => {
        const reminderDate = new Date(reminder.date);
        const hasValidDate =
          Boolean(reminder.date) && !Number.isNaN(reminderDate.getTime());

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (hasValidDate) {
          reminderDate.setHours(0, 0, 0, 0);
        }

        const overdueDays =
          showOverdueDays && hasValidDate
            ? Math.max(
                0,
                Math.floor(
                  (today.getTime() - reminderDate.getTime()) /
                    (1000 * 60 * 60 * 24),
                ),
              )
            : null;

        return (
          <button
            key={`${reminder.applicationId}-${reminder.activityId}`}
            type="button"
            className={`dashboard-list-item dashboard-reminder-item ${
              showOverdueDays ? "dashboard-reminder-overdue" : ""
            }`}
            onClick={() => onReminderClick(reminder.applicationId)}
          >
            <div>
              <h3>{reminder.title}</h3>

              <p>
                {reminder.role} at {reminder.company}
              </p>

              {reminder.description && <p>{reminder.description}</p>}

              {showOverdueDays && (
                <p className="dashboard-reminder-urgency">
                  {overdueDays === null
                    ? "Overdue — date unavailable"
                    : `${overdueDays} ${
                        overdueDays === 1 ? "day" : "days"
                      } overdue`}
                </p>
              )}
            </div>

            <strong>{formatDate(reminder.date)}</strong>
          </button>
        );
      })}
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
          <h3>Overdue ({overdue.length})</h3>

          <ReminderList
            reminders={overdue}
            onReminderClick={handleReminderClick}
            showOverdueDays
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
