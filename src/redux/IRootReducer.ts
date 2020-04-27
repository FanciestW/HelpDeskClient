import { IAuthedState } from './states/IAuthedState';
import { IUserState } from './states/IUserState';

export interface IRootReducer {
  authedReducer: IAuthedState;
  userReducer: IUserState;
}
