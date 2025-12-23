import { ReactNode, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setOrganizations } from "@/store/authSlice";
import { useQuery } from "@apollo/client/react";
import { MY_ORGANIZATIONS_QUERY } from "@/graphql/queries";
import { cn } from "@/lib/utils";
import type { Organization } from "@/types";

interface DashboardLayoutProps {
  children: ReactNode;
}

interface OrganizationsResponse {
  myOrganizations: Organization[];
}

interface OrganizationVariables {
  organizationId: string;
}


export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { sidebarOpen } = useAppSelector((state) => state.ui);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const {user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const { data: orgsData } = useQuery<OrganizationsResponse, OrganizationVariables>(
    MY_ORGANIZATIONS_QUERY,
    {
      variables: {
        organizationId: user?.organizationId || "",
      },
      skip: !user?.organizationId,
    }
  );

  useEffect(() => {
    if (orgsData?.myOrganizations) {
      dispatch(setOrganizations(orgsData.myOrganizations));
    }
  }, [orgsData, dispatch]);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          sidebarOpen ? "lg:pl-64" : "lg:pl-20"
        )}
      >
        <Header />
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};
