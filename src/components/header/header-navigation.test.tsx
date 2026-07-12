import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  APIRoute,
  AppRoute,
  AuthorizationStatus,
  NameSpace,
} from '../../const';
import { logoutAction } from '../../store/api-actions';
import { withHistory, withStore } from '../../utils/mock-component';
import {
  extractActionsTypes,
  makeFakeOffer,
  makeFakeStore,
} from '../../utils/mocks';
import HeaderNavigation from './header-navigation';

describe('Component: HeaderNavigation', () => {
  it('should render sign in link when user is not authorized', () => {
    const { withStoreComponent } = withStore(
      withHistory(<HeaderNavigation />),
      makeFakeStore({
        [NameSpace.User]: {
          authorizationStatus: AuthorizationStatus.NoAuth,
        },
      }),
    );

    render(withStoreComponent);

    const signInLink = screen.getByRole('link', {
      name: 'Sign in',
    });

    expect(signInLink).toBeInTheDocument();
    expect(signInLink).toHaveAttribute(
      'href',
      AppRoute.Login,
    );

    expect(
      screen.queryByText('Sign Out'),
    ).not.toBeInTheDocument();
  });

  it('should render user information and favorite offers count when user is authorized', () => {
    const userEmail = 'test@test.com';

    const favoriteOffers = [
      {
        ...makeFakeOffer('1'),
        isFavorite: true,
      },
      {
        ...makeFakeOffer('2'),
        isFavorite: true,
      },
    ];

    const { withStoreComponent } = withStore(
      withHistory(<HeaderNavigation />),
      makeFakeStore({
        [NameSpace.User]: {
          authorizationStatus: AuthorizationStatus.Auth,
          userEmail,
        },
        [NameSpace.Offers]: {
          favoriteOffers,
        },
      }),
    );

    render(withStoreComponent);

    const profileLink = screen.getByRole('link', {
      name: `${userEmail} ${favoriteOffers.length}`,
    });

    expect(profileLink).toBeInTheDocument();
    expect(profileLink).toHaveAttribute(
      'href',
      AppRoute.Favorites,
    );

    expect(
      screen.getByText(userEmail),
    ).toBeInTheDocument();

    expect(
      screen.getByText(String(favoriteOffers.length)),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Sign Out'),
    ).toBeInTheDocument();

    expect(
      screen.queryByText('Sign in'),
    ).not.toBeInTheDocument();
  });

  it('should dispatch "logoutAction" when user clicks "Sign Out"', async () => {
    const user = userEvent.setup();

    const {
      withStoreComponent,
      mockStore,
      mockAxiosAdapter,
    } = withStore(
      withHistory(<HeaderNavigation />),
      makeFakeStore({
        [NameSpace.User]: {
          authorizationStatus: AuthorizationStatus.Auth,
          userEmail: 'test@test.com',
        },
      }),
    );

    mockAxiosAdapter
      .onDelete(APIRoute.Logout)
      .reply(204);

    render(withStoreComponent);

    await user.click(
      screen.getByRole('link', {
        name: 'Sign Out',
      }),
    );

    await waitFor(() => {
      const actions = extractActionsTypes(
        mockStore.getActions(),
      );

      expect(actions).toContain(
        logoutAction.pending.type,
      );

      expect(actions).toContain(
        logoutAction.fulfilled.type,
      );
    });
  });
});
