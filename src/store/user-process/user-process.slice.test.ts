import { AuthorizationStatus } from '../../const';
import {
  checkAuthAction,
  loginAction,
  logoutAction,
} from '../api-actions';
import { makeFakeUserData } from '../../utils/mocks';
import { userProcess } from './user-process.slice';

describe('UserProcess Slice', () => {
  it('should return initial state when passed empty action and undefined state', () => {
    const emptyAction = { type: '' };

    const expectedState = {
      authorizationStatus: AuthorizationStatus.Unknown,
      userEmail: '',
    };

    const result = userProcess.reducer(undefined, emptyAction);

    expect(result).toEqual(expectedState);
  });

  it('should return current state when passed empty action', () => {
    const currentState = {
      authorizationStatus: AuthorizationStatus.Auth,
      userEmail: 'test@test.com',
    };

    const emptyAction = { type: '' };

    const result = userProcess.reducer(currentState, emptyAction);

    expect(result).toEqual(currentState);
  });

  it('should set "authorizationStatus" to "Auth" and set "userEmail" with "checkAuthAction.fulfilled"', () => {
    const userData = makeFakeUserData();

    const initialState = {
      authorizationStatus: AuthorizationStatus.Unknown,
      userEmail: '',
    };

    const expectedState = {
      authorizationStatus: AuthorizationStatus.Auth,
      userEmail: userData.email,
    };

    const result = userProcess.reducer(
      initialState,
      checkAuthAction.fulfilled(userData, '', undefined)
    );

    expect(result).toEqual(expectedState);
  });

  it('should set "authorizationStatus" to "NoAuth" and clear "userEmail" when checkAuthAction is rejected with 401', () => {
    const initialState = {
      authorizationStatus: AuthorizationStatus.Unknown,
      userEmail: 'test@test.com',
    };

    const expectedState = {
      authorizationStatus: AuthorizationStatus.NoAuth,
      userEmail: '',
    };

    const result = userProcess.reducer(
      initialState,
      checkAuthAction.rejected(null, '', undefined, 401)
    );

    expect(result).toEqual(expectedState);
  });

  it('should set "authorizationStatus" to "Error" when checkAuthAction is rejected because server is unavailable', () => {
    const initialState = {
      authorizationStatus: AuthorizationStatus.Unknown,
      userEmail: 'test@test.com',
    };

    const expectedState = {
      authorizationStatus: AuthorizationStatus.Error,
      userEmail: 'test@test.com',
    };

    const result = userProcess.reducer(
      initialState,
      checkAuthAction.rejected(null, '', undefined, 0)
    );

    expect(result).toEqual(expectedState);
  });

  it('should set "authorizationStatus" to "Auth" and set "userEmail" with "loginAction.fulfilled"', () => {
    const userData = makeFakeUserData();

    const initialState = {
      authorizationStatus: AuthorizationStatus.NoAuth,
      userEmail: '',
    };

    const expectedState = {
      authorizationStatus: AuthorizationStatus.Auth,
      userEmail: userData.email,
    };

    const result = userProcess.reducer(
      initialState,
      loginAction.fulfilled(userData, '', {
        email: userData.email,
        password: '123456',
      })
    );

    expect(result).toEqual(expectedState);
  });

  it('should set "authorizationStatus" to "NoAuth" and clear "userEmail" with "logoutAction.fulfilled"', () => {
    const initialState = {
      authorizationStatus: AuthorizationStatus.Auth,
      userEmail: 'test@test.com',
    };

    const expectedState = {
      authorizationStatus: AuthorizationStatus.NoAuth,
      userEmail: '',
    };

    const result = userProcess.reducer(
      initialState,
      logoutAction.fulfilled(undefined, '', undefined)
    );

    expect(result).toEqual(expectedState);
  });

  it('should set "authorizationStatus" to "NoAuth" and clear "userEmail" with "logoutAction.rejected"', () => {
    const initialState = {
      authorizationStatus: AuthorizationStatus.Auth,
      userEmail: 'test@test.com',
    };

    const expectedState = {
      authorizationStatus: AuthorizationStatus.NoAuth,
      userEmail: '',
    };

    const result = userProcess.reducer(
      initialState,
      logoutAction.rejected(null, '', undefined)
    );

    expect(result).toEqual(expectedState);
  });
});
