import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NameSpace } from '../../const';
import { useFavoriteButtonClick } from '../../hooks/use-favorite-button-click';
import { withStore } from '../../utils/mock-component';
import { makeFakeOfferDetails, makeFakeStore } from '../../utils/mocks';
import OfferFavoriteButton from './offer-favorite-button';

vi.mock('../../hooks/use-favorite-button-click', () => ({
  useFavoriteButtonClick: vi.fn(),
}));

describe('Component: OfferFavoriteButton', () => {
  const mockFavoriteButtonClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useFavoriteButtonClick)
      .mockReturnValue(mockFavoriteButtonClick);
  });

  it('should render inactive button when offer is not favorite', () => {
    const mockOffer = {
      ...makeFakeOfferDetails(),
      isFavorite: false,
    };

    const { withStoreComponent } = withStore(
      <OfferFavoriteButton offerId={mockOffer.id} />,
      makeFakeStore({
        [NameSpace.Offer]: {
          currentOffer: mockOffer,
        },
      }),
    );

    render(withStoreComponent);

    const favoriteButton = screen.getByRole('button', {
      name: 'To bookmarks',
    });

    expect(favoriteButton).toBeInTheDocument();
    expect(favoriteButton).not.toHaveClass(
      'offer__bookmark-button--active',
    );
  });

  it('should render active button when offer is favorite', () => {
    const mockOffer = {
      ...makeFakeOfferDetails(),
      isFavorite: true,
    };

    const { withStoreComponent } = withStore(
      <OfferFavoriteButton offerId={mockOffer.id} />,
      makeFakeStore({
        [NameSpace.Offer]: {
          currentOffer: mockOffer,
        },
      }),
    );

    render(withStoreComponent);

    const favoriteButton = screen.getByRole('button', {
      name: 'In bookmarks',
    });

    expect(favoriteButton).toBeInTheDocument();
    expect(favoriteButton).toHaveClass(
      'offer__bookmark-button--active',
    );
  });

  it('should call favorite button handler when user clicks the button', async () => {
    const user = userEvent.setup();

    const mockOffer = {
      ...makeFakeOfferDetails(),
      isFavorite: false,
    };

    const { withStoreComponent } = withStore(
      <OfferFavoriteButton offerId={mockOffer.id} />,
      makeFakeStore({
        [NameSpace.Offer]: {
          currentOffer: mockOffer,
        },
      }),
    );

    render(withStoreComponent);

    await user.click(
      screen.getByRole('button', {
        name: 'To bookmarks',
      }),
    );

    expect(mockFavoriteButtonClick)
      .toHaveBeenCalledTimes(1);
  });
});
