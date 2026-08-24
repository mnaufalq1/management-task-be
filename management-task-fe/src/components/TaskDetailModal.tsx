import React, { useState, useEffect } from 'react';
import { 
  X, 
  MessageSquare, 
  Send, 
  Trash2, 
  Clock, 
  User as UserIcon, 
  CheckCircle2, 
  Users, 
  Sparkles,
  Paperclip,
  Smile
} from 'lucide-react';
import { Project, Task, TaskComment, User } from '../types';
import { getTaskComments, addTaskComment, deleteTaskComment } from '../services/storageService';
import { api } from '../services/api';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  project?: Project;
  currentUser: User;
  onCommentsUpdated?: () => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  isOpen,
  onClose,
  task,
  project,
  currentUser,
  onCommentsUpdated,
}) => {
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task && isOpen) {
      loadComments();
    }
  }, [task, isOpen]);

  const loadComments = async () => {
    if (!task) return;
    try {
      const apiComments = await api.getComments(task.id);
      if (apiComments.length > 0) {
        setComments(apiComments);
      } else {
        const taskCmts = getTaskComments(task.id);
        setComments(taskCmts);
      }
    } catch {
      const taskCmts = getTaskComments(task.id);
      setComments(taskCmts);
    }
  };

  if (!isOpen || !task) return null;

  const handleAddComment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newComment.trim() || !task) return;

    setIsSubmitting(true);
    try {
      await api.addComment(task.id, {
        userId: currentUser.id,
        userName: currentUser.name,
        userTeam: currentUser.teamName,
        userAvatar: currentUser.avatarUrl,
        content: newComment.trim(),
      });
      addTaskComment(task.id, currentUser, newComment.trim());
      setNewComment('');
      await loadComments();
    } catch {
      addTaskComment(task.id, currentUser, newComment.trim());
      setNewComment('');
      loadComments();
    } finally {
      setIsSubmitting(false);
      if (onCommentsUpdated) {
        onCommentsUpdated();
      }
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await api.deleteComment(commentId);
    } catch {
      deleteTaskComment(commentId);
    }
    loadComments();
    if (onCommentsUpdated) {
      onCommentsUpdated();
    }
  };

  const handleQuickEmoji = (emoji: string) => {
    setNewComment((prev) => (prev ? `${prev} ${emoji}` : emoji));
  };

  const formatTimeAgo = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffSec = Math.floor((new Date().getTime() - date.getTime()) / 1000);
      if (diffSec < 60) return 'Baru saja';
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)} mnt lalu`;
      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} jam lalu`;
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Baru saja';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] border border-[#DFD3C3] rounded-3xl w-full max-w-2xl shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-[#EFE8DC] flex items-start justify-between bg-[#FAF6F0]">
          <div className="space-y-1 pr-6">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#7A1C28]/10 text-[#7A1C28] border border-[#7A1C28]/20">
                {project?.name || 'Project Tim'}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                  task.priority === 'High'
                    ? 'bg-rose-500/10 text-rose-700 border border-rose-500/20'
                    : task.priority === 'Medium'
                    ? 'bg-amber-500/10 text-amber-700 border border-amber-500/20'
                    : 'bg-indigo-500/10 text-indigo-700 border border-indigo-500/20'
                }`}
              >
                {task.priority === 'High' ? 'Prioritas Tinggi' : task.priority === 'Medium' ? 'Prioritas Sedang' : 'Prioritas Rendah'}
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#2A1B17] pt-1">{task.title}</h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#EFE8DC] text-[#7A1C28] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Task Summary Details */}
          <div className="bg-[#FAF6F0] border border-[#E6DCCF] rounded-2xl p-4 space-y-3">
            <p className="text-xs text-[#544238] leading-relaxed whitespace-pre-line">
              {task.description || 'Tidak ada deskripsi detail untuk task ini.'}
            </p>

            <div className="pt-3 border-t border-[#EFE8DC] flex flex-wrap items-center justify-between gap-3 text-xs text-[#7A685D]">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#7A1C28]" />
                <span>Deadline: <strong className="text-[#2A1B17] font-mono">{task.deadline}</strong></span>
              </div>

              <div className="flex items-center gap-2">
                <UserIcon className="w-3.5 h-3.5 text-[#7A1C28]" />
                <span>Penanggung Jawab: <strong className="text-[#2A1B17]">{task.assignedTo || 'Tim MataApp'}</strong></span>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Status: <strong className="text-emerald-700">{task.status}</strong></span>
              </div>
            </div>
          </div>

          {/* Collaborator Avatars Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-[#FAF4EC] via-[#F5ECE0] to-[#FAF4EC] border border-[#DFD3C3] rounded-2xl p-3 px-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#7A1C28]" />
              <span className="text-xs font-bold text-[#2A1B17]">Kolaborasi Tim ({comments.length} Diskusi)</span>
            </div>

            <div className="flex items-center -space-x-2">
              <div
                className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#5C121D] to-[#7A1C28] text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#FFFFFF]"
                title={currentUser.name}
              >
                {currentUser.name.slice(0, 2).toUpperCase()}
              </div>
              <div
                className="w-7 h-7 rounded-full bg-amber-700 text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#FFFFFF]"
                title="Siti Rahma"
              >
                SR
              </div>
              <div
                className="w-7 h-7 rounded-full bg-emerald-700 text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#FFFFFF]"
                title="Ahmad Fauzi"
              >
                AF
              </div>
            </div>
          </div>

          {/* Comment List */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8C7769] flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              Komentar & Catatan Pengerjaan
            </h4>

            {comments.length === 0 ? (
              <div className="text-center py-8 bg-[#FAF6F0] border border-dashed border-[#DFD3C3] rounded-2xl space-y-2">
                <MessageSquare className="w-8 h-8 text-[#9C8A7D] mx-auto" />
                <p className="text-xs text-[#544238]">Belum ada komentar pada task ini.</p>
                <p className="text-[11px] text-[#8C7769]">Tulis komentar pertama untuk mulai berkolaborasi dengan anggota tim!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {comments.map((comment) => {
                  const isOwner = comment.userId === currentUser.id;

                  return (
                    <div
                      key={comment.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isOwner
                          ? 'bg-[#FAF4EC] border-[#7A1C28]/30 ml-4 sm:ml-8'
                          : 'bg-[#FFFFFF] border-[#E6DCCF] mr-4 sm:mr-8 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2.5">
                          {comment.userAvatar ? (
                            <img
                              src={comment.userAvatar}
                              alt={comment.userName}
                              className="w-7 h-7 rounded-full object-cover border border-[#DFD3C3]"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#5C121D] to-[#7A1C28] text-white text-[11px] font-bold flex items-center justify-center border border-[#DFD3C3]">
                              {comment.userName.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#2A1B17]">{comment.userName}</span>
                              {comment.userTeam && (
                                <span className="text-[10px] text-[#7A1C28] bg-[#7A1C28]/10 px-1.5 py-0.5 rounded border border-[#7A1C28]/20 font-semibold">
                                  {comment.userTeam}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-[#8C7769]">
                              {formatTimeAgo(comment.createdAt)}
                            </span>
                          </div>
                        </div>

                        {isOwner && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-[#8C7769] hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                            title="Hapus komentar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <p className="text-xs text-[#2A1B17] leading-relaxed pl-9 whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Input Footer for Posting Comments */}
        <div className="p-4 sm:p-5 bg-[#FAF6F0] border-t border-[#EFE8DC] space-y-3">
          
          {/* Quick Reaction Emojis */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[10px] text-[#8C7769] font-semibold mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" /> Reaksi Cepat:
            </span>
            {['👍 Siap ditinjau', '🚀 Selesai dikerjakan', '✅ ACC', '💡 Punya ide baru', '👏 Keren!'].map((quickText) => (
              <button
                key={quickText}
                type="button"
                onClick={() => handleQuickEmoji(quickText)}
                className="px-2.5 py-1 rounded-full bg-[#FFFFFF] hover:bg-[#F3EBE0] text-[#4A0E17] text-[11px] font-semibold border border-[#D8C7B5] transition-all cursor-pointer whitespace-nowrap shadow-sm"
              >
                {quickText}
              </button>
            ))}
          </div>

          <form onSubmit={handleAddComment} className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Tulis komentar atau progres kolaborasi tim..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
                className="w-full bg-[#FFFFFF] border border-[#DFD3C3] rounded-2xl py-2.5 pl-4 pr-10 text-xs text-[#2A1B17] placeholder-[#8C7769] focus:outline-none focus:border-[#7A1C28] focus:ring-1 focus:ring-[#7A1C28] transition-all shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={!newComment.trim() || isSubmitting}
              className="py-2.5 px-5 rounded-2xl bg-gradient-to-r from-[#5C121D] via-[#7A1C28] to-[#9C2B3C] hover:from-[#4A0E17] hover:to-[#832030] disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-[#4A0E17]/20 transition-all cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
