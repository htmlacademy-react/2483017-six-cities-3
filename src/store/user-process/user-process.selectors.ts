import { NameSpace } from '../../const';
import { State } from '../../types/state';

export const selectAuthorizationStatus = (state: State) =>
  state[NameSpace.User].authorizationStatus;

export const selectUserEmail = (state: State) =>
  state[NameSpace.User].userEmail;
