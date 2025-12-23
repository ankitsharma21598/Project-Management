import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { Task, TaskStatus } from "@/types";
import { TaskCard } from "./TaskCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TaskColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onAddTask: (status: TaskStatus) => void;
}

const statusConfig: Record<TaskStatus, { label: string; color: string }> = {
  TODO: { label: "To Do", color: "bg-muted-foreground" },
  IN_PROGRESS: { label: "In Progress", color: "bg-warning" },
  DONE: { label: "Done", color: "bg-success" },
  BLOCKED: { label: "Blocked", color: "bg-destructive" },
};

export const TaskColumn = ({ status, tasks, onAddTask }: TaskColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const config = statusConfig[status];

  return (
    <div className="flex flex-col min-w-[320px] max-w-[320px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={cn("h-2 w-2 rounded-full", config.color)} />
          <h3 className="font-semibold text-foreground">{config.label}</h3>
          <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onAddTask(status)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 rounded-xl p-3 space-y-3 min-h-[200px] transition-colors",
          isOver ? "bg-primary/5 border-2 border-dashed border-primary/30" : "bg-muted/30"
        )}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground text-sm">
            <p>No tasks</p>
          </div>
        )}
      </div>
    </div>
  );
};
