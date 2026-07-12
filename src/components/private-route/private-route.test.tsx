import { render, screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import {
  AppRoute,
  AuthorizationStatus,
  NameSpace,
} from '../../const';
import { withHistory, withStore } from '../../utils/mock-component';
import { makeFakeStore } from '../../utils/mocks';
import PrivateRoute from './private-route';

describe('Component: PrivateRoute', () => {
  it('should render component for public route, when user not authorized', () => {
    const expectedText = 'public route';
    const notExpectedText = 'private route';

    const preparedComponent = withHistory(
      <Routes>
        <Route
          path={AppRoute.Login}
          element={<span>{expectedText}</span>}
        />

        <Route
          path={AppRoute.Favorites}
          element={
            <PrivateRoute>
              <span>{notExpectedText}</span>
            </PrivateRoute>
          }
        />
      </Routes>,
      [AppRoute.Favorites],
    );

    const { withStoreComponent } = withStore(
      preparedComponent,
      makeFakeStore({
        [NameSpace.User]: {
          authorizationStatus: AuthorizationStatus.NoAuth,
        },
      }),
    );

    render(withStoreComponent);

    expect(screen.getByText(expectedText)).toBeInTheDocument();
    expect(screen.queryByText(notExpectedText)).not.toBeInTheDocument();
  });

  it('should render component for private route, when user authorized', () => {
    const expectedText = 'private route';
    const notExpectedText = 'public route';

    const preparedComponent = withHistory(
      <Routes>
        <Route
          path={AppRoute.Login}
          element={<span>{notExpectedText}</span>}
        />

        <Route
          path={AppRoute.Favorites}
          element={
            <PrivateRoute>
              <span>{expectedText}</span>
            </PrivateRoute>
          }
        />
      </Routes>,
      [AppRoute.Favorites],
    );

    const { withStoreComponent } = withStore(
      preparedComponent,
      makeFakeStore({
        [NameSpace.User]: {
          authorizationStatus: AuthorizationStatus.Auth,
        },
      }),
    );

    render(withStoreComponent);

    expect(screen.getByText(expectedText)).toBeInTheDocument();
    expect(screen.queryByText(notExpectedText)).not.toBeInTheDocument();
  });
});
