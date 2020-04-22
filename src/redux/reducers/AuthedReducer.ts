import { AnyAction } from 'redux';
import { EAuthedActions } from '../actions/AuthedActions';
import { IAuthedState } from '../states/IAuthedState';

const DEFAULT_STATE: IAuthedState = {
  isAuthed: false
};

export function authedReducer(state = DEFAULT_STATE, action: AnyAction): IAuthedState {
  switch (action.type) {
    case EAuthedActions.CHANGE_AUTHED:
      return { ...state, isAuthed: action.authed };
    default:
      return state;
  }
}
