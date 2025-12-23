import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { setUser, setLoading, logout } from "../../store/authSlice";
import { useQuery } from "@apollo/client/react";
import { ME_QUERY } from "@/graphql/queries";
import { Loader2 } from "lucide-react";
import type { User } from "@/types";

interface ProtectedRouteProps {
  children: ReactNode;
}

interface MeResponse {
  me: User;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const location = useLocation();

  const { data: userData, error: userError, loading: queryLoading } = useQuery<MeResponse>(ME_QUERY, {
    skip: !isAuthenticated || !!user,
  });

  useEffect(() => {
    if (userData?.me) {
      dispatch(setUser(userData.me));
      dispatch(setLoading(false));
    }
    if (userError) {
      dispatch(logout());
      dispatch(setLoading(false));
    }
  }, [userData, userError, dispatch]);
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (loading || queryLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  

  return <>{children}</>;
};
