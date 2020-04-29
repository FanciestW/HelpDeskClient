import IUser from './User';

interface IConnectionRequest {
  requestId?: string;
  requesterUid?: string;
  requester?: IUser;
  recipientUid?: string;
  recipient?: IUser;
  status?: string;
}

export default IConnectionRequest;