import { cn } from "@/lib/utils";
import { ProjectStatus, TaskStatus } from "@/types";

interface StatusBadgeProps {
  status: ProjectStatus | TaskStatus;
  size?: "sm" | "md";
  className?: string;
}

const statusConfig: Record<
  ProjectStatus | TaskStatus,
  { label: string; className: string }
> = {
  // Project statuses
  ACTIVE: {
    label: "Active",
    className: "bg-success/10 text-success border-success/20",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  ON_HOLD: {
    label: "On Hold",
    className: "bg-warning/10 text-warning border-warning/20",
  },
  ARCHIVED: {
    label: "Archived",
    className: "bg-muted text-muted-foreground border-border",
  },
  PLANNING: {
    label: "Planning",
    className: "bg-muted text-muted-foreground border-border",
  },
  
  // Task statuses
  TODO: {
    label: "To Do",
    className: "bg-muted text-muted-foreground border-border",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-warning/10 text-warning border-warning/20",
  },
  DONE: {
    label: "Done",
    className: "bg-success/10 text-success border-success/20",
  },
  BLOCKED: {
    label: "Blocked",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  
};

export const StatusBadge = ({
  status,
  size = "md",
  className,
}: StatusBadgeProps) => {
  const config = statusConfig[status as keyof typeof statusConfig];
  
  // console.log("Config ==>",config);
  

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full border",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        config.className,
        className
      )}
    >
      <span
        className={cn(
          "rounded-full mr-1.5",
          size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2",
          status === "ACTIVE" || status === "DONE"
            ? "bg-success"
            : status === "IN_PROGRESS" || status === "ON_HOLD"
            ? "bg-warning"
            : status === "BLOCKED"
            ? "bg-destructive"
            : status === "COMPLETED"
            ? "bg-primary"
            : status === "PLANNING"
            ? "bg-primary"
            : "bg-muted-foreground"
            
        )}
      />
      {config.label}
    </span>
  );
};
