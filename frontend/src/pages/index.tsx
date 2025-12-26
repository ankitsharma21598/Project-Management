import { useQuery, useMutation } from "@apollo/client/react";
import { FolderKanban, Plus, TrendingUp, CheckCircle, Clock } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { ProjectCardSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorBanner } from "@/components/common/ErrorBanner";
import { Button } from "@/components/ui/button";
import { PROJECTS_QUERY } from "@/graphql/queries";
import { DELETE_PROJECT_MUTATION } from "@/graphql/mutations";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  openCreateProjectModal,
  closeCreateProjectModal,
  openEditProjectModal,
  closeEditProjectModal,
} from "@/store/uiSlice";
import type { Project } from "@/types";
import { toast } from "react-toastify";

interface ProjectsResponse {
  projects: Project[];
}

interface ProjectsVariables {
  organizationId: string;
}


const Index = () => {
  const dispatch = useAppDispatch();
  
  const { modals, searchQuery } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);
  

  const { data, loading, error, refetch } = useQuery<
    ProjectsResponse,
    ProjectsVariables
  >(
    PROJECTS_QUERY,
    {
      variables: {
        organizationId: user!.organizationId,
      }
    }
  );

  const [deleteProject] = useMutation(DELETE_PROJECT_MUTATION, {
    refetchQueries: [{ query: PROJECTS_QUERY, variables: { organizationId: user?.organizationId } }],
  });

  const projects = data?.projects || [];
  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: projects.length,
    active: projects.filter((p) => p.status === "ACTIVE").length,
    completed: projects.filter((p) => p.status === "COMPLETED").length,
    onHold: projects.filter((p) => p.status === "ON_HOLD").length,
  };
  

  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      await deleteProject({ variables: { id: projectId } });
      toast.success("Project deleted successfully");
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  const editingProject = modals.editProject
    ? projects.find((p) => p.id === modals.editProject)
    : null;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome back, {user?.firstName || "there"}!
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your projects and tasks.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Projects",
            value: stats?.total,
            icon: FolderKanban,
            color: "text-primary",
            bgColor: "bg-primary/10",
          },
          {
            label: "Active",
            value: stats?.active,
            icon: TrendingUp,
            color: "text-success",
            bgColor: "bg-success/10",
          },
          {
            label: "Completed",
            value: stats?.completed,
            icon: CheckCircle,
            color: "text-primary",
            bgColor: "bg-primary/10",
          },
          {
            label: "On Hold",
            value: stats?.onHold,
            icon: Clock,
            color: "text-warning",
            bgColor: "bg-warning/10",
          },
        ]
        .map((stat, index) => (
          <div
            key={stat?.label}
            className="bg-card border border-border rounded-xl p-5 animate-fade-in "
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat?.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat?.value}</p>
              </div>
              <div className={`h-10 w-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`h-5 w-5 ${stat?.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Projects Section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Projects</h2>
        <Button
          onClick={() => dispatch(openCreateProjectModal())}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {error && (
        <ErrorBanner
          message="Failed to load projects. Please try again."
          onRetry={() => refetch()}
          className="mb-6"
        />
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          icon={<FolderKanban className="h-8 w-8 text-muted-foreground" />}
          title={searchQuery ? "No projects found" : "No projects yet"}
          description={
            searchQuery
              ? `No projects match "${searchQuery}"`
              : "Create your first project to get started"
          }
          action={
            !searchQuery
              ? {
                  label: "Create Project",
                  onClick: () => dispatch(openCreateProjectModal()),
                }
              : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onEdit={(p) => dispatch(openEditProjectModal(p.id))}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {modals.createProject && (
        <ProjectForm onClose={() => dispatch(closeCreateProjectModal())} />
      )}

      {modals.editProject && editingProject && (
        <ProjectForm
          project={editingProject}
          onClose={() => dispatch(closeEditProjectModal())}
        />
      )}
    </DashboardLayout>
  );
};

export default Index;
