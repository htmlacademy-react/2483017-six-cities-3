import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { generatePath } from 'react-router-dom';
import { AppRoute, AuthorizationStatus, NameSpace } from '../../const';
import { withHistory, withStore } from '../../utils/mock-component';
import { makeFakeOffer, makeFakeStore } from '../../utils/mocks';
import OfferCard from './offer-card';
import { capitalizeFirstLetter } from '../../utils/common';

describe('Component: OfferCard', () => {
  it('should render offer information', () => {
    const mockOffer = makeFakeOffer();

    const { withStoreComponent } = withStore(
      withHistory(
        <OfferCard
          offer={mockOffer}
          onMouseEnter={vi.fn()}
          onMouseLeave={vi.fn()}
        />,
      ),
      makeFakeStore({
        [NameSpace.User]: {
          authorizationStatus: AuthorizationStatus.Auth,
        },
      }),
    );

    render(withStoreComponent);

    expect(screen.getByText(mockOffer.title)).toBeInTheDocument();
    expect(
      screen.getByText(capitalizeFirstLetter(mockOffer.type)),
    ).toBeInTheDocument();
    expect(screen.getByText(`€${mockOffer.price}`)).toBeInTheDocument();
    expect(screen.getByAltText('Place image')).toHaveAttribute(
      'src',
      mockOffer.previewImage,
    );
  });

  it('should render "Premium" mark when offer is premium', () => {
    const mockOffer = {
      ...makeFakeOffer(),
      isPremium: true,
    };

    const { withStoreComponent } = withStore(
      withHistory(
        <OfferCard
          offer={mockOffer}
          onMouseEnter={vi.fn()}
          onMouseLeave={vi.fn()}
        />,
      ),
      makeFakeStore(),
    );

    render(withStoreComponent);

    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('should not render "Premium" mark when offer is not premium', () => {
    const mockOffer = {
      ...makeFakeOffer(),
      isPremium: false,
    };

    const { withStoreComponent } = withStore(
      withHistory(
        <OfferCard
          offer={mockOffer}
          onMouseEnter={vi.fn()}
          onMouseLeave={vi.fn()}
        />,
      ),
      makeFakeStore(),
    );

    render(withStoreComponent);

    expect(screen.queryByText('Premium')).not.toBeInTheDocument();
  });

  it('should call "onMouseEnter" with offer id when user hovers over card', async () => {
    const user = userEvent.setup();
    const mockOffer = makeFakeOffer();
    const handleMouseEnter = vi.fn();

    const { withStoreComponent } = withStore(
      withHistory(
        <OfferCard
          offer={mockOffer}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={vi.fn()}
        />,
      ),
      makeFakeStore(),
    );

    render(withStoreComponent);

    const card = screen.getByRole('article');

    await user.hover(card);

    expect(handleMouseEnter).toHaveBeenCalledTimes(1);
    expect(handleMouseEnter).toHaveBeenCalledWith(mockOffer.id);
  });

  it('should call "onMouseLeave" when user moves cursor away from card', async () => {
    const user = userEvent.setup();
    const mockOffer = makeFakeOffer();
    const handleMouseLeave = vi.fn();

    const { withStoreComponent } = withStore(
      withHistory(
        <OfferCard
          offer={mockOffer}
          onMouseEnter={vi.fn()}
          onMouseLeave={handleMouseLeave}
        />,
      ),
      makeFakeStore(),
    );

    render(withStoreComponent);

    const card = screen.getByRole('article');

    await user.hover(card);
    await user.unhover(card);

    expect(handleMouseLeave).toHaveBeenCalledTimes(1);
  });

  it('should contain links to offer page', () => {
    const mockOffer = makeFakeOffer();
    const expectedPath = generatePath(AppRoute.Offer, {
      id: mockOffer.id,
    });

    const { withStoreComponent } = withStore(
      withHistory(
        <OfferCard
          offer={mockOffer}
          onMouseEnter={vi.fn()}
          onMouseLeave={vi.fn()}
        />,
      ),
      makeFakeStore(),
    );

    render(withStoreComponent);

    const offerLinks = screen.getAllByRole('link');

    expect(offerLinks).toHaveLength(2);

    offerLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', expectedPath);
    });
  });
});
