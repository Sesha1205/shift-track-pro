
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Send, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface LeaveRequest {
  id: number;
  type: string;
  fromDate: Date;
  toDate: Date;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: Date;
  days: number;
}

const LeaveRequest = () => {
  const { toast } = useToast();
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [leaveType, setLeaveType] = useState('');
  const [reason, setReason] = useState('');

  const leaveBalance = {
    casual: 8,
    sick: 4,
    earned: 12
  };

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: 1,
      type: 'Casual Leave',
      fromDate: new Date('2024-01-10'),
      toDate: new Date('2024-01-12'),
      reason: 'Family function',
      status: 'approved',
      appliedDate: new Date('2024-01-05'),
      days: 3
    },
    {
      id: 2,
      type: 'Sick Leave',
      fromDate: new Date('2024-01-15'),
      toDate: new Date('2024-01-15'),
      reason: 'Medical appointment',
      status: 'pending',
      appliedDate: new Date('2024-01-14'),
      days: 1
    }
  ]);

  const calculateDays = (from: Date, to: Date): number => {
    const diffTime = Math.abs(to.getTime() - from.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleSubmitLeave = () => {
    if (!fromDate || !toDate || !leaveType || !reason) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (fromDate > toDate) {
      toast({
        title: "Error",
        description: "End date must be after start date.",
        variant: "destructive"
      });
      return;
    }

    const days = calculateDays(fromDate, toDate);
    const newRequest: LeaveRequest = {
      id: Date.now(),
      type: leaveType,
      fromDate,
      toDate,
      reason,
      status: 'pending',
      appliedDate: new Date(),
      days
    };

    setLeaveRequests([newRequest, ...leaveRequests]);
    
    // Reset form
    setFromDate(undefined);
    setToDate(undefined);
    setLeaveType('');
    setReason('');

    toast({
      title: "Leave Request Submitted",
      description: "Your leave application has been submitted for approval.",
    });
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Leave Request</h1>
        <p className="text-muted-foreground">Apply for leave and track your applications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leave Balance */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Leave Balance
              </CardTitle>
              <CardDescription>Your remaining leave days</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div>
                  <p className="font-medium">Casual Leave</p>
                  <p className="text-sm text-muted-foreground">Available</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{leaveBalance.casual}</p>
                  <p className="text-sm text-muted-foreground">days</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div>
                  <p className="font-medium">Sick Leave</p>
                  <p className="text-sm text-muted-foreground">Available</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">{leaveBalance.sick}</p>
                  <p className="text-sm text-muted-foreground">days</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div>
                  <p className="font-medium">Earned Leave</p>
                  <p className="text-sm text-muted-foreground">Available</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-600">{leaveBalance.earned}</p>
                  <p className="text-sm text-muted-foreground">days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leave Application Form */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Apply for Leave</CardTitle>
              <CardDescription>Fill in the details for your leave request</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Leave Type *</Label>
                  <Select value={leaveType} onValueChange={setLeaveType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Casual Leave">Casual Leave</SelectItem>
                      <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                      <SelectItem value="Earned Leave">Earned Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Duration</Label>
                  <div className="text-sm text-muted-foreground mt-1">
                    {fromDate && toDate ? `${calculateDays(fromDate, toDate)} days` : 'Select dates'}
                  </div>
                </div>

                <div>
                  <Label>From Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !fromDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {fromDate ? format(fromDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={fromDate}
                        onSelect={setFromDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>To Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !toDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {toDate ? format(toDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={toDate}
                        onSelect={setToDate}
                        initialFocus
                        disabled={(date) => date < (fromDate || new Date())}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="reason">Reason *</Label>
                  <Textarea
                    id="reason"
                    placeholder="Please provide reason for leave"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={handleSubmitLeave} className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Submit Leave Request
              </Button>
            </CardContent>
          </Card>

          {/* Recent Requests */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Requests</CardTitle>
              <CardDescription>Your latest leave applications</CardDescription>
            </CardHeader>
            <CardContent>
              {leaveRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No leave requests found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {leaveRequests.slice(0, 3).map((request) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{request.type}</h4>
                            <Badge className={getStatusColor(request.status)}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(request.status)}
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </div>
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Applied on {format(request.appliedDate, 'PPP')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{request.days} days</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <span className="font-medium">From:</span> {format(request.fromDate, 'PPP')}
                        </div>
                        <div>
                          <span className="font-medium">To:</span> {format(request.toDate, 'PPP')}
                        </div>
                      </div>
                      
                      <div className="text-sm">
                        <span className="font-medium">Reason:</span> {request.reason}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;
