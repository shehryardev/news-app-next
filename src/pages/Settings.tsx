import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-app-text-primary">Settings</h1>
          <p className="text-app-text-secondary mt-2">Manage your account and preferences</p>
        </div>

        {/* Profile Settings */}
        <Card className="p-6 bg-app-surface border-app-border">
          <h2 className="text-xl font-semibold text-app-text-primary mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-app-text-secondary">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                className="mt-1 bg-app-background border-app-border text-app-text-primary"
              />
            </div>
            <div>
              <Label htmlFor="username" className="text-app-text-secondary">Username</Label>
              <Input
                id="username"
                placeholder="username"
                className="mt-1 bg-app-background border-app-border text-app-text-primary"
              />
            </div>
          </div>
        </Card>

        {/* Preferences */}
        <Card className="p-6 bg-app-surface border-app-border">
          <h2 className="text-xl font-semibold text-app-text-primary mb-4">Preferences</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-app-text-primary">Email Notifications</Label>
                <p className="text-sm text-app-text-muted">Receive email updates about new articles</p>
              </div>
              <Switch />
            </div>
            
            <Separator className="bg-app-border" />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-app-text-primary">Weekly Digest</Label>
                <p className="text-sm text-app-text-muted">Get a weekly summary of popular articles</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator className="bg-app-border" />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-app-text-primary">Show Read Articles</Label>
                <p className="text-sm text-app-text-muted">Display articles you've already read</p>
              </div>
              <Switch />
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline" className="border-app-border text-app-text-secondary">
            Cancel
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            Save Changes
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;