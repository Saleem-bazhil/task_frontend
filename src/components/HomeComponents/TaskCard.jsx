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
      className={`group relative bg-white rounded-2xl border ${pStyles.card} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col`}
    >
      {/* Priority stripe on the left */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${pStyles.stripe} rounded-l-2xl`}
      />

      {/* Card Body */}
      <div className="pl-5 pr-5 pt-5 pb-4 flex flex-col gap-3 flex-1">
        {/* Row 1: Priority badge + Assignee */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border ${pStyles.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${pStyles.dot}`} />
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </span>

          <div className="flex items-center gap-1.5">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black shadow-sm border ${
                task.user
                  ? "bg-gradient-to-br from-pink-500 to-rose-600 text-white border-pink-300"
                  : "bg-slate-100 text-slate-400 border-slate-200"
              }`}
            >
              {assigneeInitial}
            </div>
            <span className="text-[11px] font-semibold text-slate-500 max-w-[100px] truncate">
              {assigneeName || "Unassigned"}
            </span>
          </div>
        </div>

        {/* Row 2: Title + Description */}
        <div>
          <h3 className="text-base font-bold text-slate-800 leading-tight group-hover:text-pink-600 transition-colors line-clamp-2">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}
        </div>

        {/* Row 2.5: Ownership Information */}
        {ownershipLabel && (
          <div className="flex items-center gap-2 text-[10px] font-semibold">
            <span className="text-slate-400 uppercase tracking-wider">
              Ownership:
            </span>
            <span className="text-slate-600">{ownershipLabel}</span>
          </div>
        )}

        {/* Row 3: Creator and Assignee Info */}
        <div className="flex items-center justify-between gap-2 text-[10px]">
          <div className="flex items-center gap-1">
            <span className="text-slate-400 font-medium">Created by:</span>
            <span className="text-slate-600 font-semibold">
              {task.user?.full_name || task.user?.username || "Unknown"}
            </span>
          </div>
          {task.assigned_by && (
            <div className="flex items-center gap-1">
              <span className="text-slate-400 font-medium">Assigned by:</span>
              <span className="text-slate-600 font-semibold">
                {task.assigned_by?.full_name ||
                  task.assigned_by?.username ||
                  "Unknown"}
              </span>
            </div>
          )}
        </div>

        {/* Row 4: Activity Preview (if any) */}
        {(task.comments_count > 0 || task.attachments_count > 0) && (
          <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
            {task.comments_count > 0 && (
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                <MessageSquare className="w-3 h-3 text-pink-400" />
                {task.comments_count} msg{task.comments_count !== 1 ? "s" : ""}
              </div>
            )}
            {task.attachments_count > 0 && (
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                <Paperclip className="w-3 h-3 text-blue-400" />
                {task.attachments_count} file
                {task.attachments_count !== 1 ? "s" : ""}
              </div>
            )}
            {task.last_message_preview && (
              <p className="text-[10px] text-slate-400 italic truncate flex-1 border-l border-slate-200 pl-2">
                <span className="font-bold not-italic text-slate-500">
                  {task.last_message_preview.user}:
                </span>{" "}
                "{task.last_message_preview.content}"
              </p>
            )}
          </div>
        )}

        {/* Row 4: Due Date + Status */}
        <div className="flex items-center justify-between mt-auto">
          <div
            className={`flex items-center gap-1.5 text-xs font-medium ${isOverdue ? "text-rose-600" : "text-slate-400"}`}
          >
            {isOverdue ? (
              <AlertCircle className="w-3.5 h-3.5" />
            ) : (
              <Calendar className="w-3.5 h-3.5" />
            )}
            <span>
              {isOverdue ? "Overdue · " : ""}
              {dueLabel}
            </span>
          </div>
          <span
            className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${sStyles.badge}`}
          >
            {sStyles.label}
          </span>
        </div>
      </div>

      {/* Card Footer: Actions */}
      <div className="border-t border-slate-100 px-5 py-3">
        <div className="flex items-center gap-2">
          {/* Unaccepted Task: View Details + Accept/Claim */}
          {!isAccepted && !isCompleted && showAcceptButton && (
            <>
              <button
                onClick={() => onCollaborate && onCollaborate(task, "comments")}
                type="button"
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Details
              </button>
              <button
                onClick={() => onAccept && onAccept(task)}
                type="button"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-pink-200"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {task.user ? "Accept Task" : "Claim Task"}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {/* Task Details Button (when accept button is hidden) */}
          {!isAccepted && !isCompleted && !showAcceptButton && (
            <button
              onClick={() => onCollaborate && onCollaborate(task, "comments")}
              type="button"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              View Details
            </button>
          )}

          {/* Active Task: Start + Complete + Discussion + Files */}
          {isAccepted && !isCompleted && (
            <>
              <button
                onClick={() => onCollaborate && onCollaborate(task, "comments")}
                type="button"
                className="relative flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all"
                title="Discussion"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                {task.comments_count > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                    {task.comments_count > 9 ? "9+" : task.comments_count}
                  </span>
                )}
              </button>
              <button
                onClick={() => onCollaborate && onCollaborate(task, "files")}
                type="button"
                className="relative flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all"
                title="Files"
              >
                <Paperclip className="w-3.5 h-3.5" />
                {task.attachments_count > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                    {task.attachments_count > 9 ? "9+" : task.attachments_count}
                  </span>
                )}
              </button>
              <button
                onClick={() => onComplete && onComplete(task.id)}
                type="button"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-emerald-200"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Mark Complete
              </button>
            </>
          )}

          {/* Completed Task */}
          {isCompleted && (
            <>
              <button
                onClick={() => onCollaborate && onCollaborate(task, "comments")}
                type="button"
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-400 bg-slate-50 border border-slate-100 rounded-xl transition-all hover:bg-slate-100"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                View
              </button>
              <div className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
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
