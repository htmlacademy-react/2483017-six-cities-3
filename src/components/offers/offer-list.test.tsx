import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Offer } from '../../types/offer';
import { makeFakeOffer } from '../../utils/mocks';
import OffersList from './offer-list';

vi.mock('./offer-card', () => ({
  default: ({
    offer,
    onMouseEnter,
    onMouseLeave,
  }: {
    offer: Offer;
    onMouseEnter: (offerId: string) => void;
    onMouseLeave: () => void;
  }) => (
    <article
      data-testid={`offer-card-${offer.id}`}
      onMouseEnter={() => onMouseEnter(offer.id)}
      onMouseLeave={onMouseLeave}
    >
      {offer.title}
    </article>
  ),
}));

describe('Component: OffersList', () => {
  it('should render an offer card for each offer', () => {
    const mockOffers = [
      makeFakeOffer('1'),
      makeFakeOffer('2'),
      makeFakeOffer('3'),
    ];

    render(
      <OffersList
        offers={mockOffers}
        onCardMouseEnter={vi.fn()}
        onCardMouseLeave={vi.fn()}
      />,
    );

    mockOffers.forEach((offer) => {
      expect(
        screen.getByTestId(`offer-card-${offer.id}`),
      ).toBeInTheDocument();

      expect(
        screen.getByText(offer.title),
      ).toBeInTheDocument();
    });
  });

  it('should call "onCardMouseEnter" with offer id when user hovers over a card', async () => {
    const user = userEvent.setup();
    const mockOffers = [
      makeFakeOffer('1'),
      makeFakeOffer('2'),
    ];
    const handleCardMouseEnter = vi.fn();

    render(
      <OffersList
        offers={mockOffers}
        onCardMouseEnter={handleCardMouseEnter}
        onCardMouseLeave={vi.fn()}
      />,
    );

    await user.hover(
      screen.getByTestId(`offer-card-${mockOffers[1].id}`),
    );

    expect(handleCardMouseEnter).toHaveBeenCalledTimes(1);
    expect(handleCardMouseEnter).toHaveBeenCalledWith(
      mockOffers[1].id,
    );
  });

  it('should call "onCardMouseLeave" when user moves cursor away from a card', async () => {
    const user = userEvent.setup();
    const mockOffer = makeFakeOffer();
    const handleCardMouseLeave = vi.fn();

    render(
      <OffersList
        offers={[mockOffer]}
        onCardMouseEnter={vi.fn()}
        onCardMouseLeave={handleCardMouseLeave}
      />,
    );

    const offerCard = screen.getByTestId(
      `offer-card-${mockOffer.id}`,
    );

    await user.hover(offerCard);
    await user.unhover(offerCard);

    expect(handleCardMouseLeave).toHaveBeenCalledTimes(1);
  });
});
