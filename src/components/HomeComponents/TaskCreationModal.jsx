import React, { useState, useEffect } from "react";
import { X, Loader2, Calendar, Users, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/Api";
import { useToast } from "../../context/ToastContext";

const TaskCreationModal = ({ isOpen, onClose, onTaskCreated }) => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    due_date: "",
    assigned_to_ids: [],
  });
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch available users when modal opens
  useEffect(() => {
    if (isOpen && users.length === 0) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await api.get("/api/tasks/users/");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users:", err);
      addToast("Failed to load users. Please refresh.", "error");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleUserToggle = (userId) => {
    setFormData((prev) => ({
      ...prev,
      assigned_to_ids: prev.assigned_to_ids.includes(userId)
        ? prev.assigned_to_ids.filter((id) => id !== userId)
        : [...prev.assigned_to_ids, userId],
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    }
    if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      addToast("Please fix the errors below", "error");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        due_date: formData.due_date || null,
        assigned_to_ids: formData.assigned_to_ids,
      };

      const res = await api.post("/api/tasks/", payload);

      addToast(`Task "${formData.title}" created successfully!`, "success");

      // Reset form
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        due_date: "",
        assigned_to_ids: [],
      });
      setDropdownOpen(false);

      // Notify parent to refresh task list
      if (onTaskCreated) {
        onTaskCreated(res.data);
      }

      onClose();
    } catch (err) {
      console.error("Failed to create task:", err);
      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to create task";
      addToast(errorMsg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        due_date: "",
        assigned_to_ids: [],
      });
      setErrors({});
      setDropdownOpen(false);
      onClose();
    }
  };

  const getSelectedUsersDisplay = () => {
    if (formData.assigned_to_ids.length === 0) return "Select assignees...";
    if (formData.assigned_to_ids.length === 1) {
      const user = users.find((u) => u.id === formData.assigned_to_ids[0]);
      return user?.full_name || user?.username || "Unknown";
    }
    return `${formData.assigned_to_ids.length} users selected`;
  };

  const priorityOptions = [
    {
      value: "low",
      label: "Low",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      value: "medium",
      label: "Medium",
      color: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      value: "high",
      label: "High",
      color: "bg-rose-50 text-rose-700 border-rose-200",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-5 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Create New Task
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Assign work to team members and set priorities
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  disabled={submitting}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Title Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter task title"
                    disabled={submitting}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all placeholder-slate-300 focus:outline-none ${
                      errors.title
                        ? "border-rose-300 focus:border-rose-500 bg-rose-50"
                        : "border-slate-200 focus:border-pink-500 bg-slate-50"
                    }`}
                  />
                  {errors.title && (
                    <p className="text-sm text-rose-600 mt-2 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Description Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Add task details, requirements, or notes..."
                    disabled={submitting}
                    rows="4"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-pink-500 bg-slate-50 focus:outline-none placeholder-slate-300 transition-all resize-none"
                  />
                </div>

                {/* Priority Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Priority
                  </label>
                  <div className="flex gap-3">
                    {priorityOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            priority: option.value,
                          }))
                        }
                        disabled={submitting}
                        className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all border-2 ${
                          formData.priority === option.value
                            ? `${option.color} border-current`
                            : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                        } disabled:opacity-50`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Due Date Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleInputChange}
                    disabled={submitting}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-pink-500 bg-slate-50 focus:outline-none transition-all"
                  />
                </div>

                {/* Assignees Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Assign To (Optional)
                  </label>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      disabled={submitting || loadingUsers}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-pink-500 bg-slate-50 focus:outline-none text-left flex items-center justify-between text-slate-700 disabled:opacity-50 transition-all"
                    >
                      <span
                        className={
                          loadingUsers ? "text-slate-400" : "text-slate-600"
                        }
                      >
                        {loadingUsers
                          ? "Loading users..."
                          : getSelectedUsersDisplay()}
                      </span>
                      <Loader2
                        className={`w-4 h-4 text-slate-400 ${loadingUsers ? "animate-spin" : ""}`}
                      />
                    </button>

                    {/* Dropdown */}
                    {dropdownOpen && !loadingUsers && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border-2 border-slate-200 shadow-xl z-10 max-h-60 overflow-y-auto"
                      >
                        {users.length === 0 ? (
                          <div className="p-4 text-center text-slate-500">
                            No users available
                          </div>
                        ) : (
                          users.map((user) => (
                            <button
                              key={user.id}
                              type="button"
                              onClick={() => handleUserToggle(user.id)}
                              className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 ${
                                formData.assigned_to_ids.includes(user.id)
                                  ? "bg-pink-50"
                                  : ""
                              }`}
                            >
                              <div
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                  formData.assigned_to_ids.includes(user.id)
                                    ? "bg-pink-500 border-pink-500"
                                    : "border-slate-300"
                                }`}
                              >
                                {formData.assigned_to_ids.includes(user.id) && (
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                              </div>
                              <div>
                                <div className="font-semibold text-slate-900">
                                  {user.full_name || user.username}
                                </div>
                                <div className="text-xs text-slate-500">
                                  @{user.username}
                                </div>
                              </div>
                            </button>
                          ))
                        )}
                      </motion.div>
                    )}
                  </div>

                  {/* Selected Users Display */}
                  {formData.assigned_to_ids.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {formData.assigned_to_ids.map((userId) => {
                        const user = users.find((u) => u.id === userId);
                        return (
                          <div
                            key={userId}
                            className="inline-flex items-center gap-2 bg-pink-100 border border-pink-200 text-pink-700 px-3 py-1.5 rounded-lg text-sm font-semibold"
                          >
                            {user?.full_name || user?.username}
                            <button
                              type="button"
                              onClick={() => handleUserToggle(userId)}
                              className="ml-1 hover:text-pink-900"
                            >
                              ✕
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={submitting}
                    className="flex-1 px-4 py-3 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Task"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TaskCreationModal;
