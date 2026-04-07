import React, { useState, useEffect } from "react";
import TaskCard from "../components/HomeComponents/TaskCard";
import CollaborationModal from "../components/HomeComponents/CollaborationModal";
import TaskCreationModal from "../components/HomeComponents/TaskCreationModal";
import { CheckCircle2, Plus } from "lucide-react";
import api from "../api/Api";

const CompletedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState("comments");

  const fetchCompletedTasks = async () => {
    try {
      const res = await api.get("/api/tasks/?status=completed");
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Could not load completed tasks", err);
      setError("Unable to fetch completed tasks from backend.");
    }
  };

  useEffect(() => {
    fetchCompletedTasks();
  }, []);

  const handleCollaborate = (task, tab = "comments") => {
    setSelectedTask(task);
    setModalTab(tab);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
    fetchCompletedTasks();
  };

  const handleCloseCreationModal = () => {
    setIsCreationModalOpen(false);
  };

  const handleTaskCreated = (newTask) => {
    // Refresh tasks list to show the new task
    fetchCompletedTasks();
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
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
            Completed Tasks{" "}
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          </h1>
          <p className="text-gray-500 mt-1">
            Review your previously completed assignments and history.
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
            isAccepted={true} // Set to true to show collaboration button even for completed tasks
            isCompleted={true}
            onCollaborate={handleCollaborate}
          />
        ))}
        {tasks.length === 0 && !error && (
          <p className="text-gray-500 col-span-full">
            No completed tasks found.
          </p>
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

export default CompletedTasks;
