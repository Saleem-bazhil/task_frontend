import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  Paperclip,
  MessageSquare,
  File,
  Download,
  Eye,
  Loader2,
  User,
  Clock,
  Reply,
  CheckCircle2,
  UserCheck,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/Api";
import { getStoredUser } from "../../services/storage";
import { BASE_URL } from "../../config/env";

// Ensure file URLs always point to the backend server, never the frontend dev server
const getAbsoluteUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

const CollaborationModal = ({
  isOpen,
  onClose,
  task,
  initialTab = "comments",
}) => {
  const currentUser = getStoredUser();
  const [activeTab, setActiveTab] = useState(initialTab);

  // Local copies of comments & attachments for live updates
  const [localComments, setLocalComments] = useState([]);
  const [localAttachments, setLocalAttachments] = useState([]);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showReassign, setShowReassign] = useState(false);
  const [users, setUsers] = useState([]);
  const [reassigning, setReassigning] = useState(false);

  const fileInputRef = useRef(null);
  const scrollRef = useRef(null);

  // Sync local state when task prop changes (modal opens)
  useEffect(() => {
    if (isOpen && task) {
      setActiveTab(initialTab);
      setLocalComments(task.comments || []);
      setLocalAttachments(task.attachments || []);
    }
  }, [isOpen, task, initialTab]);

  // Load assignable users when reassign panel opens
  useEffect(() => {
    if (showReassign && users.length === 0) {
      api
        .get("/api/tasks/users/")
        .then((res) => setUsers(res.data))
        .catch(() => {});
    }
  }, [showReassign]);

  // Auto-scroll to bottom of comments
  useEffect(() => {
    if (scrollRef.current && activeTab === "comments") {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [localComments, activeTab]);

  if (!isOpen || !task) return null;

  const handleSendComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const optimisticComment = {
      id: `temp-${Date.now()}`,
      user: {
        id: currentUser?.id,
        username: currentUser?.username,
        full_name: currentUser?.full_name || currentUser?.username,
      },
      content: comment.trim(),
      created_at: new Date().toISOString(),
    };

    // Optimistic update — show it immediately
    setLocalComments((prev) => [...prev, optimisticComment]);
    setComment("");
    setIsSubmitting(true);

    try {
      const res = await api.post("/api/comments/", {
        task: task.id,
        content: optimisticComment.content,
      });
      // Replace the temp comment with the real one from backend
      setLocalComments((prev) =>
        prev.map((c) => (c.id === optimisticComment.id ? res.data : c)),
      );
    } catch (err) {
      console.error("Failed to send comment", err);
      // Rollback optimistic update on error
      setLocalComments((prev) =>
        prev.filter((c) => c.id !== optimisticComment.id),
      );
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("task", task.id);
    formData.append("file", file);

    try {
      const res = await api.post("/api/attachments/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Immediately append to local attachments
      setLocalAttachments((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Upload failed", err);
      alert("File upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmitForReview = async () => {
    if (
      !window.confirm(
        "Submit this work for review? The task will be marked as Completed.",
      )
    )
      return;

    setIsSubmitting(true);
    try {
      const submissionContent =
        "[WORK SUBMITTED] I have completed the requirements and attached the necessary files for review.";
      const res = await api.post("/api/comments/", {
        task: task.id,
        content: submissionContent,
      });
      setLocalComments((prev) => [...prev, res.data]);
      await api.patch(`/api/tasks/${task.id}/`, { status: "completed" });
      onClose();
    } catch (err) {
      console.error("Submission failed", err);
      alert("Failed to submit work. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReassign = async (userId) => {
    setReassigning(true);
    try {
      await api.patch(`/api/tasks/${task.id}/`, { assigned_to_ids: [userId] });
      setShowReassign(false);
      onClose();
    } catch (err) {
      console.error("Reassign failed", err);
      alert("Failed to reassign task.");
    } finally {
      setReassigning(false);
    }
  };

  const getFileIcon = (filename) => {
    const ext = filename?.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return "🖼️";
    if (["pdf"].includes(ext)) return "📄";
    if (["doc", "docx"].includes(ext)) return "📝";
    if (["xls", "xlsx"].includes(ext)) return "📊";
    if (["zip", "rar", "7z"].includes(ext)) return "🗜️";
    if (["mp4", "mov", "avi"].includes(ext)) return "🎬";
    return "📎";
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl shadow-slate-900/20 overflow-hidden flex flex-col"
          style={{ height: "min(85vh, 680px)" }}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-gradient-to-r from-pink-50/60 via-white to-white">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-200 shrink-0">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-pink-500">
                  Task #{task.id}
                </p>
                <h2 className="text-base font-bold text-slate-800 truncate">
                  {task.title}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Reassign Button */}
              <div className="relative">
                <button
                  onClick={() => setShowReassign(!showReassign)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-[11px] font-bold transition-all border border-slate-200"
                  title="Reassign task"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Assign</span>
                  <ChevronDown
                    className={`w-3 h-3 transition-transform ${showReassign ? "rotate-180" : ""}`}
                  />
                </button>
                {showReassign && (
                  <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/60 z-10 overflow-hidden">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-4 pt-3 pb-1">
                      Reassign to
                    </p>
                    <div className="max-h-40 overflow-y-auto">
                      {users.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => handleReassign(u.id)}
                          disabled={reassigning}
                          className="w-full text-left px-4 py-2.5 hover:bg-pink-50 text-sm font-medium text-slate-700 hover:text-pink-600 transition-colors flex items-center gap-2"
                        >
                          <div className="w-7 h-7 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center text-xs font-black">
                            {(u.full_name || u.username)
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          {u.full_name || u.username}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Work button — only for active tasks */}
              {task.status === "in_progress" && (
                <button
                  onClick={handleSubmitForReview}
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold transition-all shadow-lg shadow-emerald-200"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Submit</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="flex border-b border-slate-100 px-6 bg-white shrink-0">
            <button
              onClick={() => setActiveTab("comments")}
              className={`py-3.5 px-3 text-xs font-bold uppercase tracking-widest flex items-center gap-2 border-b-2 transition-all ${
                activeTab === "comments"
                  ? "border-pink-500 text-pink-600"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Discussion
              {localComments.length > 0 && (
                <span className="bg-pink-100 text-pink-700 text-[9px] px-1.5 py-0.5 rounded-full font-black min-w-[1.2rem] text-center">
                  {localComments.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("files")}
              className={`py-3.5 px-3 text-xs font-bold uppercase tracking-widest flex items-center gap-2 border-b-2 transition-all ${
                activeTab === "files"
                  ? "border-pink-500 text-pink-600"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <Paperclip className="w-3.5 h-3.5" />
              Files
              {localAttachments.length > 0 && (
                <span className="bg-slate-100 text-slate-600 text-[9px] px-1.5 py-0.5 rounded-full font-black min-w-[1.2rem] text-center">
                  {localAttachments.length}
                </span>
              )}
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            {activeTab === "comments" ? (
              <>
                {/* Messages List */}
                <div
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-5 space-y-4"
                >
                  {localComments.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3 py-12 min-h-[200px]">
                      <div className="p-5 bg-slate-50 border border-slate-100 rounded-3xl">
                        <Reply className="w-8 h-8 opacity-30 text-pink-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-slate-600">
                          No messages yet
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Start the conversation below.
                        </p>
                      </div>
                    </div>
                  ) : (
                    localComments.map((msg, index) => {
                      const isMe = msg.user?.id === currentUser?.id;
                      const isSubmission =
                        msg.content?.includes("[WORK SUBMITTED]");
                      return (
                        <div
                          key={msg.id || index}
                          className={`flex gap-3 ${isMe ? "ml-auto flex-row-reverse" : "mr-auto"} max-w-[88%]`}
                        >
                          {/* Avatar */}
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-[11px] font-black ${
                              isMe
                                ? "bg-gradient-to-br from-pink-500 to-rose-600 text-white"
                                : "bg-slate-100 text-slate-600 border border-slate-200"
                            }`}
                          >
                            {(msg.user?.full_name || msg.user?.username || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div
                            className={`space-y-1 ${isMe ? "items-end flex flex-col" : ""}`}
                          >
                            <div
                              className={`flex items-center gap-2 ${isMe ? "flex-row-reverse" : ""}`}
                            >
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">
                                {isMe
                                  ? "You"
                                  : msg.user?.full_name || msg.user?.username}
                              </span>
                              <span className="text-[9px] text-slate-300 flex items-center gap-0.5">
                                <Clock className="w-2.5 h-2.5" />
                                {new Date(msg.created_at).toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" },
                                )}
                              </span>
                            </div>

                            <div
                              className={`
                              p-3.5 text-sm leading-relaxed rounded-2xl shadow-sm
                              ${
                                isSubmission
                                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl"
                                  : isMe
                                    ? "bg-gradient-to-br from-pink-500 to-rose-600 text-white rounded-tr-sm"
                                    : "bg-white text-slate-700 border border-slate-100 rounded-tl-sm"
                              }
                            `}
                            >
                              {isSubmission ? (
                                <span className="flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                  <span className="font-semibold">
                                    {msg.content}
                                  </span>
                                </span>
                              ) : (
                                msg.content
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Input */}
                <form
                  onSubmit={handleSendComment}
                  className="px-5 py-4 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0"
                >
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Type your message or doubt…"
                      className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-3 pl-5 pr-12 text-sm focus:bg-white focus:border-pink-300 focus:ring-4 focus:ring-pink-500/5 transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-300 hover:text-pink-500 transition-colors"
                      title="Attach file"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting || !comment.trim()}
                    className="bg-pink-600 hover:bg-pink-700 disabled:bg-slate-200 disabled:cursor-not-allowed text-white w-12 h-12 rounded-2xl transition-all shadow-lg shadow-pink-200 flex items-center justify-center shrink-0"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* Files Tab */
              <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
                {/* File List */}
                <div className="space-y-2">
                  {localAttachments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-slate-400 gap-3 py-8">
                      <div className="p-5 bg-slate-50 border border-slate-100 rounded-3xl">
                        <File className="w-7 h-7 opacity-30" />
                      </div>
                      <p className="text-sm font-bold text-slate-500">
                        No files attached yet
                      </p>
                      <p className="text-xs text-slate-400">
                        Upload proof of work or supporting documents below.
                      </p>
                    </div>
                  ) : (
                    localAttachments.map((file, idx) => {
                      const fileUrl = getAbsoluteUrl(
                        file.file_url || file.file,
                      );
                      const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(
                        file.filename,
                      );
                      return (
                        <div
                          key={file.id || idx}
                          className="group flex items-center gap-3 p-3.5 bg-white hover:bg-pink-50/30 border border-slate-100 hover:border-pink-200 rounded-2xl transition-all"
                        >
                          {/* File Icon */}
                          <div className="w-11 h-11 bg-slate-50 group-hover:bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 text-xl shrink-0 transition-colors">
                            {getFileIcon(file.filename)}
                          </div>

                          {/* File Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-800 truncate">
                              {file.filename}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <User className="w-3 h-3 text-slate-300" />
                              <span className="text-[10px] text-slate-400 font-medium">
                                {file.user?.full_name || file.user?.username}
                              </span>
                              <span className="text-[9px] text-slate-300">
                                ·
                              </span>
                              <Clock className="w-2.5 h-2.5 text-slate-300" />
                              <span className="text-[9px] text-slate-300">
                                {new Date(file.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          {/* Actions: View + Download */}
                          <div className="flex items-center gap-1 shrink-0">
                            {/* View button */}
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="w-9 h-9 bg-slate-50 hover:bg-blue-500 text-slate-400 hover:text-white rounded-xl flex items-center justify-center transition-all shadow-sm"
                              title="View file"
                            >
                              <Eye className="w-4 h-4" />
                            </a>
                            {/* Download button */}
                            <a
                              href={fileUrl}
                              download={file.filename}
                              className="w-9 h-9 bg-slate-50 hover:bg-pink-500 text-slate-400 hover:text-white rounded-xl flex items-center justify-center transition-all shadow-sm"
                              title="Download file"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Upload Zone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-auto p-8 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-pink-400 hover:bg-pink-50/40 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md border border-slate-100 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    {uploading ? (
                      <Loader2 className="w-6 h-6 text-pink-600 animate-spin" />
                    ) : (
                      <Paperclip className="w-6 h-6 text-pink-500" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-700">
                      {uploading ? "Uploading..." : "Click to upload a file"}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Supports all file types up to 25MB
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CollaborationModal;
