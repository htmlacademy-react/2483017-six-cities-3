import { render, screen } from '@testing-library/react';
import { generatePath } from 'react-router-dom';
import { AppRoute, NameSpace } from '../../const';
import { Offer } from '../../types/offer';
import { withHistory, withStore } from '../../utils/mock-component';
import { makeFakeOffer, makeFakeStore } from '../../utils/mocks';
import FavoritesList from './favorites-list';

vi.mock('../offers/card-favorite-button', () => ({
  default: ({
    offerId,
    isFavorite,
  }: {
    offerId: string;
    isFavorite: boolean;
  }) => (
    <button
      type="button"
      data-testid={`favorite-button-${offerId}`}
      data-is-favorite={String(isFavorite)}
    >
      Favorite button
    </button>
  ),
}));

const createFavoriteOffer = (
  id: string,
  cityName: string,
  offerData: Partial<Offer> = {},
): Offer => {
  const offer = makeFakeOffer(id);

  return {
    ...offer,
    city: {
      ...offer.city,
      name: cityName,
    },
    isFavorite: true,
    ...offerData,
  };
};

describe('Component: FavoritesList', () => {
  it('should render favorite offers grouped by city', () => {
    const parisOffer = createFavoriteOffer('1', 'Paris');
    const cologneOffer = createFavoriteOffer('2', 'Cologne');

    const { withStoreComponent } = withStore(
      withHistory(<FavoritesList />),
      makeFakeStore({
        [NameSpace.Offers]: {
          favoriteOffers: [
            parisOffer,
            cologneOffer,
          ],
        },
      }),
    );

    render(withStoreComponent);

    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Cologne')).toBeInTheDocument();

    expect(
      screen.getByText(parisOffer.title),
    ).toBeInTheDocument();

    expect(
      screen.getByText(cologneOffer.title),
    ).toBeInTheDocument();
  });

  it('should render all favorite offer information', () => {
    const mockOffer = createFavoriteOffer('1', 'Paris');

    const { withStoreComponent } = withStore(
      withHistory(<FavoritesList />),
      makeFakeStore({
        [NameSpace.Offers]: {
          favoriteOffers: [mockOffer],
        },
      }),
    );

    render(withStoreComponent);

    expect(
      screen.getByText(mockOffer.title),
    ).toBeInTheDocument();

    expect(
      screen.getByText(mockOffer.type),
    ).toBeInTheDocument();

    expect(
      screen.getByText(`€${mockOffer.price}`),
    ).toBeInTheDocument();

    expect(
      screen.getByAltText('Place image'),
    ).toHaveAttribute(
      'src',
      mockOffer.previewImage,
    );
  });

  it('should render links to offer page', () => {
    const mockOffer = createFavoriteOffer('1', 'Paris');

    const expectedPath = generatePath(AppRoute.Offer, {
      id: mockOffer.id,
    });

    const { withStoreComponent } = withStore(
      withHistory(<FavoritesList />),
      makeFakeStore({
        [NameSpace.Offers]: {
          favoriteOffers: [mockOffer],
        },
      }),
    );

    render(withStoreComponent);

    const offerLinks = screen.getAllByRole('link')
      .filter((link) => link.getAttribute('href') === expectedPath);

    expect(offerLinks).toHaveLength(2);

    offerLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', expectedPath);
    });
  });

  it('should render "Premium" mark when offer is premium', () => {
    const mockOffer = createFavoriteOffer(
      '1',
      'Paris',
      {
        isPremium: true,
      },
    );

    const { withStoreComponent } = withStore(
      withHistory(<FavoritesList />),
      makeFakeStore({
        [NameSpace.Offers]: {
          favoriteOffers: [mockOffer],
        },
      }),
    );

    render(withStoreComponent);

    expect(
      screen.getByText('Premium'),
    ).toBeInTheDocument();
  });

  it('should not render "Premium" mark when offer is not premium', () => {
    const mockOffer = createFavoriteOffer(
      '1',
      'Paris',
      {
        isPremium: false,
      },
    );

    const { withStoreComponent } = withStore(
      withHistory(<FavoritesList />),
      makeFakeStore({
        [NameSpace.Offers]: {
          favoriteOffers: [mockOffer],
        },
      }),
    );

    render(withStoreComponent);

    expect(
      screen.queryByText('Premium'),
    ).not.toBeInTheDocument();
  });

  it('should pass offer id and favorite status to favorite button', () => {
    const mockOffer = createFavoriteOffer('1', 'Paris');

    const { withStoreComponent } = withStore(
      withHistory(<FavoritesList />),
      makeFakeStore({
        [NameSpace.Offers]: {
          favoriteOffers: [mockOffer],
        },
      }),
    );

    render(withStoreComponent);

    const favoriteButton = screen.getByTestId(
      `favorite-button-${mockOffer.id}`,
    );

    expect(favoriteButton).toHaveAttribute(
      'data-is-favorite',
      'true',
    );
  });
});
