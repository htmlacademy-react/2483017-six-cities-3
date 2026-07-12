import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SortOption, NameSpace } from '../../const';
import { Offer } from '../../types/offer';
import { useActiveOffer } from '../../hooks/use-active-offer';
import { withStore } from '../../utils/mock-component';
import { makeFakeOffer, makeFakeStore } from '../../utils/mocks';
import OffersSection from './offers-section';

vi.mock('../../hooks/use-active-offer', () => ({
  useActiveOffer: vi.fn(),
}));

vi.mock('../offers/offers-empty', () => ({
  default: ({cityName}: {cityName: string}) => (
    <div data-testid="offers-empty">
      No places in {cityName}
    </div>
  ),
}));

vi.mock('../sorting-options/sorting-options', () => ({
  default: ({
    activeSortOption,
    onSortOptionChange,
  }: {
    activeSortOption: SortOption;
    onSortOptionChange: (sortOption: SortOption) => void;
  }) => (
    <div>
      <span data-testid="active-sort-option">
        {activeSortOption}
      </span>

      <button
        type="button"
        onClick={() => {
          onSortOptionChange(SortOption.PriceLowToHigh);
        }}
      >
        Sort by price
      </button>
    </div>
  ),
}));

vi.mock('../offers/offer-list', () => ({
  default: ({
    offers,
    onCardMouseEnter,
    onCardMouseLeave,
  }: {
    offers: Offer[];
    onCardMouseEnter: (offerId: string) => void;
    onCardMouseLeave: () => void;
  }) => (
    <div data-testid="offers-list">
      {offers.map((offer) => (
        <article key={offer.id} data-testid="offer-item">
          <span>{offer.title}</span>

          <button
            type="button"
            onClick={() => {
              onCardMouseEnter(offer.id);
            }}
          >
            Activate {offer.id}
          </button>

          <button
            type="button"
            onClick={onCardMouseLeave}
          >
            Deactivate {offer.id}
          </button>
        </article>
      ))}
    </div>
  ),
}));

vi.mock('../map/map', () => ({
  default: ({
    offers,
    selectedOffer,
  }: {
    offers: Offer[];
    selectedOffer?: Offer;
  }) => (
    <div
      data-testid="map"
      data-offers-count={offers.length}
      data-selected-offer={selectedOffer?.id ?? ''}
    >
      Map
    </div>
  ),
}));

describe('Component: OffersSection', () => {
  const mockCardMouseEnter = vi.fn();
  const mockCardMouseLeave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useActiveOffer).mockReturnValue([
      null,
      mockCardMouseEnter,
      mockCardMouseLeave,
    ]);
  });

  it('should render empty component when current city has no offers', () => {
    const cityName = 'Paris';

    const {withStoreComponent} = withStore(
      <OffersSection />,
      makeFakeStore({
        [NameSpace.App]: {
          city: cityName,
        },
        [NameSpace.Offers]: {
          offers: [],
        },
      }),
    );

    render(withStoreComponent);

    expect(
      screen.getByTestId('offers-empty'),
    ).toBeInTheDocument();

    expect(
      screen.getByText(`No places in ${cityName}`),
    ).toBeInTheDocument();

    expect(
      screen.queryByTestId('offers-list'),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByTestId('map'),
    ).not.toBeInTheDocument();
  });

  it('should render offers information, list and map when offers exist', () => {
    const cityName = 'Paris';

    const mockOffers = [
      makeFakeOffer('1'),
      makeFakeOffer('2'),
    ];

    const {withStoreComponent} = withStore(
      <OffersSection />,
      makeFakeStore({
        [NameSpace.App]: {
          city: cityName,
        },
        [NameSpace.Offers]: {
          offers: mockOffers,
        },
      }),
    );

    render(withStoreComponent);

    expect(
      screen.getByText(
        `${mockOffers.length} places to stay in ${cityName}`,
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId('active-sort-option'),
    ).toHaveTextContent(SortOption.Popular);

    expect(
      screen.getByTestId('offers-list'),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId('map'),
    ).toHaveAttribute(
      'data-offers-count',
      String(mockOffers.length),
    );

    expect(
      screen.queryByTestId('offers-empty'),
    ).not.toBeInTheDocument();
  });

  it('should change offers order when user selects another sort option', async () => {
    const user = userEvent.setup();

    const expensiveOffer = {
      ...makeFakeOffer('1'),
      title: 'Expensive offer',
      price: 300,
    };

    const cheapOffer = {
      ...makeFakeOffer('2'),
      title: 'Cheap offer',
      price: 100,
    };

    const {withStoreComponent} = withStore(
      <OffersSection />,
      makeFakeStore({
        [NameSpace.App]: {
          city: 'Paris',
        },
        [NameSpace.Offers]: {
          offers: [
            expensiveOffer,
            cheapOffer,
          ],
        },
      }),
    );

    render(withStoreComponent);

    let renderedOffers = screen.getAllByTestId(
      'offer-item',
    );

    expect(renderedOffers[0]).toHaveTextContent(
      expensiveOffer.title,
    );

    expect(renderedOffers[1]).toHaveTextContent(
      cheapOffer.title,
    );

    await user.click(
      screen.getByRole('button', {
        name: 'Sort by price',
      }),
    );

    expect(
      screen.getByTestId('active-sort-option'),
    ).toHaveTextContent(SortOption.PriceLowToHigh);

    renderedOffers = screen.getAllByTestId(
      'offer-item',
    );

    expect(renderedOffers[0]).toHaveTextContent(
      cheapOffer.title,
    );

    expect(renderedOffers[1]).toHaveTextContent(
      expensiveOffer.title,
    );
  });

  it('should pass active offer to map', () => {
    const mockOffers = [
      makeFakeOffer('1'),
      makeFakeOffer('2'),
    ];

    vi.mocked(useActiveOffer).mockReturnValue([
      mockOffers[1].id,
      mockCardMouseEnter,
      mockCardMouseLeave,
    ]);

    const {withStoreComponent} = withStore(
      <OffersSection />,
      makeFakeStore({
        [NameSpace.App]: {
          city: 'Paris',
        },
        [NameSpace.Offers]: {
          offers: mockOffers,
        },
      }),
    );

    render(withStoreComponent);

    expect(
      screen.getByTestId('map'),
    ).toHaveAttribute(
      'data-selected-offer',
      mockOffers[1].id,
    );
  });

  it('should pass active offer handlers to offers list', async () => {
    const user = userEvent.setup();
    const mockOffer = makeFakeOffer('1');

    const {withStoreComponent} = withStore(
      <OffersSection />,
      makeFakeStore({
        [NameSpace.App]: {
          city: 'Paris',
        },
        [NameSpace.Offers]: {
          offers: [mockOffer],
        },
      }),
    );

    render(withStoreComponent);

    await user.click(
      screen.getByRole('button', {
        name: `Activate ${mockOffer.id}`,
      }),
    );

    expect(mockCardMouseEnter).toHaveBeenCalledTimes(1);
    expect(mockCardMouseEnter).toHaveBeenCalledWith(
      mockOffer.id,
    );

    await user.click(
      screen.getByRole('button', {
        name: `Deactivate ${mockOffer.id}`,
      }),
    );

    expect(mockCardMouseLeave).toHaveBeenCalledTimes(1);
  });
});
