import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskCard from "../components/HomeComponents/TaskCard";
import CollaborationModal from "../components/HomeComponents/CollaborationModal";
import TaskCreationModal from "../components/HomeComponents/TaskCreationModal";
import { Inbox, Layers3, Plus, UserCheck } from "lucide-react";
import api from "../api/Api";
import { getStoredUser } from "../services/storage";
import { useToast } from "../context/ToastContext";

const MyTasks = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const currentUser = getStoredUser();
  const [createdTasks, setCreatedTasks] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState("comments");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/tasks/?status=pending");
      const pendingTasks = Array.isArray(response.data) ? response.data : [];
      const currentUserId = currentUser?.id;

      const nextAssignedTasks = pendingTasks.filter((task) => {
        const assignedToCurrentUser = Array.isArray(task.assigned_to)
          ? task.assigned_to.some((assignee) => assignee.id === currentUserId)
          : false;
        const assignedByAnotherUser =
          task.assigned_by && task.assigned_by.id !== currentUserId;
        return assignedToCurrentUser && assignedByAnotherUser;
      });

      const nextCreatedTasks = pendingTasks.filter((task) => {
        const createdByCurrentUser = task.user?.id === currentUserId;
        const assignedByAnotherUser =
          task.assigned_by && task.assigned_by.id !== currentUserId;
        return createdByCurrentUser && !assignedByAnotherUser;
      });

      setCreatedTasks(nextCreatedTasks);
      setAssignedTasks(nextAssignedTasks);
    } catch (err) {
      console.error("Could not load tasks", err);
      setError("Unable to fetch tasks from backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [currentUser?.id]);

  const handleAcceptTask = async (task) => {
    try {
      const payload = {
        status: "in_progress",
        assigned_to_ids: [currentUser?.id],
      };
      await api.patch(`/api/tasks/${task.id}/`, payload);
      setAssignedTasks((prevTasks) =>
        prevTasks.filter((item) => item.id !== task.id),
      );

      addToast(
        `Task "${task.title}" accepted! Redirecting to Active Tasks…`,
        "success",
      );

      setTimeout(() => navigate("/app/accepted-tasks"), 800);
    } catch (err) {
      console.error("Failed to accept task", err);
      addToast("Failed to accept task. Please try again.", "error");
    }
  };

  const handleCollaborate = (task, tab = "comments") => {
    setSelectedTask(task);
    setModalTab(tab);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
    fetchTasks();
  };

  const handleCloseCreationModal = () => {
    setIsCreationModalOpen(false);
  };

  const handleTaskCreated = () => {
    // Refresh tasks list to show the new task
    fetchTasks();
  };

  const totalTasks = assignedTasks.length + createdTasks.length;

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-[1600px] mx-auto animate-fade-in min-h-[80vh]">
      {error && (
        <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700 shadow-sm">
          {error}
        </div>
      )}

      <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm mb-8">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pink-500 via-amber-400 to-emerald-400" />
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 p-4 sm:p-6 md:p-7">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
              <span className="text-xs font-extrabold text-pink-500">
                Task Discovery
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 tracking-tight">
              Available Tasks
            </h1>
            <p className="text-sm sm:text-base text-slate-500 mt-2 font-medium max-w-2xl leading-6">
              Claim unassigned tasks, review your pending work, and jump into task details from one focused board.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="grid grid-cols-2 gap-3 sm:min-w-[18rem]">
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <Layers3 className="w-3.5 h-3.5" />
                  Open Pool
                </div>
                <p className="mt-1 text-xl font-black text-slate-900">
                  {totalTasks}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <UserCheck className="w-3.5 h-3.5" />
                  Assigned
                </div>
                <p className="mt-1 text-xl font-black text-slate-900">
                  {assignedTasks.length}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCreationModalOpen(true)}
              className="px-5 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-pink-200 hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-pink-200"
            >
              <Plus className="w-5 h-5" />
              Create Task
            </button>
          </div>
        </div>
      </div>

      {/* Created by Me Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full" />
            <span className="text-xs font-extrabold text-blue-500">
              Created by Me
            </span>
          </div>
          <span className="rounded-md border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-600">
            {createdTasks.length} pending
          </span>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,22rem),1fr))] gap-4 sm:gap-6">
          {loading ? (
            Array(2)
              .fill(0)
              .map((_, i) => (
                <div
                  key={`created-${i}`}
                  className="h-[320px] bg-slate-100 rounded-lg animate-pulse shadow-sm"
                />
              ))
          ) : createdTasks.length === 0 ? (
            <div className="col-span-full py-10 bg-blue-50 border-2 border-dashed border-blue-200 rounded-lg flex flex-col items-center justify-center text-center">
              <div className="p-4 bg-white rounded-lg shadow-lg shadow-blue-100 mb-4">
                <Inbox className="w-8 h-8 text-blue-200" />
              </div>
              <h3 className="text-sm font-bold text-blue-800">
                No tasks created by you
              </h3>
              <p className="text-xs text-blue-600 mt-1">
                Tasks you create will appear here
              </p>
            </div>
          ) : (
            createdTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onCollaborate={handleCollaborate}
                showAcceptButton={false}
                ownershipLabel="Created by you"
              />
            ))
          )}
        </div>
      </div>

      {/* Assigned to Me Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-xs font-extrabold text-green-500">
              Assigned to Me
            </span>
          </div>
          <span className="rounded-md border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-600">
            {assignedTasks.length} waiting
          </span>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,22rem),1fr))] gap-4 sm:gap-6">
          {loading ? (
            Array(2)
              .fill(0)
              .map((_, i) => (
                <div
                  key={`assigned-${i}`}
                  className="h-[320px] bg-slate-100 rounded-lg animate-pulse shadow-sm"
                />
              ))
          ) : assignedTasks.length === 0 ? (
            <div className="col-span-full py-10 bg-green-50 border-2 border-dashed border-green-200 rounded-lg flex flex-col items-center justify-center text-center">
              <div className="p-4 bg-white rounded-lg shadow-lg shadow-green-100 mb-4">
                <Inbox className="w-8 h-8 text-green-200" />
              </div>
              <h3 className="text-sm font-bold text-green-800">
                No tasks assigned to you
              </h3>
              <p className="text-xs text-green-600 mt-1">
                Tasks assigned to you will appear here
              </p>
            </div>
          ) : (
            assignedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onCollaborate={handleCollaborate}
                onAccept={handleAcceptTask}
                showAcceptButton={true}
                ownershipLabel="Assigned to you"
              />
            ))
          )}
        </div>
      </div>

      <CollaborationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        task={selectedTask}
        initialTab={modalTab}
      />

      <TaskCreationModal
        isOpen={isCreationModalOpen}
        onClose={handleCloseCreationModal}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
};

export default MyTasks;
