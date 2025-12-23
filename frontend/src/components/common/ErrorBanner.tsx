import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorBannerProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorBanner = ({
  title = "Something went wrong",
  message,
  onRetry,
  className,
}: ErrorBannerProps) => {
  return (
    <div
      className={cn(
        "flex items-start gap-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20 animate-fade-in",
        className
      )}
    >
      <div className="h-10 w-10 rounded-lg bg-destructive/20 flex items-center justify-center flex-shrink-0">
        <AlertCircle className="h-5 w-5 text-destructive" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground mt-1">{message}</p>
      </div>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="flex-shrink-0 gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      )}
    </div>
  );
};
