import { AnyAction } from 'redux';
import { EUserActions } from '../actions/UserActions';
import { IUserState } from '../states/IUserState';

const DEFAULT_STATE: IUserState = {
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') ?? '{}') : null,
};

export function userReducer(state = DEFAULT_STATE, action: AnyAction): IUserState {
  switch (action.type) {
    case EUserActions.UPDATE_USER:
      return { ...state, user: action.user };
    default:
      return state;
  }
}
