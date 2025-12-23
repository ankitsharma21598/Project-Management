import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, MessageSquare, User } from "lucide-react";
import { Task } from "@/types";
import { useAppDispatch } from "@/store/hooks";
import { openTaskDetailModal } from "@/store/uiSlice";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
}

export const TaskCard = ({ task }: TaskCardProps) => {
  const dispatch = useAppDispatch();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group bg-card border border-border rounded-lg p-4 cursor-pointer transition-all",
        "hover:border-primary/30 hover:shadow-card",
        isDragging && "opacity-50 shadow-lg"
      )}
      onClick={() => dispatch(openTaskDetailModal(task.id))}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>

        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground text-sm mb-1.5 line-clamp-2">
            {task.title}
          </h4>

          {task.description && (
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-3">
            {task.assigneeEmail && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-3 w-3" />
                </div>
                <span className="truncate max-w-[100px]">
                  {task.assigneeEmail.split("@")[0]}
                </span>
              </div>
            )}

            {task.comments && task.comments.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>{task.comments.length}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
