import { useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { useMutation } from "@apollo/client/react";
import { Task, TaskStatus } from "@/types";
import { TaskColumn } from "./TaskColumn";
import { TaskCard } from "./TaskCard";
import { UPDATE_TASK_STATUS_MUTATION } from "@/graphql/mutations";
import { PROJECT_QUERY } from "@/graphql/queries";
import { toast } from "react-toastify";

interface TaskBoardProps {
  tasks: Task[];
  projectId: string;
  onAddTask: (status: TaskStatus) => void;
}

const COLUMNS: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE", "BLOCKED"];

export const TaskBoard = ({ tasks, projectId, onAddTask }: TaskBoardProps) => {
  const [localTasks, setLocalTasks] = useState(tasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const [updateTaskStatus] = useMutation(UPDATE_TASK_STATUS_MUTATION, {
    refetchQueries: [{ query: PROJECT_QUERY, variables: { projectId } }],
  });

  // Group tasks by status
  const tasksByStatus: Record<TaskStatus, Task[]> = {
    TODO: [],
    IN_PROGRESS: [],
    DONE: [],
    BLOCKED: [],
  };

  localTasks.forEach((task) => {
    tasksByStatus[task.status].push(task);
  });

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = localTasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeTask = localTasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    // If dragging over a column
    if (COLUMNS.includes(overId as TaskStatus)) {
      if (activeTask.status !== overId) {
        setLocalTasks((prev) =>
          prev.map((t) =>
            t.id === activeId ? { ...t, status: overId as TaskStatus } : t
          )
        );
      }
      return;
    }

    // If dragging over another task
    const overTask = localTasks.find((t) => t.id === overId);
    if (!overTask) return;

    if (activeTask.status !== overTask.status) {
      setLocalTasks((prev) =>
        prev.map((t) =>
          t.id === activeId ? { ...t, status: overTask.status } : t
        )
      );
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveTask(null);

    if (!over) return;

    const activeId = active.id;
    const task = localTasks.find((t) => t.id === activeId);

    if (!task) return;

    // Determine the new status
    let newStatus: TaskStatus = task.status;

    if (COLUMNS.includes(over.id as TaskStatus)) {
      newStatus = over.id as TaskStatus;
    } else {
      const overTask = localTasks.find((t) => t.id === over.id);
      if (overTask) {
        newStatus = overTask.status;
      }
    }

    const originalTask = tasks.find((t) => t.id === activeId);
    if (originalTask && originalTask.status !== newStatus) {
      console.log("Updating task status:", activeId, "from", originalTask.status, "to", newStatus);

      try {
        await updateTaskStatus({
          variables: { id: activeId, status: newStatus },
          optimisticResponse: {
            updateTaskStatus: {
              id: activeId,
              status: newStatus,
            },
          },
        });
        toast.success("Task status updated");
      } catch (error) {
        // Revert on error
        setLocalTasks(tasks);
        toast.error("Failed to update task status");
      }
    }
  };

  // Sync with props
  useState(() => {
    setLocalTasks(tasks);
  });

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 overflow-x-auto pb-6">
        {COLUMNS.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasksByStatus[status]}
            onAddTask={onAddTask}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="opacity-80">
            <TaskCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
