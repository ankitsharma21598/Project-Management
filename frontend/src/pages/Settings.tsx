import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { User, Building2, Bell, Shield } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  const { user, currentOrganization } = useAppSelector((state) => state.auth);

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and organization settings.
          </p>
        </div>

        {/* Profile Section */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Profile</h2>
              <p className="text-sm text-muted-foreground">
                Manage your personal information
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  defaultValue={user?.firstName}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  defaultValue={user?.lastName}
                  disabled
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue={user?.email}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                defaultValue={user?.role}
                disabled
              />
            </div>
          </div>
        </div>

        {/* Organization Section */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6 animate-fade-in stagger-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Organization
              </h2>
              <p className="text-sm text-muted-foreground">
                Manage your organization settings
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orgName">Organization Name</Label>
              <Input
                id="orgName"
                defaultValue={currentOrganization?.name}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="orgRole">Your Role</Label>
              <Input
                id="orgRole"
                defaultValue={currentOrganization?.role}
                disabled
              />
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6 animate-fade-in stagger-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Notifications
              </h2>
              <p className="text-sm text-muted-foreground">
                Configure your notification preferences
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive email updates about your projects
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Task Assignments</p>
                <p className="text-sm text-muted-foreground">
                  Get notified when you're assigned to a task
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Comments</p>
                <p className="text-sm text-muted-foreground">
                  Get notified when someone comments on your tasks
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-card border border-border rounded-xl p-6 animate-fade-in stagger-3">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Security</h2>
              <p className="text-sm text-muted-foreground">
                Manage your account security
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Change Password</p>
                <p className="text-sm text-muted-foreground">
                  Update your password regularly for security
                </p>
              </div>
              <Button variant="outline" size="sm">
                Change
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">
                  Two-Factor Authentication
                </p>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
