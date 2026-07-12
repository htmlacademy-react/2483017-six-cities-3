import {
  AuthorizationStatus,
  NameSpace,
} from '../../const';
import { makeFakeStore } from '../../utils/mocks';
import {
  selectAuthorizationStatus,
  selectUserEmail,
} from './user-process.selectors';

describe('User process selectors', () => {
  it('should return authorization status from state', () => {
    const authorizationStatus = AuthorizationStatus.Auth;

    const state = makeFakeStore({
      [NameSpace.User]: {
        authorizationStatus,
      },
    });

    expect(
      selectAuthorizationStatus(state),
    ).toBe(authorizationStatus);
  });

  it('should return user email from state', () => {
    const userEmail = 'user@test.com';

    const state = makeFakeStore({
      [NameSpace.User]: {
        userEmail,
      },
    });

    expect(selectUserEmail(state)).toBe(userEmail);
  });
});
