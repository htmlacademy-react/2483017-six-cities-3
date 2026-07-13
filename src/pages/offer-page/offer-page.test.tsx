import { render, screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import {
  AppRoute,
  Limits,
} from '../../const';
import {
  useAppDispatch,
  useAppSelector,
} from '../../hooks';
import {
  fetchNearbyOffersAction,
  fetchOfferAction,
  fetchReviewsAction,
} from '../../store/api-actions';
import {
  resetOfferData,
  selectCurrentOffer,
  selectNearbyOffers,
  selectOfferLoadingStatus,
  selectOfferNotFoundStatus,
} from '../../store/offers';
import { Offer, OfferDetails } from '../../types/offer';
import { withHistory } from '../../utils/mock-component';
import {
  makeFakeOffer,
  makeFakeOfferDetails,
} from '../../utils/mocks';
import OfferPage from './offer-page';

vi.mock('../../hooks', () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

vi.mock('../../store/api-actions', () => ({
  fetchOfferAction: vi.fn(),
  fetchNearbyOffersAction: vi.fn(),
  fetchReviewsAction: vi.fn(),
}));

vi.mock('../../components/header/header', () => ({
  default: () => <header>Header</header>,
}));

vi.mock('../../components/offers/offer-info', () => ({
  default: ({offer}: {offer: OfferDetails}) => (
    <section
      data-testid="offer-info"
      data-offer-id={offer.id}
    >
      Offer info
    </section>
  ),
}));

vi.mock('../../components/map/map', () => ({
  default: ({
    offers,
    selectedOffer,
    className,
  }: {
    offers: Offer[];
    selectedOffer?: Offer;
    className?: string;
  }) => (
    <section
      data-testid="map"
      data-offers-count={offers.length}
      data-selected-offer={selectedOffer?.id ?? ''}
      className={className}
    >
      Map
    </section>
  ),
}));

vi.mock('../../components/offers/nearby-offers-list', () => ({
  default: ({offers}: {offers: Offer[]}) => (
    <section data-testid="nearby-offers-list">
      {offers.map((offer) => (
        <div
          key={offer.id}
          data-testid="nearby-offer"
        >
          {offer.title}
        </div>
      ))}
    </section>
  ),
}));

vi.mock('../not-found-page/not-found-page', () => ({
  default: () => <div>Not found page</div>,
}));

type SelectorValues = {
  currentOffer: OfferDetails | null;
  nearbyOffers: Offer[];
  isOfferLoading: boolean;
  isOfferNotFound: boolean;
};

describe('Component: OfferPage', () => {
  const mockDispatch = vi.fn();

  const setSelectorValues = ({
    currentOffer,
    nearbyOffers,
    isOfferLoading,
    isOfferNotFound,
  }: SelectorValues) => {
    vi.mocked(useAppSelector).mockImplementation(
      ((selector: unknown) => {
        if (selector === selectCurrentOffer) {
          return currentOffer;
        }

        if (selector === selectNearbyOffers) {
          return nearbyOffers;
        }

        if (selector === selectOfferLoadingStatus) {
          return isOfferLoading;
        }

        if (selector === selectOfferNotFoundStatus) {
          return isOfferNotFound;
        }

        return undefined;
      }) as typeof useAppSelector,
    );
  };

  const renderOfferPage = (offerId = 'offer-id') =>
    render(
      withHistory(
        <Routes>
          <Route
            path={AppRoute.Offer}
            element={<OfferPage />}
          />
        </Routes>,
        [`/offer/${offerId}`],
      ),
    );

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAppDispatch).mockReturnValue(mockDispatch);
  });

  it('should dispatch reset and loading actions when component mounts', () => {
    const offerId = 'offer-id';

    setSelectorValues({
      currentOffer: null,
      nearbyOffers: [],
      isOfferLoading: true,
      isOfferNotFound: false,
    });

    renderOfferPage(offerId);

    expect(mockDispatch).toHaveBeenCalledWith(
      resetOfferData(),
    );

    expect(fetchOfferAction).toHaveBeenCalledWith(
      offerId,
    );

    expect(fetchNearbyOffersAction).toHaveBeenCalledWith(
      offerId,
    );

    expect(fetchReviewsAction).toHaveBeenCalledWith(
      offerId,
    );

    expect(mockDispatch).toHaveBeenCalledTimes(4);
  });

  it('should render not found page when offer is not found', () => {
    setSelectorValues({
      currentOffer: null,
      nearbyOffers: [],
      isOfferLoading: false,
      isOfferNotFound: true,
    });

    renderOfferPage();

    expect(
      screen.getByText('Not found page'),
    ).toBeInTheDocument();

    expect(
      screen.queryByText('Header'),
    ).not.toBeInTheDocument();
  });

  it('should not render offer content while offer is loading', () => {
    setSelectorValues({
      currentOffer: null,
      nearbyOffers: [],
      isOfferLoading: true,
      isOfferNotFound: false,
    });

    renderOfferPage();

    expect(
      screen.getByText('Header'),
    ).toBeInTheDocument();

    expect(
      screen.queryByTestId('offer-info'),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByTestId('map'),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByTestId('nearby-offers-list'),
    ).not.toBeInTheDocument();
  });

  it('should render loaded offer information', () => {
    const mockOffer = makeFakeOfferDetails('offer-id');

    setSelectorValues({
      currentOffer: mockOffer,
      nearbyOffers: [],
      isOfferLoading: false,
      isOfferNotFound: false,
    });

    renderOfferPage(mockOffer.id);

    expect(
      screen.getByTestId('offer-info'),
    ).toHaveAttribute(
      'data-offer-id',
      mockOffer.id,
    );

    expect(
      screen.getByRole('heading', {
        name: 'Other places in the neighbourhood',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId('map'),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId('nearby-offers-list'),
    ).toBeInTheDocument();
  });

  it('should render no more than allowed number of offer images', () => {
    const images = Array.from(
      {length: Limits.OfferImages + 2},
      (_, index) => `img/offer-${index + 1}.jpg`,
    );

    const mockOffer = {
      ...makeFakeOfferDetails('offer-id'),
      images,
    };

    setSelectorValues({
      currentOffer: mockOffer,
      nearbyOffers: [],
      isOfferLoading: false,
      isOfferNotFound: false,
    });

    renderOfferPage(mockOffer.id);

    const renderedImages = screen.getAllByRole('img', {
      name: 'Photo studio',
    });

    expect(renderedImages).toHaveLength(
      Limits.OfferImages,
    );

    expect(renderedImages[0]).toHaveAttribute(
      'src',
      images[0],
    );
  });

  it('should render no more than allowed number of nearby offers', () => {
    const mockOffer = makeFakeOfferDetails('offer-id');

    const nearbyOffers = Array.from(
      {length: Limits.NearbyOffers + 2},
      (_, index) => makeFakeOffer(`nearby-${index + 1}`),
    );

    setSelectorValues({
      currentOffer: mockOffer,
      nearbyOffers,
      isOfferLoading: false,
      isOfferNotFound: false,
    });

    renderOfferPage(mockOffer.id);

    expect(
      screen.getAllByTestId('nearby-offer'),
    ).toHaveLength(Limits.NearbyOffers);

    nearbyOffers
      .slice(0, Limits.NearbyOffers)
      .forEach((offer) => {
        expect(
          screen.getByText(offer.title),
        ).toBeInTheDocument();
      });

    expect(
      screen.queryByText(
        nearbyOffers[Limits.NearbyOffers].title,
      ),
    ).not.toBeInTheDocument();
  });

  it('should pass current and limited nearby offers to map', () => {
    const mockOffer = makeFakeOfferDetails('offer-id');

    const nearbyOffers = Array.from(
      {length: Limits.NearbyOffers + 2},
      (_, index) => makeFakeOffer(`nearby-${index + 1}`),
    );

    setSelectorValues({
      currentOffer: mockOffer,
      nearbyOffers,
      isOfferLoading: false,
      isOfferNotFound: false,
    });

    renderOfferPage(mockOffer.id);

    const map = screen.getByTestId('map');

    expect(map).toHaveAttribute(
      'data-selected-offer',
      mockOffer.id,
    );

    expect(map).toHaveAttribute(
      'data-offers-count',
      String(Limits.NearbyOffers + 1),
    );

    expect(map).toHaveClass('offer__map', 'map');
  });
});
