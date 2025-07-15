
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Filter, Search, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface LeaveRecord {
  id: number;
  type: string;
  fromDate: Date;
  toDate: Date;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: Date;
  approvedBy?: string;
  rejectionReason?: string;
}

const LeaveHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');
  const [selectedLeave, setSelectedLeave] = useState<LeaveRecord | null>(null);

  const leaveHistory: LeaveRecord[] = [
    {
      id: 1,
      type: 'Casual Leave',
      fromDate: new Date('2024-01-10'),
      toDate: new Date('2024-01-12'),
      days: 3,
      reason: 'Family function',
      status: 'approved',
      appliedDate: new Date('2024-01-05'),
      approvedBy: 'Jane Smith (HR)'
    },
    {
      id: 2,
      type: 'Sick Leave',
      fromDate: new Date('2024-01-15'),
      toDate: new Date('2024-01-15'),
      days: 1,
      reason: 'Medical appointment',
      status: 'pending',
      appliedDate: new Date('2024-01-14')
    },
    {
      id: 3,
      type: 'Earned Leave',
      fromDate: new Date('2023-12-20'),
      toDate: new Date('2023-12-29'),
      days: 8,
      reason: 'Annual vacation',
      status: 'approved',
      appliedDate: new Date('2023-12-01'),
      approvedBy: 'Jane Smith (HR)'
    },
    {
      id: 4,
      type: 'Sick Leave',
      fromDate: new Date('2023-11-28'),
      toDate: new Date('2023-11-29'),
      days: 2,
      reason: 'Flu symptoms',
      status: 'rejected',
      appliedDate: new Date('2023-11-27'),
      rejectionReason: 'Insufficient sick leave balance'
    },
    {
      id: 5,
      type: 'Casual Leave',
      fromDate: new Date('2023-11-15'),
      toDate: new Date('2023-11-17'),
      days: 3,
      reason: 'Personal work',
      status: 'approved',
      appliedDate: new Date('2023-11-10'),
      approvedBy: 'Jane Smith (HR)'
    }
  ];

  const filteredLeaves = leaveHistory.filter(leave => {
    const matchesSearch = leave.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         leave.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || leave.status === statusFilter;
    const matchesMonth = monthFilter === 'all' || 
                        format(leave.fromDate, 'yyyy-MM') === monthFilter;
    
    return matchesSearch && matchesStatus && matchesMonth;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-orange-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Rejected</Badge>;
      default:
        return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">Pending</Badge>;
    }
  };

  const leaveStats = {
    total: leaveHistory.length,
    approved: leaveHistory.filter(l => l.status === 'approved').length,
    pending: leaveHistory.filter(l => l.status === 'pending').length,
    rejected: leaveHistory.filter(l => l.status === 'rejected').length,
    totalDays: leaveHistory.filter(l => l.status === 'approved').reduce((sum, l) => sum + l.days, 0)
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Leave History</h1>
        <p className="text-muted-foreground">View and manage your leave application history</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{leaveStats.total}</p>
              <p className="text-sm text-muted-foreground">Total Applications</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{leaveStats.approved}</p>
              <p className="text-sm text-muted-foreground">Approved</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{leaveStats.pending}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{leaveStats.rejected}</p>
              <p className="text-sm text-muted-foreground">Rejected</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{leaveStats.totalDays}</p>
              <p className="text-sm text-muted-foreground">Days Taken</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by reason or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Month</label>
              <Select value={monthFilter} onValueChange={setMonthFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Months</SelectItem>
                  <SelectItem value="2024-01">January 2024</SelectItem>
                  <SelectItem value="2023-12">December 2023</SelectItem>
                  <SelectItem value="2023-11">November 2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leave History Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Leave Applications
          </CardTitle>
          <CardDescription>
            {filteredLeaves.length} of {leaveHistory.length} applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeaves.map((leave) => (
                <TableRow key={leave.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{leave.type}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-xs">
                        {leave.reason}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{format(leave.fromDate, 'MMM d, yyyy')}</p>
                      <p className="text-muted-foreground">
                        to {format(leave.toDate, 'MMM d, yyyy')}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{leave.days} days</Badge>
                  </TableCell>
                  <TableCell>
                    {format(leave.appliedDate, 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(leave.status)}
                      {getStatusBadge(leave.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedLeave(leave)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Leave Details Modal */}
      {selectedLeave && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Leave Details</CardTitle>
              <CardDescription>Application #{selectedLeave.id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Leave Type</label>
                <p>{selectedLeave.type}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium">Duration</label>
                <p>{format(selectedLeave.fromDate, 'PPP')} to {format(selectedLeave.toDate, 'PPP')}</p>
                <p className="text-sm text-muted-foreground">{selectedLeave.days} days</p>
              </div>
              
              <div>
                <label className="text-sm font-medium">Reason</label>
                <p>{selectedLeave.reason}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium">Status</label>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusIcon(selectedLeave.status)}
                  {getStatusBadge(selectedLeave.status)}
                </div>
              </div>
              
              {selectedLeave.approvedBy && (
                <div>
                  <label className="text-sm font-medium">Approved By</label>
                  <p>{selectedLeave.approvedBy}</p>
                </div>
              )}
              
              {selectedLeave.rejectionReason && (
                <div>
                  <label className="text-sm font-medium">Rejection Reason</label>
                  <p className="text-red-600">{selectedLeave.rejectionReason}</p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium">Applied Date</label>
                <p>{format(selectedLeave.appliedDate, 'PPP')}</p>
              </div>
            </CardContent>
            <div className="p-6 pt-0">
              <Button onClick={() => setSelectedLeave(null)} className="w-full">
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LeaveHistory;
