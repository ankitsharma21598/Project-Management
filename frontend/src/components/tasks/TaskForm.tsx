import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CREATE_TASK_MUTATION, UPDATE_TASK_MUTATION } from "@/graphql/mutations";
import { PROJECT_QUERY } from "@/graphql/queries";
import { toast } from "sonner";
import type { Task, TaskStatus } from "@/types";

interface TaskFormProps {
  projectId: string;
  task?: Task | null;
  initialStatus?: TaskStatus;
  onClose: () => void;
}

interface CreateTaskResponse {
  createTask: Task;
}

interface UpdateTaskResponse {
  updateTask: Task;
}

export const TaskForm = ({
  projectId,
  task,
  initialStatus = "TODO",
  onClose,
}: TaskFormProps) => {
  const isEditing = !!task;

  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState<TaskStatus>(task?.status || initialStatus);
  const [assigneeEmail, setAssigneeEmail] = useState(task?.assigneeEmail || "");

  const [createTask, { loading: createLoading }] = useMutation<CreateTaskResponse>(
    CREATE_TASK_MUTATION,
    {
      refetchQueries: [{ query: PROJECT_QUERY, variables: { projectId } }],
    }
  );

  const [updateTask, { loading: updateLoading }] = useMutation<UpdateTaskResponse>(
    UPDATE_TASK_MUTATION,
    {
      refetchQueries: [{ query: PROJECT_QUERY, variables: { projectId } }],
    }
  );

  const loading = createLoading || updateLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Task title is required");
      return;
    }

    try {
      if (isEditing) {
        await updateTask({
          variables: {
            id: task.id,
            input: {
              title,
              description: description || undefined,
              status,
              assigneeEmail: assigneeEmail || undefined,
            },
          },
        });
        toast.success("Task updated successfully");
      } else {
        await createTask({
          variables: {
            input: {
              projectId,
              title,
              description: description || undefined,
              assigneeEmail: assigneeEmail || undefined,
            },
          },
        });
        toast.success("Task created successfully");
      }
      onClose();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg mx-4 bg-card border border-border rounded-xl shadow-xl animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            {isEditing ? "Edit Task" : "Create Task"}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {isEditing && (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as TaskStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODO">To Do</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="DONE">Done</SelectItem>
                  <SelectItem value="BLOCKED">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="assigneeEmail">Assignee Email</Label>
            <Input
              id="assigneeEmail"
              type="email"
              placeholder="assignee@example.com"
              value={assigneeEmail}
              onChange={(e) => setAssigneeEmail(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {isEditing ? "Save Changes" : "Create Task"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
