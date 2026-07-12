import { render, screen } from '@testing-library/react';
import { makeFakeOfferDetails } from '../../utils/mocks';
import OfferInfo from './offer-info';

vi.mock('./offer-favorite-button', () => ({
  default: ({offerId}: {offerId: string}) => (
    <button
      type="button"
      data-testid="offer-favorite-button"
      data-offer-id={offerId}
    >
      Favorite button
    </button>
  ),
}));

vi.mock('../reviews/reviews-section', () => ({
  default: ({offerId}: {offerId: string}) => (
    <section
      data-testid="reviews-section"
      data-offer-id={offerId}
    >
      Reviews section
    </section>
  ),
}));

describe('Component: OfferInfo', () => {
  it('should render offer information', () => {
    const mockOffer = makeFakeOfferDetails();

    render(<OfferInfo offer={mockOffer} />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: mockOffer.title,
      }),
    ).toBeInTheDocument();

    expect(screen.getByText(mockOffer.type)).toBeInTheDocument();
    expect(screen.getByText(`€${mockOffer.price}`)).toBeInTheDocument();
    expect(screen.getByText(String(mockOffer.rating))).toBeInTheDocument();
    expect(screen.getByText(mockOffer.description)).toBeInTheDocument();
  });

  it('should render offer goods', () => {
    const mockOffer = makeFakeOfferDetails();

    render(<OfferInfo offer={mockOffer} />);

    mockOffer.goods.forEach((good) => {
      expect(screen.getByText(good)).toBeInTheDocument();
    });
  });

  it('should render host information', () => {
    const mockOffer = makeFakeOfferDetails();

    render(<OfferInfo offer={mockOffer} />);

    expect(screen.getByText(mockOffer.host.name)).toBeInTheDocument();

    expect(
      screen.getByRole('img', {
        name: 'Host avatar',
      }),
    ).toHaveAttribute('src', mockOffer.host.avatarUrl);
  });

  it('should render "Premium" mark when offer is premium', () => {
    const mockOffer = {
      ...makeFakeOfferDetails(),
      isPremium: true,
    };

    render(<OfferInfo offer={mockOffer} />);

    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('should not render "Premium" mark when offer is not premium', () => {
    const mockOffer = {
      ...makeFakeOfferDetails(),
      isPremium: false,
    };

    render(<OfferInfo offer={mockOffer} />);

    expect(screen.queryByText('Premium')).not.toBeInTheDocument();
  });

  it('should render "Pro" status when host is pro', () => {
    const fakeOffer = makeFakeOfferDetails();

    const mockOffer = {
      ...fakeOffer,
      host: {
        ...fakeOffer.host,
        isPro: true,
      },
    };

    render(<OfferInfo offer={mockOffer} />);

    expect(screen.getByText('Pro')).toBeInTheDocument();
  });

  it('should not render "Pro" status when host is not pro', () => {
    const fakeOffer = makeFakeOfferDetails();

    const mockOffer = {
      ...fakeOffer,
      host: {
        ...fakeOffer.host,
        isPro: false,
      },
    };

    render(<OfferInfo offer={mockOffer} />);

    expect(screen.queryByText('Pro')).not.toBeInTheDocument();
  });

  it('should render correct text for one bedroom and one adult', () => {
    const mockOffer = {
      ...makeFakeOfferDetails(),
      bedrooms: 1,
      maxAdults: 1,
    };

    render(<OfferInfo offer={mockOffer} />);

    expect(screen.getByText('1 Bedroom')).toBeInTheDocument();
    expect(screen.getByText('Max 1 adult')).toBeInTheDocument();
  });

  it('should render plural text for several bedrooms and adults', () => {
    const mockOffer = {
      ...makeFakeOfferDetails(),
      bedrooms: 2,
      maxAdults: 3,
    };

    render(<OfferInfo offer={mockOffer} />);

    expect(screen.getByText('2 Bedrooms')).toBeInTheDocument();
    expect(screen.getByText('Max 3 adults')).toBeInTheDocument();
  });

  it('should pass offer id to favorite button and reviews section', () => {
    const mockOffer = makeFakeOfferDetails();

    render(<OfferInfo offer={mockOffer} />);

    expect(
      screen.getByTestId('offer-favorite-button'),
    ).toHaveAttribute('data-offer-id', mockOffer.id);

    expect(
      screen.getByTestId('reviews-section'),
    ).toHaveAttribute('data-offer-id', mockOffer.id);
  });
});
