import IUser from './User';

interface ITicket {
  ticketId?: string;
  title?: string;
  description?: string;
  createdBy?: IUser;
  assignedTo?: IUser;
  status?: string;
  priority?: number;
  createdAt?: string;
  dueDate?: string;
}

export default ITicket;