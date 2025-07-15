
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Home, 
  Clock, 
  Calendar, 
  BarChart3, 
  History, 
  User, 
  Settings, 
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  Shield
} from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const employeeNavItems = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/timesheet', icon: Clock, label: 'Timesheet' },
    { to: '/leave-request', icon: Calendar, label: 'Leave Request' },
    { to: '/attendance', icon: BarChart3, label: 'Attendance' },
    { to: '/leave-history', icon: History, label: 'Leave History' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  const adminNavItems = [
    { to: '/admin', icon: Shield, label: 'Admin Panel' },
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/timesheet', icon: Clock, label: 'Timesheet' },
    { to: '/leave-request', icon: Calendar, label: 'Leave Request' },
    { to: '/attendance', icon: BarChart3, label: 'Attendance' },
    { to: '/leave-history', icon: History, label: 'Leave History' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  const navItems = isAdmin ? adminNavItems : employeeNavItems;

  return (
    <aside className={`bg-card border-r transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <h2 className="text-lg font-semibold">TimeTracker</h2>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="ml-auto"
            >
              {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback>
                {user?.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.department}</p>
                {isAdmin && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary text-primary-foreground mt-1">
                    Admin
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`
                  }
                >
                  <item.icon className="h-5 w-5" />
                  {!isCollapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="w-full justify-start"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            {!isCollapsed && <span className="ml-3">Toggle Theme</span>}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-destructive hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
