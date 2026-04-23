import React from "react";
import {
  Calendar,
  CheckCircle2,
  MessageSquare,
  Paperclip,
  AlertCircle,
  ArrowRight,
  Clock,
  User,
  History,
} from "lucide-react";

const PRIORITY_STYLES = {
  high: {
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-100",
    dot: "bg-red-500",
    accent: "bg-red-500",
  },
  medium: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-100",
    dot: "bg-amber-500",
    accent: "bg-amber-500",
  },
  low: {
    bg: "bg-slate-50",
    text: "text-slate-600",
    border: "border-slate-100",
    dot: "bg-slate-400",
    accent: "bg-slate-400",
  },
};

const STATUS_STYLES = {
  pending: { bg: "bg-slate-100", text: "text-slate-500", label: "Pending" },
  in_progress: { bg: "bg-indigo-50", text: "text-indigo-600", label: "In Progress" },
  completed: { bg: "bg-green-50", text: "text-green-600", label: "Completed" },
  overdue: { bg: "bg-red-50", text: "text-red-600", label: "Overdue" },
};

const Avatar = ({ name, colorClass = "bg-slate-100 text-slate-500" }) => {
  const initial = name && name.length > 0 ? name.trim().charAt(0).toUpperCase() : "?";
  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-sm shrink-0 ${colorClass}`}
      title={name}
    >
      {initial}
    </div>
  );
};

const TaskCard = ({
  task,
  isAccepted = false,
  isCompleted = false,
  onAccept,
  onStart,
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

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const dueLabel = formatDate(task.due_date);
  const createdAt = formatDate(task.created_at);
  const updatedAt = formatDate(task.updated_at);

  const assignees = Array.isArray(task.assigned_to) ? task.assigned_to : [];
  const assigneeNames = assignees.length
    ? assignees
        .map((user) => user.full_name || user.username)
        .filter(Boolean)
        .join(", ")
    : "Unassigned";

  const assignedByName =
    task.assigned_by?.full_name || task.assigned_by?.username || "—";

  return (
    <div
      className={`group relative bg-white rounded-2xl border ${
        isOverdue ? "border-red-200 bg-red-50/30" : "border-slate-200"
      } hover:shadow-xl hover:shadow-slate-200/40 hover:border-indigo-200 transition-all duration-300 flex flex-col h-full overflow-hidden`}
    >
      {/* Priority Accent Bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-1.5 ${
          isOverdue ? "bg-red-500" : pStyles.accent
        } transition-colors duration-300`}
      />

      <div className="p-5 flex flex-col flex-1 gap-4">
        {/* Header: Priority & Status */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${pStyles.bg} ${pStyles.text} ${pStyles.border}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${pStyles.dot}`} />
              {priority}
            </span>
            {isOverdue && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white border border-red-500 uppercase tracking-wider shadow-sm">
                <AlertCircle className="w-3 h-3" />
                Overdue
              </span>
            )}
          </div>
          <span
            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg uppercase tracking-wider ${sStyles.bg} ${sStyles.text} border border-transparent`}
          >
            {sStyles.label}
          </span>
        </div>

        {/* Title & Description */}
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-[13px] text-slate-500 line-clamp-2 leading-relaxed font-normal">
              {task.description}
            </p>
          )}
        </div>

        {/* Assignees Section */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar
                name={assigneeNames}
                colorClass="bg-indigo-500 text-white"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-0.5">
                  Assigned To
                </span>
                <span className="text-[12px] font-semibold text-slate-700 truncate">
                  {assigneeNames}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 min-w-0 text-right">
              <div className="flex flex-col min-w-0 items-end">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-0.5">
                  Assigned By
                </span>
                <span className="text-[12px] font-semibold text-slate-700 truncate">
                  {assignedByName}
                </span>
              </div>
              <Avatar name={assignedByName} colorClass="bg-white text-slate-500 border-slate-200" />
            </div>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400">
              <Calendar className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Deadline
              </span>
            </div>
            <div
              className={`text-[12px] font-bold ${
                isOverdue ? "text-red-600" : "text-slate-700"
              }`}
            >
              {dueLabel}
            </div>
          </div>
          <div className="h-px bg-slate-200/50 w-full" />
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-[9px] font-bold uppercase tracking-wider">
                  Created
                </span>
              </div>
              <div className="text-[11px] font-medium text-slate-600">
                {createdAt}
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-slate-400">
                <History className="w-3.5 h-3.5" />
                <span className="text-[9px] font-bold uppercase tracking-wider">
                  Updated
                </span>
              </div>
              <div className="text-[11px] font-medium text-slate-600">
                {updatedAt}
              </div>
            </div>
          </div>
        </div>

        {/* Activity & Ownership */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex items-center gap-3">
            {task.comments_count > 0 && (
              <div
                className="flex items-center gap-1.5 text-slate-500"
                title="Comments"
              >
                <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-[11px] font-bold">
                  {task.comments_count}
                </span>
              </div>
            )}
            {task.attachments_count > 0 && (
              <div
                className="flex items-center gap-1.5 text-slate-500"
                title="Attachments"
              >
                <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[11px] font-bold">
                  {task.attachments_count}
                </span>
              </div>
            )}
          </div>
          {ownershipLabel && (
            <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 uppercase tracking-wider">
              {ownershipLabel}
            </span>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-5 pb-5 pt-0">
        <div className="flex items-center gap-2">
          {!isAccepted && !isCompleted && showAcceptButton && (
            <>
              <button
                onClick={() => onCollaborate && onCollaborate(task, "comments")}
                className="flex items-center justify-center px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider text-slate-500 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all w-1/3"
              >
                Details
              </button>
              <button
                onClick={() => onAccept && onAccept(task)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-[12px] font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-indigo-100 hover:shadow-lg hover:shadow-indigo-200"
              >
                <CheckCircle2 className="w-4 h-4" />
                {task.user ? "Accept" : "Claim"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {!isAccepted && !isCompleted && !showAcceptButton && (
            <button
              onClick={() => onCollaborate && onCollaborate(task, "comments")}
              className="w-full flex items-center justify-center gap-2.5 px-5 py-3 bg-white border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-600 text-[12px] font-bold uppercase tracking-wider rounded-xl transition-all"
            >
              <MessageSquare className="w-4 h-4 text-indigo-500" />
              View Full Details
            </button>
          )}

          {isAccepted && !isCompleted && (
            <>
              <div className="flex gap-2 w-1/3">
                <button
                  onClick={() =>
                    onCollaborate && onCollaborate(task, "comments")
                  }
                  className="flex-1 relative flex items-center justify-center p-2.5 text-slate-500 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all"
                  title="Discussion"
                >
                  <MessageSquare className="w-4 h-4" />
                  {task.comments_count > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                      {task.comments_count > 9 ? "9+" : task.comments_count}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => onCollaborate && onCollaborate(task, "files")}
                  className="flex-1 relative flex items-center justify-center p-2.5 text-slate-500 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all"
                  title="Files"
                >
                  <Paperclip className="w-4 h-4" />
                  {task.attachments_count > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-slate-400 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                      {task.attachments_count > 9
                        ? "9+"
                        : task.attachments_count}
                    </span>
                  )}
                </button>
              </div>
              <button
                onClick={() => onComplete && onComplete(task.id)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white text-[12px] font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-green-100 hover:shadow-lg hover:shadow-green-200"
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
                className="flex items-center justify-center px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider text-slate-500 bg-white border border-slate-200 rounded-xl transition-all hover:bg-slate-50 w-1/3"
              >
                View
              </button>
              <div className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-50 text-green-600 text-[12px] font-bold uppercase tracking-wider rounded-xl border border-green-100 shadow-sm shadow-green-50">
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
