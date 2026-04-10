import React from "react";
import {
  Calendar,
  CheckCircle2,
  Play,
  MessageSquare,
  User,
  Paperclip,
  AlertCircle,
  Clock,
  ArrowRight,
} from "lucide-react";

const PRIORITY_STYLES = {
  high: {
    card: "border-rose-200",
    stripe: "bg-rose-500",
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
  },
  medium: {
    card: "border-amber-200",
    stripe: "bg-amber-400",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-400",
  },
  low: {
    card: "border-emerald-200",
    stripe: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
};

const STATUS_STYLES = {
  pending: { badge: "bg-slate-100 text-slate-600", label: "Pending" },
  in_progress: { badge: "bg-blue-100 text-blue-700", label: "In Progress" },
  completed: { badge: "bg-emerald-100 text-emerald-700", label: "Completed" },
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
  const pStyles = PRIORITY_STYLES[priority] || PRIORITY_STYLES.medium;
  const sStyles = STATUS_STYLES[status] || STATUS_STYLES.pending;

  const isOverdue =
    task.due_date &&
    new Date(task.due_date) < new Date() &&
    status !== "completed";
  const dueLabel = task.due_date
    ? new Date(task.due_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "No deadline";
  const assigneeName = task.user?.full_name || task.user?.username;
  const assigneeInitial = assigneeName
    ? assigneeName.charAt(0).toUpperCase()
    : "?";

  return (
    <div
      className={`group relative bg-white rounded-xl border ${pStyles.card} overflow-hidden flex flex-col w-full`}
    >
      {/* Priority stripe on the left */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${pStyles.stripe}`}
      />

      {/* Card Body - Tighter padding and gaps for reduced size */}
      <div className="p-3.5 pl-4 flex flex-col gap-2.5 flex-1">
        {/* Row 1: Priority badge + Assignee */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span
            className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md border ${pStyles.badge}`}
          >
            <span className={`w-1 h-1 rounded-full ${pStyles.dot}`} />
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </span>

          <div className="flex items-center gap-1.5">
            <div
              className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black border ${
                task.user
                  ? "bg-gradient-to-br from-pink-500 to-rose-600 text-white border-pink-300"
                  : "bg-slate-100 text-slate-400 border-slate-200"
              }`}
            >
              {assigneeInitial}
            </div>
            <span className="text-[10px] font-semibold text-slate-500 max-w-[80px] sm:max-w-[100px] truncate">
              {assigneeName || "Unassigned"}
            </span>
          </div>
        </div>

        {/* Row 2: Title + Description */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 leading-tight group-hover:text-pink-600 transition-colors line-clamp-2">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}
        </div>

        {/* Row 2.5: Ownership Information */}
        {ownershipLabel && (
          <div className="flex items-center gap-1.5 text-[9px] font-semibold flex-wrap">
            <span className="text-slate-400 uppercase tracking-wider">
              Ownership:
            </span>
            <span className="text-slate-600">{ownershipLabel}</span>
          </div>
        )}

        {/* Row 3: Creator and Assignee Info */}
        <div className="flex items-center justify-between gap-2 text-[9px] flex-wrap">
          <div className="flex items-center gap-1">
            <span className="text-slate-400 font-medium">Created by:</span>
            <span className="text-slate-600 font-semibold truncate max-w-[80px]">
              {task.user?.full_name || task.user?.username || "Unknown"}
            </span>
          </div>
          {task.assigned_by && (
            <div className="flex items-center gap-1">
              <span className="text-slate-400 font-medium">Assigned by:</span>
              <span className="text-slate-600 font-semibold truncate max-w-[80px]">
                {task.assigned_by?.full_name ||
                  task.assigned_by?.username ||
                  "Unknown"}
              </span>
            </div>
          )}
        </div>

        {/* Row 4: Activity Preview (if any) */}
        {(task.comments_count > 0 || task.attachments_count > 0) && (
          <div className="flex flex-wrap items-center gap-2 px-2 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
            {task.comments_count > 0 && (
              <div className="flex items-center gap-1 text-[9px] font-bold text-slate-500">
                <MessageSquare className="w-2.5 h-2.5 text-pink-400" />
                {task.comments_count}
              </div>
            )}
            {task.attachments_count > 0 && (
              <div className="flex items-center gap-1 text-[9px] font-bold text-slate-500">
                <Paperclip className="w-2.5 h-2.5 text-blue-400" />
                {task.attachments_count}
              </div>
            )}
            {task.last_message_preview && (
              <p className="text-[9px] text-slate-400 italic truncate flex-1 border-l border-slate-200 pl-1.5 min-w-[100px]">
                <span className="font-bold not-italic text-slate-500">
                  {task.last_message_preview.user}:
                </span>{" "}
                "{task.last_message_preview.content}"
              </p>
            )}
          </div>
        )}

        {/* Row 5: Due Date + Status */}
        <div className="flex items-center justify-between mt-auto flex-wrap gap-2 pt-1">
          <div
            className={`flex items-center gap-1 text-[11px] font-medium ${
              isOverdue ? "text-rose-600" : "text-slate-400"
            }`}
          >
            {isOverdue ? (
              <AlertCircle className="w-3 h-3" />
            ) : (
              <Calendar className="w-3 h-3" />
            )}
            <span>
              {isOverdue ? "Overdue · " : ""}
              {dueLabel}
            </span>
          </div>
          <span
            className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${sStyles.badge}`}
          >
            {sStyles.label}
          </span>
        </div>
      </div>

      {/* Card Footer: Actions - flex-wrap added for tiny screens */}
      <div className="border-t border-slate-100 p-2.5 bg-slate-50/50">
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5">
          {/* Unaccepted Task: View Details + Accept/Claim */}
          {!isAccepted && !isCompleted && showAcceptButton && (
            <>
              <button
                onClick={() => onCollaborate && onCollaborate(task, "comments")}
                type="button"
                className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-[11px] font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors w-full sm:w-auto"
              >
                <MessageSquare className="w-3 h-3" />
                Details
              </button>
              <button
                onClick={() => onAccept && onAccept(task)}
                type="button"
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-pink-600 hover:bg-pink-700 text-white text-[11px] font-bold rounded-lg transition-colors w-full sm:w-auto shadow-sm shadow-pink-200"
              >
                <CheckCircle2 className="w-3 h-3" />
                {task.user ? "Accept" : "Claim"}
                <ArrowRight className="w-3 h-3" />
              </button>
            </>
          )}

          {/* Task Details Button (when accept button is hidden) */}
          {!isAccepted && !isCompleted && !showAcceptButton && (
            <button
              onClick={() => onCollaborate && onCollaborate(task, "comments")}
              type="button"
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-bold rounded-lg transition-colors"
            >
              <MessageSquare className="w-3 h-3" />
              View Details
            </button>
          )}

          {/* Active Task: Start + Complete + Discussion + Files */}
          {isAccepted && !isCompleted && (
            <>
              <div className="flex gap-1.5 w-full sm:w-auto">
                <button
                  onClick={() =>
                    onCollaborate && onCollaborate(task, "comments")
                  }
                  type="button"
                  className="flex-1 sm:flex-none relative flex items-center justify-center px-2.5 py-1.5 text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
                  title="Discussion"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  {task.comments_count > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-pink-500 text-white text-[8px] font-black rounded-full flex items-center justify-center">
                      {task.comments_count > 9 ? "9+" : task.comments_count}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => onCollaborate && onCollaborate(task, "files")}
                  type="button"
                  className="flex-1 sm:flex-none relative flex items-center justify-center px-2.5 py-1.5 text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
                  title="Files"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  {task.attachments_count > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-blue-500 text-white text-[8px] font-black rounded-full flex items-center justify-center">
                      {task.attachments_count > 9
                        ? "9+"
                        : task.attachments_count}
                    </span>
                  )}
                </button>
              </div>
              <button
                onClick={() => onComplete && onComplete(task.id)}
                type="button"
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition-colors w-full sm:w-auto shadow-sm shadow-emerald-200"
              >
                <CheckCircle2 className="w-3 h-3" />
                Complete
              </button>
            </>
          )}

          {/* Completed Task */}
          {isCompleted && (
            <>
              <button
                onClick={() => onCollaborate && onCollaborate(task, "comments")}
                type="button"
                className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-[11px] font-bold text-slate-500 bg-white border border-slate-200 rounded-lg transition-colors hover:bg-slate-50 w-full sm:w-auto"
              >
                <MessageSquare className="w-3 h-3" />
                View
              </button>
              <div className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-lg border border-emerald-200 w-full sm:w-auto">
                <CheckCircle2 className="w-3 h-3" />
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