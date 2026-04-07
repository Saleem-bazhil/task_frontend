import React, { useState, useEffect } from "react";
import TaskCard from "../components/HomeComponents/TaskCard";
import CollaborationModal from "../components/HomeComponents/CollaborationModal";
import TaskCreationModal from "../components/HomeComponents/TaskCreationModal";
import api from "../api/Api";
import { useToast } from "../context/ToastContext";
import { Plus } from "lucide-react";

const AcceptedTasks = () => {
  const { addToast } = useToast();
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState("comments");

  const fetchAcceptedTasks = async () => {
    try {
      const res = await api.get("/api/tasks/?status=in_progress");
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Could not load active tasks", err);
      setError("Unable to fetch active tasks from backend.");
    }
  };

  useEffect(() => {
    fetchAcceptedTasks();
  }, []);

  const handleCompleteTask = async (taskId) => {
    try {
      await api.patch(`/api/tasks/${taskId}/`, { status: "completed" });
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      addToast("Task marked as completed! 🎉", "success");
    } catch (err) {
      console.error("Failed to complete task", err);
      addToast("Failed to complete task. Please try again.", "error");
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
    // Refresh tasks to get new comments/attachments if any
    fetchAcceptedTasks();
  };

  const handleCloseCreationModal = () => {
    setIsCreationModalOpen(false);
  };

  const handleTaskCreated = (newTask) => {
    // Refresh tasks list to show the new task
    fetchAcceptedTasks();
  };

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-[1600px] mx-auto animate-fade-in relative z-0">
      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            Active Tasks
          </h1>
          <p className="text-gray-500 mt-1">
            Manage tasks you are currently working on.
          </p>
        </div>
        <button
          onClick={() => setIsCreationModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          Create Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            isAccepted={true}
            onComplete={() => handleCompleteTask(task.id)}
            onCollaborate={handleCollaborate}
          />
        ))}
        {tasks.length === 0 && !error && (
          <p className="text-gray-500 col-span-full">No active tasks found.</p>
        )}
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

export default AcceptedTasks;
