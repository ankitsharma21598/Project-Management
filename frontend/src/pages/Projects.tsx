import { useQuery, useMutation } from "@apollo/client/react";
import { FolderKanban, Plus } from "lucide-react";
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
import { toast } from "sonner";
import type { Project } from "@/types";

interface ProjectsResponse {
  projects: Project[];
}

interface ProjectsVariables {
  organizationId: string;
}

const Projects = () => {
  const dispatch = useAppDispatch();
  const { modals, searchQuery } = useAppSelector((state) => state.ui);

  // const { data, loading, error, refetch } = useQuery<ProjectsResponse>(PROJECTS_QUERY);
  const { data, loading, error, refetch } = useQuery<
    ProjectsResponse,
    ProjectsVariables
  >(PROJECTS_QUERY, {
    variables: {
      organizationId: useAppSelector((state) => state.auth.user?.organizationId)!,
    },
    skip: !useAppSelector((state) => state.auth.user?.organizationId),
  });

  const [deleteProject] = useMutation(DELETE_PROJECT_MUTATION, {
    refetchQueries: [{ query: PROJECTS_QUERY }],
  });

  const projects = data?.projects || [];
  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Projects</h1>
          <p className="text-muted-foreground">
            Manage and track all your projects in one place.
          </p>
        </div>
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

export default Projects;
