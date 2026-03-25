import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays } from "lucide-react";

function priorityClasses(priority) {
  switch (priority) {
    case "high":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "medium":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "low":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

function statusClasses(status) {
  switch (status) {
    case "completed":
      return "bg-emerald-100 text-emerald-700";
    case "in_progress":
      return "bg-pink-100 text-pink-700";
    case "pending":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function formatStatus(status) {
  return status === "in_progress" ? "In Progress" : `${status?.charAt(0).toUpperCase()}${status?.slice(1)}`;
}

export default function RecentTasks({ tasks = [], isAdmin }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 p-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Recent Tasks</h2>
          <p className="mt-1 text-sm text-slate-500">
            {isAdmin ? "Latest assignments across the workspace." : "Latest updates on your assigned work."}
          </p>
        </div>
        <Link to="/app/my-tasks" className="inline-flex items-center gap-2 text-sm font-medium text-pink-700 transition hover:text-pink-900">
          View Tasks
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="p-6 text-sm text-slate-500">No task activity yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.24em] text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">Task</th>
                <th className="px-6 py-4 font-medium">{isAdmin ? "Assigned To" : "Owner"}</th>
                <th className="px-6 py-4 font-medium">Priority</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.map((task) => (
                <tr key={task.id} className="transition hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{task.title}</div>
                    <div className="mt-1 line-clamp-1 text-sm text-slate-500">{task.description || "No description added."}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700">{task.user?.username || "-"}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${priorityClasses(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusClasses(task.status)}`}>
                      {formatStatus(task.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-slate-400" />
                      {task.due_date ? new Date(task.due_date).toLocaleDateString() : "TBD"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

