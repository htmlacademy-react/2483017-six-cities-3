import { render, screen } from '@testing-library/react';
import { generatePath } from 'react-router-dom';
import { AppRoute } from '../../const';
import { makeFakeOffer } from '../../utils/mocks';
import { withHistory } from '../../utils/mock-component';
import NearbyOffer from './nearby-offer';
import { capitalizeFirstLetter } from '../../utils/common';

vi.mock('./card-favorite-button', () => ({
  default: ({
    offerId,
    isFavorite,
  }: {
    offerId: string;
    isFavorite: boolean;
  }) => (
    <button
      type="button"
      data-testid="favorite-button"
      data-offer-id={offerId}
      data-is-favorite={String(isFavorite)}
    >
      Favorite button
    </button>
  ),
}));

describe('Component: NearbyOffer', () => {
  it('should render offer information', () => {
    const mockOffer = makeFakeOffer();

    render(
      withHistory(
        <NearbyOffer offer={mockOffer} />,
      ),
    );

    expect(
      screen.getByText(mockOffer.title),
    ).toBeInTheDocument();

    expect(
      screen.getByText(capitalizeFirstLetter(mockOffer.type)),
    ).toBeInTheDocument();

    expect(
      screen.getByText(`€${mockOffer.price}`),
    ).toBeInTheDocument();

    expect(
      screen.getByAltText('Place image'),
    ).toHaveAttribute('src', mockOffer.previewImage);
  });

  it('should render "Premium" mark when offer is premium', () => {
    const mockOffer = {
      ...makeFakeOffer(),
      isPremium: true,
    };

    render(
      withHistory(
        <NearbyOffer offer={mockOffer} />,
      ),
    );

    expect(
      screen.getByText('Premium'),
    ).toBeInTheDocument();
  });

  it('should not render "Premium" mark when offer is not premium', () => {
    const mockOffer = {
      ...makeFakeOffer(),
      isPremium: false,
    };

    render(
      withHistory(
        <NearbyOffer offer={mockOffer} />,
      ),
    );

    expect(
      screen.queryByText('Premium'),
    ).not.toBeInTheDocument();
  });

  it('should contain links to offer page', () => {
    const mockOffer = makeFakeOffer();
    const expectedPath = generatePath(AppRoute.Offer, {
      id: mockOffer.id,
    });

    render(
      withHistory(
        <NearbyOffer offer={mockOffer} />,
      ),
    );

    const offerLinks = screen.getAllByRole('link');

    expect(offerLinks).toHaveLength(2);

    offerLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', expectedPath);
    });
  });

  it('should pass offer id and favorite status to favorite button', () => {
    const mockOffer = {
      ...makeFakeOffer(),
      isFavorite: true,
    };

    render(
      withHistory(
        <NearbyOffer offer={mockOffer} />,
      ),
    );

    const favoriteButton = screen.getByTestId(
      'favorite-button',
    );

    expect(favoriteButton).toHaveAttribute(
      'data-offer-id',
      mockOffer.id,
    );

    expect(favoriteButton).toHaveAttribute(
      'data-is-favorite',
      'true',
    );
  });
});
