import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { format } from "date-fns";
import { X, Loader2, Send, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/common/StatusBadge";
import { TASK_QUERY } from "@/graphql/queries";
import { ADD_TASK_COMMENT_MUTATION, DELETE_TASK_MUTATION } from "@/graphql/mutations";
import { useAppDispatch } from "@/store/hooks";
import { closeTaskDetailModal, openEditTaskModal } from "@/store/uiSlice";
import { toast } from "sonner";
import type { Task, TaskComment } from "@/types";
import { cn } from "@/lib/utils";

interface TaskDetailProps {
  taskId: string;
  projectId: string;
}

interface TaskResponse {
  task: Task & { comments: TaskComment[] };
}

interface AddCommentResponse {
  addTaskComment: TaskComment;
}

export const TaskDetail = ({ taskId, projectId }: TaskDetailProps) => {
  const dispatch = useAppDispatch();
  const [newComment, setNewComment] = useState("");

  const { data, loading, error } = useQuery<TaskResponse>(TASK_QUERY, {
    variables: { taskId },
  });

  const [addComment, { loading: addingComment }] = useMutation<AddCommentResponse>(
    ADD_TASK_COMMENT_MUTATION,
    {
      refetchQueries: [{ query: TASK_QUERY, variables: { taskId } }],
    }
  );

  const [deleteTask, { loading: deletingTask }] = useMutation(DELETE_TASK_MUTATION, {
    variables: { id: taskId },
  });

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await addComment({
        variables: { taskId, content: newComment.trim() },
      });
      setNewComment("");
      toast.success("Comment added");
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await deleteTask();
      toast.success("Task deleted");
      dispatch(closeTaskDetailModal());
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const handleClose = () => {
    dispatch(closeTaskDetailModal());
  };

  const handleEdit = () => {
    dispatch(closeTaskDetailModal());
    dispatch(openEditTaskModal(taskId));
  };

  const task = data?.task;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative w-full max-w-2xl mx-4 max-h-[85vh] bg-card border border-border rounded-xl shadow-xl animate-scale-in overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground truncate pr-4">
            {loading ? "Loading..." : task?.title}
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEdit}
              className="h-8 w-8"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={deletingTask}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="p-6 text-center text-destructive">
            Failed to load task details
          </div>
        ) : task ? (
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Status & Assignee */}
              <div className="flex items-center gap-4 flex-wrap">
                <StatusBadge status={task.status} />
                {task.assigneeEmail && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">
                        {task.assigneeEmail[0].toUpperCase()}
                      </span>
                    </div>
                    <span>{task.assigneeEmail}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {task.description && (
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2">
                    Description
                  </h3>
                  <p className="text-muted-foreground text-sm whitespace-pre-wrap">
                    {task.description}
                  </p>
                </div>
              )}

              {/* Comments */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-4">
                  Comments ({task.comments?.length || 0})
                </h3>

                <div className="space-y-4">
                  {task.comments?.map((comment) => (
                    <div
                      key={comment.id}
                      className="bg-muted/50 rounded-lg p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-xs font-medium text-primary">
                            {comment.authorEmail[0].toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {comment.authorEmail.split("@")[0]}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(Number(comment.createdAt)), "MMM d, h:mm a")}
                        </span>
                      </div>
                      <p className="text-sm text-foreground whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  ))}

                  {(!task.comments || task.comments.length === 0) && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No comments yet
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Add Comment */}
            <div className="p-6 border-t border-border">
              <div className="flex gap-3">
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={2}
                  className="flex-1"
                />
                <Button
                  onClick={handleAddComment}
                  disabled={addingComment || !newComment.trim()}
                  size="icon"
                  className="h-auto"
                >
                  {addingComment ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
