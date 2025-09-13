import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Clock, 
  Play, 
  Pause, 
  Square, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Trash2
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: 'study' | 'coding' | 'project' | 'review';
  estimatedTime: number; // in minutes
  timeSpent: number; // in minutes
  isCompleted: boolean;
  dueDate?: Date;
  createdAt: Date;
}

interface TaskManagerProps {
  onStartTimer: (taskId: string) => void;
}

export const TaskManager = ({ onStartTimer }: TaskManagerProps) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Complete JavaScript Arrays Exercise',
      description: 'Finish the array manipulation exercises in the coding section',
      priority: 'high',
      category: 'study',
      estimatedTime: 45,
      timeSpent: 25,
      isCompleted: false,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      createdAt: new Date()
    },
    {
      id: '2',
      title: 'Review Object-Oriented Programming',
      description: 'Go through OOP concepts and practice problems',
      priority: 'medium',
      category: 'review',
      estimatedTime: 60,
      timeSpent: 60,
      isCompleted: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ]);

  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    category: 'study' as const,
    estimatedTime: 30
  });

  const addTask = () => {
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      category: newTask.category,
      estimatedTime: newTask.estimatedTime,
      timeSpent: 0,
      isCompleted: false,
      createdAt: new Date()
    };

    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      category: 'study',
      estimatedTime: 30
    });
    setShowAddTask(false);
  };

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, isCompleted: !task.isCompleted }
        : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-difficulty-hard';
      case 'medium': return 'text-tutorial-highlight';
      case 'low': return 'text-difficulty-easy';
      default: return 'text-muted-foreground';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'study': return 'bg-primary/20 text-primary';
      case 'coding': return 'bg-accent/20 text-accent';
      case 'project': return 'bg-tutorial-highlight/20 text-tutorial-highlight';
      case 'review': return 'bg-secondary/20 text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const completedTasks = tasks.filter(task => task.isCompleted).length;
  const totalTime = tasks.reduce((sum, task) => sum + task.timeSpent, 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-8 w-8 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Completed Tasks</p>
              <p className="text-2xl font-bold">{completedTasks}/{tasks.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <Clock className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Time Logged</p>
              <p className="text-2xl font-bold">{Math.floor(totalTime / 60)}h {totalTime % 60}m</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-8 w-8 text-tutorial-highlight" />
            <div>
              <p className="text-sm text-muted-foreground">Pending Tasks</p>
              <p className="text-2xl font-bold">{tasks.length - completedTasks}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Add Task Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Task Management</h2>
        <Button onClick={() => setShowAddTask(!showAddTask)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Add Task Form */}
      {showAddTask && (
        <Card className="p-6 animate-slide-up">
          <h3 className="text-lg font-semibold mb-4">Create New Task</h3>
          <div className="space-y-4">
            <Input
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            
            <Textarea
              placeholder="Task description (optional)"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={newTask.priority} onValueChange={(value: any) => setNewTask({ ...newTask, priority: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={newTask.category} onValueChange={(value: any) => setNewTask({ ...newTask, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="study">Study</SelectItem>
                  <SelectItem value="coding">Coding</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="Est. minutes"
                  value={newTask.estimatedTime}
                  onChange={(e) => setNewTask({ ...newTask, estimatedTime: parseInt(e.target.value) || 0 })}
                />
                <span className="text-sm text-muted-foreground">min</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={addTask}>Create Task</Button>
              <Button variant="outline" onClick={() => setShowAddTask(false)}>Cancel</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Task List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <Card key={task.id} className={`p-4 transition-all ${task.isCompleted ? 'opacity-60' : ''}`}>
            <div className="flex items-start space-x-4">
              <Checkbox
                checked={task.isCompleted}
                onCheckedChange={() => toggleTask(task.id)}
                className="mt-1"
              />
              
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className={`font-semibold ${task.isCompleted ? 'line-through' : ''}`}>
                    {task.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Badge className={getCategoryColor(task.category)}>
                      {task.category}
                    </Badge>
                    <Badge variant="outline" className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                </div>
                
                {task.description && (
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {task.timeSpent}/{task.estimatedTime} min
                    </span>
                    {task.dueDate && (
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Due {task.dueDate.toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!task.isCompleted && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onStartTimer(task.id)}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Start Timer
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteTask(task.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
        
        {tasks.length === 0 && (
          <Card className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
            <p className="text-muted-foreground mb-4">Create your first task to get started with time management</p>
            <Button onClick={() => setShowAddTask(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Task
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};