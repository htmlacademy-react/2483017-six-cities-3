import { render, screen } from '@testing-library/react';
import { AppRoute, AuthorizationStatus, NameSpace } from '../const';
import App from './app';
import { withHistory, withStore } from '../utils/mock-component';
import {
  makeFakeOffer,
  makeFakeOfferDetails,
  makeFakeStore,
} from '../utils/mocks';

describe('Application Routing', () => {
  it('should render MainPage when user navigates to "/"', () => {
    const { withStoreComponent } = withStore(
      withHistory(<App />, [AppRoute.Main]),
      makeFakeStore(),
    );

    render(withStoreComponent);

    expect(screen.getByText(/Cities/i)).toBeInTheDocument();
    expect(screen.getByText(/No places to stay available/i)).toBeInTheDocument();
  });

  it('should render LoginPage when user navigates to "/login"', () => {
    const { withStoreComponent } = withStore(
      withHistory(<App />, [AppRoute.Login]),
      makeFakeStore(),
    );

    render(withStoreComponent);

    expect(screen.getByRole('heading', { name: /Sign in/i })).toBeInTheDocument();
  });

  it('should render NotFoundPage when user navigates to unknown route', () => {
    const { withStoreComponent } = withStore(
      withHistory(<App />, ['/unknown-route']),
      makeFakeStore(),
    );

    render(withStoreComponent);

    expect(screen.getByText(/404 Not Found/i)).toBeInTheDocument();
  });

  it('should redirect to LoginPage when unauthorized user navigates to "/favorites"', () => {
    const { withStoreComponent } = withStore(
      withHistory(<App />, [AppRoute.Favorites]),
      makeFakeStore({
        [NameSpace.User]: {
          authorizationStatus: AuthorizationStatus.NoAuth,
        },
      }),
    );

    render(withStoreComponent);

    expect(screen.getByRole('heading', { name: /Sign in/i })).toBeInTheDocument();
  });

  it('should render FavoritesPage when authorized user navigates to "/favorites"', () => {
    const favoriteOffer = {
      ...makeFakeOffer('1'),
      isFavorite: true,
    };

    const { withStoreComponent } = withStore(
      withHistory(<App />, [AppRoute.Favorites]),
      makeFakeStore({
        [NameSpace.User]: {
          authorizationStatus: AuthorizationStatus.Auth,
          userEmail: 'test@test.com',
        },
        [NameSpace.Offers]: {
          favoriteOffers: [favoriteOffer],
        },
      }),
    );

    render(withStoreComponent);

    expect(screen.getByText(/Saved listing/i)).toBeInTheDocument();
    expect(screen.getByText(favoriteOffer.title)).toBeInTheDocument();
  });

  it('should render OfferPage when user navigates to "/offer/:id"', () => {
    const mockOffer = makeFakeOfferDetails('1');

    const { withStoreComponent } = withStore(
      withHistory(<App />, [`/offer/${mockOffer.id}`]),
      makeFakeStore({
        [NameSpace.Offer]: {
          currentOffer: mockOffer,
        },
      }),
    );

    render(withStoreComponent);

    expect(screen.getByText(mockOffer.title)).toBeInTheDocument();
    expect(screen.getByText(mockOffer.description)).toBeInTheDocument();
  });
});
