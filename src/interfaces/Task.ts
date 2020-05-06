import IUser from './User';

interface ITask {
  taskId?: string;
  title?: string;
  description?: string;
  subtasks?: string[];
  relatedTickets: string[];
  createdBy?: IUser;
  assignedTo?: IUser;
  status?: string;
  priority?: number;
  createdAt?: string;
  dueDate?: string;
}

export default ITask;