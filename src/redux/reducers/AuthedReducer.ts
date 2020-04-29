import { AnyAction } from 'redux';
import { EAuthedActions } from '../actions/AuthedActions';
import { IAuthedState } from '../states/IAuthedState';

const DEFAULT_STATE: IAuthedState = {
  isAuthed: localStorage.getItem('authed') === 'true' ? true : false,
};

export function authedReducer(state = DEFAULT_STATE, action: AnyAction): IAuthedState {
  switch (action.type) {
    case EAuthedActions.CHANGE_AUTHED:
      return { ...state, isAuthed: action.isAuthed };
    default:
      return state;
  }
}
