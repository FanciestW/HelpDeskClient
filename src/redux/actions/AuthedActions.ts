export enum EAuthedActions {
  CHANGE_AUTHED = 'CHANGE_AUTHED',
}

export function changeAuthed(isAuthed: boolean) {
  return {
    type: EAuthedActions.CHANGE_AUTHED,
    isAuthed,
  };
}