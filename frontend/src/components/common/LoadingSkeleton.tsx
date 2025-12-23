import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  variant?: "text" | "card" | "avatar" | "button";
}

export const LoadingSkeleton = ({
  className,
  variant = "text",
}: LoadingSkeletonProps) => {
  const variants = {
    text: "h-4 w-full",
    card: "h-32 w-full",
    avatar: "h-10 w-10 rounded-full",
    button: "h-10 w-24",
  };

  return (
    <div
      className={cn(
        "skeleton rounded-md",
        variants[variant],
        className
      )}
    />
  );
};

export const ProjectCardSkeleton = () => (
  <div className="rounded-xl border border-border bg-card p-6 space-y-4">
    <div className="flex items-start justify-between">
      <LoadingSkeleton className="h-6 w-48" />
      <LoadingSkeleton className="h-6 w-20" />
    </div>
    <LoadingSkeleton className="h-4 w-full" />
    <LoadingSkeleton className="h-4 w-3/4" />
    <div className="flex items-center gap-4 pt-2">
      <LoadingSkeleton className="h-4 w-24" />
      <LoadingSkeleton className="h-4 w-32" />
    </div>
  </div>
);

export const TaskCardSkeleton = () => (
  <div className="rounded-lg border border-border bg-card p-4 space-y-3">
    <LoadingSkeleton className="h-5 w-full" />
    <LoadingSkeleton className="h-4 w-3/4" />
    <div className="flex items-center gap-2 pt-1">
      <LoadingSkeleton variant="avatar" className="h-6 w-6" />
      <LoadingSkeleton className="h-3 w-24" />
    </div>
  </div>
);

export const KanbanColumnSkeleton = () => (
  <div className="flex flex-col gap-3 min-w-[320px]">
    <div className="flex items-center gap-2 mb-2">
      <LoadingSkeleton className="h-5 w-32" />
      <LoadingSkeleton className="h-5 w-8" />
    </div>
    <TaskCardSkeleton />
    <TaskCardSkeleton />
    <TaskCardSkeleton />
  </div>
);
