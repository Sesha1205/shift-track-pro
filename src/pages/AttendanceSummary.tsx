
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Download, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'leave';
  leaveType?: string;
  hoursWorked?: number;
  tasksLogged?: number;
}

const AttendanceSummary = () => {
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState('2024-01');
  
  const months = [
    { value: '2024-01', label: 'January 2024' },
    { value: '2023-12', label: 'December 2023' },
    { value: '2023-11', label: 'November 2023' },
  ];

  // Mock attendance data
  const attendanceData: AttendanceRecord[] = [
    { date: '2024-01-01', status: 'leave', leaveType: 'Holiday' },
    { date: '2024-01-02', status: 'present', hoursWorked: 8.5, tasksLogged: 4 },
    { date: '2024-01-03', status: 'present', hoursWorked: 8.0, tasksLogged: 3 },
    { date: '2024-01-04', status: 'present', hoursWorked: 7.5, tasksLogged: 5 },
    { date: '2024-01-05', status: 'present', hoursWorked: 8.0, tasksLogged: 3 },
    { date: '2024-01-08', status: 'present', hoursWorked: 8.5, tasksLogged: 4 },
    { date: '2024-01-09', status: 'present', hoursWorked: 8.0, tasksLogged: 6 },
    { date: '2024-01-10', status: 'leave', leaveType: 'Casual' },
    { date: '2024-01-11', status: 'leave', leaveType: 'Casual' },
    { date: '2024-01-12', status: 'leave', leaveType: 'Casual' },
    { date: '2024-01-15', status: 'present', hoursWorked: 8.0, tasksLogged: 4 },
    { date: '2024-01-16', status: 'present', hoursWorked: 7.5, tasksLogged: 3 },
    { date: '2024-01-17', status: 'absent' },
    { date: '2024-01-18', status: 'present', hoursWorked: 8.5, tasksLogged: 5 },
    { date: '2024-01-19', status: 'present', hoursWorked: 8.0, tasksLogged: 4 },
  ];

  const calculateStats = () => {
    const totalDays = attendanceData.length;
    const presentDays = attendanceData.filter(d => d.status === 'present').length;
    const leaveDays = attendanceData.filter(d => d.status === 'leave').length;
    const absentDays = attendanceData.filter(d => d.status === 'absent').length;
    const totalHours = attendanceData
      .filter(d => d.hoursWorked)
      .reduce((sum, d) => sum + (d.hoursWorked || 0), 0);
    const totalTasks = attendanceData
      .filter(d => d.tasksLogged)
      .reduce((sum, d) => sum + (d.tasksLogged || 0), 0);
    
    return {
      totalDays,
      presentDays,
      leaveDays,
      absentDays,
      totalHours,
      totalTasks,
      attendanceRate: Math.round((presentDays / (totalDays - leaveDays)) * 100)
    };
  };

  const stats = calculateStats();

  const handleExportToExcel = () => {
    toast({
      title: "Export Started",
      description: "Your attendance summary is being prepared for download.",
    });
    
    // In a real application, this would generate and download an Excel file
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Attendance summary has been downloaded successfully.",
      });
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'absent':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'leave':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string, leaveType?: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Present</Badge>;
      case 'absent':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Absent</Badge>;
      case 'leave':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">{leaveType || 'Leave'}</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Attendance Summary</h1>
          <p className="text-muted-foreground">Track your monthly attendance and work hours</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleExportToExcel} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Days Present</p>
                <p className="text-2xl font-bold text-green-600">{stats.presentDays}</p>
                <p className="text-xs text-muted-foreground">Out of {stats.totalDays - stats.leaveDays} working days</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Attendance Rate</p>
                <p className="text-2xl font-bold text-blue-600">{stats.attendanceRate}%</p>
                <p className="text-xs text-muted-foreground">This month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Hours</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalHours}h</p>
                <p className="text-xs text-muted-foreground">Work hours logged</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tasks Logged</p>
                <p className="text-2xl font-bold text-orange-600">{stats.totalTasks}</p>
                <p className="text-xs text-muted-foreground">Total activities</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Monthly Breakdown</CardTitle>
            <CardDescription>Overview of your attendance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium">Present</span>
              </div>
              <span className="font-bold text-green-600">{stats.presentDays} days</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Leave</span>
              </div>
              <span className="font-bold text-blue-600">{stats.leaveDays} days</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600" />
                <span className="font-medium">Absent</span>
              </div>
              <span className="font-bold text-red-600">{stats.absentDays} days</span>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Attendance Details</CardTitle>
            <CardDescription>Day-wise attendance record for {selectedMonth}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Hours Worked</TableHead>
                  <TableHead>Tasks Logged</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceData.map((record) => (
                  <TableRow key={record.date}>
                    <TableCell className="font-medium">
                      {new Date(record.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(record.status)}
                        {getStatusBadge(record.status, record.leaveType)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {record.hoursWorked ? `${record.hoursWorked}h` : '-'}
                    </TableCell>
                    <TableCell>
                      {record.tasksLogged || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AttendanceSummary;
