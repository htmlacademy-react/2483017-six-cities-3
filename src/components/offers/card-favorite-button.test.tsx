import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useFavoriteButtonClick } from '../../hooks/use-favorite-button-click';
import CardFavoriteButton from './card-favorite-button';

vi.mock('../../hooks/use-favorite-button-click', () => ({
  useFavoriteButtonClick: vi.fn(),
}));

describe('Component: CardFavoriteButton', () => {
  const mockFavoriteButtonClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useFavoriteButtonClick)
      .mockReturnValue(mockFavoriteButtonClick);
  });

  it('should render inactive button when offer is not favorite', () => {
    render(
      <CardFavoriteButton
        offerId="offer-id"
        isFavorite={false}
      />,
    );

    const favoriteButton = screen.getByRole('button', {
      name: 'To bookmarks',
    });

    expect(favoriteButton).toBeInTheDocument();
    expect(favoriteButton).not.toHaveClass(
      'place-card__bookmark-button--active',
    );
  });

  it('should render active button when offer is favorite', () => {
    render(
      <CardFavoriteButton
        offerId="offer-id"
        isFavorite
      />,
    );

    const favoriteButton = screen.getByRole('button', {
      name: 'In bookmarks',
    });

    expect(favoriteButton).toBeInTheDocument();
    expect(favoriteButton).toHaveClass(
      'place-card__bookmark-button--active',
    );
  });

  it('should call favorite button handler when user clicks the button', async () => {
    const user = userEvent.setup();

    render(
      <CardFavoriteButton
        offerId="offer-id"
        isFavorite={false}
      />,
    );

    await user.click(
      screen.getByRole('button', { name: 'To bookmarks' }),
    );

    expect(mockFavoriteButtonClick).toHaveBeenCalledTimes(1);
  });
});
