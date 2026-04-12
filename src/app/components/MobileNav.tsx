import React from 'react';
import { NavLink } from 'react-router';
import { Library, BookOpen, Heart, Settings } from 'lucide-react';

export function MobileNav() {
  const navItems = [
    { to: '/', label: 'Explore', icon: Library },
    { to: '/my-library', label: 'Library', icon: BookOpen },
    { to: '/wishlist', label: 'Wishlist', icon: Heart },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-3 flex-1 transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
