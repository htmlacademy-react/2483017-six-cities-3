import {render, screen} from '@testing-library/react';
import {useAppSelector} from '../../hooks';
import {
  selectCurrentCityOffers,
  selectIsOffersLoadingError,
  selectOffersLoadingStatus,
} from '../../store/offers';
import {makeFakeOffer} from '../../utils/mocks';
import MainPage from './main-page';

vi.mock('../../hooks', () => ({
  useAppSelector: vi.fn(),
}));

vi.mock('../../components/header/header', () => ({
  default: ({isMainPage}: {isMainPage?: boolean}) => (
    <header
      data-testid="header"
      data-is-main-page={String(Boolean(isMainPage))}
    >
      Header
    </header>
  ),
}));

vi.mock('../../components/cities-list/cities-list', () => ({
  default: () => (
    <div data-testid="cities-list">
      Cities list
    </div>
  ),
}));

vi.mock('../../components/offers/offers-section', () => ({
  default: () => (
    <section data-testid="offers-section">
      Offers section
    </section>
  ),
}));

vi.mock('../../components/spinner/spinner', () => ({
  default: () => (
    <div data-testid="spinner">
      Spinner
    </div>
  ),
}));

type MockSelectorsData = {
  isLoading?: boolean;
  isLoadingError?: boolean;
  offers?: ReturnType<typeof makeFakeOffer>[];
};

const mockSelectors = ({
  isLoading = false,
  isLoadingError = false,
  offers = [makeFakeOffer('1')],
}: MockSelectorsData = {}) => {
  vi.mocked(useAppSelector).mockImplementation((selector) => {
    if (selector === selectOffersLoadingStatus) {
      return isLoading;
    }

    if (selector === selectCurrentCityOffers) {
      return offers;
    }

    if (selector === selectIsOffersLoadingError) {
      return isLoadingError;
    }

    throw new Error('Unknown selector');
  });
};

describe('Component: MainPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render spinner while offers are loading', () => {
    mockSelectors({
      isLoading: true,
      offers: [],
    });

    render(<MainPage />);

    expect(
      screen.getByTestId('spinner'),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId('header'),
    ).toHaveAttribute(
      'data-is-main-page',
      'false',
    );

    expect(
      screen.queryByTestId('cities-list'),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByTestId('offers-section'),
    ).not.toBeInTheDocument();
  });

  it('should render error message when offers loading failed', () => {
    mockSelectors({
      isLoadingError: true,
      offers: [],
    });

    render(<MainPage />);

    expect(
      screen.getByRole('alert'),
    ).toHaveTextContent(
      'Failed to load data. Please try again later.',
    );

    expect(
      screen.getByTestId('header'),
    ).toHaveAttribute(
      'data-is-main-page',
      'false',
    );

    expect(
      screen.queryByTestId('spinner'),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByTestId('cities-list'),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByTestId('offers-section'),
    ).not.toBeInTheDocument();
  });

  it('should render main page content when offers are loaded', () => {
    mockSelectors({
      offers: [
        makeFakeOffer('1'),
        makeFakeOffer('2'),
      ],
    });

    render(<MainPage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Cities',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId('cities-list'),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId('offers-section'),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId('header'),
    ).toHaveAttribute(
      'data-is-main-page',
      'true',
    );

    expect(
      screen.queryByTestId('spinner'),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText(
        'Failed to load offers. Please try again later.',
      ),
    ).not.toBeInTheDocument();
  });

  it('should add empty class when current city has no offers', () => {
    mockSelectors({
      offers: [],
    });

    const {container} = render(<MainPage />);

    expect(
      container.querySelector('main'),
    ).toHaveClass(
      'page__main--index-empty',
    );
  });

  it('should not add empty class when current city has offers', () => {
    mockSelectors();

    const {container} = render(<MainPage />);

    expect(
      container.querySelector('main'),
    ).not.toHaveClass(
      'page__main--index-empty',
    );
  });
});
