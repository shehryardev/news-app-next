import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Settings as SettingsIcon, Wrench } from "lucide-react";

const Settings = () => {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-app-text-primary">Settings</h1>
          <p className="text-app-text-secondary mt-2">
            Manage your account and preferences
          </p>
        </div>

        {/* Under Construction Card */}
        <Card className="p-12 bg-app-surface border-app-border">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-app-background rounded-full flex items-center justify-center mb-6 border border-app-border">
              <div className="relative">
                <SettingsIcon className="h-10 w-10 text-app-text-muted" />
                <Wrench className="h-6 w-6 text-orange-500 absolute -bottom-1 -right-1" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-app-text-primary mb-4">
              Settings Under Construction
            </h2>

            <p className="text-app-text-secondary max-w-md mx-auto mb-6">
              We're working hard to bring you advanced settings and preferences.
              This feature will be available in the next release build.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 justify-center items-center text-sm text-app-text-muted">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span>In Development</span>
              </div>
              <div className="hidden sm:block">•</div>
              <span>Coming Soon in v2.0</span>
            </div>
          </div>
        </Card>

        {/* Features Preview */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Card className="p-6 bg-app-surface border-app-border opacity-60">
            <h3 className="text-lg font-semibold text-app-text-primary mb-2">
              🔔 Notification Preferences
            </h3>
            <p className="text-app-text-muted text-sm">
              Customize email notifications, push alerts, and digest frequency
            </p>
          </Card>

          <Card className="p-6 bg-app-surface border-app-border opacity-60">
            <h3 className="text-lg font-semibold text-app-text-primary mb-2">
              👤 Profile Management
            </h3>
            <p className="text-app-text-muted text-sm">
              Update your profile, change password, and manage account settings
            </p>
          </Card>

          <Card className="p-6 bg-app-surface border-app-border opacity-60">
            <h3 className="text-lg font-semibold text-app-text-primary mb-2">
              🎨 Theme Customization
            </h3>
            <p className="text-app-text-muted text-sm">
              Choose between light and dark themes, customize colors and layout
            </p>
          </Card>

          <Card className="p-6 bg-app-surface border-app-border opacity-60">
            <h3 className="text-lg font-semibold text-app-text-primary mb-2">
              🔐 Privacy Controls
            </h3>
            <p className="text-app-text-muted text-sm">
              Manage data sharing, reading history, and recommendation
              preferences
            </p>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
