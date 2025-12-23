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
import {
  CREATE_PROJECT_MUTATION,
  UPDATE_PROJECT_MUTATION,
} from "@/graphql/mutations";
import { PROJECTS_QUERY } from "@/graphql/queries";
import { toast } from "sonner";
import type { Project, ProjectStatus } from "@/types";

interface ProjectFormProps {
  project?: Project | null;
  onClose: () => void;
}

interface CreateProjectResponse {
  createProject: Project;
}

interface UpdateProjectResponse {
  updateProject: Project;
}

export const ProjectForm = ({ project, onClose }: ProjectFormProps) => {
  const isEditing = !!project;

  const [name, setName] = useState(project?.name || "");
  const [description, setDescription] = useState(project?.description || "");
  const [status, setStatus] = useState<ProjectStatus>(project?.status || "ACTIVE");
  const [dueDate, setDueDate] = useState(
    project?.dueDate ? project.dueDate.split("T")[0] : ""
  );

  const [createProject, { loading: createLoading }] = useMutation<CreateProjectResponse>(
    CREATE_PROJECT_MUTATION,
    {
      refetchQueries: [{ query: PROJECTS_QUERY }],
    }
  );

  const [updateProject, { loading: updateLoading }] = useMutation<UpdateProjectResponse>(
    UPDATE_PROJECT_MUTATION,
    {
      refetchQueries: [{ query: PROJECTS_QUERY }],
    }
  );

  const loading = createLoading || updateLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Project name is required");
      return;
    }

    if (dueDate && new Date(dueDate) < new Date()) {
      toast.error("Due date must be in the future");
      return;
    }

    try {
      if (isEditing) {
        await updateProject({
          variables: {
            id: project.id,
            input: {
              name,
              description: description || undefined,
              status,
              dueDate: dueDate || undefined,
            },
          },
        });
        toast.success("Project updated successfully");
      } else {
        await createProject({
          variables: {
            input: {
              name,
              description: description || undefined,
              dueDate: dueDate || undefined,
            },
          },
        });
        toast.success("Project created successfully");
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
            {isEditing ? "Edit Project" : "Create Project"}
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
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              placeholder="Enter project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter project description"
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
                onValueChange={(value) => setStatus(value as ProjectStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="ON_HOLD">On Hold</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
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
              {isEditing ? "Save Changes" : "Create Project"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
