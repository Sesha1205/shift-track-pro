import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Clock, Download, Filter, Calendar, Users } from 'lucide-react';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';

interface TimeEntry {
  id: string;
  employee_id: string;
  employee_name: string;
  clock_in_time: string | null;
  clock_out_time: string | null;
  total_hours: number | null;
  date: string;
  status: 'clocked_in' | 'clocked_out';
  notes: string | null;
}

interface TimesheetSummary {
  employee_id: string;
  employee_name: string;
  total_hours: number;
  days_worked: number;
  avg_hours_per_day: number;
}

const TimesheetManagement = () => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<TimeEntry[]>([]);
  const [summaries, setSummaries] = useState<TimesheetSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [startDate, setStartDate] = useState(format(startOfWeek(new Date()), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(endOfWeek(new Date()), 'yyyy-MM-dd'));
  const { toast } = useToast();

  useEffect(() => {
    fetchTimeEntries();
  }, [startDate, endDate]);

  useEffect(() => {
    filterAndSummarizeData();
  }, [timeEntries, selectedEmployee]);

  const fetchTimeEntries = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('time_entries' as any)
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false })
        .order('employee_name', { ascending: true });

      if (error) {
        throw error;
      }

      setTimeEntries((data as unknown as TimeEntry[]) || []);
    } catch (error) {
      console.error('Error fetching time entries:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch timesheet data.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSummarizeData = () => {
    let filtered = timeEntries;
    
    if (selectedEmployee !== 'all') {
      filtered = timeEntries.filter(entry => entry.employee_id === selectedEmployee);
    }
    
    setFilteredEntries(filtered);

    // Calculate summaries
    const employeeSummaries: { [key: string]: TimesheetSummary } = {};
    
    filtered.forEach(entry => {
      if (!employeeSummaries[entry.employee_id]) {
        employeeSummaries[entry.employee_id] = {
          employee_id: entry.employee_id,
          employee_name: entry.employee_name,
          total_hours: 0,
          days_worked: 0,
          avg_hours_per_day: 0,
        };
      }
      
      if (entry.total_hours) {
        employeeSummaries[entry.employee_id].total_hours += entry.total_hours;
        employeeSummaries[entry.employee_id].days_worked += 1;
      }
    });

    // Calculate averages
    Object.values(employeeSummaries).forEach(summary => {
      if (summary.days_worked > 0) {
        summary.avg_hours_per_day = summary.total_hours / summary.days_worked;
      }
    });

    setSummaries(Object.values(employeeSummaries));
  };

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    const today = new Date();
    
    switch (period) {
      case 'today':
        setStartDate(format(today, 'yyyy-MM-dd'));
        setEndDate(format(today, 'yyyy-MM-dd'));
        break;
      case 'week':
        setStartDate(format(startOfWeek(today), 'yyyy-MM-dd'));
        setEndDate(format(endOfWeek(today), 'yyyy-MM-dd'));
        break;
      case 'month':
        setStartDate(format(new Date(today.getFullYear(), today.getMonth(), 1), 'yyyy-MM-dd'));
        setEndDate(format(new Date(today.getFullYear(), today.getMonth() + 1, 0), 'yyyy-MM-dd'));
        break;
    }
  };

  const exportTimesheet = () => {
    const csvContent = [
      ['Employee ID', 'Employee Name', 'Date', 'Clock In', 'Clock Out', 'Total Hours', 'Status'],
      ...filteredEntries.map(entry => [
        entry.employee_id,
        entry.employee_name,
        entry.date,
        entry.clock_in_time ? format(new Date(entry.clock_in_time), 'HH:mm:ss') : '',
        entry.clock_out_time ? format(new Date(entry.clock_out_time), 'HH:mm:ss') : '',
        entry.total_hours?.toFixed(2) || '',
        entry.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timesheet_${startDate}_to_${endDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getUniqueEmployees = () => {
    const employees = Array.from(new Set(timeEntries.map(entry => entry.employee_id)))
      .map(id => {
        const entry = timeEntries.find(e => e.employee_id === id);
        return { id, name: entry?.employee_name || '' };
      });
    return employees;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaries.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summaries.reduce((acc, s) => acc + s.total_hours, 0).toFixed(1)}h
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Hours/Day</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summaries.length > 0 
                ? (summaries.reduce((acc, s) => acc + s.avg_hours_per_day, 0) / summaries.length).toFixed(1)
                : '0.0'
              }h
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Today</CardTitle>
            <Badge variant="outline">Live</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredEntries.filter(e => 
                e.date === format(new Date(), 'yyyy-MM-dd') && e.status === 'clocked_in'
              ).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Export
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="space-y-2">
              <Label>Time Period</Label>
              <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Employee</Label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  {getUniqueEmployees().map(emp => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={exportTimesheet} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Employee Summary */}
      {summaries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Employee Summary</CardTitle>
            <CardDescription>Work hours summary for the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Total Hours</TableHead>
                  <TableHead>Days Worked</TableHead>
                  <TableHead>Avg Hours/Day</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summaries.map((summary) => (
                  <TableRow key={summary.employee_id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{summary.employee_name}</div>
                        <div className="text-sm text-muted-foreground">{summary.employee_id}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">
                      {summary.total_hours.toFixed(2)}h
                    </TableCell>
                    <TableCell>{summary.days_worked}</TableCell>
                    <TableCell className="font-mono">
                      {summary.avg_hours_per_day.toFixed(2)}h
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Detailed Time Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Time Entries</CardTitle>
          <CardDescription>Detailed clock in/out records</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading timesheet data...</div>
          ) : filteredEntries.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No time entries found for the selected period.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Clock In</TableHead>
                  <TableHead>Clock Out</TableHead>
                  <TableHead>Total Hours</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-mono">
                      {format(new Date(entry.date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{entry.employee_name}</div>
                        <div className="text-sm text-muted-foreground">{entry.employee_id}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">
                      {entry.clock_in_time 
                        ? format(new Date(entry.clock_in_time), 'HH:mm:ss')
                        : '-'
                      }
                    </TableCell>
                    <TableCell className="font-mono">
                      {entry.clock_out_time 
                        ? format(new Date(entry.clock_out_time), 'HH:mm:ss')
                        : '-'
                      }
                    </TableCell>
                    <TableCell className="font-mono">
                      {entry.total_hours ? `${entry.total_hours.toFixed(2)}h` : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={entry.status === 'clocked_in' ? 'default' : 'secondary'}
                      >
                        {entry.status === 'clocked_in' ? 'Active' : 'Completed'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TimesheetManagement;