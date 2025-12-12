import React, { useState } from 'react';
import { Plus, Check, X, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Textarea } from '../../ui/Textarea';
import { Badge } from '../../ui/Badge';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'inProgress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  dueDate?: string;
  createdAt: string;
}

const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Prepare monthly report',
      description: 'Compile metrics from the ongoing projects and prepare a summary report',
      status: 'todo',
      priority: 'high',
      assignedTo: 'Neha Gupta',
      dueDate: '2025-06-15',
      createdAt: '2025-06-01',
    },
    {
      id: '2',
      title: 'Schedule volunteer training',
      description: 'Organize training session for new volunteers',
      status: 'inProgress',
      priority: 'medium',
      assignedTo: 'Rahul Sharma',
      dueDate: '2025-06-20',
      createdAt: '2025-06-03',
    },
    {
      id: '3',
      title: 'Update program documentation',
      description: 'Review and update the documentation for the rural education program',
      status: 'todo',
      priority: 'low',
      dueDate: '2025-06-25',
      createdAt: '2025-06-05',
    },
    {
      id: '4',
      title: 'Contact potential donors',
      description: 'Reach out to identified potential donors for the upcoming fundraising event',
      status: 'inProgress',
      priority: 'high',
      assignedTo: 'Amit Patel',
      dueDate: '2025-06-10',
      createdAt: '2025-05-30',
    },
    {
      id: '5',
      title: 'Order supplies for health camp',
      status: 'done',
      priority: 'medium',
      assignedTo: 'Priya Singh',
      createdAt: '2025-05-28',
    },
    {
      id: '6',
      title: 'Finalize event venue',
      description: 'Confirm booking for the community awareness event',
      status: 'done',
      priority: 'high',
      createdAt: '2025-05-25',
    },
  ]);

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
  });

  const handleAddTask = () => {
    if (!newTask.title) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      status: newTask.status as 'todo' | 'inProgress' | 'done',
      priority: newTask.priority as 'low' | 'medium' | 'high',
      dueDate: newTask.dueDate,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: '',
    });
    setIsAddingTask(false);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleStatusChange = (id: string, newStatus: 'todo' | 'inProgress' | 'done') => {
    setTasks(
      tasks.map(task => {
        if (task.id === id) {
          return { ...task, status: newStatus };
        }
        return task;
      })
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-danger-100 text-danger-700">High</Badge>;
      case 'medium':
        return <Badge className="bg-warning-100 text-warning-700">Medium</Badge>;
      case 'low':
        return <Badge className="bg-success-100 text-success-700">Low</Badge>;
      default:
        return null;
    }
  };
  
  // Filter tasks by status
  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'inProgress');
  const doneTasks = tasks.filter(task => task.status === 'done');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-800">Task Board</h3>
        <Button 
          variant="primary" 
          size="sm" 
          onClick={() => setIsAddingTask(!isAddingTask)}
        >
          {isAddingTask ? (
            <>
              <X className="w-4 h-4 mr-2" /> Cancel
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" /> New Task
            </>
          )}
        </Button>
      </div>

      {isAddingTask && (
        <Card className="mb-4">
          <CardContent className="pt-4">
            <form className="space-y-3">
              <div>
                <Input
                  name="title"
                  value={newTask.title}
                  onChange={handleChange}
                  placeholder="Task title"
                  required
                />
              </div>
              <div>
                <Textarea
                  name="description"
                  value={newTask.description}
                  onChange={handleChange}
                  placeholder="Task description (optional)"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <select
                    name="priority"
                    value={newTask.priority}
                    onChange={handleChange}
                    className="w-full rounded-md border border-slate-200 py-2 px-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                    aria-label="Task priority"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
                <div>
                  <Input
                    name="dueDate"
                    type="date"
                    value={newTask.dueDate}
                    onChange={handleChange}
                    placeholder="Due date (optional)"
                  />
                </div>
                <div className="flex justify-end">
                  <Button variant="primary" type="button" onClick={handleAddTask}>
                    <Plus className="w-4 h-4 mr-2" /> Add Task
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* To Do Column */}
        <Card>
          <CardHeader className="bg-slate-50 border-b border-slate-100">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 text-slate-500" /> To Do
              </CardTitle>
              <Badge className="bg-slate-100 text-slate-600">{todoTasks.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-2">
            <div className="space-y-2 max-h-96 overflow-y-auto p-2">
              {todoTasks.length === 0 ? (
                <div className="text-sm text-slate-500 text-center py-4">No tasks</div>
              ) : (
                todoTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onDelete={handleDeleteTask} 
                    onStatusChange={handleStatusChange}
                    getPriorityBadge={getPriorityBadge}
                  />
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* In Progress Column */}
        <Card>
          <CardHeader className="bg-slate-50 border-b border-slate-100">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base flex items-center">
                <Clock className="w-4 h-4 mr-2 text-primary-500" /> In Progress
              </CardTitle>
              <Badge className="bg-primary-100 text-primary-600">{inProgressTasks.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-2">
            <div className="space-y-2 max-h-96 overflow-y-auto p-2">
              {inProgressTasks.length === 0 ? (
                <div className="text-sm text-slate-500 text-center py-4">No tasks</div>
              ) : (
                inProgressTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onDelete={handleDeleteTask} 
                    onStatusChange={handleStatusChange}
                    getPriorityBadge={getPriorityBadge}
                  />
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Done Column */}
        <Card>
          <CardHeader className="bg-slate-50 border-b border-slate-100">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base flex items-center">
                <Check className="w-4 h-4 mr-2 text-success-500" /> Done
              </CardTitle>
              <Badge className="bg-success-100 text-success-600">{doneTasks.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-2">
            <div className="space-y-2 max-h-96 overflow-y-auto p-2">
              {doneTasks.length === 0 ? (
                <div className="text-sm text-slate-500 text-center py-4">No tasks</div>
              ) : (
                doneTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onDelete={handleDeleteTask} 
                    onStatusChange={handleStatusChange}
                    getPriorityBadge={getPriorityBadge}
                  />
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: 'todo' | 'inProgress' | 'done') => void;
  getPriorityBadge: (priority: string) => React.ReactNode;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, onStatusChange, getPriorityBadge }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const formatDueDate = (dateString?: string) => {
    if (!dateString) return null;
    
    const now = new Date();
    const dueDate = new Date(dateString);
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return <span className="text-danger-600">Overdue</span>;
    }
    
    if (diffDays === 0) {
      return <span className="text-warning-600">Due today</span>;
    }
    
    if (diffDays === 1) {
      return <span className="text-warning-600">Due tomorrow</span>;
    }
    
    return <span>Due in {diffDays} days</span>;
  };

  return (
    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start">
        <h4 className="font-medium text-sm">{task.title}</h4>
        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-slate-400 hover:text-slate-700 focus:outline-none"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border border-slate-200">
              <div className="py-1">
                {task.status !== 'todo' && (
                  <button
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 w-full text-left"
                    onClick={() => {
                      onStatusChange(task.id, 'todo');
                      setIsMenuOpen(false);
                    }}
                  >
                    Move to To Do
                  </button>
                )}
                {task.status !== 'inProgress' && (
                  <button
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 w-full text-left"
                    onClick={() => {
                      onStatusChange(task.id, 'inProgress');
                      setIsMenuOpen(false);
                    }}
                  >
                    Move to In Progress
                  </button>
                )}
                {task.status !== 'done' && (
                  <button
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 w-full text-left"
                    onClick={() => {
                      onStatusChange(task.id, 'done');
                      setIsMenuOpen(false);
                    }}
                  >
                    Move to Done
                  </button>
                )}
                <button
                  className="block px-4 py-2 text-sm text-danger-600 hover:bg-slate-100 w-full text-left"
                  onClick={() => {
                    onDelete(task.id);
                    setIsMenuOpen(false);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {task.description && (
        <p className="text-xs text-slate-500 mt-1 mb-2">{task.description}</p>
      )}
      
      <div className="flex justify-between items-center mt-3">
        <div>{getPriorityBadge(task.priority)}</div>
        {task.dueDate && (
          <div className="text-xs">{formatDueDate(task.dueDate)}</div>
        )}
      </div>
      
      {task.assignedTo && (
        <div className="mt-3 text-xs text-slate-600 flex items-center">
          <div className="w-4 h-4 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 text-[10px] mr-1">
            {task.assignedTo.charAt(0)}
          </div>
          {task.assignedTo}
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
