import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Calendar, 
  Clock, 
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Eye,
  UserPlus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AddEmployeeForm from '@/components/AddEmployeeForm';

const AdminDashboard = () => {
  const { toast } = useToast();
  
  const adminStats = [
    {
      title: 'Total Employees',
      value: '45',
      icon: Users,
      trend: '+3 this month',
      color: 'text-blue-600'
    },
    {
      title: 'Pending Requests',
      value: '8',
      icon: AlertCircle,
      trend: 'Leave applications',
      color: 'text-orange-600'
    },
    {
      title: 'This Month Attendance',
      value: '92%',
      icon: TrendingUp,
      trend: 'Average across all',
      color: 'text-green-600'
    },
    {
      title: 'Active Projects',
      value: '12',
      icon: Clock,
      trend: 'Currently ongoing',
      color: 'text-purple-600'
    }
  ];

  const pendingLeaves = [
    {
      id: 1,
      employee: 'John Doe',
      type: 'Casual Leave',
      from: '2024-01-20',
      to: '2024-01-22',
      days: 3,
      reason: 'Family vacation',
      department: 'Engineering'
    },
    {
      id: 2,
      employee: 'Sarah Wilson',
      type: 'Sick Leave',
      from: '2024-01-18',
      to: '2024-01-19',
      days: 2,
      reason: 'Medical appointment',
      department: 'Marketing'
    },
    {
      id: 3,
      employee: 'Mike Johnson',
      type: 'Earned Leave',
      from: '2024-01-25',
      to: '2024-01-29',
      days: 5,
      reason: 'Annual vacation',
      department: 'Sales'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'Leave Approved',
      employee: 'Alice Brown',
      timestamp: '2 hours ago',
      type: 'approval'
    },
    {
      id: 2,
      action: 'New Employee Added',
      employee: 'David Chen',
      timestamp: '5 hours ago',
      type: 'addition'
    },
    {
      id: 3,
      action: 'Leave Rejected',
      employee: 'Emma Davis',
      timestamp: '1 day ago',
      type: 'rejection'
    }
  ];

  const handleLeaveAction = (leaveId: number, action: 'approve' | 'reject') => {
    toast({
      title: `Leave ${action === 'approve' ? 'Approved' : 'Rejected'}`,
      description: `The leave request has been ${action}d successfully.`,
    });
  };

  const handleExportReport = () => {
    toast({
      title: "Report Generated",
      description: "Monthly attendance report has been exported successfully.",
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage employees and oversee operations</p>
        </div>
        <Button onClick={handleExportReport} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminStats.map((stat, index) => (
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

      {/* Main Content Tabs */}
      <Tabs defaultValue="leaves" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="leaves">Leave Management</TabsTrigger>
          <TabsTrigger value="employees">Employee Overview</TabsTrigger>
          <TabsTrigger value="add-employee">Add Employee</TabsTrigger>
          <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="leaves" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Pending Leave Requests
              </CardTitle>
              <CardDescription>
                Review and approve/reject employee leave applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingLeaves.map((leave) => (
                  <div key={leave.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{leave.employee}</h4>
                        <p className="text-sm text-muted-foreground">{leave.department}</p>
                      </div>
                      <Badge variant="outline">{leave.type}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                      <div>
                        <span className="font-medium">From:</span>
                        <p>{leave.from}</p>
                      </div>
                      <div>
                        <span className="font-medium">To:</span>
                        <p>{leave.to}</p>
                      </div>
                      <div>
                        <span className="font-medium">Days:</span>
                        <p>{leave.days}</p>
                      </div>
                      <div>
                        <span className="font-medium">Reason:</span>
                        <p className="truncate">{leave.reason}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleLeaveAction(leave.id, 'approve')}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleLeaveAction(leave.id, 'reject')}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Employee Overview
              </CardTitle>
              <CardDescription>
                Current employee status and attendance summary
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">38</div>
                  <div className="text-sm text-muted-foreground">Present Today</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">5</div>
                  <div className="text-sm text-muted-foreground">On Leave</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-red-600">2</div>
                  <div className="text-sm text-muted-foreground">Absent</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add-employee" className="space-y-4">
          <AddEmployeeForm />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Reports & Analytics
              </CardTitle>
              <CardDescription>
                Generate and download various reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  Monthly Attendance Report
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  Leave Summary Report
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  Timesheet Report
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  Department Wise Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Admin Settings</CardTitle>
              <CardDescription>
                Configure system settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">System Configuration</h4>
                  <p className="text-sm text-muted-foreground">
                    Manage leave policies, working hours, and holiday calendar
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">User Management</h4>
                  <p className="text-sm text-muted-foreground">
                    Handle user roles, permissions, and access controls
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Latest actions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'approval' ? 'bg-green-500' :
                    activity.type === 'rejection' ? 'bg-red-500' : 'bg-blue-500'
                  }`} />
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.employee}</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{activity.timestamp}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
