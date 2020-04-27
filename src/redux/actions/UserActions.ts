import IUser from '../../interfaces/User';

export enum EUserActions {
  UPDATE_USER = 'UPDATE_USER',
}

export function updateUser(user: IUser) {
  return {
    type: EUserActions.UPDATE_USER,
    user,
  };
}