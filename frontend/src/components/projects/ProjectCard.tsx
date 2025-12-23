import { Link } from "react-router-dom";
import { Calendar, ArrowRight, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Project } from "@/types";
import { StatusBadge } from "@/components/common/StatusBadge";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
  index?: number;
}

export const ProjectCard = ({
  project,
  onEdit,
  onDelete,
  index = 0,
}: ProjectCardProps) => {
  
  return (
    <div
      className={cn(
        "group relative rounded-xl border border-border bg-card p-6 transition-all duration-200",
        "hover:border-primary/30 hover:shadow-card-hover hover:bg-card/80",
        "animate-fade-in"
      )}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-1">
          <Link
            to={`/projects/${project?.id}`}
            className="text-lg font-semibold text-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group/link"
          >
            {project?.name}
            <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
          </Link>
          <StatusBadge status={project?.status} size="sm" />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit?.(project)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete?.(project?.id)}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {project.description && (
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {project?.description}
        </p>
      )}

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        {project.dueDate && (
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(Number(project.dueDate)), "dd/MM/yyyy")}</span>
          </div>
        )}
        {project.tasks && (
          <div className="flex items-center gap-1.5">
            <span>
              {project?.tasks.length}{" "}
              {project?.tasks.length === 1 || project?.tasks.length === 0 ? "Task" : "Tasks"}
            </span>

          </div>
        )}
      </div>

      {/* Progress indicator */}
      {project.tasks && project.tasks.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-foreground font-medium">
              {Math.round(
                (project.tasks.filter((t) => t.status === "DONE").length /
                  project.tasks.length) *
                  100
              )}
              %
            </span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{
                width: `${
                  (project.tasks.filter((t) => t.status === "DONE").length /
                    project.tasks.length) *
                  100
                }%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
