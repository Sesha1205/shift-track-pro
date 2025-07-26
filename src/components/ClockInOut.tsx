import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Clock, ClockIcon, Timer, Calendar } from 'lucide-react';
import { format } from 'date-fns';

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

const ClockInOut = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [todayEntry, setTodayEntry] = useState<TimeEntry | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { toast } = useToast();

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch today's time entry
  useEffect(() => {
    fetchTodayEntry();
  }, []);

  const fetchTodayEntry = async () => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const { data, error } = await supabase
        .from('time_entries' as any)
        .select('*')
        .eq('date', today)
        .eq('employee_id', 'EMP001') // TODO: Get from auth context
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching today entry:', error);
        return;
      }

      setTodayEntry(data ? data as unknown as TimeEntry : null);
    } catch (error) {
      console.error('Error fetching today entry:', error);
    }
  };

  const handleClockIn = async () => {
    setIsLoading(true);
    try {
      const now = new Date();
      const today = format(now, 'yyyy-MM-dd');
      
      const { error } = await supabase
        .from('time_entries' as any)
        .insert([{
          employee_id: 'EMP001', // TODO: Get from auth context
          employee_name: 'John Doe', // TODO: Get from auth context
          clock_in_time: now.toISOString(),
          date: today,
          status: 'clocked_in'
        }]);

      if (error) {
        throw error;
      }

      toast({
        title: 'Clocked In',
        description: `Successfully clocked in at ${format(now, 'HH:mm:ss')}`,
      });

      fetchTodayEntry();
    } catch (error) {
      console.error('Error clocking in:', error);
      toast({
        title: 'Error',
        description: 'Failed to clock in. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (!todayEntry) return;

    setIsLoading(true);
    try {
      const now = new Date();
      
      const { error } = await supabase
        .from('time_entries' as any)
        .update({
          clock_out_time: now.toISOString(),
          status: 'clocked_out'
        })
        .eq('id', todayEntry.id);

      if (error) {
        throw error;
      }

      toast({
        title: 'Clocked Out',
        description: `Successfully clocked out at ${format(now, 'HH:mm:ss')}`,
      });

      fetchTodayEntry();
    } catch (error) {
      console.error('Error clocking out:', error);
      toast({
        title: 'Error',
        description: 'Failed to clock out. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getWorkingTime = () => {
    if (!todayEntry?.clock_in_time) return '00:00:00';
    
    const clockIn = new Date(todayEntry.clock_in_time);
    const clockOut = todayEntry.clock_out_time ? new Date(todayEntry.clock_out_time) : new Date();
    
    const diff = clockOut.getTime() - clockIn.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const isCheckedIn = todayEntry?.status === 'clocked_in';

  return (
    <div className="space-y-6">
      {/* Current Time Display */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Clock className="h-5 w-5" />
            Current Time
          </CardTitle>
          <div className="text-3xl font-mono font-bold text-primary">
            {format(currentTime, 'HH:mm:ss')}
          </div>
          <CardDescription>
            {format(currentTime, 'EEEE, MMMM do, yyyy')}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Clock In/Out Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Time Tracking
          </CardTitle>
          <CardDescription>
            Manage your work hours for today
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={isCheckedIn ? "default" : "secondary"}>
                {isCheckedIn ? "Checked In" : "Checked Out"}
              </Badge>
              {todayEntry?.clock_in_time && (
                <span className="text-sm text-muted-foreground">
                  Since {format(new Date(todayEntry.clock_in_time), 'HH:mm')}
                </span>
              )}
            </div>
          </div>

          {todayEntry?.clock_in_time && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm font-medium">Clock In</p>
                <p className="text-lg font-mono">
                  {format(new Date(todayEntry.clock_in_time), 'HH:mm:ss')}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">
                  {todayEntry.clock_out_time ? 'Clock Out' : 'Working Time'}
                </p>
                <p className="text-lg font-mono">
                  {todayEntry.clock_out_time 
                    ? format(new Date(todayEntry.clock_out_time), 'HH:mm:ss')
                    : getWorkingTime()
                  }
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            {!isCheckedIn ? (
              <Button 
                onClick={handleClockIn}
                disabled={isLoading}
                className="flex-1"
                size="lg"
              >
                <ClockIcon className="h-4 w-4 mr-2" />
                Clock In
              </Button>
            ) : (
              <Button 
                onClick={handleClockOut}
                disabled={isLoading}
                variant="destructive"
                className="flex-1"
                size="lg"
              >
                <ClockIcon className="h-4 w-4 mr-2" />
                Clock Out
              </Button>
            )}
          </div>

          {todayEntry?.total_hours && (
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Hours Today</p>
              <p className="text-2xl font-bold text-primary">
                {todayEntry.total_hours.toFixed(2)} hours
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClockInOut;