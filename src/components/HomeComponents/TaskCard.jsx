import React from "react";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  MessageSquare,
  Paperclip,
  Users,
} from "lucide-react";

const PRIORITY_STYLES = {
  high: {
    bg: "bg-rose-50",
    text: "text-rose-600",
    border: "border-rose-100",
    dot: "bg-rose-500",
    accent: "from-rose-500 via-pink-500 to-orange-400",
    glow: "group-hover:shadow-rose-500/15",
  },
  medium: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-100",
    dot: "bg-amber-500",
    accent: "from-amber-400 via-orange-400 to-pink-400",
    glow: "group-hover:shadow-amber-500/15",
  },
  low: {
    bg: "bg-slate-50",
    text: "text-slate-600",
    border: "border-slate-200",
    dot: "bg-slate-400",
    accent: "from-sky-400 via-slate-400 to-emerald-400",
    glow: "group-hover:shadow-sky-500/10",
  },
};

const STATUS_STYLES = {
  pending: {
    bg: "bg-slate-50",
    text: "text-slate-600",
    border: "border-slate-200",
    label: "Pending",
  },
  in_progress: {
    bg: "bg-pink-50",
    text: "text-pink-600",
    border: "border-pink-200",
    label: "In Progress",
  },
  completed: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-200",
    label: "Completed",
  },
  overdue: {
    bg: "bg-rose-50",
    text: "text-rose-600",
    border: "border-rose-200",
    label: "Overdue",
  },
};

const Avatar = ({ name, colorClass = "bg-slate-100 text-slate-600" }) => {
  const initial =
    name && name.length > 0 ? name.trim().charAt(0).toUpperCase() : "?";

  return (
    <div
      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm shrink-0 transition-transform duration-300 group-hover:scale-105 ${colorClass}`}
      title={name}
    >
      {initial}
    </div>
  );
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getDaysLeftLabel = (dateStr, isOverdue) => {
  if (!dateStr) return "No due date";

  const today = new Date();
  const due = new Date(dateStr);
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  const days = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

  if (isOverdue) {
    const lateDays = Math.abs(days);
    return `${lateDays} day${lateDays === 1 ? "" : "s"} late`;
  }
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `${days} days left`;
};

const TaskCard = ({
  task,
  isAccepted = false,
  isCompleted = false,
  onAccept,
  onComplete,
  onCollaborate,
  ownershipLabel = null,
  showAcceptButton = true,
}) => {
  if (!task) return null;

  const priority = (task.priority || "medium").toLowerCase();
  const status = (task.status || "pending").toLowerCase();
  const isOverdue =
    task.due_date &&
    new Date(task.due_date) < new Date() &&
    status !== "completed";

  const pStyles = PRIORITY_STYLES[priority] || PRIORITY_STYLES.medium;
  const sStyles = isOverdue
    ? STATUS_STYLES.overdue
    : STATUS_STYLES[status] || STATUS_STYLES.pending;

  const assignees = Array.isArray(task.assigned_to) ? task.assigned_to : [];
  const assigneeNames = assignees.length
    ? assignees
        .map((user) => user.full_name || user.username)
        .filter(Boolean)
        .join(", ")
    : "Unassigned";
  const assignedByName =
    task.assigned_by?.full_name || task.assigned_by?.username || "-";
  const dueLabel = formatDate(task.due_date);
  const createdAt = formatDate(task.created_at);
  const daysLeftLabel = getDaysLeftLabel(task.due_date, isOverdue);
  const hasActivity = task.comments_count > 0 || task.attachments_count > 0;

  return (
    <div
      className={`group relative bg-white rounded-lg border ${
        isOverdue ? "border-rose-200" : "border-slate-200"
      } shadow-sm ${pStyles.glow} hover:shadow-xl hover:border-slate-300 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full min-w-0 overflow-hidden cursor-default`}
    >
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
          isOverdue ? "from-rose-500 via-pink-500 to-red-400" : pStyles.accent
        } transition-all duration-300 group-hover:h-1.5`}
      />

      <div className="p-4 sm:p-5 flex flex-col flex-1 gap-4 pt-6">
        <div className="flex flex-col min-[380px]:flex-row min-[380px]:items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold capitalize border transition-colors duration-300 ${pStyles.bg} ${pStyles.text} ${pStyles.border}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${pStyles.dot} ${
                  priority === "high" ? "animate-pulse" : ""
                }`}
              />
              {priority}
            </span>
            {isOverdue && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200 animate-pulse">
                <AlertCircle className="w-3 h-3" />
                Overdue
              </span>
            )}
          </div>
          <span
            className={`w-fit text-xs font-bold px-2.5 py-1 rounded-md border transition-colors duration-300 ${sStyles.bg} ${sStyles.text} ${sStyles.border}`}
          >
            {sStyles.label}
          </span>
        </div>

        <div className="space-y-2 min-w-0">
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug group-hover:text-pink-600 transition-colors duration-300 line-clamp-2 break-words">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-slate-500 line-clamp-2 leading-6 break-words">
              {task.description}
            </p>
          )}
        </div>

        <div className="rounded-lg bg-slate-50/80 px-3 py-3 ring-1 ring-slate-100 transition-colors duration-300 group-hover:bg-white">
          <div className="grid grid-cols-1 min-[420px]:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] min-[420px]:items-center gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar name={assigneeNames} colorClass="bg-pink-500 text-white" />
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] text-slate-400 font-bold leading-none mb-1">
                  Assignee
                </span>
                <span className="text-sm font-semibold text-slate-700 truncate" title={assigneeNames}>
                  {assigneeNames}
                </span>
              </div>
            </div>
            <div className="hidden min-[420px]:block w-px h-8 bg-slate-200 mx-1" />
            <div className="flex items-center gap-3 min-w-0 min-[420px]:justify-end min-[420px]:text-right">
              <div className="flex flex-col min-w-0 min-[420px]:items-end">
                <span className="text-[11px] text-slate-400 font-bold leading-none mb-1">
                  Owner
                </span>
                <span className="max-w-full text-sm font-semibold text-slate-700 truncate" title={assignedByName}>
                  {assignedByName}
                </span>
              </div>
              <Avatar
                name={assignedByName}
                colorClass="bg-white text-slate-600 border-slate-200"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-3 pt-1 mt-auto">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-xs font-bold">
                Due Date
              </span>
            </div>
            <div
              className={`text-sm font-bold ${
                isOverdue ? "text-rose-600" : "text-slate-700"
              }`}
            >
              {dueLabel}
            </div>
            <span
              className={`text-[11px] font-semibold ${
                isOverdue ? "text-rose-500" : "text-slate-400"
              }`}
            >
              {daysLeftLabel}
            </span>
          </div>
          <div className="flex flex-col gap-1 min-[380px]:items-end min-[380px]:text-right">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-xs font-bold">
                Created
              </span>
            </div>
            <div className="text-sm font-semibold text-slate-600 truncate">
              {createdAt}
            </div>
          </div>
        </div>

        <div className="flex flex-col min-[420px]:flex-row min-[420px]:items-center justify-between gap-3 border-t border-slate-100 pt-3">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1 ring-1 ring-slate-100">
              <MessageSquare className="w-3.5 h-3.5 text-pink-500" />
              {task.comments_count || 0}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1 ring-1 ring-slate-100">
              <Paperclip className="w-3.5 h-3.5 text-slate-500" />
              {task.attachments_count || 0}
            </span>
            {!hasActivity && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                <Users className="w-3.5 h-3.5" />
                Ready for action
              </span>
            )}
          </div>
          {ownershipLabel && (
            <span className="w-fit text-xs font-bold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-md border border-pink-100">
              {ownershipLabel}
            </span>
          )}
        </div>
      </div>

      <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0">
        <div className="flex flex-col min-[420px]:flex-row items-stretch gap-2.5">
          {!isAccepted && !isCompleted && showAcceptButton && (
            <>
              <button
                onClick={() => onCollaborate && onCollaborate(task, "comments")}
                className="w-full min-[420px]:w-1/3 min-w-[7rem] flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-slate-800 border border-slate-200 hover:border-slate-300 rounded-lg transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-pink-200"
              >
                <MessageSquare className="w-4 h-4" />
                Details
              </button>
              <button
                onClick={() => onAccept && onAccept(task)}
                className="w-full min-[420px]:flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-sm font-bold rounded-lg transition-all duration-200 active:scale-[0.98] shadow-md shadow-pink-200 hover:shadow-lg hover:shadow-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-200"
              >
                <CheckCircle2 className="w-4 h-4" />
                {task.user ? "Accept" : "Claim"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </>
          )}

          {!isAccepted && !isCompleted && !showAcceptButton && (
            <button
              onClick={() => onCollaborate && onCollaborate(task, "comments")}
              className="w-full flex items-center justify-center gap-2.5 px-5 py-2.5 bg-white border border-slate-200 hover:border-pink-300 hover:bg-pink-50 hover:text-pink-600 text-slate-600 text-sm font-bold rounded-lg transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-pink-200"
            >
              <MessageSquare className="w-4 h-4 text-pink-500" />
              View Full Details
              <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          )}

          {isAccepted && !isCompleted && (
            <>
              <div className="flex gap-2.5 w-full min-[420px]:w-1/3 min-w-[7rem]">
                <button
                  onClick={() =>
                    onCollaborate && onCollaborate(task, "comments")
                  }
                  className="flex-1 relative flex items-center justify-center p-2.5 text-slate-500 bg-slate-50 hover:bg-pink-50 hover:text-pink-600 border border-slate-200 hover:border-pink-200 rounded-lg transition-all duration-200 active:scale-[0.95] focus:outline-none focus:ring-2 focus:ring-pink-200"
                  title="Discussion"
                >
                  <MessageSquare className="w-4 h-4" />
                  {task.comments_count > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-pink-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                      {task.comments_count > 9 ? "9+" : task.comments_count}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => onCollaborate && onCollaborate(task, "files")}
                  className="flex-1 relative flex items-center justify-center p-2.5 text-slate-500 bg-slate-50 hover:bg-pink-50 hover:text-pink-600 border border-slate-200 hover:border-pink-200 rounded-lg transition-all duration-200 active:scale-[0.95] focus:outline-none focus:ring-2 focus:ring-pink-200"
                  title="Files"
                >
                  <Paperclip className="w-4 h-4" />
                  {task.attachments_count > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-slate-400 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                      {task.attachments_count > 9
                        ? "9+"
                        : task.attachments_count}
                    </span>
                  )}
                </button>
              </div>
              <button
                onClick={() => onComplete && onComplete(task.id)}
                className="w-full min-[420px]:flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-bold rounded-lg transition-all duration-200 active:scale-[0.98] shadow-md shadow-emerald-200 hover:shadow-lg hover:shadow-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              >
                <CheckCircle2 className="w-4 h-4" />
                Complete
              </button>
            </>
          )}

          {isCompleted && (
            <>
              <button
                onClick={() => onCollaborate && onCollaborate(task, "comments")}
                className="w-full min-[420px]:w-1/3 min-w-[7rem] flex items-center justify-center px-4 py-2.5 text-sm font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg transition-all duration-200 hover:bg-slate-100 hover:text-slate-800 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-200"
              >
                View
              </button>
              <div className="w-full min-[420px]:flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-600 text-sm font-bold rounded-lg border border-emerald-200 shadow-sm cursor-default">
                <CheckCircle2 className="w-4 h-4" />
                Completed
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
