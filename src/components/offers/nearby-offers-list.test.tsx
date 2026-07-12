import { render, screen } from '@testing-library/react';
import { Offer } from '../../types/offer';
import { makeFakeOffer } from '../../utils/mocks';
import NearbyOffersList from './nearby-offers-list';

vi.mock('./nearby-offer', () => ({
  default: ({offer}: {offer: Offer}) => (
    <article data-testid={`nearby-offer-${offer.id}`}>
      {offer.title}
    </article>
  ),
}));

describe('Component: NearbyOffersList', () => {
  it('should render a nearby offer for each offer', () => {
    const mockOffers = [
      makeFakeOffer('1'),
      makeFakeOffer('2'),
      makeFakeOffer('3'),
    ];

    render(<NearbyOffersList offers={mockOffers} />);

    mockOffers.forEach((offer) => {
      expect(
        screen.getByTestId(`nearby-offer-${offer.id}`),
      ).toBeInTheDocument();

      expect(
        screen.getByText(offer.title),
      ).toBeInTheDocument();
    });
  });
});
