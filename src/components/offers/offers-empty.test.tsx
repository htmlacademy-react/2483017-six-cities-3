import { render, screen } from '@testing-library/react';
import OffersEmpty from './offers-empty';

describe('Component: OffersEmpty', () => {
  it('should render correct', () => {
    const cityName = 'Paris';
    const expectedStatusText = /No places to stay available/i;
    const expectedDescriptionText = /We could not find any property available at the moment in Paris/i;

    render(<OffersEmpty cityName={cityName} />);

    expect(screen.getByText(expectedStatusText)).toBeInTheDocument();
    expect(screen.getByText(expectedDescriptionText)).toBeInTheDocument();
  });
});
