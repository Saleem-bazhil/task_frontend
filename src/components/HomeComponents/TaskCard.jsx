import React from "react";
import {
  Calendar,
  CheckCircle2,
  MessageSquare,
  Paperclip,
  AlertCircle,
  ArrowRight,
  Clock,
  History,
} from "lucide-react";

const PRIORITY_STYLES = {
  high: {
    bg: "bg-rose-50",
    text: "text-rose-600",
    border: "border-rose-100",
    dot: "bg-rose-500",
  },
  medium: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-100",
    dot: "bg-amber-500",
  },
  low: {
    bg: "bg-slate-50",
    text: "text-slate-600",
    border: "border-slate-200",
    dot: "bg-slate-400",
  },
};

const STATUS_STYLES = {
  pending: { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200", label: "Pending" },
  in_progress: { bg: "bg-pink-50", text: "text-pink-600", border: "border-pink-200", label: "In Progress" },
  completed: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", label: "Completed" },
  overdue: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-200", label: "Overdue" },
};

const Avatar = ({ name, colorClass = "bg-slate-100 text-slate-600" }) => {
  const initial = name && name.length > 0 ? name.trim().charAt(0).toUpperCase() : "?";
  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-sm shrink-0 transition-transform duration-300 group-hover:scale-105 ${colorClass}`}
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
        isOverdue ? "border-rose-200" : "border-slate-200/80"
      } shadow-[0_2px_10px_-3px_rgba(6,81,237,0.03)] hover:shadow-xl hover:shadow-pink-500/10 hover:border-pink-300 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full overflow-hidden cursor-default`}
    >
      {/* Top Accent Line */}
      <div
        className={`absolute top-0 left-0 right-0 h-1.5 ${
          isOverdue 
            ? "bg-gradient-to-r from-rose-400 to-rose-500" 
            : (priority === 'high' 
                ? 'bg-gradient-to-r from-rose-400 to-rose-500' 
                : priority === 'medium' 
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500' 
                  : 'bg-gradient-to-r from-slate-300 to-slate-400')
        } opacity-80 transition-opacity duration-300 group-hover:opacity-100`}
      />

      <div className="p-5 flex flex-col flex-1 gap-4 pt-6">
        {/* Header: Priority & Status */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border transition-colors duration-300 ${pStyles.bg} ${pStyles.text} ${pStyles.border}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${pStyles.dot} ${priority === 'high' ? 'animate-pulse' : ''}`} />
              {priority}
            </span>
            {isOverdue && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200 uppercase tracking-wider animate-pulse">
                <AlertCircle className="w-3 h-3" />
                Overdue
              </span>
            )}
          </div>
          <span
            className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border transition-colors duration-300 ${sStyles.bg} ${sStyles.text} ${sStyles.border}`}
          >
            {sStyles.label}
          </span>
        </div>

        {/* Title & Description */}
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-slate-800 leading-snug group-hover:text-pink-600 transition-colors duration-300 line-clamp-2">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-[13px] text-slate-500 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}
        </div>

        {/* Assignees Section */}
        <div className="flex flex-col gap-2 mt-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50/50 hover:bg-slate-50 p-3 rounded-xl border border-slate-100 gap-3 sm:gap-0 transition-colors duration-300">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar
                name={assigneeNames}
                colorClass="bg-pink-500 text-white"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">
                  Assignee
                </span>
                <span className="text-[12px] font-semibold text-slate-700 truncate">
                  {assigneeNames}
                </span>
              </div>
            </div>
            <div className="hidden sm:block w-px h-8 bg-slate-200/50 mx-2" />
            <div className="flex items-center gap-3 min-w-0 sm:justify-end sm:text-right">
              <div className="flex flex-col min-w-0 sm:items-end">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">
                  Owner
                </span>
                <span className="text-[12px] font-semibold text-slate-700 truncate">
                  {assignedByName}
                </span>
              </div>
              <Avatar name={assignedByName} colorClass="bg-white text-slate-600 border-slate-200" />
            </div>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-100 mt-auto">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Due Date
              </span>
            </div>
            <div
              className={`text-[12px] font-bold ${
                isOverdue ? "text-rose-600" : "text-slate-700"
              }`}
            >
              {dueLabel}
            </div>
          </div>
          <div className="flex flex-col gap-1 sm:items-end sm:text-right">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Created
              </span>
            </div>
            <div className="text-[12px] font-semibold text-slate-600 truncate">
              {createdAt}
            </div>
          </div>
        </div>

        {/* Activity & Ownership */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            {task.comments_count > 0 && (
              <div
                className="flex items-center gap-1.5 text-slate-500 hover:text-pink-500 transition-colors cursor-pointer"
                title="Comments"
              >
                <MessageSquare className="w-4 h-4 text-pink-400" />
                <span className="text-[12px] font-bold">
                  {task.comments_count}
                </span>
              </div>
            )}
            {task.attachments_count > 0 && (
              <div
                className="flex items-center gap-1.5 text-slate-500 hover:text-pink-500 transition-colors cursor-pointer"
                title="Attachments"
              >
                <Paperclip className="w-4 h-4 text-slate-400" />
                <span className="text-[12px] font-bold">
                  {task.attachments_count}
                </span>
              </div>
            )}
          </div>
          {ownershipLabel && (
            <span className="text-[10px] font-bold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-md border border-pink-100 uppercase tracking-wider shadow-sm">
              {ownershipLabel}
            </span>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-5 pb-5 pt-0">
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          {!isAccepted && !isCompleted && showAcceptButton && (
            <>
              <button
                onClick={() => onCollaborate && onCollaborate(task, "comments")}
                className="w-full sm:w-1/3 flex items-center justify-center px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-slate-800 border border-slate-200 hover:border-slate-300 rounded-xl transition-all duration-200 active:scale-[0.98]"
              >
                Details
              </button>
              <button
                onClick={() => onAccept && onAccept(task)}
                className="w-full sm:flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white text-[12px] font-bold uppercase tracking-wider rounded-xl transition-all duration-200 active:scale-[0.98] shadow-md shadow-pink-200 hover:shadow-lg hover:shadow-pink-300"
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
              className="w-full flex items-center justify-center gap-2.5 px-5 py-2.5 bg-white border border-slate-200 hover:border-pink-300 hover:bg-pink-50 hover:text-pink-600 text-slate-600 text-[12px] font-bold uppercase tracking-wider rounded-xl transition-all duration-200 active:scale-[0.98]"
            >
              <MessageSquare className="w-4 h-4 text-pink-500" />
              View Full Details
            </button>
          )}

          {isAccepted && !isCompleted && (
            <>
              <div className="flex gap-2.5 w-full sm:w-1/3">
                <button
                  onClick={() =>
                    onCollaborate && onCollaborate(task, "comments")
                  }
                  className="flex-1 relative flex items-center justify-center p-2.5 text-slate-500 bg-slate-50 hover:bg-pink-50 hover:text-pink-600 border border-slate-200 hover:border-pink-200 rounded-xl transition-all duration-200 active:scale-[0.95]"
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
                  className="flex-1 relative flex items-center justify-center p-2.5 text-slate-500 bg-slate-50 hover:bg-pink-50 hover:text-pink-600 border border-slate-200 hover:border-pink-200 rounded-xl transition-all duration-200 active:scale-[0.95]"
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
                className="w-full sm:flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-[12px] font-bold uppercase tracking-wider rounded-xl transition-all duration-200 active:scale-[0.98] shadow-md shadow-emerald-200 hover:shadow-lg hover:shadow-emerald-300"
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
                className="w-full sm:w-1/3 flex items-center justify-center px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider text-slate-600 bg-slate-50 border border-slate-200 rounded-xl transition-all duration-200 hover:bg-slate-100 hover:text-slate-800 active:scale-[0.98]"
              >
                View
              </button>
              <div className="w-full sm:flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-600 text-[12px] font-bold uppercase tracking-wider rounded-xl border border-emerald-200 shadow-sm cursor-default">
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
