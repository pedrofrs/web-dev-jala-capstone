import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Moon,
  Bell,
  Lock,
  LogOut,
  ChevronRight,
  Mail,
  Eye,
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { useAuth } from '../hooks/AuthContext';
import { useTheme } from '../hooks/ThemeContext';
import { useNavigate } from 'react-router';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export default function Settings() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    loanReminders: true,
    newBooksAlerts: true,
    reservationUpdates: true,
    promotions: false,
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'private',
    showWishlist: false,
    allowMessages: true,
  });

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleNotificationChange = (key: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handlePrivacyChange = (key: string, value: any) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="min-h-screen p-8 space-y-8 bg-background">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-secondary">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and notifications
        </p>
      </div>

      {/* Account Section */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold text-secondary">Account</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium text-secondary">{user?.email}</p>
            </div>
            <Mail className="w-4 h-4 text-muted-foreground" />
          </div>

          <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border">
            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-medium text-secondary">{user?.name}</p>
            </div>
            <User className="w-4 h-4 text-muted-foreground" />
          </div>

          <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border">
            <div>
              <p className="text-sm text-muted-foreground">Registration Number</p>
              <p className="font-medium text-secondary">
                {user?.registrationNumber || 'Not set'}
              </p>
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Update your profile information
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    defaultValue={user?.name}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={user?.email}
                    placeholder="your@email.com"
                  />
                </div>
                <Button className="w-full">Save Changes</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      {/* Theme Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Moon className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold text-secondary">Appearance</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border hover:bg-accent/50 transition-colors">
            <div>
              <p className="font-medium text-secondary">Dark Mode</p>
              <p className="text-sm text-muted-foreground">
                {isDark ? 'Enabled' : 'Disabled'}
              </p>
            </div>
            <Switch checked={isDark} onCheckedChange={toggleTheme} />
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold text-secondary">Notifications</h2>
        </div>

        <div className="space-y-3">
          {[
            {
              key: 'emailNotifications',
              label: 'Email Notifications',
              description: 'Receive updates via email',
            },
            {
              key: 'loanReminders',
              label: 'Loan Reminders',
              description: 'Get notified about loan due dates',
            },
            {
              key: 'newBooksAlerts',
              label: 'New Books Alerts',
              description: 'Notify about new arrivals in your interests',
            },
            {
              key: 'reservationUpdates',
              label: 'Reservation Updates',
              description: 'Updates when reserved books are available',
            },
            {
              key: 'promotions',
              label: 'Promotions & Offers',
              description: 'Special offers and library promotions',
            },
          ].map(item => (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 bg-card rounded-lg border border-border hover:bg-accent/50 transition-colors"
            >
              <div>
                <p className="font-medium text-secondary">{item.label}</p>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <Switch
                checked={
                  notificationSettings[
                    item.key as keyof typeof notificationSettings
                  ]
                }
                onCheckedChange={() =>
                  handleNotificationChange(
                    item.key as keyof typeof notificationSettings
                  )
                }
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Privacy Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Eye className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold text-secondary">Privacy</h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-card rounded-lg border border-border">
            <p className="font-medium text-secondary mb-2">Profile Visibility</p>
            <select
              value={privacySettings.profileVisibility}
              onChange={e =>
                handlePrivacyChange('profileVisibility', e.target.value)
              }
              className="w-full p-2 rounded-md border border-border bg-background text-secondary"
            >
              <option value="private">Private</option>
              <option value="friends">Friends Only</option>
              <option value="public">Public</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border hover:bg-accent/50 transition-colors">
            <div>
              <p className="font-medium text-secondary">Show My Wishlist</p>
              <p className="text-sm text-muted-foreground">
                Allow others to see your wishlist
              </p>
            </div>
            <Switch
              checked={privacySettings.showWishlist}
              onCheckedChange={value =>
                handlePrivacyChange('showWishlist', value)
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border hover:bg-accent/50 transition-colors">
            <div>
              <p className="font-medium text-secondary">Allow Messages</p>
              <p className="text-sm text-muted-foreground">
                Let other users send you messages
              </p>
            </div>
            <Switch
              checked={privacySettings.allowMessages}
              onCheckedChange={value =>
                handlePrivacyChange('allowMessages', value)
              }
            />
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold text-secondary">Security</h2>
        </div>

        <div className="space-y-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between"
              >
                Change Password
                <ChevronRight className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change Password</DialogTitle>
                <DialogDescription>
                  Enter your current password and choose a new one
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                  />
                </div>
                <Button className="w-full">Update Password</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" className="w-full justify-between">
            Two-Factor Authentication
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-destructive/30 bg-destructive/5">
        <div className="flex items-center gap-3 mb-6">
          <LogOut className="w-5 h-5 text-destructive" />
          <h2 className="text-2xl font-bold text-destructive">Danger Zone</h2>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
              >
                Delete Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-destructive">
                  Delete Account
                </DialogTitle>
                <DialogDescription>
                  This action cannot be undone. All your data will be permanently
                  deleted.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Type <strong>DELETE</strong> to confirm:
                </p>
                <Input placeholder="Type DELETE to confirm" />
                <Button variant="destructive" className="w-full">
                  Delete My Account
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    </div>
  );
}
