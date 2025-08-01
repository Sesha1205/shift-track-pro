
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import ClockInOut from '@/components/ClockInOut';
import { 
  Clock, 
  Calendar, 
  BarChart3, 
  History, 
  Plus,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const quickStats = [
    {
      title: 'Hours This Week',
      value: '0.0',
      icon: Clock,
      trend: 'Start logging your hours',
      color: 'text-blue-600'
    },
    {
      title: 'Leave Balance',
      value: '0 days',
      icon: Calendar,
      trend: 'No leave applications yet',
      color: 'text-green-600'
    },
    {
      title: 'Attendance Rate',
      value: '0%',
      icon: TrendingUp,
      trend: 'This month',
      color: 'text-purple-600'
    },
    {
      title: 'Pending Requests',
      value: '0',
      icon: AlertCircle,
      trend: 'No pending requests',
      color: 'text-orange-600'
    }
  ];

  const quickActions = [
    {
      title: 'Log Task',
      description: 'Record your daily work activities',
      icon: Plus,
      action: () => navigate('/timesheet'),
      color: 'bg-blue-500'
    },
    {
      title: 'Apply for Leave',
      description: 'Submit a new leave request',
      icon: Calendar,
      action: () => navigate('/leave-request'),
      color: 'bg-green-500'
    },
    {
      title: 'View Attendance',
      description: 'Check your monthly summary',
      icon: BarChart3,
      action: () => navigate('/attendance'),
      color: 'bg-purple-500'
    },
    {
      title: 'Leave History',
      description: 'Review past applications',
      icon: History,
      action: () => navigate('/leave-history'),
      color: 'bg-orange-500'
    }
  ];

  const recentTasks: any[] = [];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground">{currentDate}</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {user?.department}
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-md transition-all hover:scale-105 cursor-pointer">
              <CardContent className="p-6" onClick={action.action}>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`p-3 rounded-full ${action.color} text-white`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Clock In/Out Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ClockInOut />
        </div>
        
        {/* Recent Tasks and Events */}
        <div className="lg:col-span-2 grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Tasks
            </CardTitle>
            <CardDescription>
              Your latest logged activities
            </CardDescription>
          </CardHeader>
           <CardContent>
            <div className="space-y-4">
              {recentTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No tasks logged yet</p>
                  <p className="text-sm">Start by logging your first task</p>
                </div>
              ) : (
                recentTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-muted-foreground">{task.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{task.duration}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-green-600">Completed</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => navigate('/timesheet')}
            >
              View All Tasks
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
            <CardDescription>
              Your schedule for this week
            </CardDescription>
          </CardHeader>
           <CardContent>
            <div className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No upcoming events scheduled</p>
                <p className="text-sm">Your calendar is empty</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => navigate('/attendance')}
            >
              View Calendar
            </Button>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
