import { render, screen } from '@testing-library/react';
import FavoritesEmpty from './favorites-empty';

describe('Component: FavoritesEmpty', () => {
  it('should render correct', () => {
    const expectedTitleText = /Favorites \(empty\)/i;
    const expectedStatusText = /Nothing yet saved/i;
    const expectedDescriptionText = /Save properties to narrow down search or plan your future trips/i;

    render(<FavoritesEmpty />);

    expect(screen.getByText(expectedTitleText)).toBeInTheDocument();
    expect(screen.getByText(expectedStatusText)).toBeInTheDocument();
    expect(screen.getByText(expectedDescriptionText)).toBeInTheDocument();
  });
});
