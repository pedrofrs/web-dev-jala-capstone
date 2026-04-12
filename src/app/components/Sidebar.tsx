import { NavLink } from 'react-router';
import { Library, BookOpen, Heart, Settings, Bell, DoorOpen, Database, Clock, FileText } from 'lucide-react';
import { Badge } from './ui/badge';
import { UserMenu } from './UserMenu';

export function Sidebar() {
  const navItems = [
    { to: '/', label: 'Explore', icon: Library },
    { to: '/my-library', label: 'My Library', icon: BookOpen },
    { to: '/wishlist', label: 'Wishlist', icon: Heart, badge: 2 },
    { to: '/study-rooms', label: 'Study Rooms', icon: DoorOpen },
    { to: '/databases', label: 'Research Databases', icon: Database },
    { to: '/form', label: 'Form', icon: FileText },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex w-64 bg-card border-r border-border flex-col h-screen sticky top-0">
      <div className="p-8">
        <h1 className="text-2xl font-bold text-primary">UniLibrary</h1>
        <p className="text-sm text-muted-foreground mt-1">Academic Resources</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-accent'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <Badge className="bg-warning text-warning-foreground">
                {item.badge}
              </Badge>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 space-y-3 border-t border-border">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-accent transition-colors">
          <Bell className="w-5 h-5" />
          <span className="flex-1">Notifications</span>
          <Badge className="bg-destructive text-destructive-foreground">
            3
          </Badge>
        </button>
        
        <div className="px-4 py-2 bg-accent/50 rounded-lg">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>Hours: 8AM - 10PM</span>
          </div>
        </div>

        <div className="pt-3 border-t border-border">
          <UserMenu />
        </div>
      </div>
    </aside>
  );
}