import { render, screen, waitFor } from '@testing-library/react';
import { APIRoute, NameSpace } from '../../const';
import { fetchFavoriteOffersAction } from '../../store/api-actions';
import { withHistory, withStore } from '../../utils/mock-component';
import {
  extractActionsTypes,
  makeFakeOffer,
  makeFakeStore,
} from '../../utils/mocks';
import FavoritesPage from './favorites-page';

vi.mock('../../components/header/header', () => ({
  default: () => <div>Header</div>,
}));

vi.mock('../../components/favorites/favorites-list', () => ({
  default: () => <div>Favorites list</div>,
}));

vi.mock('../../components/favorites/favorites-empty', () => ({
  default: () => <div>Favorites empty</div>,
}));

vi.mock('../../components/server-error/server-error', () => ({
  default: () => (
    <div role="alert">
      Failed to load data. Please try again later.
    </div>
  ),
}));

describe('Component: FavoritesPage', () => {
  it('should render empty favorites when favorite offers list is empty', async () => {
    const {
      withStoreComponent,
      mockAxiosAdapter,
    } = withStore(
      withHistory(<FavoritesPage />),
      makeFakeStore({
        [NameSpace.Offers]: {
          favoriteOffers: [],
          isFavoriteOffersLoadingError: false,
        },
      }),
    );

    mockAxiosAdapter
      .onGet(APIRoute.Favorite)
      .reply(200, []);

    const { container } = render(withStoreComponent);

    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Favorites empty')).toBeInTheDocument();

    expect(
      screen.queryByText('Favorites list'),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole('heading', {
        name: 'Saved listing',
      }),
    ).not.toBeInTheDocument();

    expect(container.querySelector('.page'))
      .toHaveClass('page--favorites-empty');

    expect(container.querySelector('.page__main'))
      .toHaveClass('page__main--favorites-empty');

    await waitFor(() => {
      expect(mockAxiosAdapter.history.get).toHaveLength(1);
    });
  });

  it('should render favorite offers list when favorite offers exist', async () => {
    const mockFavoriteOffer = {
      ...makeFakeOffer(),
      isFavorite: true,
    };

    const {
      withStoreComponent,
      mockAxiosAdapter,
    } = withStore(
      withHistory(<FavoritesPage />),
      makeFakeStore({
        [NameSpace.Offers]: {
          favoriteOffers: [mockFavoriteOffer],
          isFavoriteOffersLoadingError: false,
        },
      }),
    );

    mockAxiosAdapter
      .onGet(APIRoute.Favorite)
      .reply(200, [mockFavoriteOffer]);

    const { container } = render(withStoreComponent);

    expect(screen.getByText('Header')).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: 'Saved listing',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Favorites list'),
    ).toBeInTheDocument();

    expect(
      screen.queryByText('Favorites empty'),
    ).not.toBeInTheDocument();

    expect(container.querySelector('.page'))
      .not.toHaveClass('page--favorites-empty');

    expect(container.querySelector('.page__main'))
      .not.toHaveClass('page__main--favorites-empty');

    await waitFor(() => {
      expect(mockAxiosAdapter.history.get).toHaveLength(1);
    });
  });

  it('should render server error when favorite offers loading failed', () => {
    const { withStoreComponent } = withStore(
      withHistory(<FavoritesPage />),
      makeFakeStore({
        [NameSpace.Offers]: {
          favoriteOffers: [],
          isFavoriteOffersLoadingError: true,
        },
      }),
    );

    render(withStoreComponent);

    expect(screen.getByText('Header')).toBeInTheDocument();

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Failed to load data. Please try again later.',
    );

    expect(
      screen.queryByText('Favorites list'),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText('Favorites empty'),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole('heading', {
        name: 'Saved listing',
      }),
    ).not.toBeInTheDocument();
  });

  it('should dispatch fetchFavoriteOffersAction when component mounts', async () => {
    const mockFavoriteOffers = [
      {
        ...makeFakeOffer(),
        isFavorite: true,
      },
    ];

    const {
      withStoreComponent,
      mockStore,
      mockAxiosAdapter,
    } = withStore(
      withHistory(<FavoritesPage />),
      makeFakeStore(),
    );

    mockAxiosAdapter
      .onGet(APIRoute.Favorite)
      .reply(200, mockFavoriteOffers);

    render(withStoreComponent);

    await waitFor(() => {
      expect(
        extractActionsTypes(mockStore.getActions()),
      ).toEqual([
        fetchFavoriteOffersAction.pending.type,
        fetchFavoriteOffersAction.fulfilled.type,
      ]);
    });
  });

  it('should dispatch rejected action when favorite offers request fails', async () => {
    const {
      withStoreComponent,
      mockStore,
      mockAxiosAdapter,
    } = withStore(
      withHistory(<FavoritesPage />),
      makeFakeStore(),
    );

    mockAxiosAdapter
      .onGet(APIRoute.Favorite)
      .networkError();

    render(withStoreComponent);

    await waitFor(() => {
      expect(
        extractActionsTypes(mockStore.getActions()),
      ).toEqual([
        fetchFavoriteOffersAction.pending.type,
        fetchFavoriteOffersAction.rejected.type,
      ]);
    });
  });
});
