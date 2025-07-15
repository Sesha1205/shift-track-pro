
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Plus, Edit, Trash2, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  date: Date;
  duration: number;
}

const TimesheetLogging = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<number | null>(null);
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
  });

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: 'Code Review - User Authentication',
      description: 'Reviewed pull requests for authentication module',
      startTime: '09:00',
      endTime: '11:30',
      date: new Date(),
      duration: 2.5
    },
    {
      id: 2,
      title: 'Team Meeting - Sprint Planning',
      description: 'Discussed upcoming sprint goals and task assignments',
      startTime: '14:00',
      endTime: '15:00',
      date: new Date(),
      duration: 1
    },
    {
      id: 3,
      title: 'Bug Fix - Payment Integration',
      description: 'Fixed critical bug in payment processing system',
      startTime: '15:30',
      endTime: '18:30',
      date: new Date(),
      duration: 3
    }
  ]);

  const calculateDuration = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const startTime = new Date(`2000-01-01T${start}`);
    const endTime = new Date(`2000-01-01T${end}`);
    const diff = endTime.getTime() - startTime.getTime();
    return diff / (1000 * 60 * 60); // Convert to hours
  };

  const handleAddTask = () => {
    if (!newTask.title || !newTask.startTime || !newTask.endTime) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const duration = calculateDuration(newTask.startTime, newTask.endTime);
    
    if (duration <= 0) {
      toast({
        title: "Error",
        description: "End time must be after start time.",
        variant: "destructive"
      });
      return;
    }

    const task: Task = {
      id: Date.now(),
      ...newTask,
      date: selectedDate,
      duration
    };

    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '', startTime: '', endTime: '' });
    setIsAddingTask(false);
    
    toast({
      title: "Task Added",
      description: "Your task has been logged successfully.",
    });
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast({
      title: "Task Deleted",
      description: "Task has been removed from your timesheet.",
    });
  };

  const filteredTasks = tasks.filter(task => 
    task.date.toDateString() === selectedDate.toDateString()
  );

  const totalHours = filteredTasks.reduce((sum, task) => sum + task.duration, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Daily Timesheet</h1>
          <p className="text-muted-foreground">Log and manage your daily work activities</p>
        </div>
        <Button onClick={() => setIsAddingTask(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Date Picker and Summary */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Select Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Daily Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-medium">{format(selectedDate, 'PPP')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Tasks:</span>
                  <span className="font-medium">{filteredTasks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Hours:</span>
                  <span className="font-medium">{totalHours.toFixed(1)}h</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge variant={totalHours >= 8 ? "default" : "secondary"}>
                    {totalHours >= 8 ? "Complete" : "Incomplete"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Task List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Add Task Form */}
          {isAddingTask && (
            <Card>
              <CardHeader>
                <CardTitle>Add New Task</CardTitle>
                <CardDescription>Enter the details of your work activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="title">Task Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter task title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what you worked on"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="startTime">Start Time *</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={newTask.startTime}
                      onChange={(e) => setNewTask({ ...newTask, startTime: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="endTime">End Time *</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={newTask.endTime}
                      onChange={(e) => setNewTask({ ...newTask, endTime: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={handleAddTask}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Task
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddingTask(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tasks List */}
          <Card>
            <CardHeader>
              <CardTitle>Tasks for {format(selectedDate, 'MMMM d, yyyy')}</CardTitle>
              <CardDescription>
                {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} logged
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No tasks logged for this date</p>
                  <p className="text-sm">Click "Add Task" to start logging your work</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTasks.map((task) => (
                    <div key={task.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{task.title}</h4>
                          {task.description && (
                            <p className="text-muted-foreground mt-1">{task.description}</p>
                          )}
                          <div className="flex items-center gap-4 mt-3 text-sm">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {task.startTime} - {task.endTime}
                            </span>
                            <Badge variant="outline">
                              {task.duration.toFixed(1)} hours
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setEditingTask(task.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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

export default TimesheetLogging;
