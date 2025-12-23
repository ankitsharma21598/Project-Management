import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { ArrowLeft, Calendar, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TaskBoard } from "@/components/tasks/TaskBoard";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskDetail } from "@/components/tasks/TaskDetail";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ErrorBanner } from "@/components/common/ErrorBanner";
import { KanbanColumnSkeleton } from "@/components/common/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { PROJECT_QUERY } from "@/graphql/queries";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  closeCreateTaskModal,
  closeEditTaskModal,
  closeTaskDetailModal,
} from "@/store/uiSlice";
import type { Project, TaskStatus } from "@/types";

interface ProjectResponse {
  project: Project;
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { modals } = useAppSelector((state) => state.ui);

  const [taskFormStatus, setTaskFormStatus] = useState<TaskStatus>("TODO");
  const [showTaskForm, setShowTaskForm] = useState(false);

  const { data, loading, error, refetch } = useQuery<ProjectResponse>(
    PROJECT_QUERY,
    {
      variables: { projectId: id },
      skip: !id,
    }
  );

  const project = data?.project;

  const handleAddTask = (status: TaskStatus) => {
    setTaskFormStatus(status);
    setShowTaskForm(true);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="mb-8">
          <div className="h-8 w-48 skeleton rounded mb-2" />
          <div className="h-4 w-96 skeleton rounded" />
        </div>
        <div className="flex gap-6 overflow-x-auto pb-6">
          {[...Array(4)].map((_, i) => (
            <KanbanColumnSkeleton key={i} />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  if (error || !project) {
    return (
      <DashboardLayout>
        <ErrorBanner
          title="Project not found"
          message="The project you're looking for doesn't exist or you don't have access to it."
          onRetry={() => refetch()}
        />
        <div className="mt-6">
          <Button variant="outline" onClick={() => navigate("/projects")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/projects"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Projects
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-foreground">
                {project.name}
              </h1>
              {/* <StatusBadge status={project.status} /> */}
            </div>
            {project.description && (
              <p className="text-muted-foreground max-w-2xl mb-3">
                {project.description}
              </p>
            )}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {/* {project.dueDate && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>Due {format(new Date(project.dueDate), "MMM d, yyyy")}</span>
                </div>
              )} */}
              <span>{project.tasks?.length || 0} tasks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Task Board */}
      <TaskBoard
        tasks={project.tasks || []}
        projectId={project.id}
        onAddTask={handleAddTask}
      />

      {/* Modals */}
      {showTaskForm && (
        <TaskForm
          projectId={project.id}
          initialStatus={taskFormStatus}
          onClose={() => setShowTaskForm(false)}
        />
      )}

      {modals.editTask && (
        <TaskForm
          projectId={project.id}
          task={project.tasks?.find((t) => t.id === modals.editTask)}
          onClose={() => dispatch(closeEditTaskModal())}
        />
      )}

      {modals.taskDetail && (
        <TaskDetail taskId={modals.taskDetail} projectId={project.id} />
      )}
    </DashboardLayout>
  );
};

export default ProjectDetail;
